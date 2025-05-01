import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import "./globals.css";
import "./fonts.css";

// Geist Sans
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Geist Mono
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// JetBrains Mono
const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Invoicely | Invoice Generator",
  description:
    "Invoicely is a simple and easy to use invoice generator ~ Proudly OSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          jetBrainsMono.variable,
          "antialiased",
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          storageKey="invoicely-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
