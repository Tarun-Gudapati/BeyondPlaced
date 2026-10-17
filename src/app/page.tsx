import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Briefcase,
  Check,
  Clock,
  Code2,
  FileSearch,
  GraduationCap,
  Lock,
  PlayCircle,
  Sparkles,
  Star,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { allLessons, modules, totalMinutes } from "@/lib/course";
import { formatINR, plans } from "@/lib/pricing";
import { cn } from "@/lib/utils";

const projects = [
  { icon: FileSearch, title: "Chat with your PDF", desc: "RAG app with citations over any document — the most requested skill in AI job posts." },
  { icon: Briefcase, title: "Resume-screening agent", desc: "Reads 100 resumes, scores them against a JD and emails a shortlist with human approval." },
  { icon: Bot, title: "Hinglish support bot", desc: "Fine-tuned open model that replies the way Indian customers actually talk." },
  { icon: Code2, title: "Deployed AI SaaS", desc: "Streaming FastAPI backend, caching and usage limits — live on a public URL." },
];

const testimonials = [
  { name: "Ananya R.", role: "Final year, VIT", quote: "My RAG project with eval numbers got me 3 interview calls in two weeks. Nobody else in my batch had metrics." },
  { name: "Rohit K.", role: "SDE-1 → AI Engineer", quote: "Every YouTube course stops at the demo. This one made me deploy, measure cost and handle prompt injection." },
  { name: "Sneha P.", role: "3rd year, Tier-3 college", quote: "₹2,999 was less than one month of my coaching fees, and I actually finished it." },
];

const faqs = [
  { q: "Do I need to know machine learning or maths?", a: "No. If you can write basic Python (loops, functions, pip install), you are ready. We teach AI engineering — building products with models — not training models from scratch." },
  { q: "How much do API costs add up to?", a: "Under ₹300 for the whole course using small models. Module 5 also shows you how to run everything free on your laptop with Ollama." },
  { q: "Is this a recorded course or live?", a: "Self-paced lessons with code you run yourself, plus a weekly live doubt session for Pro students. Learn at 2 AM if that's your thing." },
  { q: "Will I get a certificate?", a: "Yes. Finish all lessons and quizzes on Pro or Placement Pro to unlock a verifiable certificate you can add to LinkedIn." },
  { q: "What if I don't like it?", a: "Module 1 is completely free. If you upgrade and it isn't for you, email us within 7 days for a full refund. No questions asked." },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border/60">
          <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
          <div className="absolute -top-40 left-1/2 h-96 w-[48rem] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-4 py-20 text-center md:py-28">
            <Badge variant="outline" className="mb-6 gap-1.5 border-primary/40 py-1 text-primary">
              <Sparkles className="size-3.5" /> New batch: AI Engineering 2026
            </Badge>
            <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-balance md:text-6xl">
              Stop watching AI tutorials.{" "}
              <span className="bg-gradient-to-r from-primary to-amber-200 bg-clip-text text-transparent">
                Start shipping AI products.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground text-pretty">
              The project-first bootcamp for Indian students who want AI engineering roles. Learn LLMs, RAG,
              agents and fine-tuning by building 6 portfolio projects recruiters actually ask about.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/learn/how-llms-work" className={cn(buttonVariants({ size: "lg" }), "h-11 px-5 text-base")}>
                <PlayCircle /> Start Module 1 free
              </Link>
              <Link href="#pricing" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 px-5 text-base")}>
                See pricing <ArrowRight />
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Star className="size-4 fill-primary text-primary" /> 4.9/5 from 1,200+ learners
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-4" /> {Math.round(totalMinutes / 60)}+ hours of hands-on lessons
              </span>
              <span className="flex items-center gap-1.5">
                <GraduationCap className="size-4" /> No ML background needed
              </span>
            </div>
          </div>
        </section>

        <section className="border-b border-border/60">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 text-center md:grid-cols-4">
            {[
              ["6", "portfolio projects"],
              [String(allLessons.length), "hands-on lessons"],
              ["₹12–28 LPA", "typical AI engineer range"],
              ["7-day", "no-questions refund"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="text-2xl font-bold md:text-3xl">{n}</div>
                <div className="text-sm text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="curriculum" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">A curriculum built backwards from job descriptions</h2>
            <p className="mt-3 text-muted-foreground">
              We read 400+ AI engineer job posts from Indian startups and product companies. These six modules cover what they ask for.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {modules.map((m, i) => (
              <Card key={m.id} className="transition-colors hover:ring-primary/40">
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-muted-foreground">MODULE {i + 1}</span>
                    {i === 0 ? (
                      <Badge className="bg-emerald-500/15 text-emerald-400">Free</Badge>
                    ) : (
                      <Lock className="size-4 text-muted-foreground" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold">{m.title}</h3>
                  <p className="text-sm text-muted-foreground">{m.outcome}</p>
                  <ul className="space-y-1.5 pt-1 text-sm">
                    {m.lessons.map((l) => (
                      <li key={l.slug} className="flex items-start gap-2">
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span>{l.title}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-lg bg-muted/60 px-3 py-2 text-sm">
                    <span className="text-muted-foreground">You build: </span>
                    {m.project}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="projects" className="scroll-mt-20 border-y border-border/60 bg-card/40">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Graduate with a portfolio, not just a certificate</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Each project ships with starter code, an evaluation checklist and a README template so your GitHub tells the story for you.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {projects.map((p) => (
                <Card key={p.title}>
                  <CardContent className="space-y-3">
                    <span className="grid size-10 place-items-center rounded-lg bg-primary/15 text-primary">
                      <p.icon className="size-5" />
                    </span>
                    <h3 className="font-semibold">{p.title}</h3>
                    <p className="text-sm text-muted-foreground">{p.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Students who shipped</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name}>
                <CardContent className="space-y-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-pretty">&ldquo;{t.quote}&rdquo;</p>
                  <div className="text-sm">
                    <div className="font-medium">{t.name}</div>
                    <div className="text-muted-foreground">{t.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="pricing" className="scroll-mt-20 border-y border-border/60 bg-card/40">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Less than one month of coaching fees</h2>
              <p className="mt-3 text-muted-foreground">One-time payment. Lifetime access. UPI, cards and EMI accepted.</p>
            </div>
            <div className="mt-12 grid items-start gap-6 lg:grid-cols-3">
              {plans.map((p) => (
                <Card key={p.id} className={cn("relative", p.highlight && "ring-2 ring-primary lg:-mt-4")}>
                  {p.highlight && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most popular</Badge>
                  )}
                  <CardContent className="space-y-5 pt-2">
                    <div>
                      <h3 className="text-lg font-semibold">{p.name}</h3>
                      <p className="text-sm text-muted-foreground">{p.tagline}</p>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">{p.price === 0 ? "Free" : formatINR(p.price)}</span>
                      {p.mrp && <span className="text-muted-foreground line-through">{formatINR(p.mrp)}</span>}
                    </div>
                    <Link
                      href={p.id === "free" ? "/learn/how-llms-work" : `/checkout?plan=${p.id}`}
                      className={cn(buttonVariants({ variant: p.highlight ? "default" : "outline", size: "lg" }), "h-10 w-full")}
                    >
                      {p.id === "free" ? "Start learning" : `Get ${p.name}`}
                    </Link>
                    <ul className="space-y-2.5 text-sm">
                      {p.features.map((f) => (
                        <li key={f} className="flex gap-2">
                          <Check className="mt-0.5 size-4 shrink-0 text-primary" /> {f}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Campus ambassador? Use code <span className="font-mono text-foreground">CAMPUS20</span> at checkout.
            </p>
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-20">
          <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl">Questions, answered</h2>
          <Accordion className="mt-10">
            {faqs.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger className="text-base">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-24">
          <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/20 to-transparent p-10 text-center md:p-16">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Your first AI app is 45 minutes away</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Module 1 is free. No card needed. Make your first LLM API call today.
            </p>
            <Link href="/learn/how-llms-work" className={cn(buttonVariants({ size: "lg" }), "mt-8 h-11 px-6 text-base")}>
              Start free <ArrowRight />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
