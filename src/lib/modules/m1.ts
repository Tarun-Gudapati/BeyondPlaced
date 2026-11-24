import type { Module } from "@/lib/course";

export const m1: Module = {
  id: "m1",
  title: "LLM Foundations",
  outcome: "Understand what an LLM really does and call one from Python with confidence.",
  project: "CLI study buddy that explains any concept at three difficulty levels",
  lessons: [
    {
      slug: "how-llms-work",
      title: "How LLMs actually work (without the maths panic)",
      minutes: 12,
      free: true,
      summary: "Tokens, context windows, temperature and why models hallucinate.",
      blocks: [
        {
          type: "video",
          src: "/videos/how-llms-work.mp4",
          poster: "/videos/how-llms-work.jpg",
          captions: "/videos/how-llms-work.vtt",
          title: "How LLMs actually work, in 100 seconds",
        },
        {
          type: "p",
          text: "A large language model is a next-token predictor. You give it a sequence of tokens and it returns a probability distribution over what token comes next. Everything else — chat, coding, reasoning — is built on top of that one trick repeated thousands of times.",
        },
        {
          type: "diagram",
          id: "llm-tokens",
          caption: "One prediction step. Chat apps repeat this until the model stops.",
        },
        { type: "h", text: "Tokens, not words" },
        {
          type: "p",
          text: "Models read text as tokens: chunks of roughly 3–4 English characters. \"Bengaluru\" might be 3 tokens. You pay per token, and every model has a maximum context window (e.g. 128k tokens) that holds your prompt and its answer together.",
        },
        {
          type: "list",
          items: [
            "Temperature controls randomness. 0 = most likely token every time, ~0.7 = creative.",
            "The model has no memory between calls. Chat apps resend the whole conversation each time.",
            "Hallucinations happen because the model optimises for plausible text, not true text.",
          ],
        },
        {
          type: "tip",
          text: "Interview gold: \"An LLM is stateless; memory is an application-level concern.\" Say this and you already sound like an engineer, not a user.",
        },
      ],
      quiz: {
        question: "Why does a chatbot \"remember\" what you said three messages ago?",
        options: [
          "The model stores your messages in its weights",
          "The app resends the previous messages as part of every new request",
          "The GPU keeps a cache of each user forever",
          "Temperature is set to 0",
        ],
        answer: 1,
        explanation: "LLMs are stateless. The application sends the conversation history in the context window on every call.",
      },
      task: "Paste the same question into any chatbot with temperature-like settings (or ask it twice). Note how answers differ and write 3 lines on why.",
    },
    {
      slug: "first-api-call",
      title: "Your first LLM API call in Python",
      minutes: 15,
      free: true,
      summary: "Set up a virtual env, store keys safely and get a response in 10 lines.",
      blocks: [
        {
          type: "p",
          text: "Every serious AI product starts with an API call. We will use the OpenAI Python SDK, but the same pattern works for Gemini, Claude, Groq or a local model via an OpenAI-compatible endpoint.",
        },
        {
          type: "diagram",
          id: "api-call",
          caption: "Your code talks to a hosted model over HTTPS and gets text + usage back.",
        },
        {
          type: "code",
          lang: "bash",
          code: "python -m venv .venv && source .venv/bin/activate\npip install openai python-dotenv\necho 'OPENAI_API_KEY=sk-...' > .env",
        },
        {
          type: "code",
          lang: "python",
          code: 'from dotenv import load_dotenv\nfrom openai import OpenAI\n\nload_dotenv()\nclient = OpenAI()\n\nresp = client.chat.completions.create(\n    model="gpt-4o-mini",\n    temperature=0.3,\n    messages=[\n        {"role": "system", "content": "You are a patient DSA tutor."},\n        {"role": "user", "content": "Explain binary search like I am in 2nd year."},\n    ],\n)\nprint(resp.choices[0].message.content)\nprint("tokens used:", resp.usage.total_tokens)',
        },
        {
          type: "tip",
          text: "Never commit your .env. Add it to .gitignore before your first commit — leaked keys on GitHub get abused within minutes.",
        },
      ],
      quiz: {
        question: "Where should your API key live in a project you push to GitHub?",
        options: [
          "Hard-coded at the top of main.py",
          "In README.md so teammates can find it",
          "In a .env file that is listed in .gitignore",
          "In a public Gist",
        ],
        answer: 2,
        explanation: "Load secrets from environment variables and keep .env out of version control.",
      },
      task: "Build the module project: a CLI that takes a topic and prints a beginner, intermediate and expert explanation.",
    },
    {
      slug: "prompt-engineering",
      title: "Prompt engineering that survives production",
      minutes: 18,
      free: true,
      summary: "System prompts, few-shot examples and forcing structured JSON output.",
      blocks: [
        {
          type: "p",
          text: "Good prompts are specifications. Tell the model its role, the exact task, the constraints, and the output format. Then show one or two examples. This is called few-shot prompting and it beats clever wording every time.",
        },
        {
          type: "diagram",
          id: "prompt-anatomy",
          caption: "Role + constraints + delimited user input → validated JSON.",
        },
        {
          type: "code",
          lang: "python",
          code: 'resp = client.chat.completions.create(\n    model="gpt-4o-mini",\n    response_format={"type": "json_object"},\n    messages=[\n        {"role": "system", "content": (\n            "Extract job details. Reply ONLY with JSON: "\n            "{\\"role\\": str, \\"skills\\": [str], \\"ctc_lpa\\": number|null}"\n        )},\n        {"role": "user", "content": jd_text},\n    ],\n)\ndata = json.loads(resp.choices[0].message.content)',
        },
        {
          type: "list",
          items: [
            "Put rules in the system prompt, data in the user message.",
            "Ask for JSON and validate it with Pydantic — never trust raw model output.",
            "Version your prompts in code like any other logic.",
          ],
        },
      ],
      quiz: {
        question: "What is the most reliable way to get machine-readable output from an LLM?",
        options: [
          "Ask nicely and hope",
          "Use JSON mode / structured outputs and validate with a schema",
          "Increase temperature to 1.5",
          "Use a longer prompt",
        ],
        answer: 1,
        explanation: "Structured output modes plus schema validation (e.g. Pydantic) make responses safe to use in code.",
      },
      task: "Write a prompt that turns any job description into JSON with role, skills and CTC. Test it on 3 real JDs from LinkedIn.",
    },
  ],
};
