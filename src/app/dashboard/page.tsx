import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { Dashboard } from "@/components/dashboard";

export const metadata: Metadata = { title: "My learning — ShipAI" };

async function DashboardWithParams({ searchParams }: { searchParams: PageProps<"/dashboard">["searchParams"] }) {
  const { welcome } = await searchParams;
  return <Dashboard welcome={welcome === "1"} />;
}

export default function DashboardPage({ searchParams }: PageProps<"/dashboard">) {
  return (
    <>
      <SiteHeader />
      <Suspense fallback={<Dashboard welcome={false} />}>
        <DashboardWithParams searchParams={searchParams} />
      </Suspense>
    </>
  );
}
