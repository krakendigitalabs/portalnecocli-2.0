import type { Metadata } from "next";
import "@/app/globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { brand, siteMetadata } from "@/lib/constants/site";

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

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es">
      <body>
        <AppShell
          announcement="Reservas, afiliaciones y soporte local"
          brandName={brand.name}
        >
          {children}
        </AppShell>
      </body>
    </html>
  );
}
