"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  Hammer,
  LifeBuoy,
  Lightbulb,
  ListTree,
  Loader2,
  Lock,
  XCircle,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { submitQuiz } from "@/app/actions/progress";
import { brand } from "@/lib/brand";
import type { Block, OutlineModule } from "@/lib/course";
import { formatINR, getPlan } from "@/lib/pricing";
import { cn } from "@/lib/utils";

type LessonMeta = {
  slug: string;
  title: string;
  minutes: number;
  free: boolean;
  summary: string;
  moduleTitle: string;
  index: number;
  total: number;
};

type LessonContent = {
  blocks: Block[];
  task: string;
  quiz: { question: string; options: string[] };
};

type NavLesson = { slug: string; title: string } | null;

function Outline({ outline, current, onNavigate }: { outline: OutlineModule[]; current: string; onNavigate?: () => void }) {
  return (
    <nav className="space-y-6 text-sm">
      {outline.map((m, i) => (
        <div key={m.id}>
          <div className="mb-2 px-2 font-mono text-xs text-muted-foreground uppercase">
            Module {i + 1} · {m.title}
          </div>
          <ul className="space-y-0.5">
            {m.lessons.map((l) => (
              <li key={l.slug}>
                <Link
                  href={`/learn/${l.slug}`}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-start gap-2 rounded-md px-2 py-1.5 hover:bg-muted",
                    current === l.slug ? "bg-muted font-medium text-foreground" : "text-muted-foreground",
                  )}
                >
                  {l.done ? (
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                  ) : l.locked ? (
                    <Lock className="mt-0.5 size-4 shrink-0" />
                  ) : (
                    <Circle className="mt-0.5 size-4 shrink-0" />
                  )}
                  <span className="leading-snug">{l.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function RenderBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return <p className="leading-7 text-foreground/90">{block.text}</p>;
    case "h":
      return <h2 className="pt-2 text-xl font-semibold">{block.text}</h2>;
    case "list":
      return (
        <ul className="list-disc space-y-2 pl-5 leading-7 text-foreground/90 marker:text-primary">
          {block.items.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ul>
      );
    case "code":
      return (
        <div className="overflow-hidden rounded-lg border bg-black/40">
          <div className="border-b px-4 py-1.5 font-mono text-xs text-muted-foreground">{block.lang}</div>
          <pre className="overflow-x-auto p-4 text-[13px] leading-6">
            <code className="font-mono">{block.code}</code>
          </pre>
        </div>
      );
    case "tip":
      return (
        <div className="flex gap-3 rounded-lg border border-primary/30 bg-primary/10 p-4 text-sm leading-6">
          <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" />
          <p>{block.text}</p>
        </div>
      );
  }
}

type Feedback = { kind: "correct"; text: string } | { kind: "wrong" } | null;

function QuizCard({ slug, quiz, done, loggedIn }: { slug: string; quiz: LessonContent["quiz"]; done: boolean; loggedIn: boolean }) {
  const [choice, setChoice] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [pending, startTransition] = useTransition();

  function submit() {
    startTransition(async () => {
      const res = await submitQuiz(slug, Number(choice));
      if (res.status === "correct") {
        setFeedback({ kind: "correct", text: res.explanation });
        toast.success("Lesson complete!", { description: "Progress saved. Keep the streak going." });
      } else if (res.status === "wrong") {
        setFeedback({ kind: "wrong" });
      } else if (res.status === "login") {
        toast.error("Create a free account to save your progress.");
      } else {
        toast.error("This lesson is part of Pro.");
      }
    });
  }

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Check your understanding</h3>
          {done && <Badge className="bg-emerald-500/15 text-emerald-400">Completed</Badge>}
        </div>
        <p>{quiz.question}</p>
        <RadioGroup
          value={choice}
          onValueChange={(v) => {
            setChoice(String(v));
            setFeedback(null);
          }}
        >
          {quiz.options.map((o, i) => (
            <label
              key={o}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition-colors hover:bg-muted/50",
                choice === String(i) && "border-primary/60 bg-primary/5",
                choice === String(i) && feedback?.kind === "correct" && "border-emerald-500/60 bg-emerald-500/10",
              )}
            >
              <RadioGroupItem value={String(i)} />
              {o}
            </label>
          ))}
        </RadioGroup>
        {feedback && (
          <div
            className={cn(
              "flex gap-2 rounded-lg p-3 text-sm",
              feedback.kind === "correct" ? "bg-emerald-500/10 text-emerald-300" : "bg-destructive/10 text-red-300",
            )}
          >
            {feedback.kind === "correct" ? <CheckCircle2 className="size-4 shrink-0" /> : <XCircle className="size-4 shrink-0" />}
            <span>{feedback.kind === "correct" ? feedback.text : "Not quite, and that's fine. Wrong answers are how learning works. Re-read the section above and try again."}</span>
          </div>
        )}
        {loggedIn ? (
          <Button onClick={submit} disabled={choice === "" || pending} size="lg" className="h-10">
            {pending && <Loader2 className="animate-spin" />} Submit answer
          </Button>
        ) : (
          <div className="flex flex-col gap-3 rounded-lg bg-muted/60 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">Create a free account to submit answers and save your progress.</p>
            <Link href={`/signup?next=${encodeURIComponent(`/learn/${slug}`)}`} className={buttonVariants()}>
              Sign up free
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Paywall({ loggedIn }: { loggedIn: boolean }) {
  const pro = getPlan("pro");
  const checkout = "/checkout?plan=pro";
  return (
    <Card className="ring-2 ring-primary/50">
      <CardContent className="space-y-5 py-4 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-primary/15 text-primary">
          <Lock className="size-5" />
        </span>
        <div>
          <h2 className="text-2xl font-bold">This lesson is part of Pro</h2>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            Unlock all 18 lessons, 6 portfolio projects and your certificate. One-time payment, lifetime access.
          </p>
        </div>
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-3xl font-bold">{formatINR(pro.price)}</span>
          <span className="text-muted-foreground line-through">{formatINR(pro.mrp!)}</span>
        </div>
        <div className="flex flex-col justify-center gap-2 sm:flex-row">
          <Link
            href={loggedIn ? checkout : `/signup?next=${encodeURIComponent(checkout)}`}
            className={cn(buttonVariants({ size: "lg" }), "h-10 px-5")}
          >
            Unlock Pro
          </Link>
          <Link href="/#pricing" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-10 px-5")}>
            Compare plans
          </Link>
        </div>
        <p className="text-xs text-muted-foreground">7-day no-questions refund · UPI, cards, EMI</p>
      </CardContent>
    </Card>
  );
}

export function LessonSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="h-14 border-b" />
      <div className="mx-auto w-full max-w-3xl space-y-4 px-4 py-10">
        <div className="h-4 w-48 animate-pulse rounded bg-muted" />
        <div className="h-10 w-3/4 animate-pulse rounded bg-muted" />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-5 animate-pulse rounded bg-muted" />
        ))}
      </div>
    </div>
  );
}

export function LessonView({
  outline,
  lesson,
  content,
  prev,
  next,
  done,
  loggedIn,
  progressPct,
}: {
  outline: OutlineModule[];
  lesson: LessonMeta;
  content: LessonContent | null;
  prev: NavLesson;
  next: NavLesson;
  done: boolean;
  loggedIn: boolean;
  progressPct: number;
}) {
  const [outlineOpen, setOutlineOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="flex h-14 items-center gap-3 px-4">
          <Sheet open={outlineOpen} onOpenChange={setOutlineOpen}>
            <SheetTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "lg:hidden")} aria-label="Course outline">
              <ListTree />
            </SheetTrigger>
            <SheetContent side="left" className="overflow-y-auto p-4">
              <SheetTitle className="mb-4">Course outline</SheetTitle>
              <Outline outline={outline} current={lesson.slug} onNavigate={() => setOutlineOpen(false)} />
            </SheetContent>
          </Sheet>
          <Logo />
          <div className="ml-auto flex items-center gap-3">
            {loggedIn && (
              <div className="hidden w-40 items-center gap-2 sm:flex">
                <Progress value={progressPct} className="flex-1" />
                <span className="text-xs text-muted-foreground tabular-nums">{progressPct}%</span>
              </div>
            )}
            <Link href={loggedIn ? "/dashboard" : "/login"} className={buttonVariants({ variant: "outline" })}>
              {loggedIn ? "Dashboard" : "Log in"}
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-80 shrink-0 overflow-y-auto border-r p-4 lg:block">
          <Outline outline={outline} current={lesson.slug} />
        </aside>

        <main className="min-w-0 flex-1">
          <article className="mx-auto max-w-3xl space-y-6 px-4 py-10 md:px-8">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span>{lesson.moduleTitle}</span>
                <span>·</span>
                <span>
                  Lesson {lesson.index + 1} of {lesson.total}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3.5" /> {lesson.minutes} min
                </span>
                {lesson.free && <Badge className="bg-emerald-500/15 text-emerald-400">Free</Badge>}
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">{lesson.title}</h1>
              <p className="text-lg text-muted-foreground">{lesson.summary}</p>
            </div>

            {content ? (
              <>
                <div className="space-y-5">
                  {content.blocks.map((b, i) => (
                    <RenderBlock key={i} block={b} />
                  ))}
                </div>
                <div className="flex gap-3 rounded-lg border bg-card p-4">
                  <Hammer className="mt-0.5 size-5 shrink-0 text-primary" />
                  <div>
                    <div className="font-semibold">Build task</div>
                    <p className="text-sm text-muted-foreground">{content.task}</p>
                  </div>
                </div>
                <QuizCard key={lesson.slug} slug={lesson.slug} quiz={content.quiz} done={done} loggedIn={loggedIn} />
                <div className="flex gap-3 rounded-lg border border-dashed p-4 text-sm">
                  <LifeBuoy className="mt-0.5 size-5 shrink-0 text-brand-mint" />
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Stuck? That&apos;s normal.</span> Ask in the community
                    Discord or email{" "}
                    <a href={`mailto:${brand.email}`} className="text-primary hover:underline">
                      {brand.email}
                    </a>
                    . No question is too basic.
                  </p>
                </div>
              </>
            ) : (
              <Paywall loggedIn={loggedIn} />
            )}

            <div className="flex items-center justify-between gap-3 border-t pt-6">
              {prev ? (
                <Link href={`/learn/${prev.slug}`} className={cn(buttonVariants({ variant: "ghost" }), "max-w-[45%]")}>
                  <ArrowLeft /> <span className="truncate">{prev.title}</span>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link
                  href={`/learn/${next.slug}`}
                  className={cn(buttonVariants({ variant: done ? "default" : "outline" }), "max-w-[55%]")}
                >
                  <span className="truncate">Next: {next.title}</span> <ArrowRight />
                </Link>
              ) : (
                <Link href="/dashboard" className={buttonVariants()}>
                  Finish course <ArrowRight />
                </Link>
              )}
            </div>
          </article>
        </main>
      </div>
    </div>
  );
}
