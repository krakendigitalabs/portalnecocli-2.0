export const BLOG_CATEGORIES = [
  "turismo",
  "gastronomia",
  "transporte",
  "cultura",
  "eventos",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export const BLOG_CATEGORY_LABELS: Record<BlogCategory, string> = {
  turismo: "Turismo",
  gastronomia: "Gastronomía",
  transporte: "Transporte",
  cultura: "Cultura",
  eventos: "Eventos",
};

export type BlogPostStatus = "draft" | "published";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  coverImageAlt: string;
  category: BlogCategory;
  tags: string[];
  author: string;
  status: BlogPostStatus;
  readingTimeMinutes: number;
  publishedAt: string;
  updatedAt: string;
};
