import Link from "next/link";
import { cn } from "@/lib/utils/cn";

const buttonVariants = {
  primary:
    "bg-teal text-white hover:bg-teal/90 border-transparent shadow-soft",
  secondary:
    "bg-white text-ink border-ink/12 hover:border-teal/30 hover:text-teal",
  ghost: "bg-transparent text-ink border-transparent hover:text-teal",
  accent:
    "bg-coral text-white hover:bg-coral/90 border-transparent shadow-soft",
} as const;

const buttonSizes = {
  md: "px-5 py-3 text-sm",
  lg: "px-6 py-3.5 text-sm",
} as const;

const baseButtonClassName =
  "inline-flex items-center justify-center rounded-full border font-semibold transition";

type ButtonVariant = keyof typeof buttonVariants;
type ButtonSize = keyof typeof buttonSizes;

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  href?: string;
  size?: ButtonSize;
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
};

export function Button({
  children,
  className,
  href,
  size = "md",
  type = "button",
  variant = "primary",
}: ButtonProps) {
  const classes = cn(
    baseButtonClassName,
    buttonSizes[size],
    buttonVariants[variant],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} type={type}>
      {children}
    </button>
  );
}
