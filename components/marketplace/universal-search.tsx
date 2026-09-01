import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { BusinessServiceType } from "@/types/featured-business";

type UniversalSearchProps = {
  actionPath?: string;
  categoryOptions?: Array<{
    label: string;
    value: string;
  }>;
  defaultCategory?: string;
  defaultLocation?: string | null;
  defaultPrice?: string | null;
  defaultQuery?: string;
  defaultRating?: number | null;
  locationOptions?: string[];
  lockedServiceType?: BusinessServiceType | "all";
  placeholder?: string;
  priceOptions?: string[];
  ratingOptions?: number[];
  submitLabel?: string;
  variant?: "hero" | "listing";
};

function renderSelectOptions(options: string[], placeholder: string) {
  return (
    <>
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </>
  );
}

export function UniversalSearch({
  actionPath = "/negocios",
  categoryOptions = [],
  defaultCategory = "all",
  defaultLocation,
  defaultPrice,
  defaultQuery = "",
  defaultRating,
  locationOptions = [],
  lockedServiceType,
  placeholder = "Busca hoteles, restaurantes, tours o transporte",
  priceOptions = [],
  ratingOptions = [],
  submitLabel = "Buscar",
  variant = "listing",
}: UniversalSearchProps) {
  const isHero = variant === "hero";

  return (
    <Card
      className={`rounded-[30px] border-ink/10 ${isHero ? "bg-white/96 p-3 shadow-soft" : "p-3"}`}
    >
      <form action={actionPath} className="grid gap-3 md:grid-cols-12" method="get">
        {lockedServiceType ? (
          <input name="category" type="hidden" value={lockedServiceType} />
        ) : (
          <label className="md:col-span-2">
            <span className="sr-only">Categoria</span>
            <select
              className="h-12 w-full rounded-[22px] border border-ink/10 bg-white px-4 text-sm text-ink outline-none transition focus:border-teal/30"
              defaultValue={defaultCategory}
              name="category"
            >
              <option value="all">Todas las categorias</option>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className={lockedServiceType ? "md:col-span-4" : "md:col-span-3"}>
          <span className="sr-only">Busqueda</span>
          <input
            className="h-12 w-full rounded-[22px] border border-ink/10 bg-white px-4 text-sm text-ink outline-none transition placeholder:text-ink/45 focus:border-teal/30"
            defaultValue={defaultQuery}
            inputMode="search"
            name="q"
            placeholder={placeholder}
            type="search"
          />
        </label>

        <label className="md:col-span-2">
          <span className="sr-only">Ubicacion</span>
          <select
            className="h-12 w-full rounded-[22px] border border-ink/10 bg-white px-4 text-sm text-ink outline-none transition focus:border-teal/30"
            defaultValue={defaultLocation ?? ""}
            name="location"
          >
            {renderSelectOptions(locationOptions, "Todas las zonas")}
          </select>
        </label>

        <label className="md:col-span-2">
          <span className="sr-only">Precio</span>
          <select
            className="h-12 w-full rounded-[22px] border border-ink/10 bg-white px-4 text-sm text-ink outline-none transition focus:border-teal/30"
            defaultValue={defaultPrice ?? ""}
            name="price"
          >
            {renderSelectOptions(priceOptions, "Todos los precios")}
          </select>
        </label>

        <label className="md:col-span-2">
          <span className="sr-only">Rating minimo</span>
          <select
            className="h-12 w-full rounded-[22px] border border-ink/10 bg-white px-4 text-sm text-ink outline-none transition focus:border-teal/30"
            defaultValue={defaultRating?.toString() ?? ""}
            name="rating"
          >
            <option value="">Todo rating</option>
            {ratingOptions.map((rating) => (
              <option key={rating} value={rating}>
                {rating}+ estrellas
              </option>
            ))}
          </select>
        </label>

        <div className={lockedServiceType ? "md:col-span-2" : "md:col-span-1"}>
          <Button className="h-12 w-full" type="submit" variant={isHero ? "accent" : "primary"}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Card>
  );
}
