import { ExitIntentModal } from "@/components/marketplace/exit-intent-modal";

type PublicLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="pb-8">
      {children}
      <ExitIntentModal />
    </div>
  );
}
