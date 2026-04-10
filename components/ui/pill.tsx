import { Badge } from "@/components/ui/badge";

type PillProps = {
  children: React.ReactNode;
};

export function Pill({ children }: PillProps) {
  return <Badge variant="teal">{children}</Badge>;
}
