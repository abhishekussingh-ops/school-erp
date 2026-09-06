import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AppProvider } from '@/lib/app-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Lovedale ERP — School Management Suite',
  description: 'Modern school ERP for principals, teachers, admin staff, parents, and students.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
