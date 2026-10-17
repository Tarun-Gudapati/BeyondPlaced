import "server-only";
import { getPlan, type PlanId } from "@/lib/pricing";

const coupons: Record<string, { off: number; label: string }> = {
  CAMPUS20: { off: 0.2, label: "Campus ambassador — 20% off" },
  EARLY40: { off: 0.4, label: "Early bird — 40% off" },
};

export function quote(planId: Exclude<PlanId, "free">, rawCoupon?: string | null) {
  const plan = getPlan(planId);
  const code = rawCoupon?.trim().toUpperCase() || null;
  const coupon = code ? coupons[code] : undefined;
  const discount = coupon ? Math.round(plan.price * coupon.off) : 0;
  return {
    plan: planId,
    price: plan.price,
    coupon: coupon ? code : null,
    couponLabel: coupon?.label ?? null,
    couponInvalid: !!code && !coupon,
    discount,
    total: plan.price - discount,
  };
}

export type Quote = ReturnType<typeof quote>;
