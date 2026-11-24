import type { Metadata } from "next";
import { Suspense } from "react";
import { count, desc, eq, sql } from "drizzle-orm";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { setUserPlan } from "@/app/actions/admin";
import { isAdminEmail, requireAdmin } from "@/lib/auth";
import { allLessons } from "@/lib/course";
import { getDb, schema } from "@/lib/db";
import { formatINR, plans } from "@/lib/pricing";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

const dateFmt = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <CardContent className="py-2">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

async function AdminData() {
  await requireAdmin();
  const db = await getDb();

  const [users, orders, [{ paidUsers }], [{ revenue, paidOrders }], [{ completions }]] = await Promise.all([
    db
      .select({
        id: schema.users.id,
        name: schema.users.name,
        email: schema.users.email,
        plan: schema.users.plan,
        createdAt: schema.users.createdAt,
        done: sql<number>`(select count(*)::int from ${schema.progress} where ${schema.progress.userId} = ${schema.users.id})`,
      })
      .from(schema.users)
      .orderBy(desc(schema.users.createdAt))
      .limit(200),
    db
      .select({
        id: schema.orders.id,
        email: schema.users.email,
        plan: schema.orders.plan,
        amountPaise: schema.orders.amountPaise,
        provider: schema.orders.provider,
        status: schema.orders.status,
        createdAt: schema.orders.createdAt,
      })
      .from(schema.orders)
      .innerJoin(schema.users, eq(schema.orders.userId, schema.users.id))
      .orderBy(desc(schema.orders.createdAt))
      .limit(50),
    db.select({ paidUsers: count() }).from(schema.users).where(sql`${schema.users.plan} <> 'free'`),
    db
      .select({
        revenue: sql<number>`coalesce(sum(${schema.orders.amountPaise}), 0)::int`,
        paidOrders: count(),
      })
      .from(schema.orders)
      .where(eq(schema.orders.status, "paid")),
    db.select({ completions: count() }).from(schema.progress),
  ]);

  const withVideo = allLessons.filter((l) => l.blocks.some((b) => b.type === "video")).length;

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-10">
      <div>
        <h1 className="text-3xl font-bold">Admin</h1>
        <p className="text-muted-foreground">Admins are set with ADMIN_EMAILS and can open every lesson.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Stat label="Users" value={users.length >= 200 ? "200+" : users.length} />
        <Stat label="Paid users" value={paidUsers} />
        <Stat label="Paid orders" value={paidOrders} />
        <Stat label="Revenue" value={formatINR(revenue / 100)} />
        <Stat label="Lessons completed" value={completions} />
        <Stat label="Lessons with video" value={`${withVideo}/${allLessons.length}`} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="text-left text-muted-foreground">
              <tr>
                <th className="py-2 pr-4 font-medium">Name</th>
                <th className="py-2 pr-4 font-medium">Email</th>
                <th className="py-2 pr-4 font-medium">Joined</th>
                <th className="py-2 pr-4 font-medium">Lessons done</th>
                <th className="py-2 font-medium">Plan</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="py-2 pr-4">{u.name}</td>
                  <td className="py-2 pr-4">
                    {u.email} {isAdminEmail(u.email) && <Badge variant="secondary">admin</Badge>}
                  </td>
                  <td className="py-2 pr-4 whitespace-nowrap">{dateFmt.format(u.createdAt)}</td>
                  <td className="py-2 pr-4">
                    {u.done}/{allLessons.length}
                  </td>
                  <td className="py-2">
                    <form action={setUserPlan} className="flex items-center gap-2">
                      <input type="hidden" name="userId" value={u.id} />
                      <select
                        name="plan"
                        defaultValue={u.plan}
                        aria-label={`Plan for ${u.email}`}
                        className="h-8 rounded-md border bg-background px-2"
                      >
                        {plans.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                      <button type="submit" className="h-8 rounded-md border px-3 font-medium hover:bg-muted">
                        Save
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent orders</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <table className="w-full min-w-[640px] text-sm">
              <thead className="text-left text-muted-foreground">
                <tr>
                  <th className="py-2 pr-4 font-medium">When</th>
                  <th className="py-2 pr-4 font-medium">User</th>
                  <th className="py-2 pr-4 font-medium">Plan</th>
                  <th className="py-2 pr-4 font-medium">Amount</th>
                  <th className="py-2 pr-4 font-medium">Provider</th>
                  <th className="py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t">
                    <td className="py-2 pr-4 whitespace-nowrap">{dateFmt.format(o.createdAt)}</td>
                    <td className="py-2 pr-4">{o.email}</td>
                    <td className="py-2 pr-4">{o.plan}</td>
                    <td className="py-2 pr-4">{formatINR(o.amountPaise / 100)}</td>
                    <td className="py-2 pr-4">{o.provider}</td>
                    <td className="py-2">{o.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

export default function AdminPage() {
  return (
    <>
      <SiteHeader />
      <Suspense fallback={<div className="mx-auto mt-10 h-96 w-full max-w-6xl animate-pulse rounded-xl bg-muted" />}>
        <AdminData />
      </Suspense>
    </>
  );
}
