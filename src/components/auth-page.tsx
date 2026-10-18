import { Suspense } from "react";
import { Logo } from "@/components/logo";
import { AuthForm } from "@/components/auth-form";
import { safeNext } from "@/lib/auth";
import { brand } from "@/lib/brand";

async function AuthFormWithNext({
  mode,
  searchParams,
}: {
  mode: "login" | "signup";
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const next = safeNext((await searchParams).next);
  return <AuthForm mode={mode} next={next} />;
}

export function AuthPage({ mode, searchParams }: { mode: "login" | "signup"; searchParams: Promise<{ next?: string | string[] }> }) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-12">
      <div className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="flex flex-col items-center gap-2">
        <Logo />
        <p className="text-sm text-muted-foreground">{brand.slogan}</p>
      </div>
      <Suspense fallback={<div className="h-96 w-full max-w-md animate-pulse rounded-xl bg-muted" />}>
        <AuthFormWithNext mode={mode} searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
