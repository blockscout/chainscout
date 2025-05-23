import fs from 'fs';
import nodeFetch from 'node-fetch';
import https from 'https';
import http from 'http';
import PQueue from 'p-queue';

interface Explorer {
  url: string;
}

interface ChainData {
  name: string;
  website: string;
  explorers?: Explorer[];
}

interface FetchResponse {
  status: number;
  url: string;
  data: string;
}

interface ValidationResult {
  error: string | null;
  isCritical: boolean;
  response?: string;
}

// Read the chains JSON file (adjust the path if needed)
const data: string = fs.readFileSync('../data/chains.json', 'utf-8');
const chains: Record<string, ChainData> = JSON.parse(data);

// Create a queue with concurrency of 10
const queue = new PQueue({ concurrency: 10 });

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
    return `Redirects to different domain (${finalDomain})`;
  }

  return null;
}

// Helper function to make HTTP request with retries
async function makeRequest(url: string, ignoreSSL: boolean = true): Promise<{ response: FetchResponse | null, error: Error | null }> {
  const maxRetries = 2;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await queue.add(async () => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        try {
          const res = await nodeFetch(url, {
            signal: controller.signal as any,
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
            agent: url.startsWith('http://')
              ? new http.Agent()
              : ignoreSSL
                ? new https.Agent({ rejectUnauthorized: false })
                : undefined
          });

          const finalUrl = res.url;
          const content = await res.text();

          return {
            response: {
              status: res.status,
              url: finalUrl,
              data: content
            },
            error: null
          };
        } finally {
          clearTimeout(timeout);
        }
      }) as { response: FetchResponse | null, error: Error | null };

      return response;
    } catch (error: unknown) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (lastError.message.includes('aborted') || lastError.message.includes('ECONNRESET')) {
        if (attempt < maxRetries) {
          continue;
        }
      } else {
        return { response: null, error: lastError };
      }
    }
  }

  return { response: null, error: lastError };
}

async function validateUrl(url: string): Promise<ValidationResult> {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }

  const originalProtocol = url.startsWith('https://') ? 'https' : 'http';
  const { response, error } = await makeRequest(url);

  if (response) {
    const finalUrl = response.url;

    // Check successful statuses (2xx)
    if (response.status >= 200 && response.status < 300) {
      // Check redirect and protocol
      const redirectError = checkRedirect(url, finalUrl);
      if (redirectError) {
        return {
          error: redirectError,
          isCritical: false,
          response: response.data
        };
      }

      if (originalProtocol === 'https' && finalUrl.startsWith('http://')) {
        return {
          error: 'HTTPS is invalid, but HTTP works',
          isCritical: false,
          response: response.data
        };
      }
      return { error: null, isCritical: false, response: response.data };
    }

    // Check client errors (4xx)
    if (response.status >= 400 && response.status < 500) {
      // Non-critical client errors
      if ([401, 403, 429, 451].includes(response.status)) {
        const statusMessages = {
          401: 'Unauthorized',
          403: 'Access forbidden',
          429: 'Too many requests',
          451: 'Unavailable for legal reasons'
        };
        return {
          error: `${statusMessages[response.status as keyof typeof statusMessages]} (${response.status})`,
          isCritical: false
        };
      }
    }

    return {
      error: `HTTP error (${response.status})`,
      isCritical: true
    };
  }

  // For any non-HTTP error, return a generic error message
  return {
    error: 'Connection error',
    isCritical: true
  };
}

// Main function: iterate over chains and record broken URLs
async function validateChainUrls(): Promise<void> {
  const entries: [string, ChainData][] = Object.entries(chains);
  const totalChains = entries.length;
  let completed = 0;
  const results: string[] = [];

  // Helper function that processes a single chain and updates the progress counter
  async function processChain([id, chain]: [string, ChainData]): Promise<string[]> {
    const chainResults: string[] = [];

    // Validate website and explorer URLs in parallel
    const [websiteResult, explorerResults] = await Promise.all([
      validateUrl(chain.website),
      Promise.all(
        (chain.explorers || []).map(async (explorer: Explorer) => {
          // Normalize explorer URL by removing trailing slash
          const normalizedUrl = explorer.url.replace(/\/$/, '');
          const result = await validateUrl(normalizedUrl);

          // Additional validation for explorers
          if (result.response) {
            // Check for common explorer patterns
            const hasExplorerPatterns =
              (result.response.includes('blocks') && result.response.includes('transactions')) ||
              result.response.includes('/envs.js');

            if (!hasExplorerPatterns) {
              return {
                error: 'Invalid content',
                isCritical: true,
                response: result.response
              };
            }
          }

          return result;
        })
      )
    ]);

    // Process website results
    if (websiteResult.error) {
      chainResults.push(`| ${id} | ${chain.name} | Website 🌐 | ${chain.website} | ${websiteResult.error} | 🟠 |`);
    }

    // Process explorer results
    explorerResults.forEach((result, index) => {
      if (result.error) {
        const explorer = chain.explorers![index];
        const severity = result.isCritical ? '🔴' : '🟠';
        chainResults.push(`| ${id} | ${chain.name} | Explorer 🔍 | ${explorer.url} | ${result.error} | ${severity} |`);
      }
    });

    // Increment the completed counter and update the dynamic progress line
    completed++;
    console.log(`Checking chains... [${completed}/${totalChains}]`);

    return chainResults;
  }

  // Process all chains
  const chainResults = await Promise.all(entries.map(processChain));
  results.push(...chainResults.flat());

  // Generate the final report
  if (results.length > 0) {
    const header = '| ID | Name | Type | URL | Issue | Severity |\n| ------------- | ------------- | ------------- | ------------- | ------------- | ------------- |';
    const report = [header, ...results].join('\n');
    fs.writeFileSync('./report', report);
  }
}

validateChainUrls().catch(console.error);
