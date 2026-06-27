import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getLaunchDarklyBootstrap } from "@/lib/launchdarkly/edge-bootstrap";
import { LaunchDarklyProvider } from "@/components/launchdarkly-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pigment Studio",
  description: "A design system at 100+-engineer scale.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bootstrap = await getLaunchDarklyBootstrap();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LaunchDarklyProvider bootstrap={bootstrap}>
          <ThemeProvider>
            <SiteHeader />
            {children}
          </ThemeProvider>
        </LaunchDarklyProvider>
      </body>
    </html>
  );
}
