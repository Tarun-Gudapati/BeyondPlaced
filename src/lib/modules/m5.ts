import type { Module } from "@/lib/course";

export const m5: Module = {
  id: "m5",
  title: "Open Models & Fine-tuning",
  outcome: "Run models locally and know exactly when fine-tuning is worth it.",
  project: "Fine-tuned Hinglish customer-support model",
  lessons: [
    {
      slug: "local-models",
      title: "Running Llama & Qwen locally with Ollama",
      minutes: 35,
      summary:
        "Run open models on your own laptop with Ollama, call them with the SDK you already know, and learn exactly what you trade for free, private inference.",
      blocks: [
        {
          type: "video",
          src: "supabase:local-models/local-models.mp4",
          poster: "supabase:local-models/local-models.jpg",
          captions: "supabase:local-models/local-models.vtt",
          title: "Running models locally with Ollama, in 84 seconds",
        },
        {
          type: "p",
          text: "Every call you have made so far went to someone else's computer: your text travelled to a data centre, a huge model answered, and you paid per token. An open model is different. Its weights are a file you can download, so the whole model can run on your own laptop. No API key, no bill, no internet, and nothing you type leaves the machine. That is exactly what you want at 2 a.m. in a hackathon when the free credits are over, or when the data is your classmates' resumes.",
        },
        {
          type: "p",
          text: "The catch is honest and simple: your laptop is not a data centre. You will run smaller models, they will be slower, and they will make more mistakes than gpt-4o-mini on hard questions. This lesson shows you how to set it up in ten minutes, how to pick a model that fits your RAM, and how to keep one codebase that can talk to both local and hosted models.",
        },
        {
          type: "diagram",
          id: "ollama",
          caption: "Same SDK pattern — point base_url at localhost:11434.",
        },
        { type: "h", text: "What Ollama actually is" },
        {
          type: "p",
          text: "Ollama is a small server program. It does three jobs: it downloads model weights (like Docker pulls images), it loads them into your RAM or GPU memory, and it serves an HTTP API on localhost:11434. Any program on your laptop can then send it a prompt. The terminal chat you get from \"ollama run\" is just one client of that server; your Python code will be another.",
        },
        {
          type: "code",
          lang: "bash",
          code: `# Linux. On Windows and macOS, download the installer from https://ollama.com/download
curl -fsSL https://ollama.com/install.sh | sh

ollama pull llama3.2:3b     # download the weights once (roughly 2 GB)
ollama run llama3.2:3b      # chat in the terminal; type /bye to exit
ollama list                 # models saved on disk, with their sizes
ollama ps                   # models loaded in memory right now, on CPU or GPU`,
        },
        {
          type: "p",
          text: "The name has two parts: the model family and a tag. \"llama3.2:3b\" is Meta's Llama 3.2 with 3 billion parameters; \"qwen2.5:3b\" is Alibaba's Qwen 2.5 at the same size; \"llama3.1:8b\" is a bigger, smarter and slower sibling. Try two families on your own questions. Qwen and Llama have different strengths, and the only benchmark that matters for your project is your own prompts.",
        },
        { type: "h", text: "Which model fits your laptop" },
        {
          type: "p",
          text: "A model is billions of numbers, and all of them must sit in memory while it runs. Stored at full 16-bit precision, an 8-billion-parameter model needs about 16 GB just for the weights. So local runners use quantisation: each weight is stored in about 4 bits instead of 16. The file becomes roughly a quarter of the size and the answers get only slightly worse. Most default Ollama tags are already 4-bit quantised, which is why a 3B model is a download of about 2 GB.",
        },
        {
          type: "list",
          items: [
            "8 GB RAM, no GPU (most college laptops): stay with 1B–3B models such as llama3.2:3b or qwen2.5:3b. They are fine for summaries, rewriting, simple Q&A and classification.",
            "16 GB RAM or a laptop GPU with 6–8 GB of VRAM: 7B–8B models such as llama3.1:8b or qwen2.5:7b become comfortable and noticeably better at reasoning and following instructions.",
            "Ollama's own guidance is at least 8 GB of RAM for 7B models, 16 GB for 13B and 32 GB for 33B. Treat that as the minimum with everything else closed, not as a comfortable setting.",
            "If \"ollama ps\" shows the model on CPU, expect a few words per second. On a GPU it is many times faster. Both work; one needs more patience.",
            "Close Chrome before you judge speed. A model that spills out of RAM into swap becomes painfully slow, and that is a memory problem, not a model problem.",
          ],
        },
        { type: "h", text: "Call it from Python with the SDK you already know" },
        {
          type: "p",
          text: "Here is the part that makes Ollama so useful for engineers. Besides its own API, it also speaks the OpenAI API format at http://localhost:11434/v1. So the OpenAI Python SDK you used in Module 1 works without changes: you only tell the client to send requests to your laptop instead of the cloud. The api_key must be a non-empty string because the SDK insists on one, but Ollama ignores it.",
        },
        {
          type: "code",
          lang: "python",
          code: `import os
from openai import OpenAI

# One table of providers. The rest of your app never needs to know which one is active.
PROVIDERS = {
    "local": {"base_url": "http://localhost:11434/v1", "api_key": "ollama", "model": "llama3.2:3b"},
    "openai": {"base_url": None, "api_key": os.getenv("OPENAI_API_KEY"), "model": "gpt-4o-mini"},
}


def get_client(provider: str) -> tuple[OpenAI, str]:
    cfg = PROVIDERS[provider]
    return OpenAI(base_url=cfg["base_url"], api_key=cfg["api_key"]), cfg["model"]


# Run with:  LLM_PROVIDER=openai python app.py   (default is local)
client, model = get_client(os.getenv("LLM_PROVIDER", "local"))

resp = client.chat.completions.create(
    model=model,
    temperature=0.3,
    messages=[
        {"role": "system", "content": "You are a patient DSA tutor."},
        {"role": "user", "content": "Explain binary search like I am in 2nd year."},
    ],
)
print(f"[{model}]", resp.choices[0].message.content)`,
        },
        {
          type: "p",
          text: "Compare this with your first API call in Module 1: only base_url, api_key and the model name changed. That is the whole trick. Build and debug against the free local model, then flip one environment variable to a hosted model for the demo. Streaming, JSON mode and embeddings go through the same endpoint, and tool calling works with models that were trained for it, such as llama3.1 and qwen2.5.",
        },
        { type: "h", text: "The native library: streaming and measuring speed" },
        {
          type: "p",
          text: "Ollama also has its own Python package (pip install ollama). Use it when you need Ollama-specific controls, such as the context size, or the timing numbers it returns with every response. The script below streams an answer and then prints tokens per second, the number you should quote when someone asks \"is it fast enough?\".",
        },
        {
          type: "code",
          lang: "python",
          code: `import ollama

stream = ollama.chat(
    model="llama3.2:3b",
    messages=[{"role": "user", "content": "Explain a hash map to a 2nd-year student in 4 lines."}],
    options={"temperature": 0.2, "num_ctx": 4096},
    stream=True,
)

last = None
for chunk in stream:
    print(chunk["message"]["content"], end="", flush=True)
    last = chunk

# The final chunk carries the stats. Durations are in nanoseconds.
tokens = last["eval_count"]
seconds = last["eval_duration"] / 1e9
print(f"\\n\\n{tokens} tokens in {seconds:.1f} s = {tokens / seconds:.1f} tokens/sec")`,
        },
        {
          type: "tip",
          text: "Watch num_ctx. Ollama gives every model a small default context window (a few thousand tokens), whatever the model itself supports. A long RAG prompt that goes over it is cut without an error, and the model answers as if it never saw part of your text. Raise it with options={\"num_ctx\": 8192} in the native library or with a Modelfile, and remember a bigger context needs more RAM.",
        },
        { type: "h", text: "Package your own assistant with a Modelfile" },
        {
          type: "p",
          text: "A Modelfile is to Ollama what a Dockerfile is to Docker: a recipe that starts from a base model and bakes in your system prompt and settings. The result is a new named model that anyone on your team can run, and it also works through the OpenAI-compatible endpoint, which is the easiest way to give that endpoint a larger context window.",
        },
        {
          type: "code",
          lang: "bash",
          code: `# Windows: instead of the cat command, save the lines between the EOF markers in a file named Modelfile
cat > Modelfile <<'EOF'
FROM llama3.2:3b
PARAMETER temperature 0.2
PARAMETER num_ctx 8192
SYSTEM """You are a placement-prep coach for Indian engineering students.
Answer in short numbered steps. If you are not sure, say so instead of guessing."""
EOF

ollama create placement-coach -f Modelfile
ollama run placement-coach "How should I prepare for an OS interview in 2 weeks?"`,
        },
        { type: "h", text: "Local or hosted? Measure, don't guess" },
        {
          type: "list",
          items: [
            "Cost: local is free per token, but you pay in RAM, battery and your own time. Hosted is pay-per-token with nothing to maintain.",
            "Privacy: local keeps every prompt on the machine, which matters for resumes, marksheets, medical or company-internal data. Hosted sends the text to a provider.",
            "Quality: a 3B model on a laptop is usually weaker than a large hosted model at multi-step reasoning, long instructions and Hindi-English mixed text. On narrow tasks it is often good enough.",
            "Speed: hosted models run on data-centre GPUs. A CPU-only laptop is slower, so use streaming and short answers.",
            "Reliability: local works offline on hostel Wi-Fi and has no rate limits. But it serves one laptop; it is not a way to serve a thousand users.",
          ],
        },
        {
          type: "p",
          text: "Do not argue about quality from memory. Run the same questions through both and read the answers side by side. This script writes a small report you can paste into your project README.",
        },
        {
          type: "code",
          lang: "python",
          code: `import time
from openai import OpenAI

local = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")
hosted = OpenAI()  # reads OPENAI_API_KEY from the environment

CONTENDERS = [
    ("local llama3.2:3b", local, "llama3.2:3b"),
    ("hosted gpt-4o-mini", hosted, "gpt-4o-mini"),
]

QUESTIONS = [
    "Explain the difference between a process and a thread in 3 lines.",
    "Rewrite this resume bullet with impact: 'Made a website for college fest.'",
    "Ek line mein batao: REST API kya hoti hai?",
]


def ask(client: OpenAI, model: str, question: str) -> tuple[str, float]:
    start = time.perf_counter()
    resp = client.chat.completions.create(
        model=model,
        temperature=0,
        messages=[{"role": "user", "content": question}],
    )
    return resp.choices[0].message.content.strip(), time.perf_counter() - start


with open("comparison.md", "w", encoding="utf-8") as f:
    for question in QUESTIONS:
        f.write(f"## {question}\\n\\n")
        for name, client, model in CONTENDERS:
            answer, seconds = ask(client, model, question)
            f.write(f"**{name}** ({seconds:.1f} s)\\n\\n{answer}\\n\\n")

print("Wrote comparison.md")`,
        },
        { type: "h", text: "Common mistakes" },
        {
          type: "list",
          items: [
            "Pulling the biggest model you have heard of. A 70B model will not load on a student laptop; start at 3B and move up only if quality is the problem.",
            "\"Connection refused\" errors because the Ollama server is not running. Open the Ollama app, or run \"ollama serve\" in a terminal, then try again.",
            "Using base_url http://localhost:11434 without the /v1 at the end. The OpenAI-compatible routes live under /v1.",
            "Asking for a model you never pulled. The name in your code must match a name from \"ollama list\" exactly, tag included.",
            "Judging the model on the first request. The first call loads the weights into memory and is slow; later calls are faster. By default Ollama unloads an idle model after about five minutes.",
            "Comparing local and hosted models with different prompts or temperatures, then drawing conclusions. Keep everything the same except the model.",
            "Shipping an open model in a paid product without reading its licence. Open weights do not always mean free for commercial use.",
          ],
        },
        { type: "h", text: "How this shows up in interviews" },
        {
          type: "list",
          items: [
            "Q: How would you design your app so it can use OpenAI today and a self-hosted model tomorrow? A: Keep the provider behind one small function or config (base_url, api_key, model name). Most providers and local servers such as Ollama expose the OpenAI-compatible chat format, so switching is a config change, not a rewrite. I keep an evaluation set and re-run it after each switch, because the same prompt behaves differently on a different model.",
            "Q: What is quantisation and what do you give up? A: Storing each weight in fewer bits, for example 4 instead of 16, so the model needs about a quarter of the memory and fits on consumer hardware. You give up a little accuracy. It is applied after training, so nobody has to retrain the model.",
            "Q: When would you choose an open, self-hosted model over a hosted API? A: When data must not leave the machine or the company, when the app must work offline, when volume is high enough that per-token pricing hurts, or when I need to fine-tune the weights. I would stay with a hosted API when I need the best quality quickly and do not want to run servers.",
          ],
        },
        {
          type: "tip",
          text: "Resume line that gets noticed: \"Built a provider-agnostic LLM layer (OpenAI + local Llama via Ollama) and benchmarked quality and tokens/sec on both.\" It shows you understand trade-offs, not just one vendor's API.",
        },
      ],
      quiz: {
        question:
          "Your RAG app works with a hosted model. You switch base_url to Ollama with a 3B model, and now it answers as if it never saw some of the retrieved chunks, with no error. What is the most likely cause?",
        options: [
          "Local models cannot use system prompts",
          "The prompt is longer than Ollama's default context window (num_ctx), so part of it was cut off",
          "The api_key \"ollama\" is invalid, so the chunks were rejected",
          "Quantised models cannot read text that was retrieved from a vector database",
        ],
        answer: 1,
        explanation:
          "Ollama's default context window is small and over-long prompts are truncated without an error. Raise num_ctx (native options or a Modelfile) or send fewer, shorter chunks. The api_key is ignored, and quantisation only makes answers slightly less accurate.",
      },
      task: "Install Ollama and pull one 3B model (llama3.2:3b or qwen2.5:3b). Add a LLM_PROVIDER switch to your Module 1 CLI so the same code runs on the local model and on gpt-4o-mini. Run the same 5 questions (include one Hinglish question and one resume rewrite) through both, and commit a comparison.md with the answers, time taken, your local tokens/sec, and three lines on where the local model was good enough and where it was not.",
    },
    {
      slug: "when-to-finetune",
      title: "Prompting vs RAG vs fine-tuning",
      minutes: 30,
      summary:
        "The decision framework senior engineers use: is the model missing instructions, knowledge or behaviour? Fix the cheapest one first, and measure before you climb.",
      blocks: [
        {
          type: "p",
          text: "When an LLM app gives a bad answer, there are only three possible reasons. The model was not told clearly what you want. The model does not have the information. Or the model knows what you want and has the information, but still cannot do it reliably. Each reason has its own fix: a better prompt, retrieval (RAG), or fine-tuning.",
        },
        {
          type: "p",
          text: "Beginners jump straight to fine-tuning because it sounds like \"real ML\". Senior engineers do the opposite. They start with the cheapest fix, measure, and move to the next one only when the numbers say they must. This lesson gives you that decision process, so that in a project review or an interview you can defend why you did, or did not, fine-tune.",
        },
        {
          type: "diagram",
          id: "when-to-finetune",
          caption: "Prompt first, RAG for knowledge, fine-tune last.",
        },
        { type: "h", text: "Three levers, and what each one really changes" },
        {
          type: "list",
          items: [
            "Prompting changes the instructions. Nothing is trained; you edit text and re-run in seconds. It fixes unclear tasks, wrong formats, missing rules and tone. It cannot add knowledge the model never saw, and a long prompt is paid for on every single call.",
            "RAG changes what the model can see at answer time. Your code finds the relevant text in your own documents and pastes it into the prompt. It fixes private, recent and frequently changing knowledge, and it lets you show the source. It does not change how the model writes.",
            "Fine-tuning changes the model itself. You train its weights on your own examples of input and ideal output. It fixes behaviour: a consistent style, a strict format, a narrow task done reliably, or a small cheap model doing a job that otherwise needs a big one. It needs a few hundred good examples, a test set and re-training when requirements change.",
          ],
        },
        { type: "h", text: "The intern test: knowledge or behaviour?" },
        {
          type: "p",
          text: "Imagine handing your exact prompt to a smart new intern who has never seen your company. What would they be missing? If the answer is \"the documents\", you have a knowledge problem, and that is RAG. If they would need weeks of practice and feedback to pick up the house style, you have a behaviour problem: try examples in the prompt first, then fine-tuning. If a clearer instruction would be enough, it was a prompt problem all along.",
        },
        {
          type: "list",
          items: [
            "Placement-cell FAQ bot that must answer from this year's eligibility rules and company list: knowledge that changes every season. RAG.",
            "Resume bullet rewriter that must always give an action verb, a number and under 20 words: an instruction plus three examples. Prompting.",
            "DSA hint bot that must never reveal the full solution: a rule. Prompting, plus the guardrails from Module 4.",
            "A Bengaluru food-delivery startup wants replies that sound like its best support agent, in casual Hinglish, on a small open model: behaviour. Fine-tune, and keep RAG for the refund policy.",
            "Sorting a very large number of support tickets a day into 12 categories with low latency: a narrow task at high volume. Start with a prompt to get a baseline, then fine-tune a small model if cost or speed demands it.",
          ],
        },
        { type: "h", text: "Climb the ladder, and measure at every rung" },
        {
          type: "p",
          text: "The order is always the same: a clear prompt, then a few examples in the prompt (few-shot), then RAG if knowledge is missing, and fine-tuning only if behaviour is still failing or you need it cheaper and faster at scale. The rule that keeps you honest: you may not climb until you have a number. Collect 30 to 50 real inputs with the output you expect, and score every change against that same set. The script below does it for a tiny Hinglish ticket classifier; the pattern is the same for any task.",
        },
        {
          type: "code",
          lang: "python",
          code: `from openai import OpenAI

client = OpenAI()
MODEL = "gpt-4o-mini"
LABELS = ["refund", "delivery", "payment", "account"]

# In a real project: 30-50 real examples loaded from a file. Six here to keep it short.
EVAL_SET = [
    ("Mera order 3 din se out for delivery dikha raha hai", "delivery"),
    ("Paise kat gaye but order place nahi hua", "payment"),
    ("Return kar diya tha, refund kab aayega?", "refund"),
    ("OTP nahi aa raha, login nahi ho pa raha", "account"),
    ("Galat size aa gaya, paisa wapas chahiye", "refund"),
    ("UPI se double payment ho gaya", "payment"),
]

ZERO_SHOT = f"Classify the customer message into exactly one of: {', '.join(LABELS)}. Reply with the label only."

FEW_SHOT = ZERO_SHOT + """

Examples:
Message: Courier wala phone nahi utha raha -> delivery
Message: Cancel kiya tha, amount abhi tak nahi mila -> refund
Message: Card decline ho raha hai checkout pe -> payment
Message: Email change karna hai profile mein -> account"""


def classify(system_prompt: str, message: str) -> str:
    resp = client.chat.completions.create(
        model=MODEL,
        temperature=0,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message},
        ],
    )
    return resp.choices[0].message.content.strip().lower()


def accuracy(system_prompt: str) -> float:
    correct = 0
    for message, expected in EVAL_SET:
        got = classify(system_prompt, message)
        if got == expected:
            correct += 1
        else:
            print(f"  MISS: {message!r} -> {got!r} (expected {expected!r})")
    return correct / len(EVAL_SET)


for name, prompt in [("zero-shot", ZERO_SHOT), ("few-shot", FEW_SHOT)]:
    print(f"{name}: {accuracy(prompt):.0%}")`,
        },
        {
          type: "p",
          text: "Read the misses, not just the percentage. If the misses are questions about things the model could not know, add retrieval. If they are format or tone slips that survive clear rules and examples, that is your evidence for fine-tuning. If there are no misses, you are done, and you just saved yourself a week.",
        },
        {
          type: "tip",
          text: "Before you fine-tune, put 5 to 10 of your best examples directly in the prompt. Few-shot prompting is fine-tuning's free trial: if it fixes the problem, ship it; if it clearly helps but not enough, you now know that more examples (training) is the right direction.",
        },
        { type: "h", text: "Why fine-tuning is the wrong tool for facts" },
        {
          type: "list",
          items: [
            "It goes stale. Every time a policy, price or syllabus changes you would have to train again. With RAG you update one document.",
            "It cannot show its source. A fine-tuned model just \"knows\"; RAG can point to the page it used, which is what users and reviewers trust.",
            "It blurs. Training teaches patterns, not a lookup table. When the model half-remembers a fact, it fills the gap with something plausible and wrong.",
          ],
        },
        {
          type: "p",
          text: "So the one-line rule is: changing knowledge belongs in retrieval, not in weights. And the three levers are not rivals. A production system usually uses all of them together: a system prompt for the rules, RAG for the facts, and, only where needed, a fine-tuned model for the voice. That is exactly how this module's project is built.",
        },
        { type: "h", text: "Signs that fine-tuning is now worth it" },
        {
          type: "list",
          items: [
            "You have a baseline number from a good prompt with examples, and it is stuck below what the product needs.",
            "The remaining failures are about behaviour: say one reply in five drifts into stiff formal English or breaks your JSON format.",
            "Your prompt has grown into pages of rules and examples that you pay for on every request. A fine-tuned model can learn them once and work with a short prompt.",
            "You need a small model (cheaper, faster, or running on your own machine for privacy) to do a narrow task that only a large model does well today.",
            "You have, or can create, a few hundred high-quality examples and can keep some aside for testing.",
          ],
        },
        { type: "h", text: "Do the cost maths before you train" },
        {
          type: "p",
          text: "Fine-tuning has a one-time cost (collecting examples, training, evaluating) and a saving per request (a shorter prompt or a smaller model). It pays off only if your volume is high enough. Plug your own numbers into this calculator; the ones below are made up to show the shape of the answer.",
        },
        {
          type: "code",
          lang: "python",
          code: `# Every number here is ILLUSTRATIVE. Use your provider's current prices and your own measurements.
PRICE_PER_1M_INPUT_TOKENS = 0.50   # any currency, as long as you use the same one everywhere
ONE_TIME_COST = 60.0               # labelling time + training runs + evaluation, same currency

long_prompt_tokens = 1800          # rules + a dozen few-shot examples sent on every call
short_prompt_tokens = 200          # what the fine-tuned model needs
saved_tokens = long_prompt_tokens - short_prompt_tokens


def break_even_days(requests_per_day: int) -> float:
    saving_per_day = saved_tokens * requests_per_day * PRICE_PER_1M_INPUT_TOKENS / 1_000_000
    return ONE_TIME_COST / saving_per_day


print(f"Tokens saved per request: {saved_tokens}")
for volume in (50, 500, 5_000, 50_000):
    print(f"{volume:>6} requests/day -> pays back in {break_even_days(volume):,.0f} days")`,
        },
        {
          type: "p",
          text: "With these made-up numbers, 5,000 requests a day pays back in about two weeks, while a college project with 50 requests a day would need about four years. Also check two things the calculator ignores: whether a fine-tuned model costs more per token than the base model on your provider, and what it costs to host the model if you serve it yourself.",
        },
        { type: "h", text: "If you do fine-tune, the data is the product" },
        {
          type: "p",
          text: "A fine-tuned model copies its training examples faithfully, including the typos, the rude replies and the wrong answers. So the real work is choosing examples you would be proud to ship. The usual source is your own logs: real questions with replies that a human wrote or approved. This script turns them into the chat-format JSONL that training tools expect, removes duplicates, and keeps a test split that the model never trains on. You will use exactly this file in the next lesson.",
        },
        {
          type: "code",
          lang: "python",
          code: `import json
import random

SYSTEM = (
    "You are a friendly support agent for a food-delivery app. "
    "Reply in natural Hinglish, in at most 3 short sentences."
)

# In a real project these rows come from your logs: real questions with replies a human approved.
approved = [
    {"question": "Order 40 min late hai, kya karu?",
     "reply": "Sorry yaar, delay ke liye! Rider 5 min mein pahunch raha hai. Late hua toh refund hum khud kar denge."},
    {"question": "Paise kat gaye par order nahi dikha raha",
     "reply": "Tension mat lo, payment safe hai. 2 ghante mein auto-refund ho jayega. Nahi aaya toh yahin message karna."},
    {"question": "order 40 min late hai, kya karu?",  # duplicate with different casing
     "reply": "Sorry for the delay."},
]


def to_example(row: dict) -> dict:
    return {
        "messages": [
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": row["question"].strip()},
            {"role": "assistant", "content": row["reply"].strip()},
        ]
    }


seen: set[str] = set()
examples = []
for row in approved:
    key = row["question"].strip().lower()
    if key in seen or not row["reply"].strip():
        continue  # skip duplicates and empty replies
    seen.add(key)
    examples.append(to_example(row))

random.seed(42)
random.shuffle(examples)
n_test = max(1, len(examples) // 10)  # hold out about 10% that the model never trains on
splits = {"test.jsonl": examples[:n_test], "train.jsonl": examples[n_test:]}

for filename, rows in splits.items():
    with open(filename, "w", encoding="utf-8") as f:
        for example in rows:
            f.write(json.dumps(example, ensure_ascii=False) + "\\n")
    print(f"{filename}: {len(rows)} examples")

if len(examples) < 200:
    print("Fewer than a few hundred examples: keep improving the prompt while you collect more.")`,
        },
        { type: "h", text: "Common mistakes" },
        {
          type: "list",
          items: [
            "Fine-tuning to \"teach the model our documents\". That is a knowledge problem; use RAG.",
            "Using RAG to fix a tone problem. Retrieved documents change what the model knows, not how it writes.",
            "Fine-tuning before writing down a baseline. Without a before-number you cannot prove the after-number is better.",
            "Testing on the same examples you trained on. The score looks great and means nothing.",
            "Training on raw logs without reading them. The model learns your worst replies as carefully as your best ones.",
            "Expecting fine-tuning to stop hallucinations. It changes style and habits; it does not make the model check facts.",
            "Forgetting maintenance. When the tone guide changes or the base model is retired, a fine-tuned model must be trained and evaluated again; a prompt is edited in a minute.",
          ],
        },
        { type: "h", text: "How this shows up in interviews" },
        {
          type: "list",
          items: [
            "Q: When would you use RAG and when would you fine-tune? A: RAG when the model lacks knowledge, especially private or changing knowledge, and when I need citations. Fine-tuning when the model has the knowledge but not the behaviour: style, format, or a narrow task on a small model. I start with prompting, measure on a fixed evaluation set, and move up only when the failures point to that lever. In production they are often combined.",
            "Q: Our chatbot is giving answers from an outdated policy. Should we fine-tune it on the new policy? A: No. That is stale knowledge, so I would fix retrieval: re-index the new document, remove the old one, and check that the right chunk is being retrieved. Fine-tuning would have to be repeated on every policy change and still could not cite the source.",
            "Q: You fine-tuned a model and it is no better than the base model with a good prompt. What do you check? A: First the data: quality, duplicates, and whether test examples leaked into training. Then whether the prompt format at inference matches the format used in training. Then overfitting, by comparing training and held-out loss. And finally whether the task needed fine-tuning at all; if few-shot prompting already solved it, there was little left to gain.",
          ],
        },
        {
          type: "tip",
          text: "The line to say out loud: \"Prompting changes the instructions, RAG changes the knowledge, fine-tuning changes the behaviour. I start with the cheapest and climb only with evidence.\" It answers half of all LLM system-design questions.",
        },
      ],
      quiz: {
        question:
          "A startup's support bot uses RAG over its help centre, and the facts in its replies are correct. But about one reply in five comes out in stiff formal English instead of the casual Hinglish the brand wants, even after adding tone rules and examples to the prompt. They have 800 approved past replies. What should they try next?",
        options: [
          "Add more help-centre documents to the vector database",
          "Fine-tune on the approved replies to fix the tone, and keep RAG for the facts",
          "Raise the temperature so the replies sound more casual",
          "Remove RAG and fine-tune the model on the help-centre articles instead",
        ],
        answer: 1,
        explanation:
          "The knowledge is fine, so more documents will not help. What fails is behaviour (tone) that prompting could not fix, and they have enough good examples, so this is the case for fine-tuning. RAG stays, because facts that change belong in retrieval, not in weights.",
      },
      task: "Pick one real use case (your college's placement FAQ, a hostel mess helpdesk, a resume reviewer, anything you could actually build). Write a one-page decision doc with: the task in one sentence; 10 real example inputs with the ideal output for each; the intern test (is it missing instructions, knowledge or behaviour?); your zero-shot and few-shot scores on those 10 examples (adapt the evaluation script from this lesson); the rung of the ladder where you would stop and why; and what result would make you climb to the next rung.",
    },
    {
      slug: "lora-finetuning",
      title: "LoRA fine-tuning on a free Colab GPU",
      minutes: 60,
      summary:
        "Freeze a small open model, train tiny LoRA adapters on your own examples on a free Colab T4, prove the change with a before/after test, and publish the adapter on Hugging Face.",
      blocks: [
        {
          type: "p",
          text: "Full fine-tuning means updating every one of a model's billions of weights. That needs far more GPU memory than a student has, and it leaves you with a new multi-gigabyte copy of the model for every task. LoRA (Low-Rank Adaptation) is the shortcut used across the industry: freeze the original weights and train a small add-on, called an adapter, that nudges the model's behaviour. The adapter is a tiny fraction of the model's size, so training fits on the free T4 GPU in Google Colab and the result is a file measured in megabytes, not gigabytes.",
        },
        {
          type: "p",
          text: "In the last lesson you decided when fine-tuning is worth it and prepared train.jsonl and test.jsonl. In this one you actually do it: by the end you will have a small open model that replies like a friendly Hinglish support agent, numbers that show it improved, and a public model page you can link from your resume.",
        },
        {
          type: "diagram",
          id: "lora",
          caption: "Freeze the base model; train small LoRA adapters only.",
        },
        { type: "h", text: "The idea: freeze the big matrix, learn a small correction" },
        {
          type: "p",
          text: "Inside a model, each layer is a big grid of numbers, a matrix W. Fine-tuning changes W by some amount. LoRA's bet is that the change needed for one task is simple, so it can be written as two thin matrices multiplied together: B times A. If W is 2048 by 2048, then A is only 16 by 2048 and B is 2048 by 16. The number 16 is the rank, r. Only A and B are trained; W never changes. The layer's output becomes W·x + (alpha / r) · B·A·x. B starts as all zeros, so before training the model behaves exactly like the base model, and training slowly moves it towards your examples.",
        },
        {
          type: "code",
          lang: "python",
          code: `import numpy as np

d, k, r, alpha = 2048, 2048, 16, 32   # an illustrative layer size; real layers differ by model

W = np.random.randn(d, k) * 0.02      # frozen base weights
A = np.random.randn(r, k) * 0.01      # trainable, starts random
B = np.zeros((d, r))                  # trainable, starts at zero

full = W.size
lora = A.size + B.size
print(f"Full matrix : {full:,} weights")
print(f"LoRA (r={r}): {lora:,} weights = {lora / full:.2%} of the full matrix")

x = np.random.randn(k)
base_out = W @ x
lora_out = W @ x + (alpha / r) * (B @ (A @ x))
print("Same output before training:", np.allclose(base_out, lora_out))`,
        },
        {
          type: "p",
          text: "Run it: 65,536 trainable numbers stand in for a matrix of about 4.2 million, roughly 1.6% for this one layer. Across a real model, where adapters are added only to some layers, the trainable share is usually well under 1% of all weights.",
        },
        { type: "h", text: "QLoRA: why a free T4 is enough" },
        {
          type: "p",
          text: "Two tricks make this fit on free hardware. First, the frozen base model is loaded in 4-bit, the same quantisation idea you met with Ollama, so its weights take about a quarter of the memory. Training LoRA adapters on top of a 4-bit base is called QLoRA. Second, gradients are needed only for the small adapters, not for the whole model. The free Colab T4 has about 15 GB of GPU memory, which is comfortable for a 1.5B model and workable for a 3B one.",
        },
        {
          type: "list",
          items: [
            "r (rank): the capacity of the adapter. 8 to 16 is a sensible start for tone and format tasks. Higher r can learn more, but uses more memory and overfits small datasets more easily.",
            "lora_alpha: a scaling factor; the update is multiplied by alpha / r. A common starting point is alpha = 2 × r.",
            "target_modules: which matrices get an adapter. The attention projections (q_proj, k_proj, v_proj, o_proj) are the usual choice. Adding the MLP layers (gate_proj, up_proj, down_proj) gives more capacity at more cost. The names depend on the model architecture.",
            "lora_dropout: a little randomness during training (for example 0.05) that reduces memorising.",
            "learning_rate and epochs: LoRA usually uses a higher learning rate than full fine-tuning (2e-4 is a common start) and only a few passes over a small dataset.",
          ],
        },
        { type: "h", text: "Step 1: the data" },
        {
          type: "p",
          text: "Each training example is one conversation in chat format, one JSON object per line, exactly what the script in the previous lesson wrote. For the module project you need about 500 Hinglish support conversations. A practical way to get them: write 50 yourself in the voice you want, ask a larger model to write variations on new customer problems, then read every single one and delete or fix whatever you would not send to a real customer. The model will copy these replies, so their quality is the ceiling for yours.",
        },
        {
          type: "code",
          lang: "json",
          code: `{"messages": [{"role": "system", "content": "You are a friendly support agent for a food-delivery app. Reply in natural Hinglish, in at most 3 short sentences."}, {"role": "user", "content": "Order 40 min late hai, kya karu?"}, {"role": "assistant", "content": "Sorry yaar, delay ke liye! Rider 5 min mein pahunch raha hai. Late hua toh refund hum khud kar denge."}]}`,
        },
        {
          type: "tip",
          text: "Remove real names, phone numbers, addresses and order IDs before you train or upload anything. A fine-tuned model can repeat its training data, and a public dataset is public forever.",
        },
        { type: "h", text: "Step 2: train on Colab" },
        {
          type: "p",
          text: "Open a new Colab notebook, choose Runtime, then Change runtime type, then T4 GPU, and upload train.jsonl and test.jsonl. Install the libraries, then run the training script. The base model here is Qwen2.5-1.5B-Instruct because it is small, open and downloads without an access request; once the pipeline works you can swap in a 3B model by changing one line.",
        },
        {
          type: "code",
          lang: "bash",
          code: `# In a Colab cell, put a ! in front of the command
pip install -q -U transformers datasets peft trl bitsandbytes accelerate`,
        },
        {
          type: "code",
          lang: "python",
          code: `import torch
from datasets import load_dataset
from peft import LoraConfig
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
from trl import SFTConfig, SFTTrainer

BASE = "Qwen/Qwen2.5-1.5B-Instruct"
OUT = "qwen-hinglish-support-lora"
assert torch.cuda.is_available(), "No GPU: Runtime > Change runtime type > T4 GPU"

# 1. Data: one JSON object per line, each with a "messages" list (system, user, assistant)
data = load_dataset("json", data_files={"train": "train.jsonl", "test": "test.jsonl"})

# 2. Base model, loaded in 4-bit so it fits on a free T4
bnb = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.float16,
)
tokenizer = AutoTokenizer.from_pretrained(BASE)
model = AutoModelForCausalLM.from_pretrained(BASE, quantization_config=bnb, device_map="auto")

# 3. LoRA: small trainable adapters on the attention layers; everything else stays frozen
lora = LoraConfig(
    r=16,
    lora_alpha=32,
    lora_dropout=0.05,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],
    task_type="CAUSAL_LM",
)

# 4. Train. SFTTrainer applies the model's chat template to the "messages" column for you.
args = SFTConfig(
    output_dir=OUT,
    num_train_epochs=3,
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,   # 4 x 4 = an effective batch of 16
    learning_rate=2e-4,
    logging_steps=10,
    eval_strategy="epoch",
    save_strategy="epoch",
    fp16=True,
    report_to="none",
)
trainer = SFTTrainer(
    model=model,
    args=args,
    train_dataset=data["train"],
    eval_dataset=data["test"],
    peft_config=lora,
)
trainer.model.print_trainable_parameters()   # expect well under 1% of all weights
trainer.train()

trainer.save_model(OUT)          # saves only the adapter, not the base model
tokenizer.save_pretrained(OUT)`,
        },
        {
          type: "list",
          items: [
            "Training loss (printed every 10 steps) should fall quickly at first and then flatten. If it does not move, check that your data really has the messages format.",
            "Validation loss (printed after each epoch) is the honest number, because the model never trains on test.jsonl. If training loss keeps falling while validation loss rises, the model is memorising: use fewer epochs, a smaller r, or more varied data.",
            "A few hundred short conversations for three epochs is a small job for a T4. Time your own run instead of trusting anyone's number; it depends on example length and on the GPU you were given.",
            "Colab deletes your files when the session ends. Download the output folder or push it to Hugging Face as soon as training finishes.",
          ],
        },
        {
          type: "tip",
          text: "First run the whole notebook on 50 examples for 1 epoch. It finishes quickly and catches path, format and memory bugs while they are cheap. Only then start the real run.",
        },
        { type: "h", text: "Step 3: prove it changed, with a before/after test" },
        {
          type: "p",
          text: "Loss going down does not prove the replies got better. Ask the base model and the fine-tuned model the same questions, ones that were never in the training file, and read the answers side by side. Use the same system prompt you trained with: the adapter learned its behaviour in that exact format.",
        },
        {
          type: "code",
          lang: "python",
          code: `import torch
from peft import PeftModel
from transformers import AutoModelForCausalLM, AutoTokenizer

BASE = "Qwen/Qwen2.5-1.5B-Instruct"
ADAPTER = "qwen-hinglish-support-lora"   # the folder saved by the training script

tokenizer = AutoTokenizer.from_pretrained(BASE)
base = AutoModelForCausalLM.from_pretrained(BASE, torch_dtype=torch.float16, device_map="auto")

SYSTEM = (
    "You are a friendly support agent for a food-delivery app. "
    "Reply in natural Hinglish, in at most 3 short sentences."
)
QUESTIONS = [  # use questions from test.jsonl, never from train.jsonl
    "Mera order cancel ho gaya par paise wapas nahi aaye",
    "Delivery boy ne galat item de diya",
    "Coupon apply nahi ho raha",
]


def reply(model, question: str) -> str:
    messages = [{"role": "system", "content": SYSTEM}, {"role": "user", "content": question}]
    inputs = tokenizer.apply_chat_template(
        messages, add_generation_prompt=True, return_tensors="pt", return_dict=True
    ).to(model.device)
    with torch.no_grad():
        output = model.generate(**inputs, max_new_tokens=80, do_sample=False)
    new_tokens = output[0][inputs["input_ids"].shape[1]:]
    return tokenizer.decode(new_tokens, skip_special_tokens=True).strip()


before = [reply(base, q) for q in QUESTIONS]       # collect these BEFORE attaching the adapter
tuned = PeftModel.from_pretrained(base, ADAPTER)   # the same frozen weights + your adapter on top
after = [reply(tuned, q) for q in QUESTIONS]

for q, b, a in zip(QUESTIONS, before, after):
    print(f"Q: {q}\\n  before: {b}\\n  after : {a}\\n")`,
        },
        {
          type: "p",
          text: "For a number instead of an impression, score both sets of replies against the rules you care about (Hinglish, at most three sentences, polite, correct action) using the evaluation habit from the previous lesson, and write the before and after scores down. That table is the most convincing thing in your model card.",
        },
        { type: "h", text: "Step 4: publish and reuse" },
        {
          type: "p",
          text: "An adapter is useless without its base model, but that is also its strength: you upload a small file, and anyone can load the public base model and put your adapter on top. Run this in the same notebook, after the before/after test. You need a free Hugging Face account and an access token with write permission.",
        },
        {
          type: "code",
          lang: "python",
          code: `from huggingface_hub import login

login()  # paste a token with write access from huggingface.co/settings/tokens

REPO = "your-username/qwen-hinglish-support-lora"
tuned.push_to_hub(REPO)        # uploads only the adapter weights and config
tokenizer.push_to_hub(REPO)

# Optional: fold the adapter into the base weights to get one ordinary model
merged = tuned.merge_and_unload()
merged.save_pretrained("qwen-hinglish-support-merged")
tokenizer.save_pretrained("qwen-hinglish-support-merged")`,
        },
        {
          type: "list",
          items: [
            "Keep the adapter separate when you want one base model to serve several tasks: load the base once and swap small adapters.",
            "Merge when you want a single model that needs no extra library and has no adapter overhead at inference. Merge into a base loaded in 16-bit, as above, not into the 4-bit one used for training.",
            "To run your merged model in Ollama, convert the merged folder to a GGUF file with the convert_hf_to_gguf.py script from the llama.cpp project, then point the FROM line of a Modelfile at that file.",
            "Write a model card (the README on the model page): base model, what the data was and how you made it, training settings, the trainable-parameter percentage, before/after examples, and what the model should not be used for.",
          ],
        },
        { type: "h", text: "Common mistakes" },
        {
          type: "list",
          items: [
            "Training on the CPU by accident. If the assert in the script fails, the notebook has no GPU selected.",
            "\"CUDA out of memory\". Lower per_device_train_batch_size and raise gradient_accumulation_steps by the same factor, shorten very long examples, reduce r, or use a smaller base model. Restart the runtime before retrying.",
            "A different prompt format at inference than in training: no chat template, or another system prompt. The adapter learned its behaviour in the training format, so in any other format its effect is much weaker and the replies drift back towards the base model's.",
            "Testing with questions from train.jsonl. The model has seen the answers; of course it does well.",
            "Too many epochs on a small dataset. The model starts repeating training replies word for word and gets worse on new questions.",
            "Trying to merge the adapter into the 4-bit model. Reload the base in 16-bit first.",
            "Losing the adapter when the Colab session ends. Save or push before you close the tab.",
            "Publishing without checking the base model's licence, or with private customer data still in the dataset.",
          ],
        },
        { type: "h", text: "How this shows up in interviews" },
        {
          type: "list",
          items: [
            "Q: Explain LoRA. Why is it cheaper than full fine-tuning? A: LoRA freezes the pretrained weights and learns a low-rank update for selected weight matrices, written as the product of two small matrices B and A. Only those are trained, usually well under 1% of the parameters, so it needs far less GPU memory, trains faster, and produces a small adapter file instead of a full model copy. Several adapters can share one base model.",
            "Q: What do r, alpha and target_modules control? A: r is the rank of the update, so the adapter's capacity. Alpha scales the update by alpha / r. Target modules decide which layers get adapters, typically the attention projections. I start with r of 8 or 16 and alpha of twice r, and change them only if the evaluation says the model is under- or over-fitting.",
            "Q: How do you know your fine-tuned model is actually better? A: I hold out a test set before training, record a baseline with the base model and a good prompt, and compare the fine-tuned model on the same examples. I watch validation loss for overfitting, read real outputs side by side, and check that it did not get worse on things it used to do well.",
          ],
        },
        {
          type: "tip",
          text: "Resume line: \"Fine-tuned Qwen2.5-1.5B with QLoRA (4-bit, r=16) on 500 Hinglish support conversations on a free Colab T4; published the adapter and a model card with before/after evaluation on Hugging Face.\" Every phrase in it is something you can now explain in an interview.",
        },
      ],
      quiz: {
        question:
          "Your LoRA training loss went down nicely. But when you load the base model plus your adapter in a new script, the replies look almost the same as the plain base model's. What is the most likely cause?",
        options: [
          "LoRA adapters stop working once the Colab session that trained them ends",
          "The prompt at inference is formatted differently from training: no chat template, or a different system prompt",
          "The frozen base weights were changed during training, so the adapter no longer matches them",
          "A rank of 16 is too small to change the output of any model",
        ],
        answer: 1,
        explanation:
          "The adapter learned its behaviour for inputs in the exact chat format and system prompt used in training. Feed it a different format and it has much less effect. The base weights stay frozen in LoRA, adapters are ordinary files that work anywhere, and r=16 is plenty for a tone task.",
      },
      task: "Build the module project. Create 500 Hinglish support conversations (at least 200 to start) for a food-delivery or e-commerce app in chat-format JSONL, with 10% held out as test.jsonl. Fine-tune Qwen2.5-1.5B-Instruct with QLoRA on a free Colab T4 using the script above. Publish the adapter on Hugging Face with a model card that lists the base model, how you made the data, your training settings, the trainable-parameter percentage, the final training and validation loss, and before/after replies for 10 held-out questions. Put the link in your GitHub README and resume.",
    },
  ],
};
