import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Bot,
  Briefcase,
  Check,
  CheckCircle2,
  Clock,
  Code2,
  FileSearch,
  Flame,
  GraduationCap,
  Laptop,
  PlayCircle,
  Rocket,
  Sparkles,
  Sprout,
  Star,
  Trophy,
  Wallet,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { allLessons, modules, totalMinutes } from "@/lib/course";
import { brand } from "@/lib/brand";
import { formatINR, plans } from "@/lib/pricing";
import { cn } from "@/lib/utils";

const personas = [
  {
    icon: Sprout,
    title: "1st or 2nd year",
    desc: "You know a little Python and keep hearing about AI. Start here. We explain every new word the first time it shows up.",
  },
  {
    icon: Briefcase,
    title: "Final year",
    desc: "Placements are coming. Build 6 projects with real numbers that make your resume different from everyone else's.",
  },
  {
    icon: Rocket,
    title: "Fresher or switching",
    desc: "Already writing code? Learn the AI engineering stack that startups and product companies are hiring for now.",
  },
];

const needs = [
  { icon: Code2, text: "Basic Python: loops, functions, pip install" },
  { icon: Laptop, text: "Any laptop with 8 GB RAM" },
  { icon: Clock, text: "About 4 hours a week" },
  { icon: Wallet, text: "₹0 to start. Module 1 is free" },
];

const steps = [
  { icon: BookOpen, title: "Read a short lesson", desc: "10–25 minutes. Plain English, examples from apps you already use." },
  { icon: Code2, title: "Run the code", desc: "Copy-paste-ready snippets you run on your own laptop." },
  { icon: CheckCircle2, title: "Pass a quick quiz", desc: "One question per lesson. Wrong answer? Try again. No penalty." },
  { icon: Trophy, title: "Ship and get certified", desc: "Finish the module project, push it to GitHub, earn your certificate." },
];

const moduleMeta = [
  { weeks: "Weeks 1–2", level: "Beginner" },
  { weeks: "Weeks 3–4", level: "Beginner" },
  { weeks: "Weeks 5–6", level: "Intermediate" },
  { weeks: "Weeks 7–8", level: "Intermediate" },
  { weeks: "Weeks 9–10", level: "Advanced" },
  { weeks: "Weeks 11–12", level: "Advanced" },
];

const levelStyle: Record<string, string> = {
  Beginner: "bg-brand-mint/15 text-brand-mint",
  Intermediate: "bg-brand-violet/15 text-brand-violet",
  Advanced: "bg-brand-marigold/15 text-brand-marigold",
};

const projects = [
  { icon: FileSearch, title: "Chat with your PDF", desc: "A RAG app that answers from any document, with citations. The skill AI job posts ask for most." },
  { icon: Briefcase, title: "Resume-screening agent", desc: "Reads 100 resumes, scores them against a job description and emails a shortlist after a human approves." },
  { icon: Bot, title: "Hinglish support bot", desc: "A fine-tuned open model that replies the way Indian customers actually talk." },
  { icon: Code2, title: "Deployed AI SaaS", desc: "Streaming backend, caching and usage limits. Live on a public URL you can share." },
];

const testimonials = [
  { name: "Ananya R.", role: "Final year, VIT", quote: "My RAG project with eval numbers got me 3 interview calls in two weeks. Nobody else in my batch had metrics." },
  { name: "Rohit K.", role: "SDE-1 → AI Engineer", quote: "Every YouTube course stops at the demo. This one made me deploy, measure cost and handle prompt injection." },
  { name: "Sneha P.", role: "3rd year, Tier-3 college", quote: "₹2,999 was less than one month of my coaching fees, and I actually finished it." },
];

const faqs = [
  { q: "I'm a complete beginner in AI. Can I still do this?", a: "Yes. That's who we built it for. If you can write basic Python (loops, functions, pip install), you're ready. We teach you to build products with AI models, not to do research maths." },
  { q: "Can I do this alongside college and exams?", a: "Yes. Lessons are 10–25 minutes, so one lesson fits in a free period. Most students do 3–4 lessons a week. It's self-paced, so you can pause during exams and your progress stays saved." },
  { q: "I only know C, C++ or Java. Is that okay?", a: "Yes. Spend a weekend on Python basics first. If you can write loops and functions in any language, the switch takes a few hours." },
  { q: "What laptop do I need? Do I need a GPU?", a: "No GPU needed. Any laptop with 8 GB RAM works. We use cloud APIs for the heavy parts, and Module 5 shows free options for running models locally." },
  { q: "How much do API costs add up to?", a: "Under ₹300 for the whole course if you use small models. Module 5 also shows you how to run everything free on your laptop with Ollama." },
  { q: "Is this recorded or live?", a: "Self-paced lessons with code you run yourself, plus a weekly live doubt session for Pro students. Learn at 2 AM if that's your thing." },
  { q: "Will I get a certificate?", a: "Yes. Finish all lessons and quizzes on Pro or Placement Pro to unlock a verifiable certificate you can add to LinkedIn." },
  { q: "What if I don't like it?", a: "Module 1 is completely free. If you upgrade and it isn't for you, email us within 7 days for a full refund. No questions asked." },
];

function HeroPreview() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:mx-0">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-brand-violet/25 via-brand-mint/10 to-transparent blur-2xl" />
      <Card className="shadow-2xl shadow-black/40">
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-mono">MODULE 1 · LESSON 2</span>
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" /> 15 min
            </span>
          </div>
          <div className="font-heading text-lg font-semibold">Your first LLM API call in Python</div>
          <div className="overflow-hidden rounded-lg border bg-black/40">
            <div className="border-b px-3 py-1 font-mono text-[11px] text-muted-foreground">python</div>
            <pre className="overflow-x-auto p-3 font-mono text-[12px] leading-5">
              <code>
                <span className="text-brand-violet">resp</span> = client.chat.completions.create({"\n"}
                {"  "}model=<span className="text-brand-mint">&quot;gpt-4o-mini&quot;</span>,{"\n"}
                {"  "}messages=[{"{"}<span className="text-brand-mint">&quot;role&quot;</span>: <span className="text-brand-mint">&quot;user&quot;</span>,{"\n"}
                {"    "}<span className="text-brand-mint">&quot;content&quot;</span>: <span className="text-brand-mint">&quot;Explain binary search&quot;</span>{"}"}],{"\n"}
                ){"\n"}
                <span className="text-muted-foreground"># tokens used: 182</span>
              </code>
            </pre>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-brand-mint/10 p-3 text-sm text-brand-mint">
            <CheckCircle2 className="size-4 shrink-0" /> Correct! Lesson complete.
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Your progress</span>
              <span>2 of {allLessons.length} lessons</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[11%] rounded-full bg-gradient-to-r from-brand-violet to-brand-mint" />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="absolute -top-4 -right-3 flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-xs font-medium shadow-lg sm:-right-6">
        <Flame className="size-3.5 text-brand-marigold" /> 5-day streak
      </div>
      <div className="absolute -bottom-4 -left-3 flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-xs font-medium shadow-lg sm:-left-6">
        <Sparkles className="size-3.5 text-brand-violet" /> No maths panic
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border/60">
          <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
          <div className="absolute -top-40 left-1/3 h-96 w-[48rem] -translate-x-1/2 rounded-full bg-brand-violet/20 blur-3xl" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 py-16 md:py-24 lg:grid-cols-[1.15fr_1fr]">
            <div className="text-center lg:text-left">
              <Badge variant="outline" className="mb-6 gap-1.5 border-brand-mint/40 py-1 text-brand-mint">
                <Sparkles className="size-3.5" /> New batch open · Module 1 is free
              </Badge>
              <h1 className="text-5xl font-extrabold tracking-tight text-balance md:text-7xl">
                Learn AI <span className="text-brand-gradient">by building it.</span>
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground text-pretty lg:mx-0">
                {brand.name} is the friendly AI school for college students. Short lessons, plain English and zero maths
                panic. Build 6 real AI projects and walk into placements with a portfolio.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Link href="/learn/how-llms-work" className={cn(buttonVariants({ size: "lg" }), "h-12 rounded-xl px-6 text-base")}>
                  <PlayCircle /> Start Module 1 free
                </Link>
                <Link
                  href="#roadmap"
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 rounded-xl px-6 text-base")}
                >
                  See the roadmap <ArrowRight />
                </Link>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">No card needed. Sign up takes 30 seconds.</p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground lg:justify-start">
                <span className="flex items-center gap-1.5">
                  <Star className="size-4 fill-brand-marigold text-brand-marigold" /> 4.9/5 from 1,200+ learners
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="size-4" /> 10–25 min lessons
                </span>
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="size-4" /> No ML background needed
                </span>
              </div>
            </div>
            <HeroPreview />
          </div>
        </section>

        <section className="border-b border-border/60">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 text-center md:grid-cols-4">
            {[
              ["6", "portfolio projects"],
              [String(allLessons.length), "bite-sized lessons"],
              [`${Math.round(totalMinutes / 60)} hrs`, "total. Finish in 12 weeks"],
              ["7-day", "no-questions refund"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="font-heading text-2xl font-bold md:text-3xl">{n}</div>
                <div className="text-sm text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="for-you" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Is {brand.name} for you?</h2>
            <p className="mt-3 text-muted-foreground">
              If you can write a for-loop and you are curious about AI, yes. Here is who usually joins.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {personas.map((p) => (
              <Card key={p.title} className="transition-transform hover:-translate-y-0.5">
                <CardContent className="space-y-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-brand-violet/15 text-brand-violet">
                    <p.icon className="size-5" />
                  </span>
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                  <p className="text-sm text-muted-foreground">{p.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-dashed p-5">
            <div className="mb-3 text-sm font-medium">All you need to start</div>
            <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
              {needs.map((n) => (
                <li key={n.text} className="flex items-center gap-2">
                  <n.icon className="size-4 shrink-0 text-brand-mint" /> {n.text}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-20 border-y border-border/60 bg-card/40">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">How learning works here</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              The same simple loop for every lesson. Small steps, quick wins, and you always know what to do next.
            </p>
            <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s, i) => (
                <li key={s.title} className="relative rounded-xl bg-card p-5 ring-1 ring-foreground/10">
                  <span className="font-heading text-5xl font-extrabold text-foreground/10">{i + 1}</span>
                  <s.icon className="absolute top-5 right-5 size-5 text-brand-violet" />
                  <h3 className="mt-2 font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="roadmap" className="mx-auto max-w-4xl scroll-mt-20 px-4 py-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Your 12-week roadmap</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Built backwards from 400+ AI engineer job posts at Indian startups and product companies. Each module
              ends with a project for your GitHub.
            </p>
          </div>
          <ol className="relative mt-12 space-y-6 border-l-2 border-dashed border-border pl-8 md:pl-10">
            {modules.map((m, i) => {
              const meta = moduleMeta[i];
              const minutes = m.lessons.reduce((s, l) => s + l.minutes, 0);
              return (
                <li key={m.id} className="relative">
                  <span
                    className={cn(
                      "absolute top-5 -left-[3.05rem] grid size-9 place-items-center rounded-full border-2 border-background font-heading text-sm font-bold md:-left-[3.55rem]",
                      i === 0 ? "bg-brand-mint text-brand-night" : "bg-secondary text-foreground",
                    )}
                  >
                    {i + 1}
                  </span>
                  <Card className="transition-colors hover:ring-primary/40">
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-mono text-muted-foreground uppercase">{meta?.weeks}</span>
                        {meta && <Badge className={levelStyle[meta.level]}>{meta.level}</Badge>}
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="size-3" /> {minutes} min
                        </span>
                        {i === 0 && <Badge className="bg-brand-mint text-brand-night">Free</Badge>}
                      </div>
                      <h3 className="text-xl font-semibold">{m.title}</h3>
                      <p className="text-sm text-muted-foreground">{m.outcome}</p>
                      <ul className="flex flex-wrap gap-2 pt-1">
                        {m.lessons.map((l) => (
                          <li key={l.slug} className="rounded-full bg-muted px-3 py-1 text-xs">
                            {l.title}
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-start gap-2 rounded-lg bg-brand-violet/10 px-3 py-2 text-sm">
                        <Trophy className="mt-0.5 size-4 shrink-0 text-brand-violet" />
                        <span>
                          <span className="text-muted-foreground">You build: </span>
                          {m.project}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ol>
        </section>

        <section id="projects" className="scroll-mt-20 border-y border-border/60 bg-card/40">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Graduate with a portfolio, not just a certificate</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Each project comes with starter code, an evaluation checklist and a README template. Your GitHub tells the
              story for you.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {projects.map((p) => (
                <Card key={p.title}>
                  <CardContent className="space-y-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-brand-mint/15 text-brand-mint">
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
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Students like you, shipping</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name}>
                <CardContent className="space-y-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-4 fill-brand-marigold text-brand-marigold" />
                    ))}
                  </div>
                  <p className="text-pretty">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-brand-violet to-brand-mint font-semibold text-brand-night">
                      {t.name[0]}
                    </span>
                    <div>
                      <div className="font-medium">{t.name}</div>
                      <div className="text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="pricing" className="scroll-mt-20 border-y border-border/60 bg-card/40">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Student-friendly pricing</h2>
              <p className="mt-3 text-muted-foreground">
                Pay once, keep it forever. Less than one month of coaching fees. UPI, cards and EMI accepted.
              </p>
            </div>
            <div className="mt-12 grid items-start gap-6 lg:grid-cols-3">
              {plans.map((p) => (
                <Card key={p.id} className={cn("relative", p.highlight && "ring-2 ring-primary lg:-mt-4")}>
                  {p.highlight && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most students pick this</Badge>
                  )}
                  <CardContent className="space-y-5 pt-2">
                    <div>
                      <h3 className="text-lg font-semibold">{p.name}</h3>
                      <p className="text-sm text-muted-foreground">{p.tagline}</p>
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-heading text-4xl font-bold">{p.price === 0 ? "Free" : formatINR(p.price)}</span>
                        {p.mrp && <span className="text-muted-foreground line-through">{formatINR(p.mrp)}</span>}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {p.price === 0 ? "Forever. No card needed." : `About ${formatINR(p.price / 12)} a week over 12 weeks`}
                      </p>
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
                          <Check className="mt-0.5 size-4 shrink-0 text-brand-mint" /> {f}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Got a code from your campus ambassador? Use{" "}
              <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">CAMPUS20</span> at checkout
              for 20% off.
            </p>
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-20">
          <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl">Questions students ask us</h2>
          <Accordion className="mt-10">
            {faqs.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger className="text-base">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Still unsure? Email{" "}
            <a href={`mailto:${brand.email}`} className="text-primary hover:underline">
              {brand.email}
            </a>
            . A real person replies.
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-24">
          <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-brand-violet/25 via-brand-mint/10 to-transparent p-10 text-center md:p-16">
            <div className="bg-grid absolute inset-0 -z-10 opacity-60" />
            <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">{brand.slogan}</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Your first AI app is 45 minutes away. Module 1 is free and needs no card. Make your first LLM API call
              today.
            </p>
            <Link href="/learn/how-llms-work" className={cn(buttonVariants({ size: "lg" }), "mt-8 h-12 rounded-xl px-6 text-base")}>
              Start free <ArrowRight />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
