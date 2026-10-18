import Link from "next/link";
import { Suspense } from "react";
import { Logo } from "@/components/logo";
import { UserMenu } from "@/components/user-menu";
import { getCurrentUser } from "@/lib/auth";
import { navLinks } from "@/lib/nav";

async function CurrentUserMenu() {
  const user = await getCurrentUser();
  return <UserMenu user={user ? { name: user.name, plan: user.plan } : null} />;
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground lg:flex">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </nav>
        <Suspense fallback={<div className="h-8 w-40 animate-pulse rounded-lg bg-muted" />}>
          <CurrentUserMenu />
        </Suspense>
      </div>
    </header>
  );
}
