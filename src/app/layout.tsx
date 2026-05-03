import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Roboto } from "next/font/google";
import { buildMetaData } from "../lib/meta/metadata";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import "./globals.css";
import ClientShell from "@/src/client/components/shell/clientShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata: Metadata = buildMetaData();

type RootLayoutType = Readonly<{ children: React.ReactNode }>;

function RootLayout({
  children
}: RootLayoutType): React.ReactNode {

  return (
    <html
      lang="en"
      className={roboto.variable}
    >
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          antialiased`
        }>
        <AppRouterCacheProvider>
          <ClientShell>
            {children}
          </ClientShell>
        </AppRouterCacheProvider>

      </body>
    </html>
  )
};

export default RootLayout;
