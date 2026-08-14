import type { Metadata, Viewport } from "next";
import "./globals.css";

const BASE_URL = "https://lumenshield.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "LumenShield — Principal-Protected FXRP Vaults on Flare",
    template: "%s | LumenShield",
  },
  description:
    "Principal-protected FXRP and FAsset vaults on Flare. Your principal stays shielded while earned yield follows higher-upside signals.",

  keywords: [
    "DeFi", "Flare", "FXRP", "FAssets", "principal protected",
    "FTSO", "Coston2", "crypto savings", "yield vault",
  ],

  authors: [{ name: "LumenShield", url: BASE_URL }],
  creator: "LumenShield",
  publisher: "LumenShield",

  // ── Favicon / icons ──────────────────────────────────────────────────────
  icons: {
    icon: [
      { url: "/lumenshield-mark.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
      { url: "/favicon-16.png", sizes: "16x16",  type: "image/png" },
      { url: "/favicon.png",    sizes: "32x32",  type: "image/png" },
      { url: "/icon.png",       sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },

  // ── Open Graph (WhatsApp, Discord, Facebook, LinkedIn) ───────────────────
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "LumenShield",
    title: "LumenShield — Principal-Protected FXRP Vaults",
    description:
      "Your principal stays shielded. Your earned yield follows the signal. Built for Flare Summer Signal on Coston2.",
    images: [
      {
        url: "/og-image.png",
        width: 630,
        height: 630,
        alt: "LumenShield — Principal-Protected FXRP Vaults",
      },
    ],
    locale: "en_US",
  },

  // ── Twitter / X card ─────────────────────────────────────────────────────
  twitter: {
    card: "summary",
    title: "LumenShield — Principal-Protected FXRP Vaults",
    description: "Principal stays shielded. Yield follows the signal. Built on Flare.",
    images: ["/og-image.png"],
  },

  // ── PWA manifest ─────────────────────────────────────────────────────────
  manifest: "/manifest.json",

  // ── Robots ───────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },

  // ── Canonical ────────────────────────────────────────────────────────────
  alternates: {
    canonical: BASE_URL,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#090b11",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="LumenShield" />
      </head>
      <body>{children}</body>
    </html>
  );
}
