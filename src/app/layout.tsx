import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import React from 'react';
import Navigation from '@/components/navigation';

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
    title: 'Finances',
    description: 'Track your finances with ease',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={cn('dark', inter.className)}>
        <Navigation/>
        <main>
            {children}
            <Toaster/>
        </main>
        </body>
        </html>
    );
}
