"use client";

import { AdminShell } from "@/components/admin/admin-shell";
import { AdminPageHeading } from "@/components/admin/admin-page-heading";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { AdminDataTable, Column } from "@/components/admin/admin-data-table";
import { StatusPill } from "@/components/admin/status-pill";
import { adminProviders, AdminProvider } from "@/lib/mock-data/admin";
import { formatDate } from "@/lib/utils";
import { Radio, Wifi, WifiOff, AlertTriangle } from "lucide-react";

const columns: Column<AdminProvider>[] = [
  { key: "name", header: "Provider", render: (p) => <span className="font-semibold">{p.name}</span> },
  { key: "type", header: "Type", render: (p) => p.type },
  { key: "commissionRate", header: "Commission rate", render: (p) => p.commissionRate },
  { key: "apiStatus", header: "API status", render: (p) => <StatusPill status={p.apiStatus} /> },
  { key: "lastSync", header: "Last sync", render: (p) => formatDate(p.lastSync) },
];

export default function AdminProvidersPage() {
  const connected = adminProviders.filter((p) => p.apiStatus === "connected").length;
  const degraded = adminProviders.filter((p) => p.apiStatus === "degraded").length;
  const offline = adminProviders.filter((p) => p.apiStatus === "offline").length;

  return (
    <AdminShell>
      <AdminPageHeading title="Bill Providers" subtitle="Third-party APIs powering every service" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard label="Total providers" value={adminProviders.length.toString()} icon={Radio} />
        <AdminStatCard label="Connected" value={connected.toString()} icon={Wifi} />
        <AdminStatCard label="Degraded" value={degraded.toString()} icon={AlertTriangle} />
        <AdminStatCard label="Offline" value={offline.toString()} icon={WifiOff} />
      </div>

      <div className="mt-6">
        <AdminDataTable columns={columns} data={adminProviders} searchKeys={["name", "type"]} searchPlaceholder="Search providers..." />
      </div>
    </AdminShell>
  );
}
