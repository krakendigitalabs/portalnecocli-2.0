import { cn } from "@/lib/utils/cn";

type BadgeVariant = "accent" | "teal" | "neutral";

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
  variant?: BadgeVariant;
};

const badgeVariants: Record<BadgeVariant, string> = {
  accent: "bg-coral/10 text-coral",
  teal: "bg-teal/10 text-teal",
  neutral: "bg-ink/6 text-ink/72",
};

export function Badge({ children, className, variant = "teal" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        badgeVariants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
