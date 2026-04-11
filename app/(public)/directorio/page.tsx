import { redirect } from "next/navigation";

type DirectoryAliasPageProps = {
  searchParams?: Promise<{
    category?: string;
    q?: string;
    location?: string;
    price?: string;
    rating?: string;
  }>;
};

export default async function DirectoryAliasPage({
  searchParams,
}: DirectoryAliasPageProps) {
  const resolvedSearchParams = await searchParams;
  const params = new URLSearchParams();

  if (resolvedSearchParams?.category) {
    params.set("category", resolvedSearchParams.category);
  }

  if (resolvedSearchParams?.q) {
    params.set("q", resolvedSearchParams.q);
  }

  if (resolvedSearchParams?.location) {
    params.set("location", resolvedSearchParams.location);
  }

  if (resolvedSearchParams?.price) {
    params.set("price", resolvedSearchParams.price);
  }

  if (resolvedSearchParams?.rating) {
    params.set("rating", resolvedSearchParams.rating);
  }

  const suffix = params.toString();

  redirect(suffix ? `/negocios?${suffix}` : "/negocios");
}
