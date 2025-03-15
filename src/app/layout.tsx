import type { Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import React from 'react';
import Navigation from '@/components/navigation';

const inter = Inter({subsets: ['latin']});

const APP_NAME = 'Finances';
const APP_DEFAULT_TITLE = 'Finances';
const APP_TITLE_TEMPLATE = `%s | ${APP_DEFAULT_TITLE}`;
const APP_DESCRIPTION = 'Track your finances with ease';

export const metadata = {
    applicationName: APP_NAME,
    title: {
        default: APP_DEFAULT_TITLE,
        template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: APP_DEFAULT_TITLE,
    },
    formatDetection: {
        telephone: false,
    },
};

export const viewport: Viewport = {
    themeColor: '#0B0908',
    width: 'device-width',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <head>
            <link crossOrigin="use-credentials" rel="manifest" href="/manifest.json"/>
            <link
                rel="icon"
                href="/logo_t_hq_o.svg"
            />
        </head>
        <body className={cn('dark', inter.className)}>
        <Navigation/>
        <main className="p-4 sm:p-8">
            {children}
        </main>
        <Toaster/>
        </body>
        </html>
    );
}
