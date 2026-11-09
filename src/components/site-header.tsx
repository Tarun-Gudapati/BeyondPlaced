import Link from "next/link";
import { Suspense } from "react";
import { Logo } from "@/components/logo";
import { UserMenu } from "@/components/user-menu";
import { getCurrentUser } from "@/lib/auth";
import { navLinks } from "@/lib/nav";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

async function CurrentUserMenu() {
  const user = await getCurrentUser();
  return <UserMenu user={user ? { name: user.name, plan: user.plan } : null} />;
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground lg:flex">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-brand-teal">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/learn/how-llms-work"
            className={cn(buttonVariants({ size: "sm" }), "hidden h-9 rounded-lg bg-brand-teal px-4 text-white hover:bg-brand-teal/90 sm:inline-flex")}
          >
            Start free
          </Link>
          <Suspense fallback={<div className="h-8 w-28 animate-pulse rounded-lg bg-muted" />}>
            <CurrentUserMenu />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
