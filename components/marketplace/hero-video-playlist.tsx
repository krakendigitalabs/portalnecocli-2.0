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
  // YouTube loop only works with a playlist; this also plays the videos back to back.
  playlist: [firstVideoId, ...queuedVideoIds].join(","),
});

export function HeroVideoPlaylist() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <iframe
        allow="autoplay; encrypted-media"
        className="absolute left-1/2 top-1/2 h-[100svh] min-h-full w-[177.78svh] min-w-full -translate-x-1/2 -translate-y-1/2 border-0"
        referrerPolicy="strict-origin-when-cross-origin"
        src={`https://www.youtube-nocookie.com/embed/${firstVideoId}?${params.toString()}`}
        tabIndex={-1}
        title="Videos de Necoclí"
      />
    </div>
  );
}
