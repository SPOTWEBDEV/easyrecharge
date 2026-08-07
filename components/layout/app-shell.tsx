import { BottomNav } from "@/components/layout/bottom-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen pb-28">
      {children}
      <BottomNav />
    </div>
  );
}
