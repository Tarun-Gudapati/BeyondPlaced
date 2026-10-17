"use server";

import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { quote, type Quote } from "@/lib/coupons";
import { getDb, schema } from "@/lib/db";
import { markOrderPaid } from "@/lib/orders";
import { PLAN_RANK } from "@/lib/pricing";
import { createRazorpayOrder, razorpayEnabled, razorpayKeyId, verifyPaymentSignature } from "@/lib/razorpay";

type PaidPlan = "pro" | "placement";

function parsePlan(plan: string): PaidPlan {
  return plan === "placement" ? "placement" : "pro";
}

export async function getQuote(plan: string, coupon: string): Promise<Quote> {
  return quote(parsePlan(plan), coupon);
}

export type CreatedOrder =
  | { ok: false; error: string }
  | {
      ok: true;
      mode: "razorpay" | "test";
      orderId: string;
      providerOrderId: string;
      keyId: string | null;
      amountPaise: number;
      planName: string;
      user: { name: string; email: string };
    };

export async function createOrder(planInput: string, coupon: string, phone: string): Promise<CreatedOrder> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please log in again." };
  const plan = parsePlan(planInput);
  if (PLAN_RANK[user.plan] >= PLAN_RANK[plan]) return { ok: false, error: "You already have this plan." };
  if (!/^[6-9]\d{9}$/.test(phone.replace(/\D/g, "").slice(-10))) {
    return { ok: false, error: "Enter a valid 10-digit Indian mobile number." };
  }

  const q = quote(plan, coupon);
  const amountPaise = q.total * 100;
  const orderId = randomUUID();

  let providerOrderId = `test_${orderId.slice(0, 18)}`;
  if (razorpayEnabled) {
    try {
      const rzp = await createRazorpayOrder(amountPaise, orderId.slice(0, 40), { userId: user.id, plan });
      providerOrderId = rzp.id;
    } catch (err) {
      console.error(err);
      return { ok: false, error: "Couldn't reach the payment gateway. Please try again." };
    }
  }

  const db = await getDb();
  await db.insert(schema.orders).values({
    id: orderId,
    userId: user.id,
    plan,
    amountPaise,
    coupon: q.coupon,
    provider: razorpayEnabled ? "razorpay" : "test",
    providerOrderId,
  });

  return {
    ok: true,
    mode: razorpayEnabled ? "razorpay" : "test",
    orderId,
    providerOrderId,
    keyId: razorpayKeyId,
    amountPaise,
    planName: plan === "placement" ? "Placement Pro" : "Pro",
    user: { name: user.name, email: user.email },
  };
}

export async function verifyRazorpayPayment(input: {
  orderId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): Promise<{ ok: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please log in again." };
  if (!verifyPaymentSignature(input.razorpay_order_id, input.razorpay_payment_id, input.razorpay_signature)) {
    return { ok: false, error: "Payment could not be verified. If money was deducted, it will be refunded automatically." };
  }
  const db = await getDb();
  const [order] = await db
    .select({ id: schema.orders.id })
    .from(schema.orders)
    .where(
      and(
        eq(schema.orders.id, input.orderId),
        eq(schema.orders.userId, user.id),
        eq(schema.orders.providerOrderId, input.razorpay_order_id),
      ),
    )
    .limit(1);
  if (!order) return { ok: false, error: "Order not found." };
  await markOrderPaid({ orderId: order.id }, input.razorpay_payment_id);
  return { ok: true };
}

export async function completeTestPayment(orderId: string, outcome: "success" | "failure"): Promise<{ ok: boolean; error?: string }> {
  if (razorpayEnabled) return { ok: false, error: "Test payments are disabled when Razorpay is configured." };
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please log in again." };
  const db = await getDb();
  const [order] = await db
    .select({ id: schema.orders.id, providerOrderId: schema.orders.providerOrderId })
    .from(schema.orders)
    .where(and(eq(schema.orders.id, orderId), eq(schema.orders.userId, user.id), eq(schema.orders.provider, "test")))
    .limit(1);
  if (!order) return { ok: false, error: "Order not found." };
  if (outcome === "failure") {
    await db.update(schema.orders).set({ status: "failed" }).where(eq(schema.orders.id, order.id));
    return { ok: false, error: "Payment failed (simulated). No money was charged — try again." };
  }
  await markOrderPaid({ orderId: order.id }, `test_pay_${Date.now()}`);
  return { ok: true };
}
