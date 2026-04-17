import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";
import { Outfit } from 'next/font/google';
import localFont from 'next/font/local';
import "./globals.css";
import IntroLoader from "./components/IntroLoader";

const soriaFont = localFont({
  src: "../public/soria-font.ttf",
  variable: "--font-soria",
});

const vercettiFont = localFont({
  src: "../public/Vercetti-Regular.woff",
  variable: "--font-vercetti",
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: "Ruchith 😎",
  description: "A Product Designer by profession, a creative at heart.",
  icons: {
    icon: "/favicon.svg",
  },
  keywords: "Ruchith, Product Designer, UI/UX Designer, Three.js, Creative Designer, Web Design, Experience Design, Portfolio",
  authors: [{ name: "Ruchith" }],
  creator: "Ruchith",
  publisher: "Ruchith",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Ruchith - Product Designer",
    description: "Product Designer by profession, creative at heart.",
    url: "https://rxchith.github.io",
    siteName: "Ruchith's Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ruchith - Product Designer",
    description: "Product Designer by profession, creative at heart.",
  },
  verification: {
    google: "GsRYY-ivL0F_VKkfs5KAeToliqz0gCrRAJKKmFkAxBA",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overscroll-y-none">
      <body
        className={`${soriaFont.variable} ${vercettiFont.variable} ${outfit.variable} font-sans antialiased`}
      >
        <IntroLoader />
        {children}
      </body>
      <GoogleAnalytics gaId={'G-7WD4HM3XRE'}/>
    </html>
  );
}
