import type { Metadata } from "next";
import Link from "next/link";
import { BlogCard } from "@/components/blog/blog-card";
import { Container } from "@/components/ui/container";
import { appUrl } from "@/lib/constants/site";
import { BlogRepo, parseBlogCategory } from "@/lib/data/repositories/blog-repo";
import { cn } from "@/lib/utils/cn";
import { BLOG_CATEGORIES, BLOG_CATEGORY_LABELS } from "@/types/blog";

export const metadata: Metadata = {
  title: "Blog y Noticias | Portal Necoclí",
  description:
    "Guías de turismo, gastronomía, transporte y cultura para descubrir Necoclí como un local.",
  alternates: { canonical: `${appUrl}/blog` },
};

type BlogPageProps = {
  searchParams: Promise<{ categoria?: string }>;
};

function chipClass(active: boolean): string {
  return cn(
    "rounded-full border px-4 py-2 text-sm font-semibold transition",
    active
      ? "border-ink bg-ink text-white"
      : "border-ink/10 bg-white text-ink/70 hover:border-ink/30",
  );
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { categoria } = await searchParams;
  const category = parseBlogCategory(categoria);
  const posts = await BlogRepo.listPublished(category);

  return (
    <div className="min-h-[70vh] pb-24 pt-16 md:pt-24">
      <Container className="space-y-12">
        <div className="space-y-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-ink md:text-6xl">
            El Blog del Golfo
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-ink/70">
            Descubre guías, tips de viaje y noticias exclusivas sobre Necoclí.
          </p>
        </div>

        <nav aria-label="Categorías del blog" className="flex flex-wrap justify-center gap-2">
          <Link href="/blog" className={chipClass(!category)}>
            Todos
          </Link>
          {BLOG_CATEGORIES.map((item) => (
            <Link
              key={item}
              href={`/blog?categoria=${item}`}
              className={chipClass(category === item)}
            >
              {BLOG_CATEGORY_LABELS[item]}
            </Link>
          ))}
        </nav>

        {posts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <BlogCard key={post.slug} post={post} priority={index < 3} />
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-2xl space-y-3 rounded-[40px] border border-ink/5 bg-sand/20 p-12 text-center">
            <h2 className="text-2xl font-bold text-ink">Nuevos artículos en camino</h2>
            <p className="text-ink/60">
              Nuestro equipo editorial está preparando las mejores guías turísticas. Vuelve pronto
              para descubrir contenido exclusivo.
            </p>
          </div>
        )}
      </Container>
    </div>
  );
}
