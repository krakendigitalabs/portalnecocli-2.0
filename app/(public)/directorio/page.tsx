import { redirect } from "next/navigation";

type DirectoryAliasPageProps = {
  searchParams?: Promise<{
    category?: string;
    q?: string;
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

  const suffix = params.toString();

  redirect(suffix ? `/negocios?${suffix}` : "/negocios");
}
