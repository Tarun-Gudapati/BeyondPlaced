import Link from "next/link";
import { Logo } from "@/components/logo";
import { brand } from "@/lib/brand";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Logo />
          <p className="font-heading text-base text-foreground">{brand.slogan}</p>
          <p>{brand.tagline}. Made in India for builders everywhere.</p>
        </div>
        <div className="flex flex-wrap gap-6">
          <Link href="/#roadmap" className="hover:text-foreground">Roadmap</Link>
          <Link href="/#pricing" className="hover:text-foreground">Pricing</Link>
          <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <Link href="/brand" className="hover:text-foreground">Brand kit</Link>
          <a href={`mailto:${brand.email}`} className="hover:text-foreground">{brand.email}</a>
        </div>
      </div>
    </footer>
  );
}
