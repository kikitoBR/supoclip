import type { Metadata } from "next";
import { Geist, Geist_Mono, Syne } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AttributionTracker } from "@/components/attribution-tracker";
import { DataFastIdentity } from "@/components/datafast-identity";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FeedbackButton } from "@/components/feedback-button";
import { getSiteUrl } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dataFastWebsiteId = process.env.NEXT_PUBLIC_DATAFAST_WEBSITE_ID;
const dataFastDomain = process.env.NEXT_PUBLIC_DATAFAST_DOMAIN;
const shouldTrackLocalhost = process.env.NEXT_PUBLIC_DATAFAST_ALLOW_LOCALHOST === "true";
const isDataFastEnabled = Boolean(dataFastWebsiteId && dataFastDomain);

export const metadata: Metadata = {
  title: {
    default: "Kortes – Cortes de vídeo com IA",
    template: "%s | Kortes",
  },
  description:
    "Transforme vídeos longos em clipes curtos legendados com IA, pontuação de viralidade e enquadramento vertical que acompanha o rosto.",
  metadataBase: new URL(getSiteUrl()),
  applicationName: "Kortes",
  authors: [{ name: "Equipe Kortes", url: getSiteUrl() }],
  creator: "Equipe Kortes",
  publisher: "Kortes",
  category: "software de vídeo",
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title: "Kortes – Cortes de vídeo com IA",
    description:
      "Transforme vídeos longos em clipes curtos legendados com IA.",
    siteName: "Kortes",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kortes – Cortes de vídeo com IA",
    description:
      "Cortes com IA, pontuação de viralidade, legendas e enquadramento vertical que acompanha o rosto.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {isDataFastEnabled ? (
          <>
            <Script id="datafast-queue" strategy="beforeInteractive">
              {`window.datafast = window.datafast || function() {
  window.datafast.q = window.datafast.q || [];
  window.datafast.q.push(arguments);
};`}
            </Script>
            <Script
              id="datafast-script"
              strategy="afterInteractive"
              src="/js/script.js"
              data-website-id={dataFastWebsiteId}
              data-domain={dataFastDomain}
              data-allow-localhost={shouldTrackLocalhost ? "true" : undefined}
              data-disable-console="true"
            />
          </>
        ) : null}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} antialiased`}
        suppressHydrationWarning
      >
        <TooltipProvider>
          {children}
          <DataFastIdentity />
          <AttributionTracker />
          <FeedbackButton />
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
