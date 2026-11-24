import type { Module } from "@/lib/course";

export const m2: Module = {
  id: "m2",
  title: "Embeddings & Vector Search",
  outcome: "Turn text into vectors and search millions of documents by meaning.",
  project: "Semantic search over your college's past question papers",
  lessons: [
    {
      slug: "embeddings-intuition",
      title: "Embeddings: meaning as numbers",
      minutes: 14,
      summary: "Why similar sentences land close together in vector space.",
      blocks: [
        {
          type: "p",
          text: "An embedding model converts text into a fixed-length list of numbers (e.g. 1536 floats). Texts with similar meaning produce vectors that point in similar directions — \"placement drive\" ends up near \"campus recruitment\" even with zero shared words.",
        },
        {
          type: "diagram",
          id: "embeddings",
          caption: "Same embedding space lets you compare meaning across sentences.",
        },
        {
          type: "code",
          lang: "python",
          code: 'emb = client.embeddings.create(\n    model="text-embedding-3-small",\n    input=["placement drive", "campus recruitment", "biryani recipe"],\n)\nvectors = [d.embedding for d in emb.data]\nprint(len(vectors[0]))  # 1536',
        },
        { type: "tip", text: "Embeddings are cheap — about ₹2 for a million tokens. Embed generously." },
      ],
      quiz: {
        question: "Two sentences with no common words can still have similar embeddings because…",
        options: [
          "Embeddings count shared characters",
          "Embeddings capture meaning, not exact words",
          "The model is random",
          "They are the same length",
        ],
        answer: 1,
        explanation: "Embedding models are trained so semantically similar texts map to nearby vectors.",
      },
      task: "Embed 10 sentences of your choice and print which pairs are most similar.",
    },
    {
      slug: "cosine-similarity",
      title: "Cosine similarity from scratch with NumPy",
      minutes: 12,
      summary: "Implement the core of every vector database in five lines.",
      blocks: [
        {
          type: "p",
          text: "Cosine similarity measures the angle between two vectors: 1 means same direction, 0 means unrelated. Implementing it yourself once removes all the magic from vector databases.",
        },
        {
          type: "diagram",
          id: "cosine",
          caption: "Rank documents by similarity score — this is vector search in plain NumPy.",
        },
        {
          type: "code",
          lang: "python",
          code: "import numpy as np\n\ndef cosine(a, b):\n    a, b = np.array(a), np.array(b)\n    return a @ b / (np.linalg.norm(a) * np.linalg.norm(b))\n\ndef search(query_vec, doc_vecs, k=3):\n    scores = [cosine(query_vec, d) for d in doc_vecs]\n    return np.argsort(scores)[::-1][:k]",
        },
      ],
      quiz: {
        question: "A cosine similarity of ~1.0 between two embeddings means:",
        options: ["They are opposites", "They are unrelated", "They are very similar in meaning", "One is longer"],
        answer: 2,
        explanation: "Vectors pointing in the same direction have cosine similarity close to 1.",
      },
      task: "Build a brute-force semantic search over 50 FAQ entries using only NumPy.",
    },
    {
      slug: "vector-databases",
      title: "Vector databases: Chroma and pgvector",
      minutes: 16,
      summary: "When brute force stops scaling and what to use instead.",
      blocks: [
        {
          type: "p",
          text: "Brute force is fine for thousands of vectors. For millions you need approximate nearest neighbour indexes (HNSW). Chroma is perfect for prototypes; pgvector lets you keep vectors next to your normal Postgres data in production.",
        },
        {
          type: "diagram",
          id: "vector-db",
          caption: "Embed once, store with metadata, query by meaning at request time.",
        },
        {
          type: "code",
          lang: "python",
          code: 'import chromadb\n\ndb = chromadb.PersistentClient(path="./db")\npapers = db.get_or_create_collection("question_papers")\npapers.add(ids=ids, documents=texts, metadatas=metas)\n\nhits = papers.query(query_texts=["dynamic programming 2023"], n_results=5)',
        },
        {
          type: "tip",
          text: "Always store metadata (year, subject, page). Filtering by metadata before vector search is what makes results actually useful.",
        },
      ],
      quiz: {
        question: "Why use a vector database instead of looping over all vectors?",
        options: [
          "Loops are illegal in Python",
          "ANN indexes like HNSW make search fast at millions of vectors",
          "Vector DBs make embeddings more accurate",
          "They are required by OpenAI",
        ],
        answer: 1,
        explanation: "Approximate nearest neighbour indexes trade a tiny bit of accuracy for massive speedups.",
      },
      task: "Load 5 past question papers into Chroma and search them by topic. This is your module project.",
    },
  ],
};
