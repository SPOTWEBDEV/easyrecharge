"use client";

import { AdminShell } from "@/components/admin/admin-shell";
import { AdminPageHeading } from "@/components/admin/admin-page-heading";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { AdminDataTable, Column } from "@/components/admin/admin-data-table";
import { StatusPill } from "@/components/admin/status-pill";
import { adminOrders, AdminOrder } from "@/lib/mock-data/admin";
import { formatDate, formatNaira } from "@/lib/utils";
import { Ticket, CheckCircle2, Clock, XCircle } from "lucide-react";

const columns: Column<AdminOrder>[] = [
  { key: "reference", header: "Order ID", render: (o) => <span className="font-mono text-xs">{o.reference}</span> },
  { key: "customer", header: "Customer", render: (o) => o.customer },
  { key: "service", header: "Item", render: (o) => o.service },
  { key: "amount", header: "Total", render: (o) => formatNaira(o.amount) },
  { key: "status", header: "Status", render: (o) => <StatusPill status={o.status} /> },
  { key: "date", header: "Placed", render: (o) => formatDate(o.date) },
];

export default function AdminOrdersPage() {
  const success = adminOrders.filter((o) => o.status === "success").length;
  const pending = adminOrders.filter((o) => o.status === "pending").length;
  const failed = adminOrders.filter((o) => o.status === "failed").length;

  return (
    <AdminShell>
      <AdminPageHeading title="Orders" subtitle="Every order placed through EasyBills" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard label="Total orders" value={adminOrders.length.toString()} icon={Ticket} />
        <AdminStatCard label="Completed" value={success.toString()} icon={CheckCircle2} />
        <AdminStatCard label="Pending" value={pending.toString()} icon={Clock} />
        <AdminStatCard label="Failed" value={failed.toString()} icon={XCircle} />
      </div>

      <div className="mt-6">
        <AdminDataTable columns={columns} data={adminOrders} searchKeys={["customer", "reference", "service"]} searchPlaceholder="Search orders..." />
      </div>
    </AdminShell>
  );
}
