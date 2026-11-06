import { z } from "zod";
import { FALLBACK_IMAGE_URL, isAllowedImageUrl } from "@/lib/config/image-hosts";
import { BLOG_CATEGORIES, type BlogPost } from "@/types/blog";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type TimestampLike = { toDate: () => Date };

function isTimestampLike(value: unknown): value is TimestampLike {
  return (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as TimestampLike).toDate === "function"
  );
}

// Firestore devuelve Timestamp; normalizamos a ISO string serializable.
const isoDateSchema = z.preprocess(
  (value) => {
    if (isTimestampLike(value)) return value.toDate().toISOString();
    if (value instanceof Date) return value.toISOString();
    return value;
  },
  z.string().datetime({ offset: true }),
);

export const BlogPostSchema = z.object({
  slug: z.string().min(3).max(120).regex(slugPattern, "Slug inválido."),
  title: z.string().min(5).max(160),
  excerpt: z.string().min(20).max(300),
  content: z.string().min(50),
  coverImageUrl: z
    .string()
    .url()
    .transform((value) => (isAllowedImageUrl(value) ? value : FALLBACK_IMAGE_URL)),
  coverImageAlt: z.string().min(3).max(200),
  category: z.enum(BLOG_CATEGORIES),
  tags: z.array(z.string().min(1).max(40)).max(10).default([]),
  author: z.string().min(2).max(80),
  status: z.enum(["draft", "published"]),
  readingTimeMinutes: z.number().int().min(1).max(120),
  publishedAt: isoDateSchema,
  updatedAt: isoDateSchema,
}) satisfies z.ZodType<BlogPost, unknown>;

export const BlogSlugSchema = z.string().min(3).max(120).regex(slugPattern);

export const BlogCategoryFilterSchema = z.enum(BLOG_CATEGORIES);
