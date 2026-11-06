export type SocialNetworkId = "facebook" | "instagram" | "tiktok" | "x";

export type SocialLink = {
  id: SocialNetworkId;
  label: string;
  href: string;
};

export const socialLinks: readonly SocialLink[] = [
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=100084510412418",
  },
  { id: "instagram", label: "Instagram", href: "https://www.instagram.com/portalnecocli/?hl=es" },
  { id: "tiktok", label: "TikTok", href: "https://www.tiktok.com/@portalnecocli" },
  { id: "x", label: "X", href: "https://x.com/Portalnecocli" },
];
