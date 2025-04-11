const fs = require('fs');
const nodeFetch = require('node-fetch');
const https = require('https');
const PQueue = require('p-queue');

interface Explorer {
  url: string;
}

interface ChainData {
  name: string;
  website: string;
  explorers?: Explorer[];
}

// Read the chains JSON file (adjust the path if needed)
const data: string = fs.readFileSync('../data/chains.json', 'utf-8');
const chains: Record<string, ChainData> = JSON.parse(data);

// Create a queue with concurrency of 5
const queue = new PQueue({
  concurrency: 5,
  interval: 2000, // 2 seconds between requests
  intervalCap: 1
});

// Helper function to normalize domain (get parent domain)
function normalizeDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    const parts = urlObj.hostname.split('.');
    return parts.slice(-2).join('.');
  } catch (e) {
    return url;
  }
}

// Helper function to check if URL redirects to a different domain
function checkRedirect(originalUrl: string, finalUrl: string): string | null {
  const originalDomain = normalizeDomain(originalUrl);
  const finalDomain = normalizeDomain(finalUrl);

  if (originalDomain !== finalDomain) {
    return `URL redirects to different domain => ${finalDomain} (${originalUrl})`;
  }

  return null;
}

// Helper function to make HTTP request with retries
async function makeRequest(url: string, ignoreSSL: boolean = true): Promise<{ response: any, error: Error | null }> {
  const maxRetries = 2;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await queue.add(async () => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000); // 5 seconds timeout

        try {
          const res = await nodeFetch(url, {
            signal: controller.signal,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
              'Accept-Language': 'en-US,en;q=0.9',
              'Accept-Encoding': 'gzip, deflate, br',
              'Connection': 'keep-alive',
              'Upgrade-Insecure-Requests': '1',
              'Sec-Fetch-Dest': 'document',
              'Sec-Fetch-Mode': 'navigate',
              'Sec-Fetch-Site': 'none',
              'Sec-Fetch-User': '?1',
              'Cache-Control': 'max-age=0',
              'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
              'sec-ch-ua-mobile': '?0',
              'sec-ch-ua-platform': '"macOS"',
              'DNT': '1',
              'Pragma': 'no-cache',
              'Referer': 'https://www.google.com/',
              'Origin': 'https://www.google.com'
            },
            redirect: 'follow',
            agent: ignoreSSL ? new https.Agent({
              rejectUnauthorized: false
            }) : undefined
          });

          if (!res.ok) {
            if (res.status === 403) {
              throw new Error(`URL exists but access is forbidden (${url})`);
            }
            throw new Error(`HTTP error! status: ${res.status}`);
          }

          return res;
        } finally {
          clearTimeout(timeout);
        }
      });

      const finalUrl = response.url;
      const content = await response.text();

      return {
        response: {
          status: response.status,
          url: finalUrl,
          data: content
        },
        error: null
      };
    } catch (error: unknown) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxRetries) {
        continue;
      }
    }
  }

  return { response: null, error: lastError };
}

async function checkUrl(url: string): Promise<string | null> {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }

  const originalProtocol = url.startsWith('https://') ? 'https' : 'http';

  // Try HTTPS first
  const { response: httpsResponse, error: httpsError } = await makeRequest(url);

  if (httpsResponse) {
    const finalUrl = httpsResponse.url;

    // Check redirects to different domains first
    const redirectError = checkRedirect(url, finalUrl);
    if (redirectError) {
      return redirectError;
    }

    // Then check if HTTPS redirects to HTTP (only if original protocol was HTTPS)
    if (originalProtocol === 'https' && finalUrl.startsWith('http://')) {
      return `HTTPS is invalid, but HTTP works (${url})`;
    }

    return null;
  }

  // If HTTPS fails, try HTTP fallback (only if original protocol was HTTPS)
  if (originalProtocol === 'https') {
    const httpUrl = url.replace("https://", "http://");
    const { response: httpResponse } = await makeRequest(httpUrl, false);

    if (httpResponse) {
      const redirectError = checkRedirect(httpUrl, httpResponse.url);
      if (redirectError) {
        return redirectError;
      }

      return `HTTPS is invalid, but HTTP works (${httpUrl})`;
    }
  }

  // Return the error message if we have one
  if (httpsError) {
    return httpsError.message;
  }

  return `URL is unreachable (${url})`;
}

// Main function: iterate over chains and record broken URLs
async function checkChains(): Promise<void> {
  const entries: [string, ChainData][] = Object.entries(chains);
  const totalChains = entries.length;
  let completed = 0;
  const results: string[] = [];

  // Helper function that processes a single chain and updates the progress counter
  async function processChain([id, chain]: [string, ChainData]): Promise<string> {
    let chainReport = '';

    // Check website and explorer URLs in parallel
    const [websiteMessage, explorerMessages] = await Promise.all([
      checkUrl(chain.website),
      Promise.all(
        (chain.explorers || []).map((explorer: Explorer) => checkUrl(explorer.url))
      )
    ]);

    if (websiteMessage) {
      chainReport += `- Website: ${websiteMessage}\n`;
    }

    explorerMessages.forEach((message: string | null) => {
      if (message) {
        chainReport += `- Explorer: ${message}\n`;
      }
    });

    // Increment the completed counter and update the dynamic progress line
    completed++;
    process.stdout.clearLine(0); // clear the current line
    process.stdout.cursorTo(0);    // move the cursor to the beginning of the line
    process.stdout.write(`Checking chains... [${completed}/${totalChains}]`);

    return chainReport ? `**${chain.name} (${id})**\n${chainReport}\n` : '';
  }

  // Process all chains
  const chainResults = await Promise.all(entries.map(processChain));
  results.push(...chainResults);

  // Aggregate the final report
  const overallReport = results.filter((report) => report !== '').join('');
  process.stdout.write('\n'); // move to a new line after progress output

  if (overallReport !== '') {
    fs.writeFileSync('report', overallReport);
  }
}

checkChains().catch(console.error);
