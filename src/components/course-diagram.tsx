"use client";

import { createContext, useContext, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const MarkerCtx = createContext("arrow");

export const DIAGRAM_IDS = [
  "llm-tokens",
  "api-call",
  "prompt-anatomy",
  "embeddings",
  "cosine",
  "vector-db",
  "chunking",
  "rag-pipeline",
  "rag-eval",
  "function-calling",
  "agent-loop",
  "guardrails",
  "ollama",
  "when-to-finetune",
  "lora",
  "fastapi-stream",
  "cost-cache",
  "portfolio",
  "learning-path",
  "campus-funnel",
] as const;

export type DiagramId = (typeof DIAGRAM_IDS)[number];

const titles: Record<DiagramId, string> = {
  "llm-tokens": "How an LLM predicts the next token",
  "api-call": "Your first LLM API call",
  "prompt-anatomy": "Production prompt anatomy",
  embeddings: "Text → embedding vectors",
  cosine: "Cosine similarity ranking",
  "vector-db": "Vector database query path",
  chunking: "Document chunking with overlap",
  "rag-pipeline": "RAG pipeline with citations",
  "rag-eval": "RAG evaluation loop",
  "function-calling": "Function / tool calling",
  "agent-loop": "Agent think → act → observe loop",
  guardrails: "Human-in-the-loop guardrails",
  ollama: "Local models with Ollama",
  "when-to-finetune": "Prompt vs RAG vs fine-tune",
  lora: "LoRA adapters on a frozen model",
  "fastapi-stream": "Streaming FastAPI response",
  "cost-cache": "Cost & latency levers",
  portfolio: "Portfolio proof stack",
  "learning-path": "12-week BeyondPlaced path",
  "campus-funnel": "Campus free → paid funnel",
};

type Props = {
  id: DiagramId;
  caption?: string;
  className?: string;
};

function Frame({
  title,
  children,
  className,
  viewBox = "0 0 720 280",
  uid = "d",
}: {
  title: string;
  children: ReactNode;
  className?: string;
  viewBox?: string;
  uid?: string;
}) {
  const arrowId = `arrow-${uid}`;
  return (
    <figure className={cn("overflow-hidden rounded-xl border border-border/80 bg-[#0B0D18]", className)}>
      <div className="border-b border-border/60 px-4 py-2 font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
        {title}
      </div>
      <div className="p-3 sm:p-4">
        <svg viewBox={viewBox} className="h-auto w-full" role="img" aria-label={title}>
          <defs>
            <marker id={arrowId} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#9AA3C7" />
            </marker>
          </defs>
          <MarkerCtx.Provider value={arrowId}>{children}</MarkerCtx.Provider>
        </svg>
      </div>
    </figure>
  );
}

function Box({
  x,
  y,
  w,
  h,
  label,
  sub,
  fill = "#171A2B",
  stroke = "#A08BFF",
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  fill?: string;
  stroke?: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={12} fill={fill} stroke={stroke} strokeWidth={1.5} />
      <text x={x + w / 2} y={sub ? y + h / 2 - 4 : y + h / 2 + 5} textAnchor="middle" fill="#F5F3FF" fontSize={13} fontFamily="system-ui,sans-serif" fontWeight={600}>
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle" fill="#9AA3C7" fontSize={11} fontFamily="system-ui,sans-serif">
          {sub}
        </text>
      )}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const markerId = useContext(MarkerCtx);
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#9AA3C7" strokeWidth={1.5} markerEnd={`url(#${markerId})`} />;
}

function FlowRow({
  title,
  steps,
  className,
  uid,
}: {
  title: string;
  steps: { label: string; sub?: string; stroke?: string }[];
  className?: string;
  uid: string;
}) {
  const gap = 16;
  const w = 120;
  const h = 64;
  const total = steps.length * w + (steps.length - 1) * gap;
  const startX = (720 - total) / 2;
  const y = 100;
  return (
    <Frame title={title} className={className} uid={uid}>
      {steps.map((s, i) => {
        const x = startX + i * (w + gap);
        return (
          <g key={s.label}>
            <Box x={x} y={y} w={w} h={h} label={s.label} sub={s.sub} stroke={s.stroke || (i === steps.length - 1 ? "#5FE3C0" : "#A08BFF")} />
            {i < steps.length - 1 && <Arrow x1={x + w} y1={y + h / 2} x2={x + w + gap - 4} y2={y + h / 2} />}
          </g>
        );
      })}
    </Frame>
  );
}

function DiagramSvg({ id }: { id: DiagramId }) {
  switch (id) {
    case "llm-tokens":
      return (
        <Frame title={titles[id]} uid={id}>
          <Box x={40} y={90} w={140} h={70} label="Prompt" sub="tokens in" />
          <Arrow x1={180} y1={125} x2={230} y2={125} />
          <Box x={230} y={80} w={160} h={90} label="LLM" sub="next-token probs" stroke="#FFC145" />
          <Arrow x1={390} y1={125} x2={440} y2={125} />
          <Box x={440} y={90} w={140} h={70} label="Next token" sub="sample / argmax" stroke="#5FE3C0" />
          <Arrow x1={580} y1={125} x2={630} y2={125} />
          <Box x={620} y={90} w={70} h={70} label="…" sub="repeat" fill="#121526" stroke="#5FE3C0" />
          <text x={360} y={220} textAnchor="middle" fill="#9AA3C7" fontSize={12} fontFamily="system-ui,sans-serif">
            Context window holds prompt + generated tokens together
          </text>
        </Frame>
      );
    case "api-call":
      return (
        <FlowRow uid={id} title={titles[id]}
          steps={[
            { label: "Your app", sub: "Python SDK" },
            { label: "API", sub: "chat.completions" },
            { label: "Model", sub: "gpt-4o-mini" },
            { label: "Reply", sub: "+ token usage", stroke: "#5FE3C0" },
          ]}
        />
      );
    case "prompt-anatomy":
      return (
        <Frame title={titles[id]} uid={id} viewBox="0 0 720 300">
          <Box x={40} y={40} w={200} h={60} label="1. Role" sub="system instructions" />
          <Box x={40} y={120} w={200} h={60} label="2. Constraints" sub="format, safety" stroke="#FFC145" />
          <Box x={40} y={200} w={200} h={60} label="3. User input" sub="delimited block" stroke="#5FE3C0" />
          <Arrow x1={240} y1={150} x2={310} y2={150} />
          <Box x={320} y={100} w={160} h={100} label="Model" sub="structured out" stroke="#A08BFF" />
          <Arrow x1={480} y1={150} x2={540} y2={150} />
          <Box x={540} y={110} w={140} h={80} label="JSON" sub="validate in code" stroke="#5FE3C0" />
        </Frame>
      );
    case "embeddings":
      return (
        <Frame title={titles[id]} uid={id}>
          <Box x={40} y={100} w={150} h={70} label="Text" sub='"placement drive"' />
          <Arrow x1={190} y1={135} x2={250} y2={135} />
          <Box x={250} y={90} w={160} h={90} label="Embed model" sub="text-embedding-3" stroke="#FFC145" />
          <Arrow x1={410} y1={135} x2={470} y2={135} />
          <Box x={470} y={100} w={200} h={70} label="Vector" sub="1536 floats" stroke="#5FE3C0" />
          <circle cx={560} cy={220} r={6} fill="#A08BFF" />
          <circle cx={590} cy={210} r={6} fill="#5FE3C0" />
          <circle cx={620} cy={230} r={6} fill="#FFC145" />
          <text x={520} y={255} fill="#9AA3C7" fontSize={11} fontFamily="system-ui,sans-serif">
            similar meanings → nearby points
          </text>
        </Frame>
      );
    case "cosine":
      return (
        <Frame title={titles[id]} uid={id}>
          <Box x={40} y={100} w={130} h={70} label="Query vec" />
          <Arrow x1={170} y1={135} x2={220} y2={135} />
          <Box x={220} y={85} w={200} h={100} label="Cosine sim" sub="dot / (|a||b|)" stroke="#FFC145" />
          <Arrow x1={420} y1={135} x2={470} y2={135} />
          <Box x={470} y={60} w={200} h={50} label="Doc A  0.91" stroke="#5FE3C0" />
          <Box x={470} y={120} w={200} h={50} label="Doc B  0.74" />
          <Box x={470} y={180} w={200} h={50} label="Doc C  0.22" stroke="#9AA3C7" />
        </Frame>
      );
    case "vector-db":
      return (
        <FlowRow uid={id} title={titles[id]}
          steps={[
            { label: "Embed", sub: "query text" },
            { label: "Store", sub: "Chroma / pgvector" },
            { label: "Search", sub: "top-k similar" },
            { label: "Chunks", sub: "+ metadata", stroke: "#5FE3C0" },
          ]}
        />
      );
    case "chunking":
      return (
        <Frame title={titles[id]} uid={id} viewBox="0 0 720 260">
          <rect x={40} y={70} width={640} height={40} rx={8} fill="#171A2B" stroke="#A08BFF" />
          <text x={360} y={95} textAnchor="middle" fill="#F5F3FF" fontSize={13} fontFamily="system-ui,sans-serif">
            Full document
          </text>
          <Box x={40} y={150} w={180} h={60} label="Chunk 1" sub="overlap →" />
          <Box x={200} y={150} w={180} h={60} label="Chunk 2" sub="← overlap →" stroke="#FFC145" />
          <Box x={360} y={150} w={180} h={60} label="Chunk 3" sub="← overlap →" />
          <Box x={520} y={150} w={160} h={60} label="Chunk 4" sub="+ metadata" stroke="#5FE3C0" />
        </Frame>
      );
    case "rag-pipeline":
      return (
        <Frame title={titles[id]} uid={id} viewBox="0 0 720 300">
          <Box x={20} y={40} w={120} h={55} label="Docs" />
          <Arrow x1={140} y1={67} x2={175} y2={67} />
          <Box x={175} y={40} w={120} h={55} label="Chunk" stroke="#FFC145" />
          <Arrow x1={295} y1={67} x2={330} y2={67} />
          <Box x={330} y={40} w={120} h={55} label="Embed" />
          <Arrow x1={450} y1={67} x2={485} y2={67} />
          <Box x={485} y={40} w={140} h={55} label="Vector DB" stroke="#A08BFF" />

          <Box x={20} y={150} w={120} h={55} label="Question" stroke="#5FE3C0" />
          <Arrow x1={140} y1={177} x2={200} y2={177} />
          <Box x={200} y={140} w={150} h={75} label="Retrieve" sub="top-k chunks" stroke="#FFC145" />
          <Arrow x1={350} y1={177} x2={400} y2={177} />
          <Box x={400} y={140} w={140} h={75} label="LLM" sub="answer + cite" />
          <Arrow x1={540} y1={177} x2={585} y2={177} />
          <Box x={585} y={150} w={115} h={55} label="UI" sub="sources" stroke="#5FE3C0" />

          <path d="M555 95 L555 140" stroke="#9AA3C7" strokeWidth={1.5} markerEnd={`url(#arrow-${id})`} fill="none" />
          <text x={360} y={270} textAnchor="middle" fill="#9AA3C7" fontSize={12} fontFamily="system-ui,sans-serif">
            No sources → toy chatbot. Citations → hireable project.
          </text>
        </Frame>
      );
    case "rag-eval":
      return (
        <FlowRow uid={id} title={titles[id]}
          steps={[
            { label: "Gold Qs", sub: "known answers" },
            { label: "Retrieve", sub: "hit@k" },
            { label: "Answer", sub: "faithfulness" },
            { label: "Report", sub: "cost + latency", stroke: "#5FE3C0" },
          ]}
        />
      );
    case "function-calling":
      return (
        <Frame title={titles[id]} uid={id}>
          <Box x={40} y={100} w={130} h={70} label="User" sub="goal" />
          <Arrow x1={170} y1={135} x2={220} y2={135} />
          <Box x={220} y={90} w={150} h={90} label="LLM" sub="tool JSON" stroke="#FFC145" />
          <Arrow x1={370} y1={135} x2={420} y2={135} />
          <Box x={420} y={100} w={130} h={70} label="Your code" sub="run tool" />
          <Arrow x1={550} y1={135} x2={600} y2={135} />
          <Box x={590} y={100} w={110} h={70} label="Result" stroke="#5FE3C0" />
          <path d="M655 100 C700 40, 180 40, 295 90" stroke="#9AA3C7" strokeWidth={1.2} fill="none" strokeDasharray="4 3" markerEnd={`url(#arrow-${id})`} />
          <text x={360} y={230} textAnchor="middle" fill="#9AA3C7" fontSize={12} fontFamily="system-ui,sans-serif">
            Tool result goes back into the next model call
          </text>
        </Frame>
      );
    case "agent-loop":
      return (
        <Frame title={titles[id]} uid={id} viewBox="0 0 720 300">
          <Box x={280} y={30} w={160} h={55} label="Think" sub="plan next step" stroke="#A08BFF" />
          <Arrow x1={360} y1={85} x2={360} y2={115} />
          <Box x={280} y={120} w={160} h={55} label="Act" sub="call tools" stroke="#FFC145" />
          <Arrow x1={360} y1={175} x2={360} y2={205} />
          <Box x={280} y={210} w={160} h={55} label="Observe" sub="tool output" stroke="#5FE3C0" />
          <path d="M280 237 H160 V57 H280" stroke="#9AA3C7" strokeWidth={1.5} fill="none" markerEnd={`url(#arrow-${id})`} />
          <Box x={500} y={120} w={160} h={55} label="Stop" sub="final answer / cap" stroke="#5FE3C0" />
          <Arrow x1={440} y1={147} x2={495} y2={147} />
          <text x={160} y={150} fill="#9AA3C7" fontSize={11} fontFamily="system-ui,sans-serif">
            loop
          </text>
        </Frame>
      );
    case "guardrails":
      return (
        <FlowRow uid={id} title={titles[id]}
          steps={[
            { label: "Agent" },
            { label: "Validate", sub: "allow-list args" },
            { label: "Human", sub: "approve" },
            { label: "Action", sub: "email / write", stroke: "#5FE3C0" },
          ]}
        />
      );
    case "ollama":
      return (
        <FlowRow uid={id} title={titles[id]}
          steps={[
            { label: "Laptop" },
            { label: "Ollama", sub: "localhost" },
            { label: "Llama/Qwen", sub: "local weights" },
            { label: "Chat/API", stroke: "#5FE3C0" },
          ]}
        />
      );
    case "when-to-finetune":
      return (
        <Frame title={titles[id]} uid={id} viewBox="0 0 720 280">
          <Box x={40} y={100} w={160} h={70} label="Prompting" sub="format & rules" />
          <Arrow x1={200} y1={135} x2={250} y2={135} />
          <Box x={250} y={100} w={160} h={70} label="RAG" sub="private knowledge" stroke="#FFC145" />
          <Arrow x1={410} y1={135} x2={460} y2={135} />
          <Box x={460} y={100} w={200} h={70} label="Fine-tune" sub="style / specialty" stroke="#5FE3C0" />
          <text x={360} y={220} textAnchor="middle" fill="#9AA3C7" fontSize={12} fontFamily="system-ui,sans-serif">
            Try left → right. Most student projects stop at RAG.
          </text>
        </Frame>
      );
    case "lora":
      return (
        <Frame title={titles[id]} uid={id}>
          <Box x={80} y={80} w={220} h={120} label="Base model" sub="weights frozen" />
          <Box x={360} y={80} w={220} h={120} label="LoRA adapters" sub="small trainable" stroke="#5FE3C0" />
          <Arrow x1={300} y1={140} x2={355} y2={140} />
          <text x={360} y={240} textAnchor="middle" fill="#9AA3C7" fontSize={12} fontFamily="system-ui,sans-serif">
            Train adapters on free Colab → export → run with base
          </text>
        </Frame>
      );
    case "fastapi-stream":
      return (
        <FlowRow uid={id} title={titles[id]}
          steps={[
            { label: "Client" },
            { label: "FastAPI", sub: "SSE / stream" },
            { label: "LLM" },
            { label: "Tokens", sub: "as generated", stroke: "#5FE3C0" },
          ]}
        />
      );
    case "cost-cache":
      return (
        <Frame title={titles[id]} uid={id} viewBox="0 0 720 280">
          <Box x={40} y={90} w={150} h={70} label="Request" />
          <Arrow x1={190} y1={125} x2={240} y2={125} />
          <Box x={240} y={80} w={160} h={90} label="Cache?" sub="embed / answer" stroke="#FFC145" />
          <Arrow x1={400} y1={100} x2={470} y2={70} />
          <Arrow x1={400} y1={150} x2={470} y2={180} />
          <Box x={470} y={40} w={180} h={60} label="Hit → reuse" stroke="#5FE3C0" />
          <Box x={470} y={150} w={180} h={60} label="Miss → model" stroke="#A08BFF" />
          <text x={360} y={250} textAnchor="middle" fill="#9AA3C7" fontSize={12} fontFamily="system-ui,sans-serif">
            Log tokens, ₹/query, and p95 latency in every README
          </text>
        </Frame>
      );
    case "portfolio":
      return (
        <FlowRow uid={id} title={titles[id]}
          steps={[
            { label: "Demo", sub: "live URL / GIF" },
            { label: "Architecture", sub: "diagram" },
            { label: "Metrics", sub: "eval + cost" },
            { label: "Resume", sub: "impact bullets", stroke: "#5FE3C0" },
          ]}
        />
      );
    case "learning-path":
      return (
        <Frame title={titles[id]} uid={id} viewBox="0 0 720 300">
          {[
            ["1", "LLMs", "#5FE3C0"],
            ["2", "Embed", "#A08BFF"],
            ["3", "RAG", "#FFC145"],
            ["4", "Agents", "#A08BFF"],
            ["5", "Fine-tune", "#A08BFF"],
            ["6", "Ship", "#5FE3C0"],
          ].map(([n, label, stroke], i) => {
            const x = 30 + i * 115;
            return (
              <g key={n}>
                <Box x={x} y={110} w={100} h={70} label={`M${n}`} sub={label} stroke={stroke} />
                {i < 5 && <Arrow x1={x + 100} y1={145} x2={x + 115 - 4} y2={145} />}
              </g>
            );
          })}
          <text x={360} y={230} textAnchor="middle" fill="#9AA3C7" fontSize={12} fontFamily="system-ui,sans-serif">
            18 lessons · 6 portfolio projects · Module 1 free
          </text>
        </Frame>
      );
    case "campus-funnel":
      return (
        <FlowRow uid={id} title={titles[id]}
          steps={[
            { label: "Reel/Campus", sub: "awareness" },
            { label: "Module 1", sub: "free win" },
            { label: "Quiz streak", sub: "progress" },
            { label: "Pro ₹2999", sub: "checkout", stroke: "#5FE3C0" },
          ]}
        />
      );
    default:
      return null;
  }
}

export function CourseDiagram({ id, caption, className }: Props) {
  return (
    <div className={cn("space-y-2", className)}>
      <DiagramSvg id={id} />
      {caption ? <p className="text-center text-xs text-muted-foreground">{caption}</p> : null}
    </div>
  );
}

export function isDiagramId(value: string): value is DiagramId {
  return (DIAGRAM_IDS as readonly string[]).includes(value);
}
