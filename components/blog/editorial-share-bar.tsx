"use client";

import { useState } from "react";
import { Check, Link2, MessageCircle, Share2 } from "lucide-react";

const SITE_BASE_URL = "https://tours.portalnecocli.com";

interface EditorialShareBarProps {
    title: string;
    slug: string;
}

export function EditorialShareBar({ title, slug }: EditorialShareBarProps) {
    const [copied, setCopied] = useState(false);

    const shareUrl = `${SITE_BASE_URL}/blog/${slug}`;
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);
    const whatsappText = encodeURIComponent(`${title} — ${shareUrl}`);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            window.prompt("Copia este enlace para compartir:", shareUrl);
        }
    };

    const handleNativeShare = async () => {
        if (typeof navigator !== "undefined" && navigator.share) {
            try {
                await navigator.share({ title, text: title, url: shareUrl });
                return;
            } catch {
                // Usuario canceló o el navegador bloqueó el diálogo nativo
            }
        }
        await handleCopy();
    };

    const pillClass =
        "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-2xs transition-all hover:border-slate-900 hover:bg-slate-50 hover:text-slate-950 cursor-pointer";

    return (
        <section
            aria-label="Compartir artículo en redes sociales"
            className="mt-12 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm"
        >
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-3">
                Compartir este artículo
            </p>

            <div className="flex flex-wrap items-center gap-2.5">
                <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={pillClass}
                >
                    <span aria-hidden="true" className="font-black text-slate-900">
                        f
                    </span>
                    <span>Facebook</span>
                </a>

                <a
                    href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={pillClass}
                >
                    <span aria-hidden="true" className="font-black text-slate-900">
                        𝕏
                    </span>
                    <span>X</span>
                </a>

                <a
                    href={`https://wa.me/?text=${whatsappText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${pillClass} hover:border-emerald-600 hover:text-emerald-800`}
                >
                    <MessageCircle className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                    <span>WhatsApp</span>
                </a>

                <button type="button" onClick={handleNativeShare} className={pillClass}>
                    <Share2 className="h-3.5 w-3.5 text-slate-600" aria-hidden="true" />
                    <span>Instagram / TikTok...</span>
                </button>

                <button
                    type="button"
                    onClick={handleCopy}
                    className={
                        copied
                            ? "inline-flex items-center gap-2 rounded-full border border-emerald-500 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-800 transition-all cursor-pointer"
                            : pillClass
                    }
                >
                    {copied ? (
                        <>
                            <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                            <span>¡Enlace copiado!</span>
                        </>
                    ) : (
                        <>
                            <Link2 className="h-3.5 w-3.5 text-slate-600" aria-hidden="true" />
                            <span>Copiar enlace</span>
                        </>
                    )}
                </button>
            </div>
        </section>
    );
}