import { cn } from "@/lib/utils/cn";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "border border-white/70 bg-white/88 shadow-soft backdrop-blur",
        className,
      )}
    >
      {children}
    </div>
  );
}
