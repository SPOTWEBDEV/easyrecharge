import { delay, generateRef } from "@/lib/utils";
import { networkProviders } from "@/lib/mock-data/providers";
import { Transaction } from "@/lib/types";
import { walletApi, pushLedgerEntry } from "@/lib/api/wallet";

export interface AirtimePurchasePayload {
  providerId: string;
  phone: string;
  amount: number;
}

export const airtimeApi = {
  async getProviders() {
    await delay(300);
    return networkProviders;
  },

  async purchase(payload: AirtimePurchasePayload): Promise<{ transaction: Transaction }> {
    await delay(1600);
    const provider = networkProviders.find((p) => p.id === payload.providerId);
    if (!provider) throw new Error("Select a network provider.");
    if (!/^0\d{10}$/.test(payload.phone)) throw new Error("Enter a valid 11-digit phone number.");
    if (payload.amount < 50) throw new Error("Minimum airtime purchase is ₦50.");

    const wallet = await walletApi.debit(payload.amount);

    const transaction: Transaction = {
      id: `txn_${Date.now()}`,
      reference: generateRef(),
      category: "airtime",
      title: `${provider.name} Airtime`,
      subtitle: payload.phone,
      amount: payload.amount,
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
