"use client";

import { Check, Link2, MessageCircle, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { type SocialNetworkId, socialLinks } from "@/lib/constants/social";
import { FacebookIcon, InstagramIcon, TikTokIcon, XIcon } from "./social-icons";

type ShareButtonsProps = {
  url: string;
  title: string;
};

const followIcons: Record<SocialNetworkId, typeof FacebookIcon> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
  x: XIcon,
};

const buttonClass =
  "inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-ink/80 transition hover:border-ink/30 hover:text-ink";

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const targets = [
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      Icon: FacebookIcon,
    },
    {
      label: "X",
      href: `https://x.com/intent/post?url=${encodedUrl}&text=${encodedTitle}`,
      Icon: XIcon,
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      Icon: MessageCircle,
    },
  ];

  // Instagram, TikTok y YouTube no tienen URL de compartir web: se usa el menú nativo del dispositivo.
  // Se detecta tras el montaje para que el primer render coincida con el HTML del servidor.
  useEffect(() => {
    setCanNativeShare(typeof navigator.share === "function");
  }, []);

  async function nativeShare() {
    try {
      await navigator.share({ title, url });
    } catch {
      // El usuario canceló el diálogo.
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section aria-label="Compartir artículo" className="space-y-3 border-t border-ink/10 pt-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-ink/50">Compartir</p>
      <div className="flex flex-wrap gap-2">
        {targets.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </a>
        ))}
        {canNativeShare && (
          <button type="button" onClick={nativeShare} className={buttonClass}>
            <Share2 className="h-4 w-4" aria-hidden="true" />
            Instagram / TikTok…
          </button>
        )}
        <button type="button" onClick={copyLink} className={buttonClass}>
          {copied ? (
            <Check className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Link2 className="h-4 w-4" aria-hidden="true" />
          )}
          {copied ? "¡Enlace copiado!" : "Copiar enlace"}
        </button>
      </div>
      <p className="pt-2 text-sm font-semibold uppercase tracking-wide text-ink/50">
        Síguenos en redes
      </p>
      <div className="flex flex-wrap gap-2">
        {socialLinks.map(({ id, label, href }) => {
          const Icon = followIcons[id];
          return (
            <a
              key={id}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </a>
          );
        })}
      </div>
    </section>
  );
}
