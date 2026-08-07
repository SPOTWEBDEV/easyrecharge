"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminPageHeading } from "@/components/admin/admin-page-heading";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { AdminDataTable, Column } from "@/components/admin/admin-data-table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { adminProducts, AdminProduct } from "@/lib/mock-data/admin";
import { formatNaira } from "@/lib/utils";
import { Package, PackageCheck, PackageX, Plus } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState(adminProducts);

  const toggleStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: p.status === "active" ? "inactive" : "active" } : p))
    );
    toast.success("Product status updated");
  };

  const columns: Column<AdminProduct>[] = [
    { key: "name", header: "Product", render: (p) => <span className="font-semibold">{p.name}</span> },
    { key: "category", header: "Category", render: (p) => p.category },
    { key: "provider", header: "Provider", render: (p) => p.provider },
    { key: "costPrice", header: "Cost price", render: (p) => formatNaira(p.costPrice) },
    { key: "sellPrice", header: "Sell price", render: (p) => <span className="font-semibold">{formatNaira(p.sellPrice)}</span> },
    {
      key: "status",
      header: "Active",
      render: (p) => (
        <Switch checked={p.status === "active"} onCheckedChange={() => toggleStatus(p.id)} />
      ),
    },
  ];

  const active = products.filter((p) => p.status === "active").length;

  return (
    <AdminShell>
      <AdminPageHeading
        title="Products"
        subtitle="Every bill / service product sold on EasyBills"
        action={
          <Button onClick={() => toast("New product form would open here")}>
            <Plus className="h-4 w-4" /> Add product
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AdminStatCard label="Total products" value={products.length.toString()} icon={Package} />
        <AdminStatCard label="Active" value={active.toString()} icon={PackageCheck} />
        <AdminStatCard label="Inactive" value={(products.length - active).toString()} icon={PackageX} />
      </div>

      <div className="mt-6">
        <AdminDataTable columns={columns} data={products} searchKeys={["name", "category", "provider"]} searchPlaceholder="Search products..." />
      </div>
    </AdminShell>
  );
}
