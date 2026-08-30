import { MainFooter } from "@/components/layout/main-footer";
import { MainHeader } from "@/components/layout/main-header";
import { Container } from "@/components/ui/container";

type AppShellProps = {
  announcement: string;
  brandName: string;
  children: React.ReactNode;
};

export function AppShell({
  announcement,
  brandName,
  children,
}: AppShellProps) {
  return (
    <div className="min-h-screen">
      <MainHeader announcement={announcement} brandName={brandName} />
      <main className="pb-10">{children}</main>
      <MainFooter brandName={brandName} />
    </div>
  );
}
