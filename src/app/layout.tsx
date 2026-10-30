import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";

import { MotionProvider } from "@/components/providers/motion-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const siteTitle = "MeraSEP — Your community. Your cause. Your move.";
const siteDescription =
  "Create, join and track social service events in your neighbourhood. Cleanups, plantation drives, donation runs, health camps and more across Bangladesh.";

export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: "%s · MeraSEP",
  },
  description: siteDescription,
  applicationName: "MeraSEP",
  keywords: [
    "MeraSEP",
    "volunteer Bangladesh",
    "social service events",
    "community service Dhaka",
    "cleanup drive",
    "tree plantation",
    "donation drive",
    "blood donation",
  ],
  authors: [{ name: "MeraSEP" }],
  creator: "MeraSEP",
  openGraph: {
    type: "website",
    locale: "en_BD",
    siteName: "MeraSEP",
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
  icons: {
    icon: [{ url: "/logo/merasep-logo.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF7" },
    { media: "(prefers-color-scheme: dark)", color: "#0B1210" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", inter.variable, plusJakarta.variable)}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
          storageKey="merasep-theme"
        >
          <MotionProvider>
            <TooltipProvider delay={250}>
              <a
                href="#main-content"
                className="sr-only z-100 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
              >
                Skip to content
              </a>
              {children}
              <Toaster richColors closeButton position="top-right" />
            </TooltipProvider>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
