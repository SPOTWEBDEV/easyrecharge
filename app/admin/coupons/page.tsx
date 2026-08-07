"use client";

import { toast } from "sonner";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminPageHeading } from "@/components/admin/admin-page-heading";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { AdminDataTable, Column } from "@/components/admin/admin-data-table";
import { StatusPill } from "@/components/admin/status-pill";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { adminCoupons, AdminCoupon } from "@/lib/mock-data/admin";
import { formatDate } from "@/lib/utils";
import { Ticket, CheckCircle2, Clock, Plus } from "lucide-react";

const columns: Column<AdminCoupon>[] = [
  { key: "code", header: "Code", render: (c) => <span className="font-mono font-semibold">{c.code}</span> },
  { key: "discountType", header: "Discount", render: (c) => (c.discountType === "percentage" ? `${c.value}%` : `₦${c.value}`) },
  {
    key: "used",
    header: "Usage",
    render: (c) => (
      <div className="w-32">
        <div className="mb-1 flex justify-between text-[11px] text-ink-500 dark:text-paper-200/40">
          <span>{c.used}</span>
          <span>{c.usageLimit}</span>
        </div>
        <Progress value={(c.used / c.usageLimit) * 100} />
      </div>
    ),
  },
  { key: "expiresAt", header: "Expires", render: (c) => formatDate(c.expiresAt) },
  { key: "status", header: "Status", render: (c) => <StatusPill status={c.status} /> },
];

export default function AdminCouponsPage() {
  const active = adminCoupons.filter((c) => c.status === "active").length;
  const totalUses = adminCoupons.reduce((s, c) => s + c.used, 0);

  return (
    <AdminShell>
      <AdminPageHeading
        title="Coupons"
        subtitle="Promo codes and discounts"
        action={
          <Button onClick={() => toast("New coupon form would open here")}>
            <Plus className="h-4 w-4" /> Create coupon
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AdminStatCard label="Total coupons" value={adminCoupons.length.toString()} icon={Ticket} />
        <AdminStatCard label="Active" value={active.toString()} icon={CheckCircle2} />
        <AdminStatCard label="Total redemptions" value={totalUses.toLocaleString()} icon={Clock} />
      </div>

      <div className="mt-6">
        <AdminDataTable columns={columns} data={adminCoupons} searchKeys={["code"]} searchPlaceholder="Search coupon codes..." />
      </div>
    </AdminShell>
  );
}
