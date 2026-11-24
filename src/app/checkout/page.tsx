import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CheckoutForm } from "@/components/checkout-form";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { quote } from "@/lib/coupons";
import { checkoutAvailable, razorpayEnabled } from "@/lib/razorpay";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Checkout" };

function ComingSoon() {
  return (
    <main className="mx-auto mt-24 w-full max-w-lg px-4">
      <Card>
        <CardContent className="space-y-4 py-4 text-center">
          <h1 className="text-2xl font-bold">Payments are coming soon</h1>
          <p className="text-muted-foreground">
            Pro and Placement Pro open shortly. Module 1 is free right now, so you can start learning today.
          </p>
          <div className="flex flex-col justify-center gap-2 sm:flex-row">
            <Link href="/learn/how-llms-work" className={cn(buttonVariants({ size: "lg" }), "h-10 px-5")}>
              Start Module 1 free
            </Link>
            <a href={`mailto:${brand.email}`} className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-10 px-5")}>
              Email us
            </a>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

async function Checkout({ searchParams }: { searchParams: PageProps<"/checkout">["searchParams"] }) {
  const { plan } = await searchParams;
  const planId = plan === "placement" ? "placement" : "pro";
  const user = await requireUser(`/checkout?plan=${planId}`);
  if (!checkoutAvailable) return <ComingSoon />;
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
