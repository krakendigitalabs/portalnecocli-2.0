import { CategoryCard } from "@/components/marketplace/category-card";
import { SectionHeader } from "@/components/ui/section-header";
import type { Category } from "@/types/category";

type MarketplaceCategoriesProps = {
  categories: Category[];
};

export function MarketplaceCategories({ categories }: MarketplaceCategoriesProps) {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Estructura del marketplace"
        title="Categorías listas para evolucionar"
        description="La plataforma queda preparada para crecer por verticales con una base homogénea, consistente y fácil de expandir."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {categories.map((category) => (
          <CategoryCard key={category.slug} category={category} />
        ))}
      </div>
    </section>
  );
}
