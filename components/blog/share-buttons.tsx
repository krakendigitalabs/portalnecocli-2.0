"use client";

import { Check, Link2, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";

type IconProps = { className?: string; "aria-hidden"?: boolean | "true" | "false" };

function FacebookIcon(props: IconProps) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
    </svg>
  );
}

function XIcon(props: IconProps) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

type ShareButtonsProps = {
  url: string;
  title: string;
};

const buttonClass =
  "inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-ink/80 transition hover:border-ink/30 hover:text-ink";

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
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
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      Icon: XIcon,
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      Icon: MessageCircle,
    },
  ];

  // Instagram, TikTok y YouTube no tienen URL de compartir web: se usa el menú nativo del dispositivo.
  const canNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

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
    </section>
  );
}
