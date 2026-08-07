import { delay } from "@/lib/utils";
import { getLedger } from "@/lib/api/wallet";
import { Transaction, TransactionStatus, TransactionCategory } from "@/lib/types";

export interface TransactionFilter {
  status?: TransactionStatus | "all";
  category?: TransactionCategory | "all";
  query?: string;
}

export const transactionsApi = {
  async list(filter: TransactionFilter = {}): Promise<Transaction[]> {
    await delay(500);
    let items = [...getLedger()];
    if (filter.status && filter.status !== "all") {
      items = items.filter((t) => t.status === filter.status);
    }
    if (filter.category && filter.category !== "all") {
      items = items.filter((t) => t.category === filter.category);
    }
    if (filter.query) {
      const q = filter.query.toLowerCase();
      items = items.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.reference.toLowerCase().includes(q) ||
          t.subtitle.toLowerCase().includes(q)
      );
    }
    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async getById(id: string): Promise<Transaction | undefined> {
    await delay(400);
    return getLedger().find((t) => t.id === id || t.reference === id);
  },

  async summary(): Promise<{ totalSpent: number; totalCount: number; successRate: number }> {
    await delay(350);
    const items = getLedger();
    const successful = items.filter((t) => t.status === "success");
    const totalSpent = successful.reduce((sum, t) => sum + t.amount + t.fee, 0);
    return {
      totalSpent,
      totalCount: items.length,
      successRate: items.length ? Math.round((successful.length / items.length) * 100) : 0,
    };
  },
};
