import { delay, generateRef } from "@/lib/utils";
import { electricityProviders } from "@/lib/mock-data/providers";
import { Transaction } from "@/lib/types";
import { walletApi, pushLedgerEntry } from "@/lib/api/wallet";

export interface MeterLookupPayload {
  providerId: string;
  meterNumber: string;
  meterType: "prepaid" | "postpaid";
}

export interface ElectricityPurchasePayload extends MeterLookupPayload {
  amount: number;
  customerName: string;
}

export const electricityApi = {
  async getProviders() {
    await delay(300);
    return electricityProviders;
  },

  async lookupMeter(payload: MeterLookupPayload): Promise<{ customerName: string; address: string }> {
    await delay(1100);
    if (!/^\d{10,13}$/.test(payload.meterNumber)) {
      throw new Error("Enter a valid meter number.");
    }
    return {
      customerName: "Ngozi Adeyemi",
      address: "14 Adeola Odeku Street, Victoria Island, Lagos",
    };
  },

  async purchase(payload: ElectricityPurchasePayload): Promise<{ transaction: Transaction; token?: string }> {
    await delay(1700);
    const provider = electricityProviders.find((p) => p.id === payload.providerId);
    if (!provider) throw new Error("Select a distribution company.");
    if (payload.amount < 500) throw new Error("Minimum electricity payment is ₦500.");

    const fee = Math.round(payload.amount * 0.01);
    const wallet = await walletApi.debit(payload.amount + fee);

    const transaction: Transaction = {
      id: `txn_${Date.now()}`,
      reference: generateRef(),
      category: "electricity",
      title: provider.name,
      subtitle: `Meter ${payload.meterNumber}`,
      amount: payload.amount,
      fee,
      status: "success",
      date: new Date().toISOString(),
      provider: provider.name,
      recipient: payload.meterNumber,
      balanceAfter: wallet.balance,
    };
    pushLedgerEntry(transaction);

    const token =
      payload.meterType === "prepaid"
        ? Array.from({ length: 4 }, () => Math.floor(1000 + Math.random() * 9000)).join("-")
        : undefined;

    return { transaction, token };
  },
};
