import {
  ReactScanProvider,
  JotaiProvider,
  OneDollarStatsProvider,
  OpenPanelProvider,
  TanstackProvider,
} from "@/providers";
import {
  Geist,
  Geist_Mono,
  JetBrains_Mono,
  Instrument_Serif,
  Instrument_Sans,
  Urbanist,
  Bricolage_Grotesque,
} from "next/font/google";
import { defaultWebsiteMetadata, defaultWebsiteViewport } from "@/constants/meta-data";
import { TOAST_ICONS, TOAST_OPTIONS } from "@/constants/toast";
import { TRPCProvider } from "@/trpc/client";
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
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

// Instrument Serif
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
});

// Instrument Sans
const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Urbanist
const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
});

// Bricolage Grotesque
const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = defaultWebsiteMetadata;
export const viewport = defaultWebsiteViewport;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          jetBrainsMono.variable,
          instrumentSerif.variable,
          instrumentSans.variable,
          urbanist.variable,
          bricolageGrotesque.variable,
          "antialiased",
        )}
      >
        <TanstackProvider>
          <TRPCProvider>
            <OpenPanelProvider>
              <OneDollarStatsProvider>
                <JotaiProvider>
                  <ThemeProvider
                    defaultTheme="system"
                    attribute="class"
                    scriptProps={{
                      "data-cfasync": "false",
                    }}
                  >
                    <ReactScanProvider />
                    <Toaster
                      richColors
                      position="top-center"
                      toastOptions={TOAST_OPTIONS}
                      icons={TOAST_ICONS}
                      visibleToasts={4}
                    />
                    {children}
                  </ThemeProvider>
                </JotaiProvider>
              </OneDollarStatsProvider>
            </OpenPanelProvider>
          </TRPCProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}
