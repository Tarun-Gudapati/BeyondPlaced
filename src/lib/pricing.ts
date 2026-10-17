export type PlanId = "free" | "pro" | "placement";

export const PLAN_RANK: Record<PlanId, number> = { free: 0, pro: 1, placement: 2 };

export const plans: {
  id: PlanId;
  name: string;
  price: number;
  mrp?: number;
  tagline: string;
  features: string[];
  highlight?: boolean;
}[] = [
  {
    id: "free",
    name: "Starter",
    price: 0,
    tagline: "Try before you pay",
    features: ["Module 1: LLM Foundations", "3 lessons + quizzes", "Community Discord"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 2999,
    mrp: 9999,
    tagline: "Everything to become job-ready",
    features: [
      "All 6 modules, 18 lessons",
      "6 portfolio projects with starter code",
      "Lifetime access + all future updates",
      "Verified completion certificate",
      "Community Discord + weekly live doubt sessions",
    ],
    highlight: true,
  },
  {
    id: "placement",
    name: "Placement Pro",
    price: 7999,
    mrp: 19999,
    tagline: "For final-years who want offers",
    features: [
      "Everything in Pro",
      "1:1 project code review by an AI engineer",
      "2 mock AI interviews with feedback",
      "Resume + LinkedIn rewrite",
      "Referral network to hiring startups",
    ],
  },
];

export const GST_RATE = 0.18;

export function getPlan(id: PlanId) {
  return plans.find((p) => p.id === id)!;
}

export function formatINR(n: number) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}
