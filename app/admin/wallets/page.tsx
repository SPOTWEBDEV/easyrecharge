"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminPageHeading } from "@/components/admin/admin-page-heading";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { AdminDataTable, Column } from "@/components/admin/admin-data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { adminCustomers, AdminCustomer, pendingWithdrawals } from "@/lib/mock-data/admin";
import { formatDate, formatNaira } from "@/lib/utils";
import { Wallet, TrendingUp, Clock, CheckCircle2, XCircle } from "lucide-react";

const columns: Column<AdminCustomer>[] = [
  { key: "name", header: "Customer", render: (c) => c.name },
  { key: "email", header: "Email", render: (c) => <span className="text-ink-500 dark:text-paper-200/40">{c.email}</span> },
  { key: "walletBalance", header: "Balance", render: (c) => <span className="font-semibold">{formatNaira(c.walletBalance)}</span> },
  { key: "tier", header: "Tier", render: (c) => c.tier },
];

export default function AdminWalletsPage() {
  const [withdrawals, setWithdrawals] = useState(pendingWithdrawals);

  const totalBalance = adminCustomers.reduce((s, c) => s + c.walletBalance, 0);

  const handleDecision = (id: string, approve: boolean) => {
    setWithdrawals((prev) => prev.filter((w) => w.id !== id));
    toast.success(approve ? "Withdrawal approved" : "Withdrawal rejected");
  };

  return (
    <AdminShell>
      <AdminPageHeading title="Wallets" subtitle="Manage customer wallets and withdrawal requests" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AdminStatCard label="Total wallet balance" value={formatNaira(totalBalance, { compact: true })} icon={Wallet} />
        <AdminStatCard label="Funded this week" value={formatNaira(5_580_000, { compact: true })} change={9.2} icon={TrendingUp} />
        <AdminStatCard label="Pending withdrawals" value={withdrawals.length.toString()} icon={Clock} />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Pending withdrawal approvals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-4">
          {withdrawals.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-500 dark:text-paper-200/40">
              No pending withdrawals — you're all caught up.
            </p>
          ) : (
            withdrawals.map((w) => (
              <div
                key={w.id}
                className="flex flex-col gap-3 rounded-2xl border border-ink-100 dark:border-ink-700 p-3.5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold">{w.customer}</p>
                  <p className="text-xs text-ink-500 dark:text-paper-200/40">
                    {w.bank} &middot; {w.accountNumber} &middot; Requested {formatDate(w.requestedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-display text-sm font-bold">{formatNaira(w.amount)}</span>
                  <Button size="sm" variant="outline" onClick={() => handleDecision(w.id, false)}>
                    <XCircle className="h-3.5 w-3.5" /> Reject
                  </Button>
                  <Button size="sm" onClick={() => handleDecision(w.id, true)}>
                    <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <div className="mt-6">
        <h2 className="mb-3 text-sm font-semibold text-ink-600 dark:text-paper-200/60">Customer wallets</h2>
        <AdminDataTable columns={columns} data={adminCustomers} searchKeys={["name", "email"]} searchPlaceholder="Search customers..." />
      </div>
    </AdminShell>
  );
}
