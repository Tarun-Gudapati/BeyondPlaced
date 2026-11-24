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
      minutes: 45,
      summary:
        "Turn your notebook bot into a real API: a FastAPI backend that streams tokens to the browser with Server-Sent Events, the way ChatGPT does.",
      blocks: [
        {
          type: "video",
          src: "supabase:fastapi-streaming/fastapi-streaming.mp4",
          poster: "supabase:fastapi-streaming/fastapi-streaming.jpg",
          captions: "supabase:fastapi-streaming/fastapi-streaming.vtt",
          title: "FastAPI streaming, in 83 seconds",
        },
        {
          type: "p",
          text: "Your RAG bot works in a notebook. Nobody else can use a notebook. A backend is what turns your Python into a URL that a React page, a phone app or a recruiter's browser can call. In this lesson you build that backend with FastAPI, and you make it stream.",
        },
        {
          type: "p",
          text: "Streaming is why ChatGPT feels fast. The model does not finish sooner. It generates one token at a time either way. The only choice you have is whether the user watches a spinner until the last token is ready, or starts reading while the rest is still being written.",
        },
        {
          type: "diagram",
          id: "fastapi-stream",
          caption: "Tokens leave the model and appear in the UI as they generate.",
        },
        { type: "h", text: "Two clocks: time to first token and total time" },
        {
          type: "p",
          text: "Every LLM request has two clocks. Time to first token (TTFT) is how long the user waits before anything appears. Total time is how long until the answer is complete. Say a 300-token answer takes 6 seconds to generate (illustrative numbers). Without streaming, the user sees nothing for 6 seconds. With streaming, the first words can show up in well under a second and the last word still lands at about 6 seconds.",
        },
        {
          type: "list",
          items: [
            "Streaming does not make the model faster. Total time stays about the same.",
            "Streaming does not make it cheaper. You pay for the same input and output tokens.",
            "Streaming changes what the wait feels like, and it lets a user stop a bad answer early instead of waiting for all of it.",
          ],
        },
        { type: "h", text: "Step 1: a normal endpoint that returns JSON" },
        {
          type: "p",
          text: "Start with the plain version so you can see exactly what streaming changes. FastAPI turns a Python function into an HTTP endpoint, and a Pydantic model validates the request body for you. If someone posts an empty question, FastAPI rejects it with a 422 error before your code runs.",
        },
        {
          type: "code",
          lang: "bash",
          code: String.raw`python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install fastapi "uvicorn[standard]" openai python-dotenv httpx
echo 'OPENAI_API_KEY=sk-...' > .env`,
        },
        {
          type: "code",
          lang: "python",
          code: String.raw`# main.py
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from openai import AsyncOpenAI
from pydantic import BaseModel, Field

load_dotenv()

app = FastAPI(title="Placement Prep Bot")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # your frontend's URL, not "*"
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)

client = AsyncOpenAI()  # reads OPENAI_API_KEY from the environment
MODEL = "gpt-4o-mini"
SYSTEM = "You are a concise placement-prep tutor for Indian engineering students."


class ChatRequest(BaseModel):
    question: str = Field(min_length=1, max_length=2000)


def build_messages(question: str) -> list[dict]:
    return [
        {"role": "system", "content": SYSTEM},
        {"role": "user", "content": question},
    ]


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/chat")
async def chat(req: ChatRequest):
    resp = await client.chat.completions.create(
        model=MODEL,
        messages=build_messages(req.question),
        max_tokens=500,
    )
    return {"answer": resp.choices[0].message.content}`,
        },
        {
          type: "p",
          text: "Run it with: uvicorn main:app --reload. Then open http://127.0.0.1:8000/docs. FastAPI has generated an interactive page from your code where you can try POST /chat without writing a frontend. Notice the wait: nothing, nothing, then the whole answer at once. That wait is what you fix next.",
        },
        {
          type: "tip",
          text: "Why AsyncOpenAI and async def? An LLM call is mostly waiting on the network. With async, one server process can wait on hundreds of users at the same time. If you call the normal blocking client inside an async def function, the whole server freezes for every other user until that one call returns.",
        },
        { type: "h", text: "Step 2: stream tokens with Server-Sent Events" },
        {
          type: "p",
          text: "Pass stream=True and the SDK stops returning one big response. It gives you an iterator of small chunks, and each chunk carries the next piece of text in chunk.choices[0].delta.content. Your job is to forward each piece to the browser the moment it arrives. FastAPI's StreamingResponse does that: you hand it a generator, and every value you yield is sent immediately.",
        },
        {
          type: "p",
          text: "You also need a format the browser understands. Server-Sent Events (SSE) is the simplest one: plain text over normal HTTP, where each message is a line starting with \"data: \" followed by a blank line. Wrap each token in JSON before sending it. Tokens often contain newlines, and a raw newline would break the message boundary.",
        },
        {
          type: "code",
          lang: "python",
          code: String.raw`# main.py (continued)
import json

from fastapi.responses import StreamingResponse


def sse(data: dict, event: str = "") -> str:
    """Format one Server-Sent Event: optional event name, JSON payload, blank line."""
    head = f"event: {event}\n" if event else ""
    return f"{head}data: {json.dumps(data)}\n\n"


async def token_stream(question: str):
    try:
        stream = await client.chat.completions.create(
            model=MODEL,
            messages=build_messages(question),
            max_tokens=500,
            stream=True,
        )
        async for chunk in stream:
            if not chunk.choices:
                continue
            token = chunk.choices[0].delta.content
            if token:
                yield sse({"token": token})
        yield sse({"done": True}, event="done")
    except Exception:
        # The 200 status has already been sent, so report the failure inside the stream.
        yield sse({"error": "Generation failed. Please retry."}, event="error")


@app.post("/chat/stream")
async def chat_stream(req: ChatRequest):
    return StreamingResponse(
        token_stream(req.question),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )`,
        },
        {
          type: "p",
          text: "On the wire the response now looks like this: data: {\"token\": \"Binary\"}, a blank line, data: {\"token\": \" search\"}, a blank line, and so on until the done event. Two details matter. The delta can be empty (the first and last chunks often are), so check before you yield. And once the first byte has gone out, the status code is already 200, so an error halfway through cannot become a 500. You report it as an event inside the stream, as the except block does.",
        },
        { type: "h", text: "Step 3: read the stream, and measure it" },
        {
          type: "p",
          text: "Test from Python first. This small client prints tokens as they arrive and reports both clocks, which gives you real numbers for your README.",
        },
        {
          type: "code",
          lang: "python",
          code: String.raw`# client.py
import json
import time

import httpx

URL = "http://127.0.0.1:8000/chat/stream"
question = "Explain binary search in 3 lines."

start = time.perf_counter()
first_token_at = None

with httpx.stream("POST", URL, json={"question": question}, timeout=60) as r:
    r.raise_for_status()
    for line in r.iter_lines():
        if not line.startswith("data: "):
            continue
        data = json.loads(line[len("data: "):])
        if "token" in data:
            if first_token_at is None:
                first_token_at = time.perf_counter() - start
            print(data["token"], end="", flush=True)
        elif "error" in data:
            print("\n[error]", data["error"])

total = time.perf_counter() - start
if first_token_at is not None:
    print(f"\n\nfirst token: {first_token_at:.2f}s | full answer: {total:.2f}s")`,
        },
        {
          type: "p",
          text: "In the browser, the built-in EventSource only supports GET requests, and a chat question belongs in a POST body. So use fetch and read the response body as a stream. The one trap: a network read does not line up with event boundaries. One read can hold three events, or half of one. Keep a buffer, split on the blank line, and hold the unfinished tail for the next read.",
        },
        {
          type: "code",
          lang: "javascript",
          code: String.raw`async function ask(question, onToken) {
  const res = await fetch("http://127.0.0.1:8000/chat/stream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop(); // the last piece may be half an event: keep it for the next read
    for (const event of events) {
      const line = event.split("\n").find((l) => l.startsWith("data: "));
      if (!line) continue;
      const data = JSON.parse(line.slice(6));
      if (data.token) onToken(data.token);
      if (data.error) throw new Error(data.error);
    }
  }
}

// usage: append each token to the page as it arrives
const box = document.querySelector("#answer");
ask("Explain binary search in 3 lines.", (token) => (box.textContent += token));`,
        },
        { type: "h", text: "Step 4: plug in your RAG bot" },
        {
          type: "p",
          text: "Your Module 3 bot needs one extra step before the model call: retrieval. Do the retrieval first, send the sources as their own event so the UI can show \"Answering from: dbms-notes.pdf\" straight away, then stream the answer. The Chroma query is a blocking call, so run it in a thread to keep the event loop free for other users.",
        },
        {
          type: "code",
          lang: "python",
          code: String.raw`# main.py (continued): streaming RAG
import chromadb
from fastapi.concurrency import run_in_threadpool

chroma = chromadb.PersistentClient(path="./chroma_db")
notes = chroma.get_or_create_collection("placement_notes")


async def rag_stream(question: str):
    try:
        # Chroma's query blocks, so run it in a thread instead of freezing the event loop.
        hits = await run_in_threadpool(notes.query, query_texts=[question], n_results=4)
        chunks = hits["documents"][0]
        sources = [(meta or {}).get("source", "unknown") for meta in hits["metadatas"][0]]
        yield sse({"sources": sources}, event="sources")

        context = "\n\n".join(chunks)
        stream = await client.chat.completions.create(
            model=MODEL,
            max_tokens=500,
            stream=True,
            messages=[
                {
                    "role": "system",
                    "content": SYSTEM + " Answer only from the context. If the answer is not there, say you do not know.",
                },
                {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {question}"},
            ],
        )
        async for chunk in stream:
            if chunk.choices and chunk.choices[0].delta.content:
                yield sse({"token": chunk.choices[0].delta.content})
        yield sse({"done": True}, event="done")
    except Exception:
        yield sse({"error": "Generation failed. Please retry."}, event="error")


@app.post("/rag/stream")
async def rag_chat_stream(req: ChatRequest):
    return StreamingResponse(
        rag_stream(req.question),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )`,
        },
        {
          type: "p",
          text: "Use the same collection name and the same embedding model you used when you built the index in Module 3. If you embedded your chunks with an API model such as text-embedding-3-small, embed the question with that same model and pass query_embeddings instead of query_texts. Mixing two embedding models gives you confident, irrelevant chunks.",
        },
        { type: "h", text: "What changes when you deploy" },
        {
          type: "list",
          items: [
            "Start command: uvicorn main:app --host 0.0.0.0 --port $PORT. Most Python hosts (Render, Railway, Fly.io or a plain VM) give you the port in an environment variable.",
            "Secrets: set OPENAI_API_KEY in the host's dashboard. The key lives only on the server. That is the whole reason the backend exists: a key shipped inside React code is public.",
            "Buffering: some proxies collect the whole response before passing it on, so the answer arrives in one lump. The X-Accel-Buffering: no header switches that off for nginx. Always test streaming on the deployed URL, not just on localhost.",
            "Disconnects: when a user closes the tab, the server cancels your generator. Catch Exception, not everything, so the cancellation passes through and you stop generating tokens nobody will read.",
            "Limits: keep max_tokens set, add a client timeout such as AsyncOpenAI(timeout=30), and require a login before /chat/stream. Per-user daily limits come in the next lesson.",
          ],
        },
        { type: "h", text: "Common mistakes" },
        {
          type: "list",
          items: [
            "Using the blocking OpenAI client inside async def. It works for one user in testing and freezes for everyone under load. Use AsyncOpenAI with await, or write a plain def endpoint, which FastAPI runs in a thread pool.",
            "Yielding raw tokens. A token that contains a newline breaks the SSE framing and words go missing in the UI. Always JSON-encode the payload.",
            "Using EventSource for a POST endpoint. It only does GET. Use fetch and read res.body.",
            "Assuming one network read equals one event. Buffer and split on the blank line, or you will hit JSON.parse errors that only show up on slow connections.",
            "Trying to return a 500 after the stream has started. The headers are gone. Send an error event and let the UI show a retry button.",
            "Forgetting CORS. The browser blocks a page on localhost:3000 from calling localhost:8000 unless the backend allows that origin.",
            "Testing only on localhost. Buffering, timeouts and cold starts only show up on the real host.",
          ],
        },
        { type: "h", text: "How this shows up in interviews" },
        {
          type: "list",
          items: [
            "\"Why stream if the total time is the same?\" Because users judge speed by time to first token. Streaming cuts the wait before anything appears from seconds to a fraction of a second, lets users read while the model writes, and lets them stop early. Cost and total time do not change.",
            "\"SSE or WebSockets for an LLM chat?\" SSE. The client sends one POST and the server streams text back, which is one-way. SSE is plain HTTP, so it passes through proxies and load balancers without special setup. WebSockets are for two-way real-time traffic such as voice or collaborative editing, and they cost more to operate.",
            "\"What is the difference between def and async def in FastAPI?\" An async def endpoint runs on the event loop and must never block; a def endpoint runs in a thread pool. LLM calls are I/O-bound, so async with an async client lets one worker hold many open streams at once.",
            "\"The model fails halfway through a stream. What does the user see?\" The status is already 200, so I send an error event in the stream. The UI keeps the partial text, shows a retry option, and the server logs the failure with the request id.",
          ],
        },
        {
          type: "tip",
          text: "Record a 10-second GIF of your answer streaming in and put it at the top of your README. It is the fastest way to show a recruiter that this is a working product and not a notebook.",
        },
      ],
      quiz: {
        question:
          "A 400-token answer takes about 8 seconds to generate (illustrative). You switch the endpoint from a normal JSON response to streaming. What changes for the user?",
        options: [
          "The full answer now completes in about 1 second",
          "The first words appear almost immediately, but the full answer still takes about 8 seconds and costs the same",
          "The answer costs fewer tokens because it is sent in smaller chunks",
          "Nothing changes unless you also switch from HTTP to WebSockets",
        ],
        answer: 1,
        explanation:
          "Streaming lowers time to first token, not total time or cost. The model generates the same tokens at the same speed; you just forward each one as it is produced. Plain HTTP with Server-Sent Events is enough.",
      },
      task: "Wrap your Module 3 RAG bot in a FastAPI app. Deliverables: (1) main.py with GET /health and POST /rag/stream that sends a sources event and then tokens as Server-Sent Events; (2) client.py that prints tokens live and reports time to first token and total time; run it on 5 questions and note both numbers; (3) a 10-second GIF of the stream in your README, with the two numbers written under it.",
    },
    {
      slug: "cost-latency",
      title: "Cost, latency and caching",
      minutes: 40,
      summary:
        "Measure what every request costs in tokens, rupees and seconds, then cut it with three levers: fewer tokens, a smaller model for easy questions, and a cache.",
      blocks: [
        {
          type: "p",
          text: "In a college demo nobody asks what a request costs. In production it is the first question. Every call to the model spends tokens, which is money, and seconds, which is your user's patience. Ten classmates testing your bot will never show you the problem. A placement-season rush of a few thousand students will.",
        },
        {
          type: "p",
          text: "The good news is that you only have three levers. Send fewer tokens. Use a smaller model when the question is easy. And best of all, skip the model when you already have the answer. This lesson covers all three, and it starts with the step most people skip: measuring.",
        },
        { type: "h", text: "Measure first: where the money and the seconds go" },
        {
          type: "p",
          text: "The bill is simple arithmetic: input tokens times the input price, plus output tokens times the output price. Two facts hold for most hosted models. Output tokens are priced higher than input tokens. And output is generated one token at a time, so a long answer is slow as well as costly. A RAG request is the opposite shape: heavy on input. Four chunks of about 300 tokens each, plus a system prompt and the question, is roughly 1,400 input tokens to produce a 150-token answer (illustrative numbers).",
        },
        {
          type: "p",
          text: "Every response already tells you what it used, in resp.usage. So before you optimise anything, wrap your model call in a function that returns tokens, seconds and cost for each request.",
        },
        {
          type: "code",
          lang: "python",
          code: String.raw`# meter.py
import time

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI()
MODEL = "gpt-4o-mini"

# Placeholder prices in rupees per 1 million tokens. These are NOT real prices:
# copy today's numbers from your provider's pricing page and note the date.
INPUT_RS_PER_M = 10.0
OUTPUT_RS_PER_M = 40.0


def ask(question: str, max_tokens: int = 300) -> dict:
    start = time.perf_counter()
    resp = client.chat.completions.create(
        model=MODEL,
        max_tokens=max_tokens,
        messages=[{"role": "user", "content": question}],
    )
    seconds = time.perf_counter() - start
    usage = resp.usage
    cost = (usage.prompt_tokens * INPUT_RS_PER_M + usage.completion_tokens * OUTPUT_RS_PER_M) / 1_000_000
    return {
        "answer": resp.choices[0].message.content,
        "input_tokens": usage.prompt_tokens,
        "output_tokens": usage.completion_tokens,
        "seconds": round(seconds, 2),
        "cost_rs": round(cost, 5),
    }


if __name__ == "__main__":
    row = ask("Explain the difference between a process and a thread in 4 lines.")
    print(row["answer"])
    print({k: v for k, v in row.items() if k != "answer"})`,
        },
        {
          type: "tip",
          text: "Prices change often and differ between providers. Keep them in one config file with the date you checked them, and say that date when you quote a cost in your README or in an interview.",
        },
        { type: "h", text: "Lever 1: send fewer tokens" },
        {
          type: "list",
          items: [
            "Trim the system prompt. It is sent with every single request, so 200 wasted tokens there are wasted thousands of times a day.",
            "Retrieve fewer, better chunks. The top 3 or 4 usually beat the top 10: more context costs more and often gives a worse answer.",
            "Cap the chat history. The app resends the whole conversation on every call, so a long chat gets more expensive with each message. Keep the last few turns, or a short running summary.",
            "Set max_tokens and ask for the length you want, for example \"answer in 5 lines\". Output is the expensive and slow side.",
            "Keep the fixed part of the prompt at the start and the changing part at the end. Several providers discount a repeated prompt prefix (prompt caching), and that only works when the prefix is identical each time.",
          ],
        },
        { type: "h", text: "Lever 2: route easy questions to a small model" },
        {
          type: "p",
          text: "\"What is the full form of DBMS?\" does not need your largest model. \"Design a rate limiter for 1 lakh users and compare token bucket with sliding window\" might. A router picks the model per request. Start with plain rules, because they are free, instant and easy to debug.",
        },
        {
          type: "code",
          lang: "python",
          code: String.raw`# router.py
SMALL, LARGE = "gpt-4o-mini", "gpt-4o"
HARD_HINTS = ("design", "compare", "trade-off", "debug", "prove", "step by step")


def pick_model(question: str) -> str:
    q = question.lower()
    if len(q.split()) > 60 or any(hint in q for hint in HARD_HINTS):
        return LARGE
    return SMALL


if __name__ == "__main__":
    print(pick_model("What is the full form of DBMS?"))                     # gpt-4o-mini
    print(pick_model("Design a rate limiter and compare two algorithms."))  # gpt-4o`,
        },
        {
          type: "p",
          text: "Routing is only a saving if quality holds. Run your Module 3 eval set with everything on the large model, then with the router, and compare. If the score drops on the questions that went to the small model, tighten the rules. A cheaper wrong answer is not cheaper.",
        },
        { type: "h", text: "Lever 3: cache, so the model is not called at all" },
        {
          type: "diagram",
          id: "cost-cache",
          caption: "A cache hit skips the model: no tokens billed and almost no waiting.",
        },
        {
          type: "p",
          text: "On a placement-prep bot, a large share of traffic is the same handful of questions: explain normalisation, what is a deadlock, how do I introduce myself. Answer each one once, store it, and serve the stored answer to everyone who asks after that. The simplest version is an exact-match cache: clean up the question, hash it together with the model name and a prompt version, and keep the answer with an expiry time.",
        },
        {
          type: "code",
          lang: "python",
          code: String.raw`# cache.py
import hashlib
import time

from meter import MODEL, ask

PROMPT_VERSION = "v1"  # bump this whenever you change the system prompt or the documents
TTL_SECONDS = 24 * 60 * 60
_cache: dict[str, tuple[float, dict]] = {}
stats = {"hits": 0, "misses": 0}


def cache_key(question: str) -> str:
    normalised = " ".join(question.lower().split())
    raw = f"{MODEL}|{PROMPT_VERSION}|{normalised}"
    return hashlib.sha256(raw.encode()).hexdigest()


def cached_ask(question: str) -> dict:
    key = cache_key(question)
    entry = _cache.get(key)
    if entry and time.time() - entry[0] < TTL_SECONDS:
        stats["hits"] += 1
        return {**entry[1], "cached": True, "seconds": 0.0, "cost_rs": 0.0}
    stats["misses"] += 1
    row = ask(question)
    _cache[key] = (time.time(), row)
    return {**row, "cached": False}


if __name__ == "__main__":
    questions = [
        "What is normalisation in DBMS?",
        "what is  normalisation in dbms?",  # same question, typed differently
        "Explain deadlock in operating systems.",
        "What is normalisation in DBMS?",
    ]
    rows = [cached_ask(q) for q in questions]
    total = sum(r["cost_rs"] for r in rows)
    print(stats, f"total cost: Rs {total:.5f}")`,
        },
        {
          type: "p",
          text: "Run it and you should see 2 hits and 2 misses: four questions answered for the price of two. A Python dict is fine while you learn, but it lives inside one process. In production you run several workers and restart them often, so each worker would have its own cache and lose it on every deploy. Redis fixes that: one shared store, with expiry built in.",
        },
        {
          type: "code",
          lang: "python",
          code: String.raw`# redis_cache.py  (pip install redis; needs a Redis server running)
import json

import redis

from cache import TTL_SECONDS, cache_key
from meter import ask

r = redis.Redis(host="localhost", port=6379, decode_responses=True)


def cached_ask_redis(question: str) -> dict:
    key = "answer:" + cache_key(question)
    hit = r.get(key)
    if hit:
        return {**json.loads(hit), "cached": True, "cost_rs": 0.0}
    row = ask(question)
    r.setex(key, TTL_SECONDS, json.dumps(row))
    return {**row, "cached": False}`,
        },
        {
          type: "p",
          text: "An exact-match cache misses paraphrases: \"How do I prepare for TCS aptitude?\" and \"Tips for the TCS aptitude round?\" are different strings. A semantic cache handles them with the tool you built in Module 2. Embed the question, compare it with the questions you have already answered, and reuse the stored answer when the cosine similarity is above a threshold.",
        },
        {
          type: "code",
          lang: "python",
          code: String.raw`# semantic_cache.py  (pip install numpy)
import numpy as np
from openai import OpenAI

from meter import ask

client = OpenAI()
THRESHOLD = 0.92  # illustrative starting point: tune it on your own questions
_entries: list[tuple[np.ndarray, dict]] = []


def embed(text: str) -> np.ndarray:
    resp = client.embeddings.create(model="text-embedding-3-small", input=text)
    vec = np.array(resp.data[0].embedding)
    return vec / np.linalg.norm(vec)


def semantic_ask(question: str) -> dict:
    q = embed(question)
    if _entries:
        scores = [float(q @ vec) for vec, _ in _entries]
        best = int(np.argmax(scores))
        if scores[best] >= THRESHOLD:
            return {**_entries[best][1], "cached": True, "similarity": round(scores[best], 3)}
    row = ask(question)
    _entries.append((q, row))
    return {**row, "cached": False}


if __name__ == "__main__":
    first = semantic_ask("How do I prepare for the TCS aptitude round?")
    second = semantic_ask("How should I prepare for the TCS aptitude test?")
    third = semantic_ask("How do I prepare for the Infosys aptitude round?")
    for row in (first, second, third):
        print(row["cached"], row.get("similarity"))`,
        },
        {
          type: "p",
          text: "Look closely at the third question in that test. TCS and Infosys questions are worded almost identically, so their embeddings are very close, but the right answers differ. If your threshold is too low, the Infosys student gets the TCS answer, delivered with full confidence. That is the real risk of a semantic cache: it can be wrong in a way an exact-match cache never is. Keep the threshold high, test it on pairs like this one, and remember it is not free either: every request pays for one embedding call.",
        },
        {
          type: "list",
          items: [
            "Do not cache personalised answers such as a resume review. If you must, put the user id in the key.",
            "Do not cache time-sensitive answers such as \"is the registration form still open?\", or give them a very short expiry.",
            "Change PROMPT_VERSION when the system prompt or the documents change. Otherwise users keep getting answers written by the old prompt until the entries expire.",
            "Track the hit rate. A cache that hits on 2% of requests is extra code with no payoff.",
          ],
        },
        { type: "h", text: "Latency: fix the slowest requests, not the average" },
        {
          type: "list",
          items: [
            "Stream the response (previous lesson). It fixes time to first token without changing anything else.",
            "Shorten the output. Tokens are generated one at a time, so answer length is the biggest dial on total time.",
            "Use the smaller model where the router allows it. Smaller models usually respond faster as well as cost less.",
            "Run independent calls side by side with asyncio.gather instead of one after another, for example when you summarise three documents.",
            "Report p50 and p95, not the average. p95 is the time that 95% of requests beat. One 12-second request in twenty ruins that user's experience, and an average hides it. With your logged latencies in a list: statistics.quantiles(latencies, n=20)[18].",
          ],
        },
        { type: "h", text: "Usage limits: protect your wallet" },
        {
          type: "p",
          text: "A public demo link with your API key behind it can be drained overnight by one script, or by one enthusiastic batchmate. Give every user a daily budget and return HTTP 429 (too many requests) when it runs out.",
        },
        {
          type: "code",
          lang: "python",
          code: String.raw`# limits.py
from collections import defaultdict
from datetime import date

from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel

from cache import cached_ask

app = FastAPI()
DAILY_LIMIT = 20
_used: dict[tuple[str, date], int] = defaultdict(int)


class ChatRequest(BaseModel):
    question: str


def check_limit(user_id: str) -> int:
    key = (user_id, date.today())
    if _used[key] >= DAILY_LIMIT:
        raise HTTPException(status_code=429, detail="Daily limit reached. Come back tomorrow.")
    _used[key] += 1
    return DAILY_LIMIT - _used[key]


@app.post("/chat")
def chat(req: ChatRequest, x_user_id: str = Header()):
    remaining = check_limit(x_user_id)
    row = cached_ask(req.question)
    return {"answer": row["answer"], "cached": row["cached"], "remaining_today": remaining}`,
        },
        {
          type: "p",
          text: "This reads the user from an X-User-Id header to keep the example short. In your real app, take the user id from the login token you verify on the server, because a header is something any client can fake. And like the cache, move the counter to Redis once you run more than one worker.",
        },
        { type: "h", text: "Common mistakes" },
        {
          type: "list",
          items: [
            "Optimising before measuring. Log tokens, seconds and cost per request first, then fix the biggest number.",
            "Leaving the prompt version and model out of the cache key, so a prompt change keeps serving old answers.",
            "Setting the semantic cache threshold by feel. Test it on near-identical questions that need different answers.",
            "Caching personalised or time-sensitive answers.",
            "Using an in-memory dict in production with several workers. Hit rate looks low and the cache empties on every deploy.",
            "No max_tokens and an ever-growing chat history. Both make cost creep up quietly.",
            "Quoting only average latency, which hides the slow requests users complain about.",
            "Routing to a smaller model without re-running your eval set.",
          ],
        },
        { type: "h", text: "How this shows up in interviews" },
        {
          type: "list",
          items: [
            "\"Your LLM feature costs too much. What do you do?\" First I measure tokens, latency and cost per request to find where it goes. Then, in order: cache repeated questions so they skip the model, route easy questions to a smaller model and confirm quality on my eval set, and cut tokens by trimming the prompt, retrieving fewer chunks and capping output length.",
            "\"Exact-match cache or semantic cache?\" Exact match is simple, safe and misses paraphrases. Semantic catches paraphrases using embeddings and a similarity threshold, but it can return a wrong answer for a question that only looks similar, and it adds an embedding call. I start with exact match, measure the hit rate, and add semantic only with a high threshold and tests.",
            "\"Why do you report p95 latency and not the average?\" Because users feel the slow requests. Averages hide a long tail. p95 tells me what the unlucky one in twenty experiences, and that is what I set targets on.",
          ],
        },
        {
          type: "tip",
          text: "Put two numbers in every project README: cost per query in rupees (with the date you checked prices) and p95 latency. Very few fresher portfolios have them, and they are exactly what an engineering interviewer asks about next.",
        },
      ],
      quiz: {
        question:
          "Your FAQ bot caches answers using only the cleaned-up question as the key. You then rewrite the system prompt so that answers include citations. What happens?",
        options: [
          "Nothing changes; the cache refreshes itself when the prompt changes",
          "Cached questions keep returning the old answers without citations until the entries expire",
          "Every request becomes a cache miss, so cost doubles",
          "The model starts hallucinating citations for cached questions",
        ],
        answer: 1,
        explanation:
          "The key does not include anything about the prompt, so the cache cannot tell that the answers are out of date. Put the model name and a prompt version in the key, and bump the version when the prompt or documents change.",
      },
      task: "Add meter.py and an exact-match cache to your FastAPI bot. Write a fixed list of 30 questions in which about 10 are repeats, and run it twice: once without the cache and once with it. Deliverable: a small table in your README with hit rate, total input and output tokens, total cost in rupees (using prices you looked up, with the date), and p50 and p95 latency, before and after. Add a per-user daily limit that returns 429.",
    },
    {
      slug: "portfolio-interviews",
      title: "Portfolio, resume and AI interview prep",
      minutes: 40,
      summary:
        "Turn your projects into proof: three pinned repos with a demo, a diagram and measured numbers, resume bullets built on those numbers, and answers to the AI interview questions you will actually get.",
      blocks: [
        {
          type: "p",
          text: "You now have six projects. A recruiter will not read six projects. In placement season your resume gets a quick skim, and your GitHub link gets one click if you are lucky. This lesson is about making that skim and that click count.",
        },
        {
          type: "p",
          text: "Think of it as a proof stack. A demo proves the thing works. An architecture diagram proves you understand why it works. Metrics prove you measured it. Resume bullets carry those three onto the one page a recruiter actually reads. Leave out a layer and the others get weaker: a demo without numbers looks like a tutorial, and numbers without a demo look made up.",
        },
        {
          type: "diagram",
          id: "portfolio",
          caption: "Demo, architecture, metrics, resume bullets: each layer makes the next one believable.",
        },
        { type: "h", text: "Pick three projects, not six" },
        {
          type: "p",
          text: "Pin three repositories on GitHub and put your effort there. A strong default set: the RAG bot with its evaluation numbers (Module 3), the agent with tools and a human approval step (Module 4), and the deployed streaming app with cost and latency numbers (this module). If you are applying to roles that lean towards model training, swap one for your fine-tuning project (Module 5). Each of the three should show a different skill.",
        },
        {
          type: "p",
          text: "Then make each one yours. Point the RAG bot at your own college's placement PDFs, your department's syllabus or your hostel rulebook, not the sample file from the lesson. Interviewers have seen the tutorial version many times. They have not seen yours, and your own data gives you real stories to tell about what went wrong.",
        },
        { type: "h", text: "The README that gets read" },
        {
          type: "p",
          text: "A README is a landing page, not a setup manual. Someone should understand what you built, see it working and find your numbers without scrolling far. Use this order.",
        },
        {
          type: "code",
          lang: "markdown",
          code: String.raw`# Placement Notes Bot

Ask questions about your placement notes and get answers with sources.
Built for final-year students revising DBMS, OS and CN before interviews.

**Live demo:** https://your-app.example.com | **2-minute walkthrough:** <video link>

![Answer streaming in](docs/demo.gif)

## How it works

![Architecture](docs/architecture.png)

1. PDFs are split into overlapping chunks and embedded into a Chroma collection.
2. A question is embedded, the top 4 chunks are retrieved, and the model answers only from them.
3. FastAPI streams the answer to the browser and caches repeated questions.

## Results

| Metric | Value | How it was measured |
| --- | --- | --- |
| Documents indexed | <count> | scripts/ingest.py |
| Hit rate @4 | <your number> | scripts/eval.py on <N> hand-written questions |
| p95 latency | <your number> s | scripts/report.py over <N> requests |
| Cost per query | Rs <your number> | scripts/report.py, prices checked on <date> |

## Run it

    pip install -r requirements.txt
    cp .env.example .env    # add your API key
    uvicorn main:app --reload

## What I would improve next

- Re-rank retrieved chunks before answering.
- Move the cache and rate limits to Redis.`,
        },
        {
          type: "list",
          items: [
            "Demo: a live URL plus a short GIF. Free hosting tiers often go to sleep, so open your link before every application and keep a recorded walkthrough as a backup.",
            "Architecture: one picture with boxes and arrows from the user's question to the answer. Draw it in Excalidraw or draw.io in fifteen minutes.",
            "Results: a small table where every number has a \"how it was measured\" column.",
            "What I would improve next: two or three honest lines. It shows judgement, and it hands the interviewer a question you are ready for.",
          ],
        },
        { type: "h", text: "Numbers you can defend" },
        {
          type: "p",
          text: "You already produced the numbers in earlier lessons. Hit rate comes from your Module 3 evaluation set. Cost per query and p95 latency come from the meter you built in the previous lesson. The document count comes from your ingestion script. The rule is simple: every number in your README must be printed by a script in the repo.",
        },
        {
          type: "p",
          text: "Interviewers will test this. \"How did you get 87%?\" and \"On how many questions?\" are standard follow-ups. \"On 60 questions I wrote by hand, and the script is in the repo\" is a strong answer. A bigger number you cannot explain is a weak one.",
        },
        {
          type: "code",
          lang: "python",
          code: String.raw`# scripts/report.py
# Turns your request log into the README results table.
# Each line of runs.jsonl looks like:
#   {"seconds": 1.8, "cost_rs": 0.02, "cached": false, "hit": true}
import json
import statistics
from pathlib import Path

SAMPLE = [  # illustrative rows, used only until you have a real runs.jsonl
    {"seconds": 1.8, "cost_rs": 0.02, "cached": False, "hit": True},
    {"seconds": 0.0, "cost_rs": 0.0, "cached": True, "hit": True},
    {"seconds": 2.4, "cost_rs": 0.03, "cached": False, "hit": False},
    {"seconds": 1.5, "cost_rs": 0.02, "cached": False, "hit": True},
]

log = Path("runs.jsonl")
if log.exists():
    rows = [json.loads(line) for line in log.read_text().splitlines() if line.strip()]
else:
    rows = SAMPLE

n = len(rows)
latencies = [r["seconds"] for r in rows if not r["cached"]]
hit_rate = sum(r["hit"] for r in rows) / n
cache_rate = sum(r["cached"] for r in rows) / n
cost_per_query = sum(r["cost_rs"] for r in rows) / n
p50 = statistics.median(latencies)
p95 = statistics.quantiles(latencies, n=20)[18]

print("| Metric | Value |")
print("| --- | --- |")
print(f"| Requests | {n} |")
print(f"| Hit rate @4 | {hit_rate:.0%} |")
print(f"| Cache hit rate | {cache_rate:.0%} |")
print(f"| p50 / p95 latency | {p50:.1f} s / {p95:.1f} s |")
print(f"| Cost per query | Rs {cost_per_query:.3f} |")`,
        },
        {
          type: "tip",
          text: "Small honest numbers beat big vague ones. \"82% hit rate@4 on 50 questions\" is believable. \"99% accuracy\" with no test set behind it is a red flag to anyone who has built these systems.",
        },
        { type: "h", text: "Resume bullets: action, scope, metric" },
        {
          type: "p",
          text: "A strong bullet answers three questions in one line. What did you build? How big was it? How well did it work? The numbers in the examples below are illustrative. Yours must come from your own scripts.",
        },
        {
          type: "list",
          items: [
            "Weak: \"Worked on an AI chatbot using LangChain.\" Strong: \"Built a RAG bot over 1,200 placement documents; 87% hit rate@4 on a 60-question eval set; ₹0.04 per query after caching.\"",
            "Weak: \"Familiar with FastAPI and deployment.\" Strong: \"Deployed a streaming FastAPI backend with per-user daily limits; first token in 0.4 s, p95 full answer in 6 s.\"",
            "Weak: \"Made an AI agent.\" Strong: \"Built a tool-calling agent with 4 tools and a human approval step for risky actions; completed 18 of 20 test tasks.\"",
          ],
        },
        {
          type: "list",
          items: [
            "Keep it to one page. As a fresher, put Projects above coursework.",
            "Put your GitHub and live demo links at the top, next to your email.",
            "List only skills you can be questioned on for five minutes. Ten frameworks you touched once will hurt you.",
            "Drop adjectives such as \"passionate\" and \"hardworking\". Numbers do that job better.",
            "Never write a number you cannot reproduce on a call with your laptop open.",
          ],
        },
        { type: "h", text: "The questions you will actually get" },
        {
          type: "list",
          items: [
            "\"Explain RAG end to end.\" Offline, I split documents into chunks, embed each chunk and store the vectors in a vector database. Online, I embed the question, retrieve the top-k most similar chunks, put them in the prompt with an instruction to answer only from that context, and return the answer with its sources. I evaluate retrieval and answer quality separately.",
            "\"How would you reduce hallucinations?\" Ground the answer in retrieved context, tell the model to say it does not know when the context has no answer, show citations, keep temperature low, and validate structured output against a schema. Then measure it on an eval set, because you cannot reduce what you do not measure. For actions with consequences, add a human approval step.",
            "\"When would you fine-tune instead of using RAG?\" RAG fixes missing knowledge: facts that change, or answers that need sources. Fine-tuning fixes behaviour: a consistent style, a strict format, or a narrow task you want from a smaller, cheaper model, when you have good training examples. I try prompting first, then RAG, then fine-tuning, and they can be combined.",
          ],
        },
        { type: "h", text: "System design: a support bot for 1 lakh daily users" },
        {
          type: "p",
          text: "This question is not about drawing the perfect diagram. It checks whether you think in a sensible order. Clarify first: what do users ask, what data answers them, which languages, how fast must it be? Then estimate the load. Then draw the path: API with login and rate limits, cache, retriever, model router, streamed answer, with logging and an eval set around it. Then talk about cost and latency levers, and what happens when something fails.",
        },
        {
          type: "code",
          lang: "python",
          code: String.raw`# capacity.py: back-of-envelope numbers for "a support bot for 1 lakh daily users"
# Every input is an assumption. Say them out loud in the interview, then compute.
daily_users = 100_000
questions_per_user = 3
peak_share = 0.20        # share of the day's traffic that lands in the busiest hour
cache_hit_rate = 0.40    # repeated questions answered without the model
input_tokens = 1_400     # system prompt + 4 retrieved chunks + question
output_tokens = 150
input_rs_per_m = 10.0    # placeholder prices in rupees per 1 million tokens:
output_rs_per_m = 40.0   # replace them with your provider's current pricing

requests_per_day = daily_users * questions_per_user
peak_rps = requests_per_day * peak_share / 3600
model_calls = requests_per_day * (1 - cache_hit_rate)
tokens_in = model_calls * input_tokens
tokens_out = model_calls * output_tokens
cost_per_day = (tokens_in * input_rs_per_m + tokens_out * output_rs_per_m) / 1_000_000

print(f"requests/day:      {requests_per_day:,}")
print(f"peak requests/sec: {peak_rps:.0f}")
print(f"model calls/day:   {model_calls:,.0f}")
print(f"tokens/day:        {tokens_in + tokens_out:,.0f}")
print(f"cost/day:          Rs {cost_per_day:,.0f}  (with placeholder prices)")`,
        },
        {
          type: "p",
          text: "With these assumptions you get 3 lakh requests a day, about 17 a second in the busiest hour, and a cache that removes 40% of the model calls. The exact figures do not matter, and the prices are placeholders. What the interviewer scores is that you state your assumptions, do the arithmetic and let the numbers drive the design: 17 requests a second means several workers and a shared Redis cache, and the daily token total tells you whether routing to a smaller model is worth the effort.",
        },
        {
          type: "list",
          items: [
            "Model API is down or rate-limited: retry with backoff, fall back to a second model, and tell the user plainly.",
            "Retrieval finds nothing relevant: say \"I don't know\" and offer a handoff to a human, instead of guessing.",
            "Abuse or a runaway script: per-user daily limits and a cap on output tokens.",
            "Quality drifts after a prompt or document change: re-run the eval set before every release.",
          ],
        },
        { type: "h", text: "Practise out loud" },
        {
          type: "p",
          text: "Knowing an answer and saying it clearly under pressure are different skills. Use what you have learnt to build your own practice partner: a script that reads your README and interviews you about it. Say each answer aloud first, then type what you said.",
        },
        {
          type: "code",
          lang: "python",
          code: String.raw`# mock_interview.py: an interviewer that has read your README
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI()
readme = Path("README.md").read_text(encoding="utf-8")

messages = [
    {
        "role": "system",
        "content": (
            "You are a senior engineer interviewing a fresher for an AI engineer role. "
            "You have read the project README below. Ask ONE question at a time, 5 in total. "
            "Start with 'walk me through the project', then go deeper into design choices, "
            "evaluation numbers, failure cases and cost. After each answer, give two lines of "
            "blunt feedback and a score out of 5, then ask the next question.\n\nREADME:\n" + readme
        ),
    },
    {"role": "user", "content": "I am ready. Ask your first question."},
]

for turn in range(5):
    resp = client.chat.completions.create(model="gpt-4o-mini", messages=messages, temperature=0.4)
    question = resp.choices[0].message.content
    print(f"\nINTERVIEWER: {question}\n")
    messages.append({"role": "assistant", "content": question})
    messages.append({"role": "user", "content": input("YOU: ")})

messages.append(
    {"role": "user", "content": "The interview is over. Give feedback on my last answer, then list my 3 weakest areas and what to revise."}
)
final = client.chat.completions.create(model="gpt-4o-mini", messages=messages)
print("\nFEEDBACK:", final.choices[0].message.content)`,
        },
        { type: "h", text: "Common mistakes" },
        {
          type: "list",
          items: [
            "Pinning a tutorial clone with the tutorial's data and no changes of your own.",
            "A dead demo link. Check it before every application.",
            "A README that is only installation steps, with no demo, no diagram and no results.",
            "A skills line with ten frameworks and bullets with no numbers.",
            "Numbers you cannot explain: no eval set, no script, no idea how many questions.",
            "An API key committed to the repo. Deleting the file later does not remove it from git history, so revoke the key and create a new one.",
            "Reciting definitions. Interviewers remember \"in my project, chunk size 800 gave worse retrieval than 300\" far longer than a textbook answer.",
          ],
        },
        { type: "h", text: "How this shows up in interviews" },
        {
          type: "list",
          items: [
            "\"Walk me through your project.\" Keep it to two minutes: the problem and who it is for in one line, the architecture in three steps, one hard decision and why you made it, your numbers, and what you would do next. Then stop and let them ask.",
            "\"What was the hardest bug?\" Pick a real one and tell it as a story: what you saw, how you found the cause, what you changed, and the number before and after. For example, wrong chunks were coming back, the eval set showed a low hit rate, and smaller chunks with overlap raised it.",
            "\"What breaks first if you get ten times the users?\" Name the bottleneck and the fix: model rate limits and cost first, so cache and route; in-memory cache and counters next, so move them to Redis; then one server process, so add workers.",
          ],
        },
        {
          type: "tip",
          text: "Record a 2-minute screen walkthrough of your best project and link it in the README and on your resume. It works when the free server is asleep, and it is the best rehearsal for \"walk me through your project\" you will ever do.",
        },
        {
          type: "tip",
          text: "Applying off campus? Send the engineer or hiring manager two lines: what you built, one number, and the demo link. That gets more replies than \"please refer me\".",
        },
      ],
      quiz: {
        question: "Which resume bullet would a technical interviewer trust most? (The numbers are illustrative.)",
        options: [
          "Developed an AI-powered chatbot using LangChain, OpenAI, ChromaDB, FastAPI and React",
          "Achieved 99% accuracy with a state-of-the-art RAG chatbot",
          "Built a RAG bot over 1,200 placement documents; 87% hit rate@4 on a 60-question eval set; ₹0.04 per query after caching",
          "Passionate AI engineer who completed 6 projects in an AI engineering bootcamp",
        ],
        answer: 2,
        explanation:
          "It states what was built, how big it was and how well it worked, and each number says how it was measured, so the interviewer can ask about it and you can answer. A tool list shows no result, \"99% accuracy\" has no test set behind it, and adjectives are not evidence.",
      },
      task: "Ship your proof stack. (1) Deploy your capstone and pin 3 repos; each README has a demo GIF or live link, an architecture diagram, a results table printed by a script, and run steps. (2) Rewrite your resume with 3 bullets in action, scope, metric form, using only numbers your scripts produce. (3) Record a 2-minute walkthrough answering \"walk me through your project\". (4) Run mock_interview.py once and write down the 3 weak areas it reports.",
    },
  ],
};
