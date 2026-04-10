import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Category } from "@/types/category";

type CategoryCardProps = {
  category: Category;
};

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Card className="rounded-[28px] border-ink/10 p-6 transition hover:-translate-y-0.5 hover:border-coral/20">
      <Badge variant="accent">{category.shortLabel}</Badge>
      <h3 className="mt-4 text-xl font-semibold text-ink">{category.label}</h3>
      <p className="mt-3 text-sm leading-6 text-ink/68">
        {category.description}
      </p>
    </Card>
  );
}
