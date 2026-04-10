import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type SearchBarProps = {
  actionLabel?: string;
  actionPath?: string;
  defaultValue?: string;
  placeholder?: string;
};

export function SearchBar({
  actionLabel = "Explorar",
  actionPath = "/negocios",
  defaultValue,
  placeholder = "Busca hoteles, tours, restaurantes o transporte",
}: SearchBarProps) {
  return (
    <Card className="rounded-[28px] border-ink/8 p-2">
      <form action={actionPath} className="flex flex-col gap-2 md:flex-row" method="get">
        <label className="flex-1">
          <span className="sr-only">Buscar negocios</span>
          <input
            className="h-12 w-full rounded-[22px] border border-transparent bg-transparent px-4 text-sm text-ink outline-none placeholder:text-ink/45 focus:border-teal/20 focus:bg-white"
            defaultValue={defaultValue}
            inputMode="search"
            name="q"
            placeholder={placeholder}
            type="search"
          />
        </label>
        <Button className="h-12 px-6" type="submit" variant="primary">
          {actionLabel}
        </Button>
      </form>
    </Card>
  );
}
