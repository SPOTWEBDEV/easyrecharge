"use client";

import { useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminPageHeading } from "@/components/admin/admin-page-heading";
import { AdminDataTable, Column } from "@/components/admin/admin-data-table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusPill } from "@/components/admin/status-pill";
import { Button } from "@/components/ui/button";
import { adminOrders, AdminOrder } from "@/lib/mock-data/admin";
import { formatDate, formatNaira } from "@/lib/utils";
import { Download } from "lucide-react";
import { toast } from "sonner";

const columns: Column<AdminOrder>[] = [
  { key: "reference", header: "Reference", render: (o) => <span className="font-mono text-xs">{o.reference}</span> },
  { key: "customer", header: "Customer", render: (o) => o.customer },
  { key: "service", header: "Service", render: (o) => o.service },
  { key: "amount", header: "Amount", render: (o) => formatNaira(o.amount) },
  { key: "status", header: "Status", render: (o) => <StatusPill status={o.status} /> },
  { key: "date", header: "Date", render: (o) => formatDate(o.date) },
];

export default function AdminTransactionsPage() {
  const [status, setStatus] = useState<"all" | "success" | "pending" | "failed">("all");

  const filtered = adminOrders.filter((o) => status === "all" || o.status === status);

  return (
    <AdminShell>
      <AdminPageHeading
        title="Transactions"
        subtitle="Every transaction processed on the platform"
        action={
          <Button variant="outline" onClick={() => toast.success("Export started — you'll get a download shortly")}>
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        }
      />

      <Tabs value={status} onValueChange={(v) => setStatus(v as typeof status)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="success">Success</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-4">
        <AdminDataTable
          columns={columns}
          data={filtered}
          searchKeys={["customer", "reference", "service"]}
          searchPlaceholder="Search by customer, reference, or service..."
        />
      </div>
    </AdminShell>
  );
}
