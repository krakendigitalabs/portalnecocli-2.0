type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
};

export function SectionHeader({ eyebrow, title, description, align = "left" }: SectionHeaderProps) {
  const alignmentClassName = align === "center" ? "mx-auto text-center" : "text-left";

  return (
    <div className={`max-w-2xl space-y-3 ${alignmentClassName}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-coral">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">{title}</h2>
      <p className="text-base leading-7 text-ink/72">{description}</p>
    </div>
  );
}
