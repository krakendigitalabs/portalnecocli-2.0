import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { formatBlogDate } from "@/components/blog/blog-card";
import { ShareButtons } from "@/components/blog/share-buttons";
import { Container } from "@/components/ui/container";
import { appUrl } from "@/lib/constants/site";
import { BlogRepo } from "@/lib/data/repositories/blog-repo";
import { BLOG_CATEGORY_LABELS } from "@/types/blog";

export const revalidate = 300;

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await BlogRepo.getPublishedBySlug(slug);

  if (!post) return { title: "Artículo no encontrado | Portal Necoclí" };

  return {
    title: `${post.title} | Blog Portal Necoclí`,
    description: post.excerpt,
    alternates: { canonical: `${appUrl}/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `${appUrl}/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      images: [{ url: post.coverImageUrl, alt: post.coverImageAlt }],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await BlogRepo.getPublishedBySlug(slug);

  if (!post) notFound();

  return (
    <article className="pb-24 pt-12 md:pt-20">
      <Container className="max-w-3xl space-y-8">
        <Link href="/blog" className="text-sm font-semibold text-gold hover:underline">
          ← Volver al blog
        </Link>

        <header className="space-y-4">
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide">
            <span className="rounded-full bg-gold/10 px-3 py-1 text-gold">
              {BLOG_CATEGORY_LABELS[post.category]}
            </span>
            <span className="text-ink/50">{post.readingTimeMinutes} min de lectura</span>
          </div>
          <h1 className="text-3xl font-bold leading-tight text-ink md:text-5xl">{post.title}</h1>
          <p className="text-lg text-ink/70">{post.excerpt}</p>
          <p className="text-sm text-ink/50">
            Por {post.author} · {formatBlogDate(post.publishedAt)}
          </p>
        </header>

        <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-sand/30">
          <Image
            src={post.coverImageUrl}
            alt={post.coverImageAlt}
            fill
            priority
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
          />
        </div>

        {/* react-markdown ignora HTML crudo por defecto, lo que evita XSS. */}
        <div className="space-y-5 text-lg leading-relaxed text-ink/80 [&_a]:text-gold [&_a]:underline [&_h2]:pt-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-ink [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-ink [&_li]:ml-6 [&_ol]:list-decimal [&_ul]:list-disc">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        <ShareButtons url={`${appUrl}/blog/${post.slug}`} title={post.title} />

        {post.tags.length > 0 && (
          <ul className="flex flex-wrap gap-2 border-t border-ink/10 pt-6">
            {post.tags.map((tag) => (
              <li key={tag} className="rounded-full bg-sand/40 px-3 py-1 text-xs text-ink/70">
                #{tag}
              </li>
            ))}
          </ul>
        )}
      </Container>
    </article>
  );
}
