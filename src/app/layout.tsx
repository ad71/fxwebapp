import "./globals.css";
import "../styles/tokens.css";
import { AppShell } from "../components/layout/app-shell";
import { NProgress } from "../components/ui/nprogress";
import { ThemeProvider } from "../components/theme/theme-provider";
import { Sora, Space_Grotesk } from "next/font/google";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Balli FX",
    template: "%s — Balli FX",
  },
  description: "Real-time FX rates, analytics, and treasury tools for currency professionals.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sora.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('fx-theme');if(t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.setAttribute('data-theme','dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <NProgress />
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
