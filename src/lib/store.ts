"use client";

import { useSyncExternalStore } from "react";
import { allLessons, type PlanId } from "./course";

export type AppState = {
  plan: PlanId;
  name: string;
  email: string;
  completed: string[];
  activeDays: string[];
  purchasedAt?: string;
};

const KEY = "shipai:v1";
const DEFAULTS: AppState = { plan: "free", name: "", email: "", completed: [], activeDays: [] };

const listeners = new Set<() => void>();
let cache: AppState | null = null;

function read(): AppState {
  if (cache) return cache;
  try {
    cache = { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || "{}") };
  } catch {
    cache = DEFAULTS;
  }
  return cache!;
}

function write(next: AppState) {
  cache = next;
  localStorage.setItem(KEY, JSON.stringify(next));
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

const today = () => new Date().toISOString().slice(0, 10);

export const actions = {
  completeLesson(slug: string) {
    const s = read();
    if (s.completed.includes(slug)) return;
    const d = today();
    write({
      ...s,
      completed: [...s.completed, slug],
      activeDays: s.activeDays.includes(d) ? s.activeDays : [...s.activeDays, d],
    });
  },
  purchase(plan: PlanId, name: string, email: string) {
    write({ ...read(), plan, name, email, purchasedAt: new Date().toISOString() });
  },
  reset() {
    write(DEFAULTS);
  },
};

export function streak(days: string[]) {
  const set = new Set(days);
  let count = 0;
  const d = new Date();
  if (!set.has(d.toISOString().slice(0, 10))) d.setDate(d.getDate() - 1);
  while (set.has(d.toISOString().slice(0, 10))) {
    count++;
    d.setDate(d.getDate() - 1);
  }
  return count;
}

export function useAppState() {
  const state = useSyncExternalStore(subscribe, read, () => DEFAULTS);
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const isPaid = state.plan !== "free";
  const canAccess = (slug: string) =>
    isPaid || !!allLessons.find((l) => l.slug === slug)?.free;
  return { state, hydrated, isPaid, canAccess };
}
