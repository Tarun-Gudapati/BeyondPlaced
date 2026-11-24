# Lesson 8 — The full RAG pipeline with citations: storylines

Source: `src/lib/modules/m3.ts`, lesson `rag-pipeline`. Every claim below comes from that lesson. The policy
sentence, page numbers and vector values are examples and are shown as illustrative.

**The one idea:** RAG retrieves the right chunks first, then lets the model answer only from them, with citations.
**Remembered as:** "RAG doesn't train the model. It hands it the right page at the right moment."

Assumptions for all three: 1920×1080, ~80 s, ElevenLabs narration, no music (voice only, as in lesson 1's build).

---

## A. One question, all the way through (recommended — Riya's question from lesson 7 travels the whole pipeline)

- **Device / form:** the worked example; one diagram that grows.
- **What you see and feel:** the model has never read the placement policy, yet the bot answers and names the
  page. We open the bot up and follow Riya's backlog question through indexing, retrieval, the numbered prompt and
  the cited answer, then watch it refuse a question the PDF cannot answer. The viewer leaves able to draw it.
- **First 2 seconds:** Riya's question in the phone chat, an "LLM" block, and the policy page sitting on the far
  side of a dashed wall labelled "never read".
- **Beats:** the puzzle (never read it, still names the page) → RAG: retrieve, then generate (open-book exam) →
  phase 1, once: PDF → chunks → vectors → store with page numbers → phase 2, every question: embed with the same
  model, four nearest chunks → numbered prompt with three rules → answer cites [2], code maps it to page 4 →
  unanswerable question gets "I don't know" → wrong answer? print the retrieved chunks first → the one line.
- **Look:** the site's brand: mist ground, white cards, deep-teal structure, coral only on the cited chunk and
  the "say you don't know" rule; Inter for words, JetBrains Mono for prompt and document text.
- **Sound:** warm, unhurried narration only.

## B. The open-book exam hall

- **Device / form:** a moment in a student's day; one continuous take.
- **What you see and feel:** an exam desk. A question paper arrives, a hand flips to a tabbed page, copies one
  line, and writes the page number in the margin. The camera pulls back: the "student" is the model, the tabs
  are the index. Familiar and warm.
- **First 2 seconds:** a question paper lands on a desk next to a thick tabbed booklet.
- **Beats:** question → flip to the tab → copy the line → write the page number → an unanswerable question gets
  "not in the book" → pull back to the pipeline → the one line.
- **Look:** desk from above, paper white, teal tabs, coral margin note.
- **Sound:** narration over page-flip sounds.

## C. The librarian and the writer (the bold one)

- **Device / form:** a character does the work; split screen to one.
- **What you see and feel:** two characters. A librarian (retrieval) who is fast but cannot write, and a writer
  (the LLM) who writes beautifully but has read nothing. Alone, each fails on screen; together, with the librarian
  passing numbered index cards, they answer with citations.
- **First 2 seconds:** the writer confidently writes a wrong answer while the right page sits unopened beside
  them.
- **Beats:** writer alone hallucinates → librarian alone hands over a pile → librarian indexes the shelves once →
  passes four numbered cards → writer cites card 2 → no card, so "I don't know" → the one line.
- **Look:** two flat characters on mist, teal shelves, coral index card.
- **Sound:** narration with a light card-shuffle sound.
