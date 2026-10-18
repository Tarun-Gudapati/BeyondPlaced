export const brand = {
  name: "BeyondPlaced",
  slogan: "Learn AI by building it.",
  tagline: "The friendly AI school for students",
  description:
    "Short, beginner-friendly lessons for Indian college students. Learn LLMs, RAG, agents and fine-tuning by building 6 real projects you can show recruiters. Start free.",
  email: "hello@beyondplaced.com",
  courseName: "AI Engineering Bootcamp",
  colors: [
    { name: "Spark Violet", hex: "#A08BFF", use: "Primary actions, links, focus" },
    { name: "Chalk Mint", hex: "#5FE3C0", use: "Success, progress, free content" },
    { name: "Marigold", hex: "#FFC145", use: "Highlights, streaks, the spark" },
    { name: "Night Class", hex: "#0F1020", use: "Background" },
    { name: "Notebook", hex: "#F5F3FF", use: "Text on dark" },
  ],
  voice: [
    { title: "Friendly, not childish", text: "Talk like a senior who wants you to win. Simple words, no jargon without an explanation." },
    { title: "Build first", text: "Every idea leads to something you run, ship or show. If it can't be built, cut it." },
    { title: "Honest", text: "No fake urgency, no guaranteed-job promises. Real numbers, real projects, real refunds." },
  ],
} as const;
