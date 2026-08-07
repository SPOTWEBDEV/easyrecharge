"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Landmark, CreditCard, Wallet2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { fundWalletSchema, FundWalletInput } from "@/lib/validators/schemas";
import { useFundWallet } from "@/hooks/use-wallet";
import { formatNaira } from "@/lib/utils";
import { cn } from "@/lib/utils";

const methods = [
  { id: "bank_transfer", label: "Bank Transfer", icon: Landmark },
  { id: "card", label: "Debit Card", icon: CreditCard },
  { id: "virtual_account", label: "Virtual Account", icon: Wallet2 },
] as const;

const presetAmounts = [1000, 2000, 5000, 10000];

export default function FundWalletPage() {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [success, setSuccess] = useState(false);
  const fundWallet = useFundWallet();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<FundWalletInput>({
    resolver: zodResolver(fundWalletSchema),
    defaultValues: { method: "bank_transfer", amount: 0 },
  });

  const values = watch();

  const onConfirm = async () => {
    try {
      await fundWallet.mutateAsync(values);
      setConfirming(false);
      setSuccess(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Funding failed.");
    }
  };

  if (success) {
    return (
      <AppShell>
        <div className="flex min-h-[80vh] flex-col items-center justify-center px-8 text-center">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14 }}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-500/10"
          >
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </motion.div>
          <h1 className="mt-6 font-display text-2xl font-bold">Wallet funded!</h1>
          <p className="mt-2 text-sm text-ink-600 dark:text-paper-200/60">
            {formatNaira(values.amount)} has been added to your wallet.
          </p>
          <div className="mt-8 flex w-full max-w-xs flex-col gap-3">
            <Button size="lg" onClick={() => router.push("/wallet")}>
              Back to wallet
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push("/dashboard")}>
              Go to dashboard
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader title="Fund Wallet" subtitle="Top up your EasyBills balance" />

      <form
        onSubmit={handleSubmit(() => setConfirming(true))}
        className="space-y-6 px-5 pt-2"
      >
        <div className="space-y-2">
          <Label>Amount</Label>
          <Input
            type="number"
            placeholder="0.00"
            leftIcon={<span className="text-sm font-semibold">₦</span>}
            {...register("amount")}
          />
          {errors.amount && <p className="text-xs text-coral-500">{errors.amount.message}</p>}
          <div className="flex flex-wrap gap-2 pt-1">
            {presetAmounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setValue("amount", amt, { shouldValidate: true })}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                  values.amount === amt
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-ink-200 dark:border-ink-700"
                )}
              >
                {formatNaira(amt, { compact: true })}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Funding method</Label>
          <Controller
            control={control}
            name="method"
            render={({ field }) => (
              <div className="space-y-2.5">
                {methods.map((m) => (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => field.onChange(m.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors",
                      field.value === m.id
                        ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
                        : "border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-850"
                    )}
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-100 dark:bg-ink-800">
                      <m.icon className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-semibold">{m.label}</span>
                  </button>
                ))}
              </div>
            )}
          />
        </div>

        <Button type="submit" size="lg" className="w-full">
          Continue
        </Button>
      </form>

      <Dialog open={confirming} onOpenChange={setConfirming}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm funding</DialogTitle>
            <DialogDescription>Review the details before you continue.</DialogDescription>
          </DialogHeader>
          <Card className="space-y-3 border-0 bg-ink-50 dark:bg-ink-900 p-4 shadow-none">
            <div className="flex justify-between text-sm">
              <span className="text-ink-600 dark:text-paper-200/60">Amount</span>
              <span className="font-semibold">{formatNaira(values.amount || 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-600 dark:text-paper-200/60">Method</span>
              <span className="font-semibold">{methods.find((m) => m.id === values.method)?.label}</span>
            </div>
          </Card>
          <div className="mt-5 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setConfirming(false)}>
              Cancel
            </Button>
            <Button className="flex-1" loading={fundWallet.isPending} onClick={onConfirm}>
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
