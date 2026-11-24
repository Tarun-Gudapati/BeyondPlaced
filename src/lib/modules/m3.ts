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
      minutes: 35,
      summary: "Chunk size, overlap, sentence-aware splitting and metadata — and how to test which strategy retrieves the right passage.",
      blocks: [
        {
          type: "video",
          src: "supabase:chunking/chunking.mp4",
          poster: "supabase:chunking/chunking.jpg",
          captions: "supabase:chunking/chunking.vtt",
          title: "Chunking, in 85 seconds",
        },
        {
          type: "p",
          text: "Think of an open-book exam. You are allowed the whole textbook, but you answer faster and better if you flip to the one right page instead of rereading the book for every question. RAG works the same way: at question time it finds a few relevant pieces of your documents and pastes only those into the prompt. Those pieces are called chunks, and the model never sees anything you did not retrieve.",
        },
        {
          type: "p",
          text: "That makes chunking the quiet decision that controls everything downstream. Say you index your college's 40-page placement policy and a junior asks, \"How many active backlogs are allowed for the TCS drive?\" If the sentence with the answer was cut in half, or buried inside a five-page chunk about everything, even the best model will answer badly. Bad chunking ruins good models.",
        },
        {
          type: "diagram",
          id: "chunking",
          caption: "Overlap keeps sentences from being cut at chunk boundaries.",
        },
        { type: "h", text: "Why not embed the whole document?" },
        {
          type: "p",
          text: "An embedding squeezes a piece of text into one vector. One vector for 40 pages is an average of every topic in the document, so it ends up close to nothing in particular. Chunks give each idea its own vector, so a question about backlogs can land on the paragraph about backlogs.",
        },
        {
          type: "list",
          items: [
            "Precision: a small, focused chunk matches a specific question far better than a blurry document-level vector.",
            "Cost and context: you pay for every token you paste into the prompt, and the context window is finite. Four good chunks beat forty pages.",
            "Citations: a chunk carries its page number, so the answer can say exactly where it came from.",
            "Limits: every embedding model has a maximum input length. Text beyond it is cut off or rejected, so a huge chunk may only be partly embedded.",
          ],
        },
        { type: "h", text: "The size trade-off, and where to start" },
        {
          type: "p",
          text: "Chunk size is a trade-off, not a magic number. Too large, and each chunk mixes several topics: retrieval gets noisy and you pay to send filler to the model. Too small, and a chunk loses the context that makes it meaningful. \"It must be cleared before the drive\" is useless if the chunk does not say what \"it\" is.",
        },
        {
          type: "p",
          text: "A sensible starting point is around 500 tokens per chunk with about 50 tokens of overlap, then measure and adjust. A token is roughly 3–4 English characters, so that is about 2,000 characters. Dense reference material such as FAQs and policy clauses often does better with smaller chunks (200–300 tokens); flowing explanations such as lecture notes can take larger ones. Here is the simplest possible chunker, measured in characters:",
        },
        {
          type: "code",
          lang: "python",
          code: `def chunk_fixed(text: str, size: int = 2000, overlap: int = 200) -> list[str]:
    """Fixed-size chunks (in characters) where neighbours share \`overlap\` characters."""
    if not 0 <= overlap < size:
        raise ValueError("overlap must be smaller than size")
    chunks, start = [], 0
    while start < len(text):
        chunks.append(text[start:start + size])
        if start + size >= len(text):  # last chunk reached: stop, no tiny duplicate tail
            break
        start += size - overlap
    return chunks


if __name__ == "__main__":
    text = "Students with active backlogs are not eligible for the drive. " * 40
    chunks = chunk_fixed(text, size=500, overlap=50)
    print(len(chunks), "chunks")
    print(repr(chunks[0][-50:]))  # the end of chunk 0 ...
    print(repr(chunks[1][:50]))   # ... is repeated at the start of chunk 1`,
        },
        {
          type: "p",
          text: "Overlap means the end of one chunk is repeated at the start of the next. If a sentence straddles a boundary, it still appears whole in at least one chunk. Ten to twenty percent of the chunk size is typical. Much more than that and you are storing, and paying to embed, the same text twice.",
        },
        { type: "h", text: "Split on meaning, not on character counts" },
        {
          type: "p",
          text: "The fixed-size chunker is honest but blunt: it will happily cut \"minimum CGPA of 7.5\" into \"minimum CGPA of 7\" and \".5\". Better chunkers respect the structure the author already gave you: headings first, then paragraphs, then sentences, cutting mid-sentence only as a last resort. This idea is usually called recursive splitting. Below is a small sentence-aware version you can read in one sitting. Put it in a file called chunking.py together with chunk_fixed; the next two lessons import it.",
        },
        {
          type: "code",
          lang: "python",
          code: `# chunking.py (add chunk_fixed from above to this file too)
import re


def split_sentences(text: str) -> list[str]:
    """Split on blank lines and sentence endings. Simple on purpose."""
    parts = re.split(r"(?<=[.?!])\\s+|\\n{2,}", text)
    return [" ".join(p.split()) for p in parts if p.strip()]


def chunk_sentences(text: str, max_chars: int = 1000, overlap: int = 150) -> list[str]:
    """Pack whole sentences into chunks of about max_chars.
    The last sentences of each chunk (up to \`overlap\` characters) start the next one."""
    chunks, current = [], []
    for sentence in split_sentences(text):
        if current and len(" ".join(current)) + 1 + len(sentence) > max_chars:
            chunks.append(" ".join(current))
            tail = []
            while current and len(" ".join(tail + [current[-1]])) <= overlap:
                tail.insert(0, current.pop())
            current = tail
        current.append(sentence)
    if current:
        chunks.append(" ".join(current))
    return chunks


if __name__ == "__main__":
    sample = (
        "Eligibility. Students need a minimum CGPA of 7.5 to sit for dream companies. "
        "Students with active backlogs are not eligible until the backlog is cleared.\\n\\n"
        "Process. Register on the placement portal before each drive. "
        "A student who accepts an offer cannot sit for further drives in the same category."
    )
    for i, chunk in enumerate(chunk_sentences(sample, max_chars=160, overlap=80)):
        print(i, len(chunk), repr(chunk))`,
        },
        {
          type: "p",
          text: "Run it and notice two things: no chunk ends in the middle of a sentence, and the backlog sentence appears in both chunk 0 and chunk 1. That repeated sentence is the overlap doing its job. In real projects you will often use a library for this. LangChain's splitter applies the same idea with more separators and can measure size in tokens instead of characters:",
        },
        {
          type: "code",
          lang: "python",
          code: `# pip install langchain-text-splitters tiktoken
from langchain_text_splitters import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
    encoding_name="cl100k_base",  # tokenizer used by OpenAI's embedding models
    chunk_size=500,               # measured in tokens
    chunk_overlap=50,
)

with open("placement_policy.txt", encoding="utf-8") as f:
    chunks = splitter.split_text(f.read())

print(len(chunks), "chunks")
print(chunks[0][:300])`,
        },
        { type: "h", text: "Every chunk needs an ID card (metadata)" },
        {
          type: "p",
          text: "A chunk without metadata is a quote without a source. Store at least the file name and page number with every chunk: they become your citations in the next lesson, and they let you filter (\"only the 2025 policy\"). If the document has headings, prepend the section heading to the chunk text so each chunk makes sense on its own. This script reads a PDF page by page, chunks each page and stores everything in Chroma:",
        },
        {
          type: "code",
          lang: "python",
          code: `# pip install pypdf chromadb
import chromadb
from pypdf import PdfReader

from chunking import chunk_sentences

PDF = "placement_policy.pdf"

ids, texts, metas = [], [], []
for page_no, page in enumerate(PdfReader(PDF).pages, start=1):
    page_text = page.extract_text() or ""
    for n, chunk in enumerate(chunk_sentences(page_text, max_chars=1000, overlap=150)):
        ids.append(f"p{page_no}-c{n}")
        texts.append(chunk)
        metas.append({"source": PDF, "page": page_no})

if not texts:
    raise SystemExit("No text found. A scanned PDF needs OCR before it can be chunked.")

db = chromadb.PersistentClient(path="./db")
col = db.get_or_create_collection("placement_policy")
col.upsert(ids=ids, documents=texts, metadatas=metas)  # Chroma embeds the text for you

print(col.count(), "chunks stored")
hit = col.query(query_texts=["How many active backlogs are allowed?"], n_results=1)
print("page", hit["metadatas"][0][0]["page"], "->", hit["documents"][0][0][:200])`,
        },
        {
          type: "tip",
          text: "Check your embedding model's input limit before choosing a size. Chroma's default local model (all-MiniLM-L6-v2) reads only about the first 256 tokens of each chunk and silently ignores the rest, which is why the script above uses ~1,000 characters. API models such as text-embedding-3-small accept much longer inputs, so 500-token chunks are fine there.",
        },
        { type: "h", text: "Measure, don't guess" },
        {
          type: "p",
          text: "There is no best chunk size, only the best one for your documents and your questions. So run a tiny experiment: chunk the same text three ways, ask the same question, and read what comes back.",
        },
        {
          type: "code",
          lang: "python",
          code: `import chromadb
from pypdf import PdfReader

from chunking import chunk_fixed, chunk_sentences

pages = PdfReader("placement_policy.pdf").pages
text = "\\n\\n".join(page.extract_text() or "" for page in pages)
question = "How many active backlogs are allowed?"

strategies = {
    "fixed_300": chunk_fixed(text, size=300, overlap=0),
    "sentence_1000": chunk_sentences(text, max_chars=1000, overlap=150),
    "sentence_3000": chunk_sentences(text, max_chars=3000, overlap=300),
}

db = chromadb.EphemeralClient()  # in-memory: nothing is saved to disk
for name, chunks in strategies.items():
    col = db.get_or_create_collection(name)
    col.upsert(ids=[f"{name}-{i}" for i in range(len(chunks))], documents=chunks)
    res = col.query(query_texts=[question], n_results=3)
    print(f"\\n=== {name}: {len(chunks)} chunks ===")
    for doc, dist in zip(res["documents"][0], res["distances"][0]):
        print(f"{dist:.3f}  {doc[:150]!r}")  # smaller distance = closer match`,
        },
        {
          type: "p",
          text: "Read the output like an engineer. Did the top chunk actually contain the answer? Is it padded with unrelated text? Is the answer split across two chunks? In the evaluation lesson you will turn this eyeballing into a number called hit rate, but reading real retrieved chunks is always step one.",
        },
        { type: "h", text: "Common mistakes" },
        {
          type: "list",
          items: [
            "Cutting mid-sentence or mid-table with a plain character split, then blaming the model for vague answers.",
            "Zero overlap: the one sentence that answers the question gets split across two chunks and neither half is retrievable.",
            "Huge chunks \"to be safe\". Retrieval gets noisy, costs rise, and small embedding models truncate them.",
            "Throwing away metadata. Without page numbers you cannot cite, filter or debug.",
            "Not cleaning PDF text: repeated headers, footers and page numbers end up inside every chunk and pollute the embeddings.",
            "Changing the chunk size without re-embedding everything. Old and new chunks mixed in one collection give confusing results.",
            "Picking a size from a blog post and never testing it on your own questions.",
          ],
        },
        { type: "h", text: "How this shows up in interviews" },
        {
          type: "list",
          items: [
            "\"How did you choose your chunk size?\" — I started around 500 tokens with roughly 10% overlap, then compared a few sizes on a fixed set of questions and kept the one that retrieved the right passage most often. Smaller chunks worked better for our FAQ-style content.",
            "\"Why do you need overlap?\" — A sentence cut at a boundary would be incomplete in both chunks. Overlap repeats the boundary text so the idea survives whole in at least one chunk, at the cost of a little extra storage.",
            "\"What happens if chunks are too big or too small?\" — Too big: each vector mixes topics, so retrieval is noisy and prompts get expensive. Too small: chunks lose their surrounding context, so they match the query but do not contain enough to answer it.",
          ],
        },
        {
          type: "tip",
          text: "On your resume, write the decision, not the default: \"Compared three chunking strategies on 20 test questions and chose sentence-aware chunks with overlap, which retrieved the right passage most often.\" Use your own numbers. That one line shows you measure.",
        },
      ],
      quiz: {
        question: "For a question about backlogs, your bot retrieves the chunk \"It must be cleared before the drive begins.\" but the model cannot tell what \"it\" refers to. Which chunking problem is the most likely cause?",
        options: [
          "Chunks are too large, so each embedding averages many topics",
          "Chunks are too small or split mid-idea, so the sentence that defines \"it\" lives in a different chunk",
          "Overlap is too high, so the chunk was stored twice",
          "The PDF has too many pages for the vector database",
        ],
        answer: 1,
        explanation: "A chunk must carry enough context to stand on its own. Tiny chunks or cuts in the middle of an idea separate a sentence from what it refers to; larger sentence-aware chunks with overlap keep them together.",
      },
      task: "Take a real 15–20 page PDF (your college placement policy, a syllabus or a course handout). Chunk it three ways: fixed 300 characters with no overlap, sentence-aware ~1,000 characters with overlap, and ~3,000 characters. Store each in its own Chroma collection and ask the same five questions against all three. Deliverable: a small table in your README showing, per strategy, how many of the five questions had the answer in the top 3 chunks, plus two sentences on which strategy you will keep and why.",
    },
    {
      slug: "rag-pipeline",
      title: "The full RAG pipeline with citations",
      minutes: 45,
      summary: "Index, retrieve, build a grounded prompt, generate and cite page numbers — a complete chat-with-your-PDF app.",
      blocks: [
        {
          type: "p",
          text: "RAG stands for Retrieval-Augmented Generation, and the name is the whole design: retrieve the relevant text first, then let the model generate an answer from it. It is an open-book exam for an LLM. The model does not need to have memorised your college's placement policy. It only needs to read the right page at the moment of the question, and say which page it used.",
        },
        {
          type: "p",
          text: "In this lesson you build the complete thing: a chat-with-your-PDF app that answers with citations like [1] and tells you the page. There are two phases. Indexing happens once per document, offline. Answering happens on every question: retrieve, build the prompt, generate, cite.",
        },
        {
          type: "diagram",
          id: "rag-pipeline",
          caption: "Index offline. At ask-time: retrieve → prompt → answer with citations.",
        },
        { type: "h", text: "Phase 1: index once, offline" },
        {
          type: "p",
          text: "Indexing is everything you did in the last lesson, plus embeddings: read the PDF, chunk it, embed each chunk, and store vector + text + metadata in Chroma. Here we call the embedding model ourselves instead of letting Chroma do it, so you can see every step and so chunks and questions are guaranteed to use the same model.",
        },
        {
          type: "code",
          lang: "bash",
          code: "pip install openai chromadb pypdf python-dotenv\n# .env must contain OPENAI_API_KEY=...   (and .env must be in .gitignore)",
        },
        {
          type: "code",
          lang: "python",
          code: `# index.py  ->  python index.py placement_policy.pdf
import sys

import chromadb
from dotenv import load_dotenv
from openai import OpenAI
from pypdf import PdfReader

from chunking import chunk_sentences  # chunking.py from the previous lesson

load_dotenv()
client = OpenAI()
EMBED_MODEL = "text-embedding-3-small"

db = chromadb.PersistentClient(path="./db")
docs = db.get_or_create_collection("pdf_chunks")


def embed(texts: list[str]) -> list[list[float]]:
    resp = client.embeddings.create(model=EMBED_MODEL, input=texts)
    return [d.embedding for d in resp.data]


def index_pdf(path: str) -> int:
    ids, texts, metas = [], [], []
    for page_no, page in enumerate(PdfReader(path).pages, start=1):
        page_text = page.extract_text() or ""
        for n, chunk in enumerate(chunk_sentences(page_text, max_chars=1500, overlap=200)):
            ids.append(f"{path}-p{page_no}-c{n}")
            texts.append(chunk)
            metas.append({"source": path, "page": page_no})

    for i in range(0, len(texts), 100):  # embed and store in batches of 100
        j = i + 100
        docs.upsert(
            ids=ids[i:j],
            documents=texts[i:j],
            metadatas=metas[i:j],
            embeddings=embed(texts[i:j]),  # our own vectors, not Chroma's default model
        )
    return len(texts)


if __name__ == "__main__":
    count = index_pdf(sys.argv[1])
    print(f"Indexed {count} chunks from {sys.argv[1]}")`,
        },
        {
          type: "p",
          text: "Run it once: python index.py placement_policy.pdf. Because it uses upsert with stable IDs, running it again updates the same chunks instead of duplicating them. If you change the chunk size, delete the collection first with db.delete_collection(\"pdf_chunks\") and re-index, otherwise old and new chunks get mixed.",
        },
        { type: "h", text: "Phase 2: retrieve the evidence" },
        {
          type: "p",
          text: "At question time, embed the question with the same embedding model and ask Chroma for the k nearest chunks. k = 4 is a reasonable start: enough to cover an answer spread over two paragraphs, small enough to keep the prompt focused and cheap. Chroma returns a distance for each hit, and smaller means closer in meaning. That is the retrieve function in the file below.",
        },
        { type: "h", text: "Phase 3: a grounded prompt with numbered sources" },
        {
          type: "p",
          text: "Now paste the retrieved chunks into the prompt, each with a number. Three instructions do most of the work: answer only from the context, cite the chunk number after each claim, and say you don't know when the context does not contain the answer. Temperature 0 keeps the model from getting creative with facts.",
        },
        {
          type: "code",
          lang: "python",
          code: `# ask.py  ->  python ask.py
import re

import chromadb
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI()
EMBED_MODEL = "text-embedding-3-small"  # must be the same model index.py used
CHAT_MODEL = "gpt-4o-mini"

docs = chromadb.PersistentClient(path="./db").get_or_create_collection("pdf_chunks")

SYSTEM = (
    "You answer questions using ONLY the numbered context from a document. "
    "Cite the context you used after each claim, like [1] or [2]. "
    "If the context does not contain the answer, reply exactly: "
    "I don't know based on this document."
)


def retrieve(question: str, k: int = 4) -> list[dict]:
    q_vec = client.embeddings.create(model=EMBED_MODEL, input=[question]).data[0].embedding
    res = docs.query(query_embeddings=[q_vec], n_results=k)
    return [
        {"text": text, "page": meta["page"], "source": meta["source"], "distance": dist}
        for text, meta, dist in zip(res["documents"][0], res["metadatas"][0], res["distances"][0])
    ]


def answer(question: str, k: int = 4) -> dict:
    hits = retrieve(question, k)
    context = "\\n\\n".join(
        f"[{i}] (page {h['page']}) {h['text']}" for i, h in enumerate(hits, start=1)
    )
    resp = client.chat.completions.create(
        model=CHAT_MODEL,
        temperature=0,
        messages=[
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": f"Context:\\n{context}\\n\\nQuestion: {question}"},
        ],
    )
    text = resp.choices[0].message.content
    # Collect cited numbers from [1], [2] or [1, 3]; keep only ones we really sent.
    groups = re.findall(r"\\[([\\d,\\s]+)\\]", text)
    cited = sorted({int(n) for group in groups for n in re.findall(r"\\d+", group)})
    sources = [{"n": n, **hits[n - 1]} for n in cited if 1 <= n <= len(hits)]
    return {"answer": text, "sources": sources, "hits": hits}


if __name__ == "__main__":
    while True:
        question = input("\\nAsk (blank to quit): ").strip()
        if not question:
            break
        out = answer(question)
        print("\\n" + out["answer"])
        for s in out["sources"]:
            print(f"  [{s['n']}] {s['source']}, page {s['page']}")`,
        },
        {
          type: "tip",
          text: "\"If the answer is not in the context, say you don't know\" is the single line that cuts most hallucinations. Test it: ask your bot something the PDF cannot answer (\"What is the hostel wifi password?\") and check that it refuses.",
        },
        { type: "h", text: "Citations people can check" },
        {
          type: "p",
          text: "A citation is only useful if a human can verify it. The model writes [2]; your code maps 2 back to that chunk's metadata and shows the file and page. Notice that ask.py only accepts citation numbers that exist in the retrieved list. Models occasionally invent a [7] when you sent four chunks, and you should never display a source you did not retrieve.",
        },
        {
          type: "p",
          text: "Also remember what a citation proves: that the model pointed at a chunk, not that the chunk truly supports the sentence. Checking that support is called faithfulness, and you will measure it in the next lesson.",
        },
        { type: "h", text: "When an answer is wrong, debug retrieval first" },
        {
          type: "p",
          text: "A RAG system can fail in two different places, and the fix is different for each. Before touching the prompt, print what was retrieved:",
        },
        {
          type: "code",
          lang: "python",
          code: `# debug_retrieval.py: look at the evidence before blaming the model
from ask import retrieve

question = "How many active backlogs are allowed for placements?"
for i, h in enumerate(retrieve(question, k=4), start=1):
    print(f"[{i}] page {h['page']}  distance {h['distance']:.3f}")
    print("    " + h["text"][:200].replace("\\n", " ") + "\\n")`,
        },
        {
          type: "list",
          items: [
            "The right passage is not in the top k: a retrieval problem. Fix chunking, raise k, clean the PDF text or rephrase the query. No prompt can use evidence that never arrived.",
            "The right passage is there but the answer is wrong or vague: a generation problem. Tighten the system prompt, keep temperature at 0, send fewer irrelevant chunks or use a stronger model.",
            "The passage is there but the bot says \"I don't know\": often the answer is split across chunks, or the chunk lacks context (the \"it\" problem from the last lesson).",
          ],
        },
        { type: "h", text: "Common mistakes" },
        {
          type: "list",
          items: [
            "Embedding questions with a different model than the chunks. The vectors live in different spaces, so retrieval fails or quietly returns irrelevant chunks.",
            "No \"I don't know\" rule, so the model fills gaps from its own memory and sounds confident.",
            "Showing citations without validating them, or without a page number the user can open.",
            "Stuffing 20 chunks in \"for safety\". More context means more noise, more cost and slower answers, and details buried in a long prompt are easier for the model to overlook.",
            "Re-indexing on every question. Indexing is an offline step; redo it only when the document changes.",
            "Thinking RAG trains the model. Nothing is learned: delete a chunk and that knowledge is gone on the very next question.",
            "Trusting document text as instructions. A PDF can contain lines like \"ignore previous instructions\"; keep your rules in the system message and pass documents as data in the user message.",
          ],
        },
        { type: "h", text: "How this shows up in interviews" },
        {
          type: "list",
          items: [
            "\"Explain RAG end to end.\" — Offline, I chunk the documents, embed each chunk and store the vectors with metadata in a vector database. At query time I embed the question with the same model, retrieve the top-k chunks, put them in the prompt as numbered context, and ask the model to answer only from that context with citations, or say it doesn't know.",
            "\"RAG or fine-tuning for a chatbot over company documents?\" — RAG. The knowledge changes often, answers need citations, and documents must be removable. RAG handles all three by updating the index, with no training. Fine-tuning changes behaviour and style; it is a poor way to store facts you need to look up.",
            "\"How do you reduce hallucinations in a RAG system?\" — Improve retrieval so the right evidence is present, instruct the model to answer only from the context and abstain otherwise, keep temperature low, require citations, and measure faithfulness on a test set.",
          ],
        },
        {
          type: "tip",
          text: "No API credits for chat? Point a separate chat client at a local model: OpenAI(base_url=\"http://localhost:11434/v1\", api_key=\"ollama\") with model=\"llama3.1\" (Module 5 covers the Ollama setup). Whatever you choose, keep the embedding model identical for indexing and asking.",
        },
      ],
      quiz: {
        question: "Your PDF bot gives a wrong answer. You print the top 4 retrieved chunks and the passage containing the correct answer is not among them. What should you fix first?",
        options: [
          "Rewrite the system prompt to be stricter about citations",
          "Retrieval (chunking, k or the query): no prompt can use evidence that was never retrieved",
          "Raise the temperature so the model explores more answers",
          "Fine-tune the chat model on the PDF",
        ],
        answer: 1,
        explanation: "The model only sees what retrieval hands it. If the right passage never reaches the prompt, the failure is in retrieval, so fix chunking, k or the query before touching generation.",
      },
      task: "Ship the module project: a chat-with-your-PDF app. Deliverable: a GitHub repo with chunking.py, index.py and ask.py that (1) indexes any PDF you pass in, (2) answers questions with [n] citations and prints the page for each cited source, and (3) replies \"I don't know based on this document.\" for a question the PDF cannot answer. Put three example Q&As in the README (two answerable, one not) with their citations.",
    },
    {
      slug: "evaluating-rag",
      title: "Evaluating RAG so you can prove it works",
      minutes: 40,
      summary: "Golden sets, hit rate@k, MRR and LLM-as-judge faithfulness — numbers that prove your RAG works.",
      blocks: [
        {
          type: "p",
          text: "\"It seems to work\" is not something you can put on a resume. Recruiters and senior engineers ask one question about every RAG project: how do you know it works? A demo with three hand-picked questions does not answer that. A small test set and a few numbers do.",
        },
        {
          type: "p",
          text: "The key idea: a RAG answer can fail in two different places, so you measure two different things. First, retrieval: did the right evidence reach the prompt? Second, generation: did the answer stick to that evidence? Measure them separately and you always know which half to fix.",
        },
        {
          type: "diagram",
          id: "rag-eval",
          caption: "Golden questions → hit@k + faithfulness → numbers for your README.",
        },
        { type: "h", text: "Step 1: write a golden set" },
        {
          type: "p",
          text: "A golden set is a list of questions with known-correct answers, written by you while reading the document. 20–30 questions is enough for a portfolio project. For each one, record the question, a short reference answer and the page(s) where the answer lives. Label by page number rather than chunk ID: chunk IDs change every time you re-chunk, page numbers do not. A good set mixes:",
        },
        {
          type: "list",
          items: [
            "Direct lookups: \"What is the minimum CGPA for dream-company drives?\"",
            "Paraphrases that share no keywords with the document: the policy says \"active backlogs\", the student asks about \"pending arrears\".",
            "Questions whose answer spans two paragraphs or depends on a condition (\"...for lateral-entry students?\").",
            "Three to five questions the document cannot answer. The correct behaviour is \"I don't know\", and you want to test it.",
          ],
        },
        {
          type: "p",
          text: "Save it as golden.json. The values below are a made-up example; write yours from your own PDF.",
        },
        {
          type: "code",
          lang: "json",
          code: `[
  {
    "question": "What is the minimum CGPA to sit for dream-company drives?",
    "reference": "A CGPA of 7.5 or above with no active backlogs.",
    "expected_pages": [3]
  },
  {
    "question": "Can I attend interviews if I still have pending arrears?",
    "reference": "No. Students with active backlogs are not eligible until they are cleared.",
    "expected_pages": [3, 4]
  },
  {
    "question": "What is the hostel wifi password?",
    "reference": "NOT_IN_DOCUMENT",
    "expected_pages": []
  }
]`,
        },
        {
          type: "tip",
          text: "Write the questions before you tune anything, and do not keep editing them to make your scores look better. A test you have tuned on stops telling you the truth, exactly like memorising last year's question paper.",
        },
        { type: "h", text: "Step 2: retrieval metrics — hit rate@k and MRR" },
        {
          type: "p",
          text: "Hit rate@k asks a yes/no question per golden item: did a chunk from the right page appear in the top k results? Average the yeses and you have the metric. A hit rate@4 of 0.85 means that for 85% of the questions, the evidence reached the prompt. If the evidence never arrives, nothing later can save the answer, so this is the first number to look at.",
        },
        {
          type: "p",
          text: "MRR (mean reciprocal rank) also rewards putting the right chunk near the top: score 1 if it is first, 1/2 if second, 1/3 if third, 0 if it is missing, then average. Two systems can have the same hit rate@4 while only one of them ranks the right chunk first.",
        },
        {
          type: "code",
          lang: "python",
          code: `# eval_retrieval.py: did the right page reach the top k?
import json

from ask import retrieve  # ask.py from the previous lesson

K = 4

with open("golden.json", encoding="utf-8") as f:
    golden = json.load(f)
answerable = [g for g in golden if g["expected_pages"]]

hits, reciprocal_ranks = 0, 0.0
for g in answerable:
    pages = [h["page"] for h in retrieve(g["question"], k=K)]
    rank = next((i for i, p in enumerate(pages, start=1) if p in g["expected_pages"]), None)
    if rank is None:
        print("MISS:", g["question"], "-> retrieved pages", pages)
    else:
        hits += 1
        reciprocal_ranks += 1 / rank

n = len(answerable)
print(f"hit rate@{K}: {hits}/{n} = {hits / n:.2f}")
print(f"MRR@{K}: {reciprocal_ranks / n:.2f}")`,
        },
        {
          type: "p",
          text: "Labelling by page is a deliberately simple proxy: a different chunk from the same page also counts as a hit. For a first project that is a fair trade for labels that survive re-chunking. Always read the MISS lines. They tell you what to fix far better than the average does.",
        },
        { type: "h", text: "Step 3: faithfulness with an LLM as judge" },
        {
          type: "p",
          text: "Retrieval metrics say nothing about the final answer. For that, check two things: faithfulness (is every claim in the answer supported by the retrieved context?) and correctness (does the answer agree with your reference?). Reading 30 answers by hand after every change is slow, so you ask a model to grade with a strict rubric and return a JSON verdict. This is called LLM-as-judge.",
        },
        {
          type: "code",
          lang: "python",
          code: `# eval_answers.py: grade every answer for faithfulness and correctness
import json

from openai import OpenAI

from ask import answer  # ask.py from the previous lesson

judge = OpenAI()

RUBRIC = """You are grading a RAG system. Reply with JSON only:
{"faithful": true or false, "correct": true or false, "reason": "one sentence"}
faithful: every factual claim in ANSWER is supported by CONTEXT.
correct: ANSWER states the same facts as REFERENCE (wording may differ).
If REFERENCE is NOT_IN_DOCUMENT, correct means ANSWER says it does not know."""


def grade(question: str, context: str, answer_text: str, reference: str) -> dict:
    resp = judge.chat.completions.create(
        model="gpt-4o-mini",
        temperature=0,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": RUBRIC},
            {
                "role": "user",
                "content": f"QUESTION: {question}\\n\\nCONTEXT:\\n{context}\\n\\n"
                f"ANSWER: {answer_text}\\n\\nREFERENCE: {reference}",
            },
        ],
    )
    return json.loads(resp.choices[0].message.content)


with open("golden.json", encoding="utf-8") as f:
    golden = json.load(f)

rows = []
for g in golden:
    out = answer(g["question"])
    context = "\\n\\n".join(h["text"] for h in out["hits"])
    verdict = grade(g["question"], context, out["answer"], g["reference"])
    rows.append({**g, "answer": out["answer"], **verdict})
    if not (verdict["faithful"] and verdict["correct"]):
        print("FAIL:", g["question"], "|", verdict["reason"])

n = len(rows)
print(f"faithfulness: {sum(bool(r['faithful']) for r in rows) / n:.2f}")
print(f"correctness:  {sum(bool(r['correct']) for r in rows) / n:.2f}")

with open("eval_results.json", "w", encoding="utf-8") as f:
    json.dump(rows, f, indent=2, ensure_ascii=False)`,
        },
        {
          type: "p",
          text: "A judge is a model too, so it can be wrong. Keep it honest: temperature 0, a narrow rubric, one-sentence reasons and a manual spot-check. Read ten verdicts yourself; if you disagree with more than one or two, fix the rubric before trusting the score.",
        },
        { type: "h", text: "Step 4: read the numbers like a doctor reads a report" },
        {
          type: "list",
          items: [
            "Low hit rate: retrieval is the problem. Try a different chunk size or overlap, clean the PDF text, raise k or rewrite the query. Do not touch the prompt yet.",
            "High hit rate, low faithfulness: the evidence arrived but the model drifted. Tighten the system prompt, keep temperature at 0, send fewer irrelevant chunks or try a stronger model.",
            "High faithfulness, low correctness: the answer is supported by what was retrieved, but what was retrieved was incomplete or from the wrong section. Back to retrieval.",
            "Unanswerable questions answered confidently: your \"I don't know\" rule is not holding. Strengthen it and re-test.",
          ],
        },
        { type: "h", text: "Step 5: one change at a time, written down" },
        {
          type: "p",
          text: "Evaluation pays off when you change something. Change one thing (chunk size, k, the prompt), re-run both scripts on the same golden set, and write the result down. A log like this in your README is worth more than any screenshot of a chat window:",
        },
        {
          type: "code",
          lang: "text",
          code: `# Illustrative numbers only. Yours will differ.
run  change                           hit@4  MRR@4  faithful  correct
1    baseline: 1500 chars, k=4        0.72   0.55   0.88      0.68
2    chunks of 800 chars, overlap 150 0.84   0.66   0.90      0.76
3    + stricter "I don't know" rule   0.84   0.66   0.96      0.80`,
        },
        {
          type: "p",
          text: "Libraries such as Ragas package similar metrics (faithfulness, context precision, context recall). Use them later. Building the two scripts above by hand once means you can explain exactly what each number measures.",
        },
        { type: "h", text: "Common mistakes" },
        {
          type: "list",
          items: [
            "Judging by vibes: asking five friendly questions and declaring it done.",
            "Scoring only the final answer, so you cannot tell whether retrieval or generation failed.",
            "Labelling golden items by chunk ID, then losing every label the first time you re-chunk.",
            "No unanswerable questions, so hallucination on missing information is never tested.",
            "Trusting the LLM judge without ever reading its verdicts.",
            "Tuning on the golden set until the number looks good, then reporting it as if it were unseen data.",
            "Reporting a metric without its k and sample size. \"85% accuracy\" means little; \"hit rate@4 = 0.85 on 26 questions\" can be checked.",
          ],
        },
        { type: "h", text: "How this shows up in interviews" },
        {
          type: "list",
          items: [
            "\"How do you evaluate a RAG system?\" — I evaluate retrieval and generation separately. For retrieval I use a golden set with known source passages and report hit rate@k and MRR. For answers I measure faithfulness to the retrieved context and correctness against reference answers, using an LLM judge that I spot-check by hand.",
            "\"Hit rate is high but users still get wrong answers. What do you check?\" — The evidence is reaching the prompt, so I look at generation: is the answer faithful to the context, is the right chunk buried among irrelevant ones, is the prompt allowing outside knowledge? I read the failing cases before changing anything.",
            "\"What are the weaknesses of LLM-as-judge?\" — The judge can be wrong or inconsistent, can favour fluent answers, and costs tokens. I reduce the risk with a narrow rubric, temperature 0, structured output, and by checking a sample of its verdicts against my own.",
          ],
        },
        {
          type: "tip",
          text: "Put the numbers in your README and turn them into a resume line: \"Built a 26-question golden set; improved hit rate@4 from 0.72 to 0.84 by re-chunking.\" Those figures are placeholders, so use your real ones. It answers \"how do you know it works?\" before the interviewer asks.",
        },
      ],
      quiz: {
        question: "On your golden set, hit rate@4 is 0.90 but faithfulness is 0.55. What does this tell you?",
        options: [
          "Retrieval is failing, so re-chunk the documents first",
          "The right evidence usually reaches the prompt, but the answers do not stick to it, so fix the generation step (prompt, temperature, noise in the context)",
          "Both numbers are fine because they average out above 0.7",
          "The vector database is too slow",
        ],
        answer: 1,
        explanation: "Hit rate measures retrieval and it is high, so the evidence is arriving. Low faithfulness means the model is adding or changing claims, which is a generation problem. Measuring the two halves separately tells you where to work.",
      },
      task: "Create golden.json with 20 questions for your PDF bot (include at least 3 the document cannot answer), then run eval_retrieval.py and eval_answers.py. Deliverable: an \"Evaluation\" section in your README with your hit rate@4, MRR@4, faithfulness and correctness, plus one logged experiment where you changed a single thing (chunk size, overlap or k) and reported the before and after numbers.",
    },
  ],
};
