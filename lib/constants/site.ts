export const brand = {
  name: "Necoclí",
} as const;

export const siteMetadata = {
  title: "Portal Necoclí 2.0",
  description:
    "Plataforma premium para hotelería, turismo, alimentos, transporte turístico y domicilios en Necoclí.",
  siteUrl: "https://portalnecocli.com",
} as const;

export const navigationLinks = [
  { href: "/", label: "Inicio" },
  { href: "/#tourists", label: "Turistas" },
  { href: "/#businesses", label: "Afiliados" },
  { href: "/#directory", label: "Directorio" },
  { href: "/#contact", label: "Contacto" },
] as const;
