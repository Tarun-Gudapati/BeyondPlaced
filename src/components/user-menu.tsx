"use client";

import Link from "next/link";
import { useState } from "react";
import { LogOut, Menu } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { logout } from "@/app/actions/auth";
import type { PlanId } from "@/lib/pricing";
import { cn } from "@/lib/utils";

const links = [
  { href: "/#curriculum", label: "Curriculum" },
  { href: "/#projects", label: "Projects" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];

export function UserMenu({ user }: { user: { name: string; plan: PlanId } | null }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="flex items-center gap-2">
      {user && user.plan !== "free" && (
        <Badge variant="secondary" className="hidden sm:inline-flex">
          {user.plan === "placement" ? "Placement Pro" : "Pro"}
        </Badge>
      )}
      {user ? (
        <>
          <form action={logout} className="hidden sm:block">
            <button type="submit" className={buttonVariants({ variant: "ghost" })}>
              Log out
            </button>
          </form>
          <Link href="/dashboard" className={buttonVariants()}>
            My learning
          </Link>
        </>
      ) : (
        <>
          <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }), "hidden sm:inline-flex")}>
            Log in
          </Link>
          <Link href="/learn/how-llms-work" className={buttonVariants()}>
            Start free
          </Link>
        </>
      )}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "md:hidden")} aria-label="Open menu">
          <Menu />
        </SheetTrigger>
        <SheetContent side="right" className="p-6">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <nav className="mt-8 flex flex-col gap-4 text-lg">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={close}>
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link href="/dashboard" onClick={close}>
                  My learning
                </Link>
                <form action={logout}>
                  <button type="submit" className="flex items-center gap-2 text-muted-foreground">
                    <LogOut className="size-4" /> Log out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" onClick={close}>
                  Log in
                </Link>
                <Link href="/signup" onClick={close}>
                  Create account
                </Link>
              </>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
