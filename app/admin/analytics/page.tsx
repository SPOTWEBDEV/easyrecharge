"use client";

import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminPageHeading } from "@/components/admin/admin-page-heading";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { revenueTrend, topServices, adminOverviewStats } from "@/lib/mock-data/admin";
import { formatNaira } from "@/lib/utils";
import { Activity, Percent, Repeat, Timer } from "lucide-react";

export default function AdminAnalyticsPage() {
  return (
    <AdminShell>
      <AdminPageHeading title="Analytics" subtitle="Deeper performance metrics across the platform" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard label="Conversion rate" value="4.8%" change={0.6} icon={Percent} />
        <AdminStatCard label="Repeat purchase rate" value="62%" change={3.1} icon={Repeat} />
        <AdminStatCard label="Avg. transaction time" value="3.8s" change={-4.2} icon={Timer} />
        <AdminStatCard label="Platform uptime" value="99.94%" change={0.02} icon={Activity} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs. sales volume</CardTitle>
          </CardHeader>
          <CardContent className="h-72 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => formatNaira(v, { compact: true })} width={64} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={50} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke="#0EA894" strokeWidth={2.5} dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="sales" name="Sales count" stroke="#22A559" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service mix (% of volume)</CardTitle>
          </CardHeader>
          <CardContent className="h-72 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topServices} layout="vertical" margin={{ left: 16 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(148,163,184,0.15)" />
                <XAxis type="number" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} unit="%" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip formatter={(v: number) => `${v}%`} />
                <Bar dataKey="value" fill="#0EA894" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Cohort summary</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-xs text-ink-500 dark:text-paper-200/40">New users (30d)</p>
              <p className="mt-1 font-display text-xl font-bold">3,214</p>
            </div>
            <div>
              <p className="text-xs text-ink-500 dark:text-paper-200/40">Churned users (30d)</p>
              <p className="mt-1 font-display text-xl font-bold">412</p>
            </div>
            <div>
              <p className="text-xs text-ink-500 dark:text-paper-200/40">Avg. order value</p>
              <p className="mt-1 font-display text-xl font-bold">{formatNaira(1840)}</p>
            </div>
            <div>
              <p className="text-xs text-ink-500 dark:text-paper-200/40">Total revenue (YTD)</p>
              <p className="mt-1 font-display text-xl font-bold">{formatNaira(adminOverviewStats.revenue * 7, { compact: true })}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminShell>
  );
}
