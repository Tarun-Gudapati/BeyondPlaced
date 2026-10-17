"use client";

import Link from "next/link";
import { Award, BookOpen, CheckCircle2, Flame, Lock, PartyPopper, PlayCircle, RotateCcw, Trophy } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { allLessons, COURSE_NAME, modules, totalMinutes } from "@/lib/course";
import { actions, streak, useAppState } from "@/lib/store";
import { cn } from "@/lib/utils";

function Certificate({ name }: { name: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl border-2 border-primary/50 bg-gradient-to-br from-card to-primary/10 p-8 text-center">
      <Award className="mx-auto size-10 text-primary" />
      <div className="mt-3 font-mono text-xs tracking-widest text-muted-foreground uppercase">Certificate of completion</div>
      <div className="mt-4 text-3xl font-bold">{name || "ShipAI Graduate"}</div>
      <p className="mt-3 text-sm text-muted-foreground">
        has completed all {allLessons.length} lessons and {modules.length} projects of the
      </p>
      <div className="mt-1 font-semibold">{COURSE_NAME}</div>
      <div className="mt-6 flex justify-between text-xs text-muted-foreground">
        <span>{new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}</span>
        <span className="font-mono">ID: SHIP-{(name || "grad").length.toString(16).toUpperCase()}{allLessons.length}26</span>
      </div>
    </div>
  );
}

export function Dashboard({ welcome }: { welcome: boolean }) {
  const { state, hydrated, isPaid, canAccess } = useAppState();

  if (!hydrated) {
    return (
      <main className="mx-auto w-full max-w-6xl flex-1 space-y-4 px-4 py-10">
        <div className="h-10 w-64 animate-pulse rounded bg-muted" />
        <div className="grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </main>
    );
  }

  const done = state.completed.length;
  const pct = Math.round((done / allLessons.length) * 100);
  const nextLesson = allLessons.find((l) => !state.completed.includes(l.slug)) ?? null;
  const nextLocked = nextLesson ? !canAccess(nextLesson.slug) : false;
  const minutesDone = allLessons.filter((l) => state.completed.includes(l.slug)).reduce((s, l) => s + l.minutes, 0);
  const days = streak(state.activeDays);
  const finished = done === allLessons.length;
  const firstName = state.name.split(" ")[0];

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 space-y-8 px-4 py-10">
      {welcome && isPaid && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm">
          <PartyPopper className="size-5 shrink-0 text-emerald-400" />
          <span>Payment successful. All {modules.length} modules are unlocked — let&apos;s build.</span>
        </div>
      )}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{firstName ? `Welcome back, ${firstName}` : "Your learning"}</h1>
          <p className="mt-1 text-muted-foreground">{COURSE_NAME}</p>
        </div>
        {nextLesson && (
          <Link
            href={nextLocked ? "/checkout?plan=pro" : `/learn/${nextLesson.slug}`}
            className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}
          >
            {nextLocked ? <Lock /> : <PlayCircle />}
            {nextLocked ? "Unlock Module 2" : done === 0 ? "Start first lesson" : "Continue learning"}
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
              {done}
              <span className="text-lg text-muted-foreground">/{allLessons.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              Day streak <Flame className="size-4 text-primary" />
            </div>
            <div className="text-3xl font-bold">{days}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              Time invested <BookOpen className="size-4" />
            </div>
            <div className="text-3xl font-bold">
              {minutesDone}
              <span className="text-lg text-muted-foreground">/{totalMinutes} min</span>
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
          {modules.map((m, i) => {
            const mDone = m.lessons.filter((l) => state.completed.includes(l.slug)).length;
            const locked = !canAccess(m.lessons[0].slug);
            const firstOpen = m.lessons.find((l) => !state.completed.includes(l.slug)) ?? m.lessons[0];
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
              {finished && isPaid ? (
                <>
                  <p className="text-sm text-muted-foreground">You did it. Share this on LinkedIn and tag us.</p>
                  <Dialog>
                    <DialogTrigger className={cn(buttonVariants(), "w-full")}>
                      <Award /> View certificate
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-xl">
                      <DialogTitle className="sr-only">Your certificate</DialogTitle>
                      <Certificate name={state.name} />
                    </DialogContent>
                  </Dialog>
                </>
              ) : (
                <>
                  <div className="grid place-items-center rounded-lg border border-dashed py-8 text-center">
                    <Award className="size-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      {isPaid
                        ? `${allLessons.length - done} lessons to go`
                        : "Available on Pro and Placement Pro"}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          {(done > 0 || isPaid) && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => {
                if (confirm("Reset all progress and plan on this device?")) actions.reset();
              }}
            >
              <RotateCcw /> Reset demo data
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
