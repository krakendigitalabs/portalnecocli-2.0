import { ExitIntentModal } from "@/components/marketplace/exit-intent-modal";
import { AiConciergeWidget } from "@/components/marketplace/ai-concierge-widget";

type PublicLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="pb-8">
      {children}
      <ExitIntentModal />
      <AiConciergeWidget />
    </div>
  );
}
