import Link from "next/link";
import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Logo />
          <p>Made in India for builders everywhere.</p>
        </div>
        <div className="flex flex-wrap gap-6">
          <Link href="/#curriculum" className="hover:text-foreground">Curriculum</Link>
          <Link href="/#pricing" className="hover:text-foreground">Pricing</Link>
          <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <a href="mailto:hello@shipai.in" className="hover:text-foreground">hello@shipai.in</a>
        </div>
      </div>
    </footer>
  );
}
