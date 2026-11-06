// Fuente única de dominios de imágenes remotas permitidos (next.config.ts y validaciones).
export const ALLOWED_IMAGE_HOSTNAMES = [
  "res.cloudinary.com",
  "images.unsplash.com",
  "placehold.co",
  "portalnecocli.com",
  "firebasestorage.googleapis.com",
] as const;

export const FALLBACK_IMAGE_URL = "https://placehold.co/1200x750/png?text=Portal+Necocli";

const LOCAL_IMAGE_PATH_PATTERN = /^\/(?!\/)[\w\-./]+$/;

// Acepta rutas de /public (sin "//" ni "..") y URLs https de hosts autorizados.
export function isAllowedImageUrl(value: string): boolean {
  if (LOCAL_IMAGE_PATH_PATTERN.test(value)) return !value.includes("..");

  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      (ALLOWED_IMAGE_HOSTNAMES as readonly string[]).includes(url.hostname)
    );
  } catch {
    return false;
  }
}
