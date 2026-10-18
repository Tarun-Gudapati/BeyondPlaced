import type { Metadata } from "next";
import { Check, Download, X } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BrandMark, Wordmark } from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Brand kit" };

const dos = ["Write BeyondPlaced as one word with a capital B and P", "Leave space around the logo of at least half the mark's width", "Use the mark on Night Class or white backgrounds"];
const donts = ["Beyond Placed, Beyondplaced or beyond-placed", "Stretching, rotating or recolouring the mark", "Placing the logo on busy photos"];

export default function BrandPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 space-y-16 px-4 py-16">
        <section className="text-center">
          <BrandMark className="mx-auto size-20" />
          <h1 className="mt-6 text-5xl font-extrabold tracking-tight md:text-6xl">
            <Wordmark className="text-5xl md:text-6xl" />
          </h1>
          <p className="mt-4 text-2xl font-heading text-brand-gradient">{brand.slogan}</p>
          <p className="mt-2 text-muted-foreground">{brand.tagline}</p>
          <a href="/icon.svg" download="beyondplaced-mark.svg" className={cn(buttonVariants({ variant: "outline" }), "mt-6")}>
            <Download /> Download mark (SVG)
          </a>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">The story</h2>
          <p className="max-w-3xl text-muted-foreground">
            Every student in India hears one question: &ldquo;Did you get placed?&rdquo; We think getting placed is the floor, not
            the ceiling. <span className="text-foreground">BeyondPlaced</span> is for students who want skills that keep growing
            after the offer letter. The mark is a graduation cap whose tassel ends in a spark: learning that turns into
            something you build. The slogan says the whole method in five words. We don&apos;t teach AI from slides; you
            learn it by building it.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Logo</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="grid h-40 place-items-center rounded-xl bg-brand-night ring-1 ring-foreground/10">
              <div className="flex items-center gap-2">
                <BrandMark />
                <Wordmark />
              </div>
            </div>
            <div className="grid h-40 place-items-center rounded-xl bg-white">
              <div className="flex items-center gap-2 text-brand-night">
                <BrandMark />
                <span className="font-heading text-lg font-bold tracking-tight">
                  Beyond<span className="text-[#6b4fe0]">Placed</span>
                </span>
              </div>
            </div>
            <div className="grid h-40 place-items-center rounded-xl bg-[#F5F3FF]">
              <BrandMark className="size-16 shadow-none" />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Colours</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {brand.colors.map((c) => (
              <div key={c.name} className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
                <div className="h-24" style={{ backgroundColor: c.hex }} />
                <div className="space-y-0.5 bg-card p-3 text-sm">
                  <div className="font-medium">{c.name}</div>
                  <div className="font-mono text-xs text-muted-foreground">{c.hex}</div>
                  <div className="text-xs text-muted-foreground">{c.use}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Typography</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="space-y-2">
                <div className="text-xs text-muted-foreground">Headings · Bricolage Grotesque</div>
                <div className="font-heading text-4xl font-extrabold">Learn AI by building it.</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-2">
                <div className="text-xs text-muted-foreground">Body · Geist / Code · Geist Mono</div>
                <p className="text-base">Short lessons, plain English and real projects.</p>
                <code className="font-mono text-sm text-brand-mint">client.chat.completions.create()</code>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">How we sound</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {brand.voice.map((v) => (
              <Card key={v.title}>
                <CardContent className="space-y-2">
                  <h3 className="font-semibold">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">{v.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="space-y-3">
              <h3 className="font-semibold text-brand-mint">Do</h3>
              <ul className="space-y-2 text-sm">
                {dos.map((d) => (
                  <li key={d} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand-mint" /> {d}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-3">
              <h3 className="font-semibold text-red-300">Don&apos;t</h3>
              <ul className="space-y-2 text-sm">
                {donts.map((d) => (
                  <li key={d} className="flex gap-2">
                    <X className="mt-0.5 size-4 shrink-0 text-red-300" /> {d}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
