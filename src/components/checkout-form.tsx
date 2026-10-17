"use client";

import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ArrowLeft, Check, FlaskConical, Loader2, ShieldCheck, Tag } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { completeTestPayment, createOrder, getQuote, verifyRazorpayPayment } from "@/app/actions/checkout";
import type { Quote } from "@/lib/coupons";
import { GST_RATE, PLAN_RANK, formatINR, getPlan, plans, type PlanId } from "@/lib/pricing";
import { cn } from "@/lib/utils";

type PaidPlan = "pro" | "placement";

type RazorpayResponse = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void; on: (event: string, cb: () => void) => void };
  }
}

export function CheckoutForm({
  initialPlan,
  initialQuote,
  currentPlan,
  user,
  mode,
}: {
  initialPlan: PaidPlan;
  initialQuote: Quote;
  currentPlan: PlanId;
  user: { name: string; email: string };
  mode: "razorpay" | "test";
}) {
  const router = useRouter();
  const [planId, setPlanId] = useState<PaidPlan>(initialPlan);
  const [q, setQ] = useState<Quote>(initialQuote);
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [paying, setPaying] = useState(false);
  const [quoting, startQuote] = useTransition();
  const [testOrder, setTestOrder] = useState<{ id: string; amountPaise: number } | null>(null);

  const plan = getPlan(planId);
  const owned = PLAN_RANK[currentPlan] >= PLAN_RANK[planId];
  const base = q.total / (1 + GST_RATE);

  function requote(nextPlan: PaidPlan, coupon: string, announce: boolean) {
    startQuote(async () => {
      const res = await getQuote(nextPlan, coupon);
      setQ(res);
      if (!announce) return;
      if (res.couponLabel) toast.success(res.couponLabel);
      else if (res.couponInvalid) toast.error("That code isn't valid.");
    });
  }

  function finish() {
    toast.success(`Welcome to ${plan.name}!`, { description: "All modules are now unlocked." });
    router.push("/dashboard?welcome=1");
    router.refresh();
  }

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(phone.replace(/\D/g, "").slice(-10))) {
      setPhoneError("Enter a 10-digit Indian mobile number");
      return;
    }
    setPhoneError("");
    setPaying(true);

    const order = await createOrder(planId, q.coupon ?? "", phone);
    if (!order.ok) {
      setPaying(false);
      toast.error(order.error);
      return;
    }

    if (order.mode === "test") {
      setTestOrder({ id: order.orderId, amountPaise: order.amountPaise });
      return;
    }

    if (!window.Razorpay) {
      setPaying(false);
      toast.error("Payment window failed to load. Check your connection and try again.");
      return;
    }
    const rzp = new window.Razorpay({
      key: order.keyId,
      amount: order.amountPaise,
      currency: "INR",
      name: "ShipAI",
      description: `${order.planName} — AI Engineering Bootcamp`,
      order_id: order.providerOrderId,
      prefill: { name: order.user.name, email: order.user.email, contact: phone },
      theme: { color: "#f59e0b" },
      handler: async (res: RazorpayResponse) => {
        const verified = await verifyRazorpayPayment({ orderId: order.orderId, ...res });
        if (verified.ok) finish();
        else {
          setPaying(false);
          toast.error(verified.error);
        }
      },
      modal: { ondismiss: () => setPaying(false) },
    });
    rzp.on("payment.failed", () => {
      setPaying(false);
      toast.error("Payment failed. No money was charged — please try again.");
    });
    rzp.open();
  }

  async function resolveTest(outcome: "success" | "failure") {
    if (!testOrder) return;
    const res = await completeTestPayment(testOrder.id, outcome);
    setTestOrder(null);
    if (res.ok) finish();
    else {
      setPaying(false);
      toast.error(res.error);
    }
  }

  return (
    <div className="min-h-screen">
      {mode === "razorpay" && <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />}
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Logo />
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <ShieldCheck className="size-4 text-emerald-400" /> Secure checkout
          </span>
        </div>
      </header>

      {mode === "test" && (
        <div className="border-b border-amber-500/30 bg-amber-500/10">
          <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-2 text-sm text-amber-200">
            <FlaskConical className="size-4 shrink-0" />
            Test mode: payments are simulated and no money is charged. Add Razorpay keys to go live.
          </div>
        </div>
      )}

      <main className="mx-auto grid max-w-5xl gap-8 px-4 py-10 lg:grid-cols-[1fr_380px]">
        <form onSubmit={pay} className="space-y-6" noValidate>
          <Link href="/#pricing" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Back to pricing
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Complete your enrollment</h1>

          <div className="grid gap-3 sm:grid-cols-2">
            {plans
              .filter((p): p is typeof p & { id: PaidPlan } => p.id !== "free")
              .map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => {
                    setPlanId(p.id);
                    requote(p.id, q.coupon ?? "", false);
                  }}
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

          {owned ? (
            <Card>
              <CardContent className="space-y-3">
                <h2 className="font-semibold">You already own {getPlan(currentPlan).name}</h2>
                <p className="text-sm text-muted-foreground">All the content in this plan is unlocked on your account.</p>
                <Link href="/dashboard" className={buttonVariants()}>
                  Go to my learning
                </Link>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardContent className="space-y-4">
                  <h2 className="font-semibold">Your details</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Name on certificate</Label>
                      <Input value={user.name} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input value={user.email} disabled />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Mobile (for payment receipt)</Label>
                    <Input
                      id="phone"
                      inputMode="tel"
                      autoComplete="tel"
                      value={phone}
                      placeholder="98765 43210"
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setPhoneError("");
                      }}
                      aria-invalid={!!phoneError}
                    />
                    {phoneError && <p className="text-sm text-red-400">{phoneError}</p>}
                  </div>
                </CardContent>
              </Card>

              <Button type="submit" size="lg" className="h-12 w-full text-base" disabled={paying || quoting}>
                {paying ? (
                  <>
                    <Loader2 className="animate-spin" /> Processing…
                  </>
                ) : (
                  <>Pay {formatINR(q.total)}</>
                )}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                UPI, cards, netbanking and EMI via Razorpay. 7-day no-questions refund.
              </p>
            </>
          )}
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
                <span>{formatINR(q.price)}</span>
              </div>
              {q.coupon && (
                <div className="flex justify-between text-sm text-emerald-400">
                  <span>Coupon {q.coupon}</span>
                  <span>−{formatINR(q.discount)}</span>
                </div>
              )}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon code" className="pl-8 uppercase" />
                </div>
                <Button type="button" variant="outline" onClick={() => requote(planId, code, true)} disabled={!code.trim() || quoting}>
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
                  <span>{formatINR(q.total - base)}</span>
                </div>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatINR(q.total)}</span>
              </div>
              <Separator />
              <ul className="space-y-2 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" /> {f}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </aside>
      </main>

      <Dialog
        open={!!testOrder}
        onOpenChange={(open) => {
          if (!open) {
            setTestOrder(null);
            setPaying(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogTitle className="flex items-center gap-2">
            <FlaskConical className="size-4 text-amber-400" /> Test payment
          </DialogTitle>
          <DialogDescription>
            Razorpay isn&apos;t connected yet, so this simulates the payment popup. Choose an outcome to test.
          </DialogDescription>
          <div className="rounded-lg bg-muted/60 p-4 text-center">
            <div className="text-sm text-muted-foreground">ShipAI {plan.name}</div>
            <div className="text-3xl font-bold">{formatINR((testOrder?.amountPaise ?? 0) / 100)}</div>
          </div>
          <div className="grid gap-2">
            <Button size="lg" className="h-10" onClick={() => resolveTest("success")}>
              Simulate successful payment
            </Button>
            <Button size="lg" variant="outline" className="h-10" onClick={() => resolveTest("failure")}>
              Simulate failed payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
