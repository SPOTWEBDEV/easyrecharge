"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminPageHeading } from "@/components/admin/admin-page-heading";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatNaira } from "@/lib/utils";

interface MarginConfig {
  category: string;
  exampleCost: number;
  mode: "fixed" | "percentage";
  value: number;
}

const initialConfigs: MarginConfig[] = [
  { category: "Airtime", exampleCost: 980, mode: "fixed", value: 30 },
  { category: "Data Bundles", exampleCost: 1380, mode: "percentage", value: 8 },
  { category: "Electricity", exampleCost: 10000, mode: "fixed", value: 100 },
  { category: "Cable TV", exampleCost: 18950, mode: "fixed", value: 50 },
  { category: "Exam Pins", exampleCost: 3400, mode: "percentage", value: 5.8 },
];

export default function AdminProfitSettingsPage() {
  const [configs, setConfigs] = useState(initialConfigs);

  const updateConfig = (category: string, patch: Partial<MarginConfig>) => {
    setConfigs((prev) => prev.map((c) => (c.category === category ? { ...c, ...patch } : c)));
  };

  const computeSellPrice = (c: MarginConfig) =>
    c.mode === "fixed" ? c.exampleCost + c.value : c.exampleCost * (1 + c.value / 100);

  const handleSave = () => {
    toast.success("Profit margins saved — applied to all future purchases");
  };

  return (
    <AdminShell>
      <AdminPageHeading
        title="Profit Settings"
        subtitle="Set the margin EasyBills adds on top of wholesale provider cost, per category"
        action={<Button onClick={handleSave}>Save changes</Button>}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {configs.map((c) => {
          const sellPrice = computeSellPrice(c);
          return (
            <Card key={c.category}>
              <CardHeader>
                <CardTitle>{c.category}</CardTitle>
                <CardDescription>Wholesale cost example: {formatNaira(c.exampleCost)}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                <div className="flex items-center gap-2">
                  {(["fixed", "percentage"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => updateConfig(c.category, { mode })}
                      className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                        c.mode === mode
                          ? "border-brand-600 bg-brand-600 text-white"
                          : "border-ink-200 dark:border-ink-700"
                      }`}
                    >
                      {mode === "fixed" ? "Fixed amount (₦)" : "Percentage (%)"}
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <Label>Margin {c.mode === "fixed" ? "amount" : "percentage"}</Label>
                  <Input
                    type="number"
                    value={c.value}
                    onChange={(e) => updateConfig(c.category, { value: Number(e.target.value) })}
                    leftIcon={<span className="text-sm font-semibold">{c.mode === "fixed" ? "₦" : "%"}</span>}
                  />
                </div>

                <div className="rounded-2xl bg-ink-50 dark:bg-ink-900 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink-600 dark:text-paper-200/60">Wholesale cost</span>
                    <span className="font-mono font-semibold">{formatNaira(c.exampleCost)}</span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-sm">
                    <span className="text-ink-600 dark:text-paper-200/60">Your margin</span>
                    <span className="font-mono font-semibold text-brand-600 dark:text-brand-400">
                      + {formatNaira(sellPrice - c.exampleCost)}
                    </span>
                  </div>
                  <div className="mt-2 border-t border-ink-200 dark:border-ink-700 pt-2 flex items-center justify-between">
                    <span className="text-sm font-semibold">Customer pays</span>
                    <span className="font-mono text-base font-bold">{formatNaira(sellPrice)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AdminShell>
  );
}
