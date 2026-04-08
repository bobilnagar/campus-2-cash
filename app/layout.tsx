import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Campus-2-Cash | Project-to-Income Engine",
    description:
        "Turn your student project into real-world revenue. AI-powered monetization paths grounded in 2026 market trends.",
    keywords: ["student monetization", "project to income", "AI startup mentor", "hackathon"],
    openGraph: {
        title: "Campus-2-Cash | Project-to-Income Engine",
        description: "Turn your student project into real-world revenue with AI-powered monetization paths.",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.variable} font-sans antialiased min-h-screen bg-background`}>
                {children}
            </body>
        </html>
    );
}
