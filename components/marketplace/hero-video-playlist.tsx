import { HERO_VIDEO_IDS } from "@/data/hero-videos";

const [firstVideoId, ...queuedVideoIds] = HERO_VIDEO_IDS;

const params = new URLSearchParams({
  autoplay: "1",
  mute: "1",
  controls: "0",
  loop: "1",
  playsinline: "1",
  rel: "0",
  modestbranding: "1",
  disablekb: "1",
  iv_load_policy: "3",
  // Pedido de máxima calidad (YouTube lo trata como sugerencia).
  vq: "hd1080",
  hd: "1",
  // YouTube loop only works with a playlist; this also plays the videos back to back.
  playlist: [firstVideoId, ...queuedVideoIds].join(","),
});

export function HeroVideoPlaylist() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <iframe
        allow="autoplay; encrypted-media"
        className="absolute left-1/2 top-[42%] aspect-video w-full -translate-x-1/2 -translate-y-1/2 border-0 md:top-1/2 md:aspect-auto md:h-[max(100%,56.25vw)] md:w-[max(100%,177.78svh)]"
        loading="eager"
        referrerPolicy="strict-origin-when-cross-origin"
        src={`https://www.youtube-nocookie.com/embed/${firstVideoId}?${params.toString()}`}
        tabIndex={-1}
        title="Videos de Necoclí"
      />
    </div>
  );
}
