import { BottomNav } from "@/components/layout/bottom-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper-100 dark:bg-ink-950">
      <div className="mx-auto min-h-screen w-full max-w-md bg-paper-50 dark:bg-ink-950 pb-28 lg:border-x lg:border-ink-200/60 dark:lg:border-ink-700/60 lg:shadow-soft-dark">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
