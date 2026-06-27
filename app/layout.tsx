import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getLaunchDarklyBootstrap } from "@/lib/launchdarkly/edge-bootstrap";
import { LaunchDarklyProvider } from "@/components/launchdarkly-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { AppShell } from "@/components/app-shell";
import { AppSidebarLayout } from "@/components/app-sidebar-layout";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className={`${geistSans.className} flex min-h-dvh flex-col`}>
        <ThemeProvider>
          <AppSidebarLayout>
            <AppShell header={<SiteHeader />}>
              <Suspense fallback={<LaunchDarklyProvider>{children}</LaunchDarklyProvider>}>
                <LaunchDarklyLayout>{children}</LaunchDarklyLayout>
              </Suspense>
            </AppShell>
          </AppSidebarLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}

async function LaunchDarklyLayout({ children }: { children: React.ReactNode }) {
  const bootstrap = await getLaunchDarklyBootstrap();

  return <LaunchDarklyProvider bootstrap={bootstrap}>{children}</LaunchDarklyProvider>;
}
