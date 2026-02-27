import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { NotificationProvider } from "@/components/NotificationContext";

export const metadata: Metadata = {
    title: "AI Inbox Assistant – Never Lose a Lead to Your Inbox Again",
    description:
        "A plug-and-play AI assistant that drafts your replies and follow-ups so you stop leaving money in unread emails. Lifetime access for $29.99.",
    icons: {
        icon: [
            { url: "/favicon.ico" },
            { url: "/icon.png", type: "image/png" },
        ],
        shortcut: "/favicon.ico",
        apple: "/icon.png",
    }
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="antialiased min-h-screen flex flex-col">
                <NotificationProvider>
                    <Header />
                    <main className="flex-grow">
                        {children}
                    </main>
                    <Footer />
                </NotificationProvider>
            </body>
        </html>
    );
}
