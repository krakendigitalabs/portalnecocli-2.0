import type { Metadata } from "next";
import "@/app/globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { brand, siteMetadata } from "@/lib/constants/site";

export const metadata: Metadata = {
  title: siteMetadata.title,
  description: siteMetadata.description,
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es">
      <body>
        <AppShell
          announcement="Portal en construcción por fases"
          brandName={brand.name}
        >
          {children}
        </AppShell>
      </body>
    </html>
  );
}
