import Image from "next/image";
import Link from "next/link";
import { BLOG_CATEGORY_LABELS, type BlogPost } from "@/types/blog";

export function formatBlogDate(iso: string): string {
  return new Intl.DateTimeFormat("es-CO", { dateStyle: "long", timeZone: "America/Bogota" }).format(
    new Date(iso),
  );
}

type BlogCardProps = {
  post: BlogPost;
  priority?: boolean;
};

export function BlogCard({ post, priority = false }: BlogCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-ink/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/blog/${post.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-[16/10] overflow-hidden bg-sand/30">
          <Image
            src={post.coverImageUrl}
            alt={post.coverImageAlt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col gap-3 p-6">
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide">
            <span className="rounded-full bg-gold/10 px-3 py-1 text-gold">
              {BLOG_CATEGORY_LABELS[post.category]}
            </span>
            <span className="text-ink/50">{post.readingTimeMinutes} min de lectura</span>
          </div>
          <h2 className="text-xl font-bold leading-snug text-ink">{post.title}</h2>
          <p className="line-clamp-3 text-sm text-ink/70">{post.excerpt}</p>
          <p className="mt-auto pt-2 text-xs text-ink/50">
            {post.author} · {formatBlogDate(post.publishedAt)}
          </p>
        </div>
      </Link>
    </article>
  );
}
