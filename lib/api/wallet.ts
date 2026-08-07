import { delay, generateRef } from "@/lib/utils";
import { mockWallet, mockTransactions } from "@/lib/mock-data/account";
import { Transaction, Wallet } from "@/lib/types";

let walletState: Wallet = { ...mockWallet };
const ledger: Transaction[] = [...mockTransactions];

export const walletApi = {
  async getWallet(): Promise<Wallet> {
    await delay(600);
    return { ...walletState };
  },

  async fundWallet(payload: { amount: number; method: "bank_transfer" | "card" | "virtual_account" }): Promise<{
    transaction: Transaction;
    wallet: Wallet;
  }> {
    await delay(1400);
    if (payload.amount < 100) {
      throw new Error("Minimum funding amount is ₦100.");
    }
    walletState = { ...walletState, balance: walletState.balance + payload.amount };
    const transaction: Transaction = {
      id: `txn_${Date.now()}`,
      reference: generateRef(),
      category: "wallet-funding",
      title: "Wallet Funding",
      subtitle:
        payload.method === "card"
          ? "Via Debit Card"
          : payload.method === "virtual_account"
          ? "Via Virtual Account"
          : "Via Bank Transfer",
      amount: payload.amount,
      fee: 0,
      status: "success",
      date: new Date().toISOString(),
      balanceAfter: walletState.balance,
    };
    ledger.unshift(transaction);
    return { transaction, wallet: { ...walletState } };
  },

  async withdraw(payload: { amount: number; bankName: string; accountNumber: string }): Promise<{
    transaction: Transaction;
    wallet: Wallet;
  }> {
    await delay(1400);
    if (payload.amount > walletState.balance) {
      throw new Error("Insufficient wallet balance.");
    }
    const fee = 25;
    walletState = { ...walletState, balance: walletState.balance - payload.amount - fee };
    const transaction: Transaction = {
      id: `txn_${Date.now()}`,
      reference: generateRef(),
      category: "withdrawal",
      title: `Withdrawal to ${payload.bankName}`,
      subtitle: `**** ${payload.accountNumber.slice(-4)}`,
      amount: payload.amount,
      fee,
      status: "success",
      date: new Date().toISOString(),
      balanceAfter: walletState.balance,
    };
    ledger.unshift(transaction);
    return { transaction, wallet: { ...walletState } };
  },

  async debit(amount: number): Promise<Wallet> {
    if (amount > walletState.balance) {
      throw new Error("Insufficient wallet balance.");
    }
    walletState = { ...walletState, balance: walletState.balance - amount };
    return { ...walletState };
  },
};

export function getLedger() {
  return ledger;
}

export function pushLedgerEntry(txn: Transaction) {
  ledger.unshift(txn);
}
