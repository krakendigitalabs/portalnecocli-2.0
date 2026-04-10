import { Card } from "@/components/ui/card";

type MetricCardProps = {
  label: string;
  value: string;
};

export function MetricCard({ label, value }: MetricCardProps) {
  return (
    <Card className="rounded-2xl border-ink/10 p-5">
      <p className="text-sm text-ink/65">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
    </Card>
  );
}
