import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WalletContextProvider } from "@/components/WalletContextProvider";
import { Toaster } from "react-hot-toast";
import { SpeedInsights } from "@vercel/speed-insights/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tokenhunt-rouge.vercel.app"),
  title: "TokenHunt - Social Token Safety",
  description: "AI-powered rug detection with social validation",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "TokenHunt - Social Token Safety",
    description: "AI-powered rug detection with social validation for Solana traders",
    url: "https://tokenhunt-rouge.vercel.app",
    siteName: "TokenHunt",
    images: [
      {
        url: "/brand/tokenhunt-social-1200x630.png",
        width: 1200,
        height: 630,
        alt: "TokenHunt - AI-powered rug detection with community validation",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TokenHunt - Social Token Safety",
    description: "AI-powered rug detection with social validation for Solana traders",
    images: ["/brand/tokenhunt-social-1200x630.png"],
  },
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
      <body className="min-h-full flex flex-col">
        <WalletContextProvider>
          <Toaster position="bottom-center" />
          {children}
        </WalletContextProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
