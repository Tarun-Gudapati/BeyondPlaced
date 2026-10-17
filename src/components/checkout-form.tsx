"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Check, CreditCard, Loader2, ShieldCheck, Smartphone, Tag } from "lucide-react";
import { Logo } from "@/components/site-header";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { coupons, formatINR, plans, type PlanId } from "@/lib/course";
import { actions, useAppState } from "@/lib/store";
import { cn } from "@/lib/utils";

const GST = 0.18;

export function CheckoutForm({ initialPlan }: { initialPlan: PlanId }) {
  const router = useRouter();
  const { state } = useAppState();
  const [planId, setPlanId] = useState<PlanId>(initialPlan);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState("upi");
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const plan = plans.find((p) => p.id === planId)!;
  const discount = applied ? plan.price * coupons[applied].off : 0;
  const subtotal = plan.price - discount;
  const base = subtotal / (1 + GST);
  const tax = subtotal - base;

  function applyCoupon() {
    const c = code.trim().toUpperCase();
    if (coupons[c]) {
      setApplied(c);
      toast.success(coupons[c].label);
    } else {
      setApplied(null);
      toast.error("That code isn't valid. Try CAMPUS20.");
    }
  }

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    const finalName = name || state.name;
    const finalEmail = email || state.email;
    if (!finalName.trim()) errs.name = "Enter your full name for the certificate";
    if (!/^\S+@\S+\.\S+$/.test(finalEmail)) errs.email = "Enter a valid email";
    if (!/^[6-9]\d{9}$/.test(phone.replace(/\D/g, "").slice(-10))) errs.phone = "Enter a 10-digit Indian mobile number";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setPaying(true);
    await new Promise((r) => setTimeout(r, 1400));
    actions.purchase(planId, finalName.trim(), finalEmail.trim());
    toast.success(`Welcome to ${plan.name}!`, { description: "All modules are now unlocked." });
    router.push("/dashboard?welcome=1");
  }

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Logo />
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <ShieldCheck className="size-4 text-emerald-400" /> Secure checkout
          </span>
        </div>
      </header>
      <main className="mx-auto grid max-w-5xl gap-8 px-4 py-10 lg:grid-cols-[1fr_380px]">
        <form onSubmit={pay} className="space-y-6" noValidate>
          <Link href="/#pricing" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Back to pricing
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Complete your enrollment</h1>

          <div className="grid gap-3 sm:grid-cols-2">
            {plans
              .filter((p) => p.id !== "free")
              .map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setPlanId(p.id)}
                  className={cn(
                    "rounded-xl border p-4 text-left transition-colors",
                    planId === p.id ? "border-primary bg-primary/10" : "hover:bg-muted/50",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{p.name}</span>
                    {planId === p.id && <Check className="size-4 text-primary" />}
                  </div>
                  <div className="mt-1 text-2xl font-bold">{formatINR(p.price)}</div>
                  <div className="text-xs text-muted-foreground">{p.tagline}</div>
                </button>
              ))}
          </div>

          <Card>
            <CardContent className="space-y-4">
              <h2 className="font-semibold">Your details</h2>
              <div className="space-y-2">
                <Label htmlFor="name">Full name (as on certificate)</Label>
                <Input id="name" value={name} placeholder={state.name || "Priya Sharma"} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} />
                {errors.name && <p className="text-sm text-red-400">{errors.name}</p>}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} placeholder={state.email || "you@college.edu"} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!errors.email} />
                  {errors.email && <p className="text-sm text-red-400">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile</Label>
                  <Input id="phone" inputMode="tel" value={phone} placeholder="98765 43210" onChange={(e) => setPhone(e.target.value)} aria-invalid={!!errors.phone} />
                  {errors.phone && <p className="text-sm text-red-400">{errors.phone}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4">
              <h2 className="font-semibold">Payment method</h2>
              <RadioGroup value={method} onValueChange={(v) => setMethod(String(v))} className="grid gap-3 sm:grid-cols-2">
                {[
                  { id: "upi", label: "UPI", sub: "GPay, PhonePe, Paytm", icon: Smartphone },
                  { id: "card", label: "Card / EMI", sub: "No-cost EMI from ₹500/mo", icon: CreditCard },
                ].map((m) => (
                  <label
                    key={m.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg border p-3",
                      method === m.id && "border-primary/60 bg-primary/5",
                    )}
                  >
                    <RadioGroupItem value={m.id} />
                    <m.icon className="size-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">{m.label}</div>
                      <div className="text-xs text-muted-foreground">{m.sub}</div>
                    </div>
                  </label>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="h-12 w-full text-base" disabled={paying}>
            {paying ? (
              <>
                <Loader2 className="animate-spin" /> Processing payment…
              </>
            ) : (
              <>Pay {formatINR(subtotal)}</>
            )}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Demo mode — no real charge. Connect Razorpay keys to accept live payments.
          </p>
        </form>

        <aside className="lg:sticky lg:top-10 lg:self-start">
          <Card>
            <CardContent className="space-y-4">
              <h2 className="font-semibold">Order summary</h2>
              <div className="flex justify-between text-sm">
                <span>ShipAI {plan.name}</span>
                <span className="text-muted-foreground line-through">{formatINR(plan.mrp ?? plan.price)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Launch price</span>
                <span>{formatINR(plan.price)}</span>
              </div>
              {applied && (
                <div className="flex justify-between text-sm text-emerald-400">
                  <span>Coupon {applied}</span>
                  <span>−{formatINR(discount)}</span>
                </div>
              )}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon code" className="pl-8 uppercase" />
                </div>
                <Button type="button" variant="outline" onClick={applyCoupon} disabled={!code.trim()}>
                  Apply
                </Button>
              </div>
              <Separator />
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Base price</span>
                  <span>{formatINR(base)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%, included)</span>
                  <span>{formatINR(tax)}</span>
                </div>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <Separator />
              <ul className="space-y-2 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" /> {f}
                  </li>
                ))}
              </ul>
              <div className="rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
                7-day no-questions refund. Email hello@shipai.in.
              </div>
            </CardContent>
          </Card>
          <Link href="/learn/how-llms-work" className={cn(buttonVariants({ variant: "link" }), "mt-2 w-full")}>
            Not sure yet? Try Module 1 free
          </Link>
        </aside>
      </main>
    </div>
  );
}
