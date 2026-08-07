"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminPageHeading } from "@/components/admin/admin-page-heading";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { AdminDataTable, Column } from "@/components/admin/admin-data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminOverviewStats, revenueTrend, adminProducts } from "@/lib/mock-data/admin";
import { formatNaira } from "@/lib/utils";
import { DollarSign, TrendingUp, Percent, Calendar } from "lucide-react";

interface RevenueRow {
  id: string;
  category: string;
  revenue: number;
  margin: number;
  share: number;
}

const revenueByCategory: RevenueRow[] = [
  { id: "r1", category: "Airtime", revenue: 18_360_000, margin: 2.1, share: 38 },
  { id: "r2", category: "Data", revenue: 14_010_000, margin: 8.2, share: 29 },
  { id: "r3", category: "Electricity", revenue: 8_690_000, margin: 1.0, share: 18 },
  { id: "r4", category: "Cable TV", revenue: 4_350_000, margin: 0.3, share: 9 },
  { id: "r5", category: "Exam Pins", revenue: 2_910_000, margin: 5.8, share: 6 },
];

const columns: Column<RevenueRow>[] = [
  { key: "category", header: "Category", render: (r) => <span className="font-semibold">{r.category}</span> },
  { key: "revenue", header: "Revenue", render: (r) => formatNaira(r.revenue) },
  { key: "margin", header: "Avg. margin", render: (r) => `${r.margin}%` },
  { key: "share", header: "% of total", render: (r) => `${r.share}%` },
];

export default function AdminRevenuePage() {
  return (
    <AdminShell>
      <AdminPageHeading title="Revenue" subtitle="Where EasyBills revenue is coming from" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard label="Total revenue" value={formatNaira(adminOverviewStats.revenue, { compact: true })} change={adminOverviewStats.revenueChange} icon={DollarSign} />
        <AdminStatCard label="Gross margin" value="3.4%" change={0.4} icon={Percent} />
        <AdminStatCard label="MoM growth" value="+8.9%" change={8.9} icon={TrendingUp} />
        <AdminStatCard label="Revenue this month" value={formatNaira(8_620_500, { compact: true })} change={5.4} icon={Calendar} />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Revenue over time</CardTitle>
        </CardHeader>
        <CardContent className="h-72 pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueTrend}>
              <defs>
                <linearGradient id="revFill2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0EA894" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#0EA894" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.15)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => formatNaira(v, { compact: true })} width={64} />
              <Tooltip formatter={(v: number) => formatNaira(v)} />
              <Area type="monotone" dataKey="revenue" stroke="#0EA894" strokeWidth={2.5} fill="url(#revFill2)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="mt-6">
        <h2 className="mb-3 text-sm font-semibold text-ink-600 dark:text-paper-200/60">Revenue by category</h2>
        <AdminDataTable columns={columns} data={revenueByCategory} />
      </div>
    </AdminShell>
  );
}
