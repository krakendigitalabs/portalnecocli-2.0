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

// Dominio público de la app (donde viven /blog, /tickets, etc.); distinto del dominio corporativo.
export const appUrl =
  process.env.NEXT_PUBLIC_BASE_URL && process.env.NEXT_PUBLIC_BASE_URL !== "http://localhost:3000"
    ? process.env.NEXT_PUBLIC_BASE_URL
    : "https://tours.portalnecocli.com";

export const navigationLinks = [
  { href: "/", label: "Inicio" },
  { href: "/negocios", label: "Explora negocios" },
  { href: "/turistas", label: "Paquetes" },
  { href: "/reservas-maritimas", label: "Tour Islas" },
  { href: "/tours/cuatrimoto", label: "Cuatrimotos" },
  { href: "/turismo-local", label: "Turismo Local" },
  { href: "/blog", label: "Blog" },
  { href: "/contacto", label: "Contacto" },
] as const;
