import type { Module } from "@/lib/course";

export const m3: Module = {
  id: "m3",
  title: "RAG: Retrieval-Augmented Generation",
  outcome: "Build chatbots that answer from your documents with citations — the #1 skill companies hire for.",
  project: "Chat-with-your-PDF app with source citations",
  lessons: [
    {
      slug: "chunking",
      title: "Chunking documents the right way",
      minutes: 14,
      summary: "Chunk size, overlap and why bad chunking ruins good models.",
      blocks: [
        {
          type: "p",
          text: "RAG retrieves relevant chunks of your documents and pastes them into the prompt. If chunks are too large, retrieval gets noisy; too small and they lose context. Start with ~500 tokens and 50 tokens of overlap, then measure.",
        },
        {
          type: "diagram",
          id: "chunking",
          caption: "Overlap keeps sentences from being cut at chunk boundaries.",
        },
        {
          type: "code",
          lang: "python",
          code: "def chunk(text, size=2000, overlap=200):\n    out, i = [], 0\n    while i < len(text):\n        out.append(text[i:i + size])\n        i += size - overlap\n    return out",
        },
      ],
      quiz: {
        question: "Why add overlap between chunks?",
        options: [
          "To use more tokens",
          "So sentences split at a boundary still appear whole in at least one chunk",
          "It is required by PDFs",
          "To confuse the retriever",
        ],
        answer: 1,
        explanation: "Overlap preserves context that would otherwise be cut at chunk boundaries.",
      },
      task: "Chunk a 20-page PDF three different ways and compare retrieved chunks for the same question.",
    },
    {
      slug: "rag-pipeline",
      title: "The full RAG pipeline with citations",
      minutes: 22,
      summary: "Retrieve, stuff, generate and cite — end to end.",
      blocks: [
        {
          type: "diagram",
          id: "rag-pipeline",
          caption: "Index offline. At ask-time: retrieve → prompt → answer with citations.",
        },
        {
          type: "code",
          lang: "python",
          code: 'def answer(question):\n    hits = docs.query(query_texts=[question], n_results=4)\n    context = "\\n\\n".join(\n        f"[{i+1}] {d}" for i, d in enumerate(hits["documents"][0])\n    )\n    return client.chat.completions.create(\n        model="gpt-4o-mini",\n        messages=[\n            {"role": "system", "content": "Answer ONLY from the context. Cite like [1]. "\n             "If the answer is not there, say you don\'t know."},\n            {"role": "user", "content": f"Context:\\n{context}\\n\\nQ: {question}"},\n        ],\n    ).choices[0].message.content',
        },
        {
          type: "tip",
          text: "\"If the answer is not in the context, say you don't know\" is the single line that cuts most hallucinations.",
        },
      ],
      quiz: {
        question: "What is the main job of the retrieval step in RAG?",
        options: [
          "Train the model on your data",
          "Find the most relevant chunks to include in the prompt",
          "Translate the question",
          "Compress the model",
        ],
        answer: 1,
        explanation: "Retrieval selects context; the LLM then generates an answer grounded in it.",
      },
      task: "Ship the module project: upload a PDF, ask questions, get answers with [n] citations.",
    },
    {
      slug: "evaluating-rag",
      title: "Evaluating RAG so you can prove it works",
      minutes: 16,
      summary: "Golden datasets, hit rate and LLM-as-judge.",
      blocks: [
        {
          type: "p",
          text: "Recruiters ask \"how do you know it works?\". Your answer: a golden set of 30 question/answer pairs, a retrieval hit-rate metric, and an LLM-as-judge score for faithfulness. Put these numbers in your README.",
        },
        {
          type: "diagram",
          id: "rag-eval",
          caption: "Golden questions → hit@k + faithfulness → numbers for your README.",
        },
        {
          type: "list",
          items: [
            "Hit rate@k: did the correct chunk appear in the top k?",
            "Faithfulness: is every claim supported by the retrieved context?",
            "Track metrics every time you change chunking or prompts.",
          ],
        },
      ],
      quiz: {
        question: "Hit rate@4 measures…",
        options: [
          "How fast the API responds",
          "Whether the correct chunk is in the top 4 retrieved results",
          "How many users clicked the answer",
          "Tokens per second",
        ],
        answer: 1,
        explanation: "It is a retrieval metric: was the right evidence found?",
      },
      task: "Create a 20-question golden set for your PDF bot and report hit rate@4.",
    },
  ],
};
