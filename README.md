# ShipAI — AI Engineering Bootcamp

A sellable course platform (LMS) that teaches Indian students and freshers to become AI engineers by building 6 portfolio projects: LLM basics, embeddings, RAG, agents, fine-tuning and deployment.

## What's inside

- **Sales page** (`/`): hero, curriculum, projects, testimonials, rupee pricing, FAQ.
- **Lesson player** (`/learn/[slug]`): 18 lessons with code, tips, a build task, and a quiz that must be passed to mark the lesson complete. Module 1 is free and the rest sits behind a paywall.
- **Checkout** (`/checkout?plan=pro|placement`): plan switcher, coupon codes (`CAMPUS20`, `EARLY40`), GST breakdown and Indian mobile validation. It runs in **demo mode**, so no money is charged.
- **Dashboard** (`/dashboard`): progress, day streak, time spent, module status and a completion certificate.

Progress and the purchased plan are stored in the browser (`localStorage`). There is no backend or account system yet.

## Run locally

```bash
npm install
npm run dev -- -p 4317
```

Open http://localhost:4317.

## Edit the course

All course content, plans, prices and coupons are in `src/lib/course.ts`.

## Going live (next steps)

1. **Payments**: replace the simulated `pay()` in `src/components/checkout-form.tsx` with Razorpay Checkout plus a server route that verifies the payment signature.
2. **Accounts**: add auth (for example Supabase or Clerk) and move progress from `localStorage` into a database so it follows the student across devices.
3. **Paywall on the server**: right now locked lessons are only hidden in the browser. Check the paid plan on the server before sending paid content.
4. **Video**: add a video URL to each lesson and embed it (Bunny Stream or Vimeo).

## Stack

Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui (Base UI), lucide icons, sonner toasts.
