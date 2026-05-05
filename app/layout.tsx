import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { avigea } from '@/lib/fonts';
import { ThemeProvider } from '@/components/theme-provider';
import { UserProvider } from '@/context/UserContext';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Citronela - Cultivo Hidropónico',
  description: 'Plataforma de gestión de cultivos hidropónicos y marketplace',
};

import { SearchProvider } from '@/context/SearchContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} ${avigea.variable} font-sans antialiased transition-colors duration-300`}>
        <UserProvider>
          <SearchProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </SearchProvider>
        </UserProvider>
      </body>
    </html>
  );
}