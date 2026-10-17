"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Rocket } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useAppState } from "@/lib/store";
import { cn } from "@/lib/utils";

const links = [
  { href: "/#curriculum", label: "Curriculum" },
  { href: "/#projects", label: "Projects" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
        <Rocket className="size-4" />
      </span>
      <span className="text-lg">ShipAI</span>
    </Link>
  );
}

export function SiteHeader() {
  const { isPaid, hydrated, state } = useAppState();
  const [open, setOpen] = useState(false);
  const started = hydrated && (isPaid || state.completed.length > 0);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {hydrated && isPaid && (
            <Badge variant="secondary" className="hidden sm:inline-flex">
              {state.plan === "placement" ? "Placement Pro" : "Pro"}
            </Badge>
          )}
          <Link href="/dashboard" className={cn(buttonVariants({ variant: "ghost" }), "hidden sm:inline-flex")}>
            {started ? "My learning" : "Log in"}
          </Link>
          <Link href={started ? "/dashboard" : "/learn/how-llms-work"} className={buttonVariants()}>
            {started ? "Continue" : "Start free"}
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "md:hidden")} aria-label="Open menu">
              <Menu />
            </SheetTrigger>
            <SheetContent side="right" className="p-6">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <nav className="mt-8 flex flex-col gap-4 text-lg">
                {links.map((l) => (
                  <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
                    {l.label}
                  </Link>
                ))}
                <Link href="/dashboard" onClick={() => setOpen(false)}>
                  My learning
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
