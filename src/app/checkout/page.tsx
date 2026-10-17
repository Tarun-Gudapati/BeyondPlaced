import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutForm } from "@/components/checkout-form";
import type { PlanId } from "@/lib/course";

export const metadata: Metadata = { title: "Checkout — ShipAI" };

async function CheckoutWithParams({ searchParams }: { searchParams: PageProps<"/checkout">["searchParams"] }) {
  const { plan } = await searchParams;
  const planId: PlanId = plan === "placement" ? "placement" : "pro";
  return <CheckoutForm initialPlan={planId} />;
}

export default function CheckoutPage({ searchParams }: PageProps<"/checkout">) {
  return (
    <Suspense fallback={<CheckoutForm initialPlan="pro" />}>
      <CheckoutWithParams searchParams={searchParams} />
    </Suspense>
  );
}
