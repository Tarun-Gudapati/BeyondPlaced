import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutForm } from "@/components/checkout-form";
import { requireUser } from "@/lib/auth";
import { quote } from "@/lib/coupons";
import { razorpayEnabled } from "@/lib/razorpay";

export const metadata: Metadata = { title: "Checkout" };

async function Checkout({ searchParams }: { searchParams: PageProps<"/checkout">["searchParams"] }) {
  const { plan } = await searchParams;
  const planId = plan === "placement" ? "placement" : "pro";
  const user = await requireUser(`/checkout?plan=${planId}`);
  return (
    <CheckoutForm
      initialPlan={planId}
      initialQuote={quote(planId, null)}
      currentPlan={user.plan}
      user={{ name: user.name, email: user.email }}
      mode={razorpayEnabled ? "razorpay" : "test"}
    />
  );
}

export default function CheckoutPage({ searchParams }: PageProps<"/checkout">) {
  return (
    <Suspense fallback={<div className="mx-auto mt-24 h-96 w-full max-w-5xl animate-pulse rounded-xl bg-muted" />}>
      <Checkout searchParams={searchParams} />
    </Suspense>
  );
}
