"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";
import { DollarSign, ShoppingCart, Receipt, Users } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminPageHeading } from "@/components/admin/admin-page-heading";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusPill } from "@/components/admin/status-pill";
import {
  adminOverviewStats, revenueTrend, topServices, walletFundingTrend, adminOrders,
} from "@/lib/mock-data/admin";
import { formatDate, formatNaira } from "@/lib/utils";

const PIE_COLORS = ["#0EA894", "#3BC7B0", "#6FDFCF", "#22A559", "#91E6D6"];

export default function AdminDashboardPage() {
  return (
    <AdminShell>
      <AdminPageHeading title="Dashboard" subtitle="Overview of EasyBills performance" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          label="Total revenue"
          value={formatNaira(adminOverviewStats.revenue, { compact: true })}
          change={adminOverviewStats.revenueChange}
          icon={DollarSign}
        />
        <AdminStatCard
          label="Total sales"
          value={adminOverviewStats.sales.toLocaleString()}
          change={adminOverviewStats.salesChange}
          icon={ShoppingCart}
        />
        <AdminStatCard
          label="Transactions"
          value={adminOverviewStats.transactions.toLocaleString()}
          change={adminOverviewStats.transactionsChange}
          icon={Receipt}
        />
        <AdminStatCard
          label="Active users"
          value={adminOverviewStats.activeUsers.toLocaleString()}
          change={adminOverviewStats.activeUsersChange}
          icon={Users}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue trend</CardTitle>
          </CardHeader>
          <CardContent className="h-72 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0EA894" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#0EA894" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => formatNaira(v, { compact: true })}
                  width={64}
                />
                <Tooltip formatter={(v: number) => formatNaira(v)} />
                <Area type="monotone" dataKey="revenue" stroke="#0EA894" strokeWidth={2.5} fill="url(#revFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top services</CardTitle>
          </CardHeader>
          <CardContent className="h-72 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={topServices} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {topServices.map((entry, i) => (
                    <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="-mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
              {topServices.map((s, i) => (
                <div key={s.name} className="flex items-center gap-1.5 text-xs text-ink-600 dark:text-paper-200/60">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                  {s.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Wallet funding (7 days)</CardTitle>
          </CardHeader>
          <CardContent className="h-64 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={walletFundingTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip formatter={(v: number) => formatNaira(v, { compact: true })} />
                <Bar dataKey="amount" fill="#0EA894" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent orders</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-1">
              {adminOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-xl px-2 py-2.5 hover:bg-ink-50 dark:hover:bg-ink-800/40">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{order.customer}</p>
                    <p className="truncate text-xs text-ink-500 dark:text-paper-200/40">
                      {order.service} &middot; {formatDate(order.date)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-sm font-semibold">{formatNaira(order.amount)}</span>
                    <StatusPill status={order.status} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
