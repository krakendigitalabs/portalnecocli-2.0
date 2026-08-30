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
  "inline-flex items-center justify-center rounded-full border font-semibold transition disabled:cursor-not-allowed disabled:opacity-60";

type ButtonVariant = keyof typeof buttonVariants;
type ButtonSize = keyof typeof buttonSizes;

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  href?: string;
  size?: ButtonSize;
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export function Button({
  children,
  className,
  disabled = false,
  href,
  size = "md",
  type = "button",
  variant = "primary",
  onClick,
}: ButtonProps) {
  const classes = cn(
    baseButtonClassName,
    buttonSizes[size],
    buttonVariants[variant],
    className,
  );

  if (href) {
    const isExternalHref =
      href.startsWith("http") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:");

    if (isExternalHref) {
      const shouldOpenInNewTab = href.startsWith("http");

      return (
        <a
          aria-disabled={disabled}
          className={classes}
          href={href}
          rel={shouldOpenInNewTab ? "noreferrer" : undefined}
          target={shouldOpenInNewTab ? "_blank" : undefined}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} disabled={disabled} type={type} onClick={onClick}>
      {children}
    </button>
  );
}
