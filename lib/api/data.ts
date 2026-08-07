import { delay, generateRef } from "@/lib/utils";
import { networkProviders, dataPlans } from "@/lib/mock-data/providers";
import { Transaction } from "@/lib/types";
import { walletApi, pushLedgerEntry } from "@/lib/api/wallet";

export interface DataPurchasePayload {
  providerId: string;
  planId: string;
  phone: string;
}

export const dataApi = {
  async getProviders() {
    await delay(300);
    return networkProviders;
  },

  async getPlans(providerId: string) {
    await delay(450);
    return dataPlans.filter((p) => p.providerId === providerId);
  },

  async purchase(payload: DataPurchasePayload): Promise<{ transaction: Transaction }> {
    await delay(1600);
    const provider = networkProviders.find((p) => p.id === payload.providerId);
    const plan = dataPlans.find((p) => p.id === payload.planId);
    if (!provider) throw new Error("Select a network provider.");
    if (!plan) throw new Error("Select a data plan.");
    if (!/^0\d{10}$/.test(payload.phone)) throw new Error("Enter a valid 11-digit phone number.");

    const wallet = await walletApi.debit(plan.price);

    const transaction: Transaction = {
      id: `txn_${Date.now()}`,
      reference: generateRef(),
      category: "data",
      title: `${provider.name} ${plan.label}`,
      subtitle: payload.phone,
      amount: plan.price,
      fee: 0,
      status: "success",
      date: new Date().toISOString(),
      provider: provider.name,
      recipient: payload.phone,
      balanceAfter: wallet.balance,
    };
    pushLedgerEntry(transaction);
    return { transaction };
  },
};
