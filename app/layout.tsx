import type { Metadata } from "next";
import { headers } from "next/headers";
import "@/app/globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { AppProviders } from "@/components/providers/app-providers";
import { brand, siteMetadata } from "@/lib/constants/site";
import { PORTAL_APP_HEADER } from "@/lib/routing/subdomains";
import { Permanent_Marker } from "next/font/google";

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
            <AppShell
              announcement="Reservas, afiliaciones y soporte local"
              brandName={brand.name}
            >
              {children}
            </AppShell>
          )}
        </AppProviders>
      </body>
    </html>
  );
}
