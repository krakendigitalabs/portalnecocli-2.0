export const brand = {
  name: "Necoclí",
} as const;

export const siteMetadata = {
  title: "Portal Necoclí 2.0",
  description:
    "Plataforma premium para hotelería, turismo, alimentos, transporte turístico y domicilios en Necoclí.",
  siteUrl: "https://portalnecocli.com",
  ogImage: "https://res.cloudinary.com/dr50ioh9h/image/upload/v1752722255/familia_22_febopw.png",
} as const;

export const navigationLinks = [
  { href: "/", label: "Inicio" },
  { href: "/negocios", label: "Explora negocios" },
  { href: "/tarifario", label: "Tarifario" },
  { href: "/turistas", label: "Turistas" },
  { href: "/customer/bonos", label: "Recompensas" },
  { href: "/#businesses", label: "Afiliados" },
  { href: "/#contact", label: "Contacto" },
] as const;
