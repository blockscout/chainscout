import '@/app/globals.css';
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import Header from '@/components/Header';

const inter = Inter({ subsets: ['latin'] });
const poppins = Poppins({
  weight: ['600'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Chainscout',
  description: 'Explorer for Blockscout instances',
  icons: [
    { rel: 'icon', url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    { rel: 'apple-touch-icon', url: '/favicon-256x256.png' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${poppins.variable} min-h-screen`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
