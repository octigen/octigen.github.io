import './globals.css';
import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";

const outfit = Outfit({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PowerPoint Template Analyzer',
  description: 'Analyze and process your PowerPoint templates',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} bg-white text-black dark:bg-[#1A1B31] dark:text-white transition-colors duration-700`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
