import type { Metadata } from "next";
import { headers } from "next/headers";
import "@/app/globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Permanent_Marker } from "next/font/google";
import Script from "next/script";
import { AppShell } from "@/components/layout/app-shell";
import { AiConciergeWidget } from "@/components/marketplace/ai-concierge-widget";
import { AppProviders } from "@/components/providers/app-providers";
import { brand, siteMetadata } from "@/lib/constants/site";
import { PORTAL_APP_HEADER } from "@/lib/routing/subdomains";

const tropicalFont = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-tropical",
});

export const metadata: Metadata = {
  title: siteMetadata.title,
  description: siteMetadata.description,
  metadataBase: new URL(siteMetadata.siteUrl),
  alternates: {
    canonical: siteMetadata.siteUrl,
  },
  openGraph: {
    url: siteMetadata.siteUrl,
    title: siteMetadata.title,
    description: siteMetadata.description,
    siteName: siteMetadata.title,
    locale: "es_CO",
    type: "website",
    images: [
      {
        url: siteMetadata.ogImage,
        width: 1600,
        height: 900,
        alt: "Portal Necoclí con enfoque en turismo, hotelería y negocios locales",
      },
    ],
  },
  icons: {
    icon: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1755929246/icono_portal_necocli_nw9wle.png",
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: [siteMetadata.ogImage],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function RootLayout({ children }: RootLayoutProps) {
  const requestHeaders = await headers();
  const portalApp = requestHeaders.get(PORTAL_APP_HEADER) ?? "public";
  const isDashboardApp = portalApp === "admin" || portalApp === "business";

  return (
    <html lang="es">
      <body className={tropicalFont.variable}>
        <AppProviders>
          {isDashboardApp ? (
            children
          ) : (
            <>
              <AppShell
                announcement="Reservas, afiliaciones y soporte local"
                brandName={brand.name}
              >
                {children}
              </AppShell>
              <AiConciergeWidget />
            </>
          )}
        </AppProviders>

        {/* Google Analytics 4 */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}

        {/* Google Ads (Conversion Tracking) */}
        {process.env.NEXT_PUBLIC_GOOGLE_ADS_ID && (
          <Script id="google-ads-config" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}');
            `}
          </Script>
        )}

        {/* Google AdSense */}
        {process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
