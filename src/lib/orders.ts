import "server-only";
import { and, eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { PLAN_RANK, type PlanId } from "@/lib/pricing";

export async function markOrderPaid(where: { orderId?: string; providerOrderId?: string }, paymentId: string | null) {
  const db = await getDb();
  const condition = where.orderId
    ? eq(schema.orders.id, where.orderId)
    : eq(schema.orders.providerOrderId, where.providerOrderId!);

  const [order] = await db.select().from(schema.orders).where(condition).limit(1);
  if (!order) return null;
  if (order.status === "paid") return order;

  const [updated] = await db
    .update(schema.orders)
    .set({ status: "paid", providerPaymentId: paymentId, paidAt: new Date() })
    .where(and(condition, eq(schema.orders.status, "created")))
    .returning();
  if (!updated) return order;

  const [user] = await db.select({ plan: schema.users.plan }).from(schema.users).where(eq(schema.users.id, order.userId));
  if (user && PLAN_RANK[order.plan as PlanId] > PLAN_RANK[user.plan as PlanId]) {
    await db.update(schema.users).set({ plan: order.plan }).where(eq(schema.users.id, order.userId));
  }
  return updated;
}
