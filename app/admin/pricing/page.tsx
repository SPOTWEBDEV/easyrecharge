"use client";

import { AdminShell } from "@/components/admin/admin-shell";
import { AdminPageHeading } from "@/components/admin/admin-page-heading";
import { AdminDataTable, Column } from "@/components/admin/admin-data-table";
import { adminPricingRules, AdminPricingRule } from "@/lib/mock-data/admin";
import { formatDate, formatNaira } from "@/lib/utils";

const columns: Column<AdminPricingRule>[] = [
  { key: "service", header: "Service", render: (p) => <span className="font-semibold">{p.service}</span> },
  { key: "costPrice", header: "Cost price", render: (p) => formatNaira(p.costPrice) },
  { key: "marginPercent", header: "Margin", render: (p) => `${p.marginPercent}%` },
  { key: "sellPrice", header: "Sell price", render: (p) => <span className="font-semibold text-brand-600 dark:text-brand-400">{formatNaira(p.sellPrice)}</span> },
  { key: "updatedAt", header: "Last updated", render: (p) => formatDate(p.updatedAt) },
];

export default function AdminPricingPage() {
  return (
    <AdminShell>
      <AdminPageHeading
        title="Pricing"
        subtitle="Cost vs. sell price for every product — edit margins in Profit Settings"
      />
      <AdminDataTable columns={columns} data={adminPricingRules} searchKeys={["service"]} searchPlaceholder="Search pricing rules..." />
    </AdminShell>
  );
}
