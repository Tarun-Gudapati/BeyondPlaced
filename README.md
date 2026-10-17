# ShipAI — AI Engineering Bootcamp

A sellable course platform (LMS) that teaches Indian students and freshers to become AI engineers by building 6 portfolio projects: LLM basics, embeddings, RAG, agents, fine-tuning and deployment.

## Features

- **Sales page** (`/`): curriculum, projects, rupee pricing and FAQ.
- **Accounts** (`/signup`, `/login`): email + password (bcrypt hashing) with signed, http-only session cookies.
- **Lesson player** (`/learn/[slug]`): 18 lessons. Module 1 is free. Paid lessons and all quiz answers stay on the server and are only sent to users who are entitled to them.
- **Progress tracking**: passing a lesson's quiz saves it to the database. The dashboard shows progress, day streak, time spent and a certificate once everything is done.
- **Payments** (`/checkout`): Razorpay Checkout with server-side order creation, signature verification and a webhook backup. Coupons (`CAMPUS20`, `EARLY40`) are validated on the server.
- **Test mode**: with no Razorpay keys, checkout shows a clearly-labelled simulated payment window (success/failure) so the full flow can be tested without an account.

## Run locally

```bash
npm install
cp .env.example .env.local   # optional; everything works with it empty
npm run dev -- -p 4317
```

Open http://localhost:4317. With no `DATABASE_URL`, data is stored in an embedded Postgres in `.data/`.

## Environment variables

| Variable | Needed for |
| --- | --- |
| `AUTH_SECRET` | Signing sessions. **Required in production**, otherwise a public dev secret is used. |
| `DATABASE_URL` | Permanent storage. Without it, Vercel uses a temporary database that resets on cold starts. |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | Real payments. Without them, checkout runs in test mode. |
| `RAZORPAY_WEBHOOK_SECRET` | Confirming payments even if the student closes the tab. |

## Deploy to Vercel

1. Import the GitHub repo in Vercel (framework: Next.js; no build settings to change).
2. Add `AUTH_SECRET` (`openssl rand -base64 32`).
3. Vercel → Storage → create a **Neon** Postgres database and connect it to the project. This sets `DATABASE_URL` automatically. Tables are created on first request.
4. Once you have a Razorpay account, add the keys (test keys first, `rzp_test_...`), then live keys after KYC. Add a webhook pointing to `https://<your-domain>/api/razorpay/webhook`.
5. Redeploy.

## Edit the course

Lessons, quizzes and modules are in `src/lib/course.ts`. Plans and prices are in `src/lib/pricing.ts`, and coupons are in `src/lib/coupons.ts`.

## Stack

Next.js 16 (App Router, Server Actions, Cache Components), TypeScript, Tailwind CSS v4, shadcn/ui (Base UI), Drizzle ORM with Postgres / PGlite, jose, bcryptjs, Razorpay.
