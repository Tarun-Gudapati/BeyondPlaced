import type { Module } from "@/lib/course";

export const m6: Module = {
  id: "m6",
  title: "Ship to Production & Get Hired",
  outcome: "Deploy real AI products and turn them into interview calls.",
  project: "Deployed AI SaaS with streaming UI, auth and usage limits",
  lessons: [
    {
      slug: "fastapi-streaming",
      title: "FastAPI backend with streaming responses",
      minutes: 18,
      summary: "Stream tokens to the browser like ChatGPT does.",
      blocks: [
        {
          type: "diagram",
          id: "fastapi-stream",
          caption: "Tokens leave the model and appear in the UI as they generate.",
        },
        {
          type: "code",
          lang: "python",
          code: 'from fastapi import FastAPI\nfrom fastapi.responses import StreamingResponse\n\napp = FastAPI()\n\n@app.post("/chat")\ndef chat(q: str):\n    def gen():\n        for chunk in client.chat.completions.create(model=M, messages=[...], stream=True):\n            yield chunk.choices[0].delta.content or ""\n    return StreamingResponse(gen(), media_type="text/plain")',
        },
      ],
      quiz: {
        question: "Why stream LLM responses?",
        options: [
          "It is cheaper per token",
          "Users see output immediately, so perceived latency drops",
          "It improves accuracy",
          "It is required by FastAPI",
        ],
        answer: 1,
        explanation: "Streaming improves perceived speed; total time is similar.",
      },
      task: "Wrap your RAG bot in a FastAPI streaming endpoint.",
    },
    {
      slug: "cost-latency",
      title: "Cost, latency and caching",
      minutes: 12,
      summary: "Keep your AI app profitable at scale.",
      blocks: [
        {
          type: "diagram",
          id: "cost-cache",
          caption: "Cache hits skip the model — that is free latency and free cost.",
        },
        {
          type: "list",
          items: [
            "Route easy queries to small models, hard ones to big models.",
            "Cache identical prompts — many users ask the same thing.",
            "Log tokens per request and set per-user daily limits.",
          ],
        },
      ],
      quiz: {
        question: "Cheapest way to handle 1,000 users asking the same FAQ?",
        options: ["Use the largest model", "Cache the response", "Raise max_tokens", "Disable streaming"],
        answer: 1,
        explanation: "A cache hit costs nothing.",
      },
      task: "Add a Redis or in-memory cache and measure cost savings.",
    },
    {
      slug: "portfolio-interviews",
      title: "Portfolio, resume and AI interview prep",
      minutes: 20,
      summary: "Turn 6 projects into interview calls.",
      blocks: [
        {
          type: "p",
          text: "Pin your 3 strongest projects on GitHub. Each README needs: a demo GIF, architecture diagram, eval metrics, and cost per request. Write resume bullets as impact: \"Built RAG bot over 1,200 docs with 87% hit rate@4 at ₹0.04/query\".",
        },
        {
          type: "diagram",
          id: "portfolio",
          caption: "Demo + architecture + metrics + resume bullets — the proof stack.",
        },
        {
          type: "list",
          items: [
            "Top asked: explain RAG end to end, how you'd reduce hallucinations, when to fine-tune.",
            "System design: design a support bot for 1 lakh daily users.",
            "Always quote numbers from your own projects.",
          ],
        },
      ],
      quiz: {
        question: "Which resume bullet is strongest?",
        options: [
          "Worked on AI chatbot",
          "Familiar with LangChain",
          "Built RAG bot over 1,200 docs, 87% hit rate@4, ₹0.04/query",
          "Passionate about AI",
        ],
        answer: 2,
        explanation: "Specific scope, metric and cost show engineering ownership.",
      },
      task: "Deploy your capstone and rewrite your resume with 3 metric-driven AI bullets.",
    },
  ],
};
