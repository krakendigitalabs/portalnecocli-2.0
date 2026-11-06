import { describe, expect, it } from "vitest";
import { FALLBACK_IMAGE_URL } from "@/lib/config/image-hosts";
import { BlogPostSchema } from "@/lib/validations/blog.schema";

const basePost = {
  slug: "guia-necocli",
  title: "Guía para visitar Necoclí",
  excerpt: "Todo lo que necesitas saber para disfrutar del golfo de Urabá.",
  content: "# Necoclí\n\nUn destino de playa, gastronomía y cultura en el Caribe antioqueño.",
  coverImageUrl: "https://images.unsplash.com/photo-1",
  coverImageAlt: "Playa de Necoclí",
  category: "turismo",
  tags: [],
  author: "Equipo Portal",
  status: "published",
  readingTimeMinutes: 3,
  publishedAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("BlogPostSchema coverImageUrl", () => {
  it("keeps URLs from allowed hosts", () => {
    expect(BlogPostSchema.parse(basePost).coverImageUrl).toBe(basePost.coverImageUrl);
  });

  it("keeps local /public paths", () => {
    const coverImageUrl = "/blog/uraba-global-fest-2026.jpg";
    expect(BlogPostSchema.parse({ ...basePost, coverImageUrl }).coverImageUrl).toBe(coverImageUrl);
  });

  it.each([
    "https://evil.example.com/a.png",
    "http://images.unsplash.com/a.png",
    "https://images.unsplash.com.evil.com/a.png",
    "//evil.example.com/a.png",
    "/blog/../../secret.png",
    "not a url",
  ])("falls back for disallowed value %s", (coverImageUrl) => {
    expect(BlogPostSchema.parse({ ...basePost, coverImageUrl }).coverImageUrl).toBe(
      FALLBACK_IMAGE_URL,
    );
  });
});
