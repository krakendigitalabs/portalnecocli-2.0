import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import type { CommercialHomeContent } from "@/types/commercial-content";

type PromoBannerSectionProps = {
  content: CommercialHomeContent["showcaseSection"] | CommercialHomeContent["bonusSection"];
  id?: string;
  tone?: "light" | "dark";
};

export function PromoBannerSection({
  content,
  id,
  tone = "light",
}: PromoBannerSectionProps) {
  const isDark = tone === "dark";
  const getColumnClassName = (index: number) => {
    if (index === 0) {
      return "lg:col-span-7 lg:min-h-[28rem]";
    }

    if (content.items.length === 3 && index === 2) {
      return "lg:col-span-12";
    }

    if (content.items.length >= 4 && index > 1) {
      return "lg:col-span-6";
    }

    return "lg:col-span-5";
  };

  return (
    <section id={id} className="space-y-6 scroll-mt-32 md:space-y-7">
      <SectionHeader
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />
      <div className="grid gap-4 lg:grid-cols-12">
        {content.items.map((item, index) => (
          <Card
            key={item.id}
            className={[
              "group relative overflow-hidden rounded-[32px] border-0 p-0",
              getColumnClassName(index),
              isDark ? "bg-ink" : "bg-white",
            ].join(" ")}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(9, 19, 24, 0.16), rgba(9, 19, 24, 0.76)), url('${item.image}')`,
              }}
            />
            <div
              className={[
                "relative flex h-full min-h-[18rem] flex-col justify-end p-5 md:min-h-[22rem] md:p-8",
                isDark ? "text-white" : "text-white",
              ].join(" ")}
            >
              <Badge className="mb-4 w-fit bg-white/12 text-white" variant="neutral">
                {item.eyebrow}
              </Badge>
              <div className="max-w-xl space-y-3">
                <h3 className="text-xl font-semibold tracking-tight md:text-3xl">
                  {item.title}
                </h3>
                <p className="text-sm leading-6 text-white/76 md:text-base md:leading-7">
                  {item.description}
                </p>
              </div>
              <div className="mt-6">
                <Button
                  className="w-full border-white/20 bg-white/12 text-white hover:border-white/36 hover:text-white sm:w-auto"
                  href={item.href}
                  size="lg"
                  variant="secondary"
                >
                  {item.label}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
