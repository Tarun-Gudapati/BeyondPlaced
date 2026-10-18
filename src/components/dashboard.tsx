"use client";

import Link from "next/link";
import { Award, BookOpen, CheckCircle2, Flame, Lock, PartyPopper, PlayCircle, Trophy } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BrandMark, Wordmark } from "@/components/logo";
import { brand } from "@/lib/brand";
import type { OutlineModule } from "@/lib/course";
import type { PlanId } from "@/lib/pricing";
import { cn } from "@/lib/utils";

function encouragement(done: number, total: number, streak: number) {
  if (done === 0) return "Your first lesson takes about 12 minutes. Let's go.";
  if (done === total) return "You finished the whole course. Time to show the world what you built.";
  if (streak >= 3) return `${streak} days in a row. You're building a real habit.`;
  if (done / total >= 0.5) return "You're past halfway. The best projects are just ahead.";
  return `${done} down, ${total - done} to go. Small steps add up.`;
}

function Certificate({ name, date, id, lessons, modules }: { name: string; date: string; id: string; lessons: number; modules: number }) {
  return (
    <div className="relative overflow-hidden rounded-xl border-2 border-primary/50 bg-gradient-to-br from-card to-primary/10 p-8 text-center">
      <div className="flex items-center justify-center gap-2">
        <BrandMark />
        <Wordmark />
      </div>
      <div className="mt-4 font-mono text-xs tracking-widest text-muted-foreground uppercase">Certificate of completion</div>
      <div className="mt-4 font-heading text-3xl font-bold">{name}</div>
      <p className="mt-3 text-sm text-muted-foreground">
        has completed all {lessons} lessons and {modules} projects of the
      </p>
      <div className="mt-1 font-semibold">
        {brand.name} {brand.courseName}
      </div>
      <p className="mt-2 text-xs text-muted-foreground italic">{brand.slogan}</p>
      <div className="mt-6 flex justify-between text-xs text-muted-foreground">
        <span>{new Date(date).toLocaleDateString("en-IN", { dateStyle: "long" })}</span>
        <span className="font-mono">ID: {id}</span>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 space-y-4 px-4 py-10">
      <div className="h-10 w-64 animate-pulse rounded bg-muted" />
      <div className="grid gap-4 md:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-xl bg-muted" />
    </main>
  );
}

export function Dashboard({
  user,
  welcome,
  outline,
  stats,
  next,
  certificateDate,
  certificateId,
}: {
  user: { name: string; plan: PlanId };
  welcome: boolean;
  outline: OutlineModule[];
  stats: { done: number; total: number; minutesDone: number; minutesTotal: number; streak: number };
  next: { slug: string; locked: boolean } | null;
  certificateDate: string | null;
  certificateId: string;
}) {
  const isPaid = user.plan !== "free";
  const pct = Math.round((stats.done / stats.total) * 100);
  const firstName = user.name.split(" ")[0];

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 space-y-8 px-4 py-10">
      {welcome && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm">
          <PartyPopper className="size-5 shrink-0 text-emerald-400" />
          <span>Payment successful. All {outline.length} modules are unlocked — let&apos;s build.</span>
        </div>
      )}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {firstName}</h1>
          <p className="mt-1 text-muted-foreground">{encouragement(stats.done, stats.total, stats.streak)}</p>
        </div>
        {next && (
          <Link
            href={next.locked ? "/checkout?plan=pro" : `/learn/${next.slug}`}
            className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}
          >
            {next.locked ? <Lock /> : <PlayCircle />}
            {next.locked ? "Unlock Module 2" : stats.done === 0 ? "Start first lesson" : "Continue learning"}
          </Link>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              Course progress <Trophy className="size-4" />
            </div>
            <div className="text-3xl font-bold">{pct}%</div>
            <Progress value={pct} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              Lessons done <CheckCircle2 className="size-4" />
            </div>
            <div className="text-3xl font-bold">
              {stats.done}
              <span className="text-lg text-muted-foreground">/{stats.total}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              Day streak <Flame className="size-4 text-primary" />
            </div>
            <div className="text-3xl font-bold">{stats.streak}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              Time invested <BookOpen className="size-4" />
            </div>
            <div className="text-3xl font-bold">
              {stats.minutesDone}
              <span className="text-lg text-muted-foreground">/{stats.minutesTotal} min</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {!isPaid && (
        <Card className="ring-2 ring-primary/40">
          <CardContent className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="font-semibold">You&apos;re on the free Starter plan</h2>
              <p className="text-sm text-muted-foreground">
                Upgrade to unlock RAG, agents, fine-tuning, production deployment and your certificate.
              </p>
            </div>
            <Link href="/checkout?plan=pro" className={buttonVariants({ size: "lg" })}>
              Upgrade for ₹2,999
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Modules</h2>
          {outline.map((m, i) => {
            const mDone = m.lessons.filter((l) => l.done).length;
            const locked = m.lessons[0].locked;
            const firstOpen = m.lessons.find((l) => !l.done) ?? m.lessons[0];
            return (
              <Card key={m.id} className={cn(locked && "opacity-70")}>
                <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="grid size-11 shrink-0 place-items-center rounded-lg bg-muted font-mono text-sm">
                    {mDone === m.lessons.length ? <CheckCircle2 className="size-5 text-emerald-400" /> : `0${i + 1}`}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{m.title}</h3>
                      {locked && (
                        <Badge variant="outline" className="gap-1">
                          <Lock className="size-3" /> Pro
                        </Badge>
                      )}
                    </div>
                    <p className="truncate text-sm text-muted-foreground">Project: {m.project}</p>
                    <Progress value={(mDone / m.lessons.length) * 100} className="max-w-xs" />
                  </div>
                  <Link
                    href={locked ? "/checkout?plan=pro" : `/learn/${firstOpen.slug}`}
                    className={buttonVariants({ variant: locked ? "outline" : "secondary" })}
                  >
                    {locked ? "Unlock" : mDone === m.lessons.length ? "Review" : mDone ? "Resume" : "Start"}
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Certificate</h2>
          <Card>
            <CardContent className="space-y-4">
              {certificateDate && isPaid ? (
                <>
                  <p className="text-sm text-muted-foreground">You did it. Share this on LinkedIn and tag us.</p>
                  <Dialog>
                    <DialogTrigger className={cn(buttonVariants(), "w-full")}>
                      <Award /> View certificate
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-xl">
                      <DialogTitle className="sr-only">Your certificate</DialogTitle>
                      <Certificate
                        name={user.name}
                        date={certificateDate}
                        id={certificateId}
                        lessons={stats.total}
                        modules={outline.length}
                      />
                    </DialogContent>
                  </Dialog>
                </>
              ) : (
                <div className="grid place-items-center rounded-lg border border-dashed py-8 text-center">
                  <Award className="size-8 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    {isPaid ? `${stats.total - stats.done} lessons to go` : "Available on Pro and Placement Pro"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
