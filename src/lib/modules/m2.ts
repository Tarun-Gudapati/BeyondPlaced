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
      minutes: 30,
      summary:
        "How an embedding model turns text into a point in space, why similar meaning lands close together, and how to get vectors from an API or a free local model.",
      blocks: [
        {
          type: "video",
          src: "supabase:embeddings-intuition/embeddings-intuition.mp4",
          poster: "supabase:embeddings-intuition/embeddings-intuition.jpg",
          captions: "supabase:embeddings-intuition/embeddings-intuition.vtt",
          title: "Embeddings, in 85 seconds",
        },
        {
          type: "p",
          text: `Search your college notice portal for "placement drive" and you may get nothing, even though there is a notice titled "Campus recruitment starts Monday". Keyword search compares letters, and those two phrases do not share a single word. Embeddings fix this. An embedding model converts any text into a fixed-length list of numbers (for example 1536 floats), and texts with similar meaning get similar lists. Search stops being "which documents contain these words" and becomes "which documents sit near this point".`,
        },
        {
          type: "diagram",
          id: "embeddings",
          caption: "Same embedding space lets you compare meaning across sentences.",
        },
        { type: "h", text: "A point on a map, but for meaning" },
        {
          type: "p",
          text: `Think of a map of India. Two numbers, latitude and longitude, are enough to place any city, and cities that are close on the ground have close numbers: Bengaluru and Mysuru are neighbours, Bengaluru and Delhi are not. An embedding does the same thing for meaning. Instead of 2 numbers it uses hundreds or thousands, and instead of geography the "ground" is what the text is about. "placement drive" and "campus recruitment" land in the same neighbourhood; "biryani recipe" lands in a different city altogether.`,
        },
        {
          type: "p",
          text: `That list of numbers is called a vector, and the count of numbers is its dimension. You cannot read a vector the way you read a coordinate: there is no "placement dimension" at position 412. Meaning is spread across all the numbers together, so the only useful thing to do with a vector is compare it with other vectors.`,
        },
        { type: "h", text: "Your first embeddings call" },
        {
          type: "p",
          text: "Embedding models are separate from chat models. You send text and get numbers back: no prompt, no temperature, no generated answer. With the OpenAI SDK it is one call, and you can send a whole list of texts in a single request.",
        },
        {
          type: "code",
          lang: "python",
          code: `# pip install openai
from openai import OpenAI

client = OpenAI()  # reads OPENAI_API_KEY from your environment

texts = ["placement drive", "campus recruitment", "biryani recipe"]
resp = client.embeddings.create(model="text-embedding-3-small", input=texts)
vectors = [d.embedding for d in resp.data]  # same order as texts

print(len(vectors))             # 3    -> one vector per input text
print(len(vectors[0]))          # 1536 -> every vector has the same length
print(vectors[0][:5])           # plain floats; no single one "means" anything
print(resp.usage.total_tokens)  # input tokens you were billed for`,
        },
        {
          type: "list",
          items: [
            "One vector comes back per input text, in the same order you sent them.",
            "Every vector has the same length, whether the text was two words or two pages.",
            "You pay for input tokens only. There is no output text to pay for.",
            "The same text with the same model gives the same vector (apart from tiny floating-point noise), so you can embed once and save the result.",
          ],
        },
        { type: "h", text: "Comparing meaning: which sentences are close?" },
        {
          type: "p",
          text: "To compare two vectors we measure how closely they point in the same direction. That measure is cosine similarity, and you will build it from scratch in the next lesson. For now one fact is enough: OpenAI's embedding vectors come back with length 1, so a plain dot product gives the similarity score. Higher means closer in meaning.",
        },
        {
          type: "code",
          lang: "python",
          code: `# pip install openai numpy
import numpy as np
from openai import OpenAI

client = OpenAI()

def embed(texts: list[str]) -> np.ndarray:
    resp = client.embeddings.create(model="text-embedding-3-small", input=texts)
    return np.array([d.embedding for d in resp.data])

sentences = [
    "When is the placement drive?",
    "Campus recruitment starts next month",
    "How to make Hyderabadi biryani",
]
vecs = embed(sentences)   # shape (3, 1536)
sims = vecs @ vecs.T      # every sentence against every other sentence

for i in range(len(sentences)):
    for j in range(i + 1, len(sentences)):
        print(f"{sims[i, j]:.2f}  {sentences[i]}  <->  {sentences[j]}")`,
        },
        {
          type: "p",
          text: "Run it and the placement / recruitment pair scores clearly highest, although the two sentences share no words. Do not expect the unrelated pairs to score 0: with most models even unrelated sentences get a score well above zero. What matters is the ranking, not the absolute number.",
        },
        { type: "h", text: "A free model that runs on your laptop" },
        {
          type: "p",
          text: "You do not need a paid API to learn this. The sentence-transformers library runs open embedding models locally. all-MiniLM-L6-v2 is a small, popular one: it gives 384 numbers per text and runs fine on a CPU, which makes it a good fit for college projects and hackathons with no API budget.",
        },
        {
          type: "code",
          lang: "python",
          code: `# pip install sentence-transformers
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")  # downloads once, then works offline

sentences = [
    "When is the placement drive?",
    "Campus recruitment starts next month",
    "How to make Hyderabadi biryani",
]
vecs = model.encode(sentences, normalize_embeddings=True)  # length-1 vectors
print(vecs.shape)  # (3, 384)

sims = vecs @ vecs.T
print(sims.round(2))  # 3x3 table; the diagonal is 1.0 (each sentence vs itself)`,
        },
        {
          type: "p",
          text: "The one rule you must not break: a vector only makes sense next to other vectors from the same model. The 384 numbers from MiniLM and the 1536 numbers from text-embedding-3-small are coordinates on two completely different maps. If you embed your documents with one model, embed your queries with that same model, and if you ever switch models, re-embed everything.",
        },
        { type: "h", text: "How the model learned to do this" },
        {
          type: "p",
          text: `An embedding model is a neural network trained on a huge number of text pairs that belong together: a question and its answer, a title and its article, two sentences that say the same thing. Training pulls the vectors of matching pairs closer and pushes the vectors of random pairs apart. After enough examples, "close together" reliably means "about the same thing", even for sentences the model has never seen.`,
        },
        {
          type: "p",
          text: `This is why embeddings capture more than synonyms. "How do I reverse a linked list?" lands near "Pointer manipulation in singly linked lists" because texts like these tend to answer each other, not because they share vocabulary.`,
        },
        { type: "h", text: "Embed once, save, reuse" },
        {
          type: "p",
          text: "Embedding your documents is a one-time job; only the query needs embedding at search time. Here is the whole pattern in miniature: embed a few FAQs, cache the vectors on disk, and answer a question by picking the nearest one. The next two lessons scale exactly this idea up.",
        },
        {
          type: "code",
          lang: "python",
          code: `# pip install sentence-transformers numpy
from pathlib import Path

import numpy as np
from sentence_transformers import SentenceTransformer

CACHE = Path("faq_vectors.npy")  # delete this file whenever you change faqs or the model

faqs = [  # made-up example data
    "The placement drive for final-year students starts in August.",
    "Internship offers must be reported to the placement cell.",
    "Hostel mess timings are 7 am to 9 pm.",
    "Library books can be renewed twice online.",
]

model = SentenceTransformer("all-MiniLM-L6-v2")

if CACHE.exists():
    vecs = np.load(CACHE)
else:
    vecs = model.encode(faqs, normalize_embeddings=True)
    np.save(CACHE, vecs)

question = "when does campus recruitment begin?"
q = model.encode([question], normalize_embeddings=True)[0]

scores = vecs @ q              # one score per FAQ
best = int(np.argmax(scores))
print(faqs[best], f"(score {scores[best]:.2f})")`,
        },
        { type: "h", text: "Where you will use embeddings" },
        {
          type: "list",
          items: [
            `Semantic search: find the past question paper about "shortest path" even when the paper only says "Dijkstra".`,
            "RAG (Module 3): fetch the most relevant pieces of your documents and give them to an LLM as context.",
            "Matching: score how well each bullet on your resume matches a job description, and see which requirements you have no bullet for.",
            "Clustering and de-duplication: group hundreds of doubts from a class WhatsApp group into topics, or spot the same question asked five different ways.",
            "Classification with few examples: embed a handful of labelled examples and give a new text the label of its nearest neighbours.",
          ],
        },
        { type: "h", text: "What embeddings cannot do" },
        {
          type: "list",
          items: [
            `Similar is not the same as true, or even agreeing. "I love DSA" and "I hate DSA" are about the same topic, so they often land close together.`,
            "One vector for a very long text blurs everything. A 40-page PDF squeezed into one vector is an average of all its topics. Long documents must be split into chunks (Module 3).",
            "Inputs have a size limit. Hosted APIs reject text over their token limit; local models such as all-MiniLM-L6-v2 silently cut off anything past a few hundred tokens.",
            "Exact strings are not their strength: roll numbers, course codes like CS301, error codes. Keyword search is better there, and real systems often combine both.",
            "Quality depends on the model and your text. Try your own data (Hinglish, your college's abbreviations) before you trust the results.",
          ],
        },
        { type: "h", text: "Common mistakes" },
        {
          type: "list",
          items: [
            "Embedding documents with one model and queries with another.",
            "Re-embedding the same documents on every run instead of saving the vectors.",
            "Calling the API once per sentence in a loop instead of sending a list of texts in one request.",
            "Embedding a whole document as one vector, then wondering why search results are vague.",
            "Reading a similarity score as a percentage or a probability. It is only useful for ranking.",
            "Expecting embeddings to handle negation, arithmetic or exact IDs.",
          ],
        },
        { type: "h", text: "How this shows up in interviews" },
        {
          type: "list",
          items: [
            `"What is an embedding?" A fixed-length vector that represents a piece of text, produced by a model trained so that texts with similar meaning get nearby vectors. It lets you compare meaning with simple maths such as cosine similarity.`,
            `"How is semantic search different from keyword search?" Keyword search matches terms that appear in both the query and the document, so it misses synonyms and paraphrases. Semantic search embeds both and ranks by vector similarity, so "placement drive" finds "campus recruitment". Keyword search still wins on exact IDs and rare terms, which is why production systems often combine the two (hybrid search).`,
            `"Can you compare embeddings from two different models?" No. Each model defines its own vector space, usually with a different number of dimensions. Changing the model means re-embedding the whole collection.`,
          ],
        },
        {
          type: "tip",
          text: "Embedding models cost far less per token than chat models, and you pay for input only. Check your provider's pricing page for current numbers, then embed generously and cache the results.",
        },
        {
          type: "tip",
          text: "Whenever you save vectors, save the model name next to them. Six months later it is the only way to know which model your queries must use.",
        },
      ],
      quiz: {
        question:
          "You embedded 5,000 question-paper chunks with all-MiniLM-L6-v2. To get better results you start embedding the search queries with text-embedding-3-small. What happens?",
        options: [
          "Search improves, because the query vectors are higher quality",
          "Search breaks: the two models use different vector spaces and dimensions, so the comparison is meaningless or the code errors out",
          "Nothing changes, because all embedding models produce the same vectors",
          "Search gets slower but more accurate",
        ],
        answer: 1,
        explanation:
          "A vector is only comparable with vectors from the same model. MiniLM gives 384 numbers and text-embedding-3-small gives 1536, in unrelated spaces. To switch models you must re-embed all 5,000 chunks.",
      },
      task: `Mini-deliverable: write similar_pairs.py. Put 10 sentences in a list covering three topics (for example placements, DSA and food). Include one pair that means the same thing with no shared words, and one pair like "I love X" / "I hate X". Embed them with one model, print every pair sorted from most to least similar, and add a comment at the top naming the one result that surprised you and why.`,
    },
    {
      slug: "cosine-similarity",
      title: "Cosine similarity from scratch with NumPy",
      minutes: 30,
      summary:
        "Work out cosine similarity by hand, implement it in NumPy, and turn it into a complete brute-force semantic search you can measure.",
      blocks: [
        {
          type: "video",
          src: "supabase:cosine-similarity/cosine-similarity.mp4",
          poster: "supabase:cosine-similarity/cosine-similarity.jpg",
          captions: "supabase:cosine-similarity/cosine-similarity.vtt",
          title: "Cosine similarity, in 90 seconds",
        },
        {
          type: "p",
          text: "Last lesson you compared vectors with a dot product and took the score on trust. Now you will build that score yourself. Cosine similarity measures the angle between two vectors: 1 means they point in exactly the same direction, 0 means they are at right angles (nothing in common), and -1 means they point in opposite directions. Once you have written it yourself, a vector database stops being magic. It is this function, run over a lot of vectors, quickly.",
        },
        {
          type: "diagram",
          id: "cosine",
          caption: "Rank documents by similarity score — this is vector search in plain NumPy.",
        },
        { type: "h", text: "The formula, by hand" },
        {
          type: "p",
          text: "Cosine similarity is the dot product of two vectors divided by the product of their lengths: cos(a, b) = (a · b) / (‖a‖ × ‖b‖). The dot product multiplies matching positions and adds the results. The length (also called the norm) is the square root of the sum of squares, which is just Pythagoras. Do these four by hand once:",
        },
        {
          type: "list",
          items: [
            "a = [3, 4], b = [6, 8]. Dot product: 3×6 + 4×8 = 50. Lengths: 5 and 10. Score: 50 / (5 × 10) = 1. Same direction, different length.",
            "a = [1, 0], b = [0, 1]. Dot product: 0. Score: 0. A right angle: nothing in common.",
            "a = [1, 0], b = [1, 1]. Dot product: 1. Lengths: 1 and about 1.414. Score: about 0.71. A 45-degree angle.",
            "a = [1, 0], b = [-1, 0]. Dot product: -1. Score: -1. Opposite directions.",
          ],
        },
        {
          type: "code",
          lang: "python",
          code: `# pip install numpy
import numpy as np

def cosine(a, b) -> float:
    a = np.asarray(a, dtype=float)
    b = np.asarray(b, dtype=float)
    return float(a @ b / (np.linalg.norm(a) * np.linalg.norm(b)))

print(cosine([3, 4], [6, 8]))    # 1.0     same direction, different length
print(cosine([1, 0], [0, 1]))    # 0.0     right angle
print(cosine([1, 0], [1, 1]))    # 0.7071  45 degrees
print(cosine([1, 0], [-1, 0]))   # -1.0    opposite`,
        },
        { type: "h", text: "Why the angle, and not the length?" },
        {
          type: "p",
          text: "In an embedding, the direction of the vector carries the meaning. Cosine similarity ignores length completely, which is why [3, 4] and [6, 8] score a perfect 1. So a one-line question and a full-paragraph answer can still point the same way and score high.",
        },
        {
          type: "p",
          text: `Two practical warnings. First, with real text embeddings you will rarely see scores near 0 or below: even unrelated sentences often score well above zero, and the usual range is different for every model. Second, a score is not a percentage. 0.82 does not mean "82% correct". Use scores to rank results against each other for the same query, and if you need a cut-off, choose it by testing your own data with your own model.`,
        },
        { type: "h", text: "Normalise once, then it is just a dot product" },
        {
          type: "p",
          text: "Dividing by the two lengths on every comparison is wasted work. Instead, scale every vector to length 1 once (this is called L2 normalisation). For unit vectors both lengths are 1, so cosine similarity is simply the dot product. OpenAI's embedding API already returns unit-length vectors, and sentence-transformers does it when you pass normalize_embeddings=True. Normalising a second time does no harm, so do it whenever you are unsure.",
        },
        {
          type: "p",
          text: "A fact worth keeping for interviews: on unit vectors, cosine similarity, dot product and Euclidean distance all give the same ranking, because ‖a − b‖² = 2 − 2 × cos(a, b). A smaller distance always means a larger cosine.",
        },
        { type: "h", text: "From one pair to a whole search" },
        {
          type: "p",
          text: "Stack your document vectors into a matrix, one row per document. Multiply that matrix by the query vector and NumPy returns every score at once, with the loop running in optimised native code instead of Python. Sort the scores, keep the top k, and that is vector search.",
        },
        {
          type: "code",
          lang: "python",
          code: `import numpy as np

def normalize(x: np.ndarray) -> np.ndarray:
    """Scale each row (or a single vector) to length 1."""
    return x / np.linalg.norm(x, axis=-1, keepdims=True)

def search(query_vec: np.ndarray, doc_vecs: np.ndarray, k: int = 3):
    """Return (index, score) for the k most similar rows. Inputs must be normalised."""
    scores = doc_vecs @ query_vec        # shape (num_docs,): one score per document
    top = np.argsort(scores)[::-1][:k]   # argsort is ascending, so reverse it
    return [(int(i), float(scores[i])) for i in top]

# Toy 2D "embeddings" so you can check the answer by eye.
docs = normalize(np.array([[1.0, 0.1], [0.7, 0.7], [0.0, 1.0], [-1.0, 0.2]]))
query = normalize(np.array([0.9, 0.3]))

for i, score in search(query, docs, k=2):
    print(i, round(score, 3))   # 0 0.975, then 1 0.894`,
        },
        { type: "h", text: "A complete semantic search over FAQs" },
        {
          type: "p",
          text: "Here is the whole thing end to end with a free local model: embed the FAQ entries once, embed each question, rank with one matrix multiplication. For the task you will swap in your own 50 entries.",
        },
        {
          type: "code",
          lang: "python",
          code: `# pip install sentence-transformers numpy
import numpy as np
from sentence_transformers import SentenceTransformer

faqs = [  # made-up example data: replace with your own
    "The placement drive for final-year students begins in August.",
    "Students must register on the placement portal before applying.",
    "The aptitude round has quantitative, logical and verbal sections.",
    "Coding rounds usually ask DSA problems on arrays, strings and trees.",
    "Resumes should be one page and uploaded as a PDF.",
    "Internship offers must be reported to the placement cell.",
    "Hostel mess timings are 7 am to 9 pm.",
    "The library stays open till midnight during exams.",
]

model = SentenceTransformer("all-MiniLM-L6-v2")
doc_vecs = model.encode(faqs, normalize_embeddings=True)   # embed once: shape (8, 384)

def ask(question: str, k: int = 3) -> None:
    q = model.encode([question], normalize_embeddings=True)[0]
    scores = doc_vecs @ q
    print()
    print("Q:", question)
    for i in np.argsort(scores)[::-1][:k]:
        print(f"  {scores[i]:.2f}  {faqs[i]}")

ask("when does campus recruitment start?")
ask("what topics come in the programming test?")
ask("what should my CV look like?")`,
        },
        { type: "h", text: "How far does brute force go?" },
        {
          type: "p",
          text: "Brute force compares the query with every stored vector, so the work grows in step with the number of documents and the number of dimensions. That sounds bad, but NumPy is fast, and for a college project with a few thousand chunks you will not notice it. Memory is easy to estimate: vectors × dimensions × 4 bytes for float32. For example, 100,000 vectors of 384 dimensions take about 154 MB, and the same count at 1536 dimensions takes about 614 MB. Do not guess the speed. Measure it on your own laptop:",
        },
        {
          type: "code",
          lang: "python",
          code: `import time

import numpy as np

rng = np.random.default_rng(0)
dim = 384

for n in (1_000, 10_000, 100_000):
    docs = rng.standard_normal((n, dim), dtype=np.float32)   # random stand-in vectors
    docs /= np.linalg.norm(docs, axis=1, keepdims=True)
    query = docs[0]

    start = time.perf_counter()
    scores = docs @ query
    top = np.argpartition(scores, -5)[-5:]        # top 5 without sorting everything
    top = top[np.argsort(scores[top])[::-1]]
    ms = (time.perf_counter() - start) * 1000

    print(f"{n:>7} vectors: {ms:.2f} ms, {docs.nbytes / 1e6:.0f} MB, best match = {top[0]}")`,
        },
        {
          type: "p",
          text: "When the numbers stop being comfortable (millions of vectors, many searches per second, data that must survive a restart, filters such as subject or year) you move to a vector database. That is the next lesson.",
        },
        { type: "h", text: "Common mistakes" },
        {
          type: "list",
          items: [
            "Forgetting to normalise and then using a plain dot product. Longer vectors win for the wrong reason.",
            "Sorting the wrong way round. np.argsort returns the smallest first; without [::-1] you return the least similar documents.",
            "Looping over documents in Python and calling cosine() each time. One matrix multiplication does the same job far faster.",
            "Re-embedding the documents for every query. Embed them once; only the query is new.",
            "Treating the score as a percentage, or copying a threshold like 0.8 from a blog post written for a different model.",
            "Comparing vectors from different models. If the dimensions differ NumPy raises a shape error; if they happen to match you silently get nonsense.",
            "Leaving vectors as float64. That is twice the memory of float32 for no benefit in search quality.",
          ],
        },
        { type: "h", text: "How this shows up in interviews" },
        {
          type: "list",
          items: [
            `"Cosine similarity vs dot product vs Euclidean distance?" Cosine compares direction only. The dot product also rewards length. Euclidean distance measures how far apart the end points are. On unit-length vectors all three give the same ranking, so most systems normalise once and use the dot product because it is the cheapest.`,
            `"What is the time complexity of brute-force vector search, and how would you speed it up?" O(N × d) per query for N vectors of d dimensions. First steps: normalise once, do one vectorised matrix multiply, keep float32, and use argpartition for the top k. Beyond that, use an approximate nearest neighbour index such as HNSW, which avoids looking at most of the vectors.`,
            `"Two documents score 0.82 and 0.79 for a query. What does that tell you?" Only that the first ranks slightly higher for this query with this model. Scores are not probabilities and cannot be compared across models, so any threshold must be tuned on your own data.`,
          ],
        },
        {
          type: "tip",
          text: "Test every similarity function with vectors you can check in your head: [3, 4] against [6, 8] must give 1, and [1, 0] against [0, 1] must give 0. If those fail, nothing built on top will work.",
        },
        {
          type: "tip",
          text: `Keep the from-scratch version on your GitHub. "I implemented vector search in NumPy before I used a vector database" is a strong, specific line in an interview.`,
        },
      ],
      quiz: {
        question:
          "You L2-normalise every document vector and the query vector to length 1. Which statement is now true?",
        options: [
          "The dot product of two vectors equals their cosine similarity, so one matrix multiplication ranks every document",
          "Every document now gets the same score",
          "Cosine similarity can no longer be negative",
          "You must still divide by both vector lengths on every comparison",
        ],
        answer: 0,
        explanation:
          "For unit vectors both lengths are 1, so the denominator disappears and cosine similarity is just the dot product. Normalising changes length, not direction, so the ranking is unchanged and negative scores are still possible.",
      },
      task: "Mini-deliverable: faq_search.py. Collect 50 real FAQ entries (your placement cell, your department or a club you belong to). Embed them once and save the vectors with np.save. Write ask(question, k=3) that uses only NumPy for the search. Run 5 questions worded differently from the FAQs, paste the output into a comment, and note one query where the top result was wrong and why you think that happened.",
    },
    {
      slug: "vector-databases",
      title: "Vector databases: Chroma and pgvector",
      minutes: 35,
      summary:
        "What a vector database adds over a NumPy array, how an HNSW index finds neighbours without checking everything, and working Chroma and pgvector code with metadata filters.",
      blocks: [
        {
          type: "p",
          text: "Your NumPy search from the last lesson compares the query with every stored vector. For a few thousand vectors that is instant. Now imagine every question paper from every department for ten years, cut into chunks: millions of vectors, every search checking all of them, the whole thing living in RAM and gone when the script stops. A vector database solves exactly these problems. It stores vectors on disk with their text and metadata, and it builds an index so a search looks at only a small part of the data.",
        },
        {
          type: "diagram",
          id: "vector-db",
          caption: "Embed once, store with metadata, query by meaning at request time.",
        },
        { type: "h", text: "What a vector database adds" },
        {
          type: "list",
          items: [
            "Persistence: vectors are saved to disk, so you embed your documents once and not on every run.",
            "Metadata: each vector is stored with fields such as subject, year and page, and you can filter on them.",
            "An index: an approximate nearest neighbour (ANN) structure, usually HNSW, that finds close vectors without comparing against all of them.",
            "Updates: add, change and delete individual records without rebuilding everything.",
            "Convenience: many will embed text for you and return the original document along with the match.",
          ],
        },
        { type: "h", text: "How an index finds neighbours without checking everything" },
        {
          type: "p",
          text: "The most common index is HNSW (Hierarchical Navigable Small World). Picture every vector as a point, with links to a handful of its nearest neighbours, forming a graph. A search starts at an entry point, looks at that point's neighbours, hops to whichever one is closer to the query, and repeats until no neighbour is closer. Most points are never looked at.",
        },
        {
          type: "p",
          text: "The hierarchy makes the first hops long. It is like finding a house in Bengaluru: you do not check every house in the city. You take the highway to the right area, then a main road, then a cross road, then the lane. HNSW keeps a few sparse upper layers with long links for the highway part, and one dense bottom layer that contains every point for the final few steps.",
        },
        {
          type: "p",
          text: "The price is in the name: approximate. Because the search only explores part of the graph, it can occasionally miss a true nearest neighbour. The fraction of true neighbours it does return is called recall. Every index has a setting for how hard to search: higher gives better recall and slower queries. For most applications the default trade is an easy one: a tiny loss in accuracy for a very large gain in speed.",
        },
        { type: "h", text: "Chroma: a vector database in a folder" },
        {
          type: "p",
          text: "Chroma is the fastest way to get started. It is a Python package, it stores everything in a local folder, and by default it embeds your text with a small local model (all-MiniLM-L6-v2, downloaded on first use), so the example below needs no API key.",
        },
        {
          type: "code",
          lang: "python",
          code: `# pip install chromadb
import chromadb

client = chromadb.PersistentClient(path="./chroma_db")   # a folder on disk; survives restarts
papers = client.get_or_create_collection(
    name="question_papers",
    metadata={"hnsw:space": "cosine"},   # the default distance is L2; cosine is the usual choice for text
)

questions = [  # made-up examples; in your project these come from real papers
    {"id": "dsa-2023-q4", "subject": "DSA", "year": 2023, "page": 2,
     "text": "Explain Dijkstra's algorithm and find the shortest path in the given graph."},
    {"id": "dsa-2022-q7", "subject": "DSA", "year": 2022, "page": 3,
     "text": "Solve the 0/1 knapsack problem using dynamic programming."},
    {"id": "dsa-2021-q3", "subject": "DSA", "year": 2021, "page": 1,
     "text": "Write an algorithm to detect a cycle in a linked list."},
    {"id": "dbms-2023-q2", "subject": "DBMS", "year": 2023, "page": 1,
     "text": "Normalise the given relation to third normal form."},
    {"id": "os-2023-q5", "subject": "OS", "year": 2023, "page": 2,
     "text": "Compare paging and segmentation with neat diagrams."},
]

papers.upsert(   # upsert = insert or update, so running this script again is safe
    ids=[q["id"] for q in questions],
    documents=[q["text"] for q in questions],   # Chroma embeds these for you
    metadatas=[{"subject": q["subject"], "year": q["year"], "page": q["page"]} for q in questions],
)
print(papers.count(), "questions stored")

hits = papers.query(query_texts=["minimum distance between two nodes"], n_results=2)
for doc, meta, dist in zip(hits["documents"][0], hits["metadatas"][0], hits["distances"][0]):
    print(f"{dist:.3f}  {meta['subject']} {meta['year']} p{meta['page']}  {doc}")`,
        },
        {
          type: "list",
          items: [
            "Results come back as lists of lists, one inner list per query. That is why the code reads hits[\"documents\"][0].",
            "Chroma returns distances, not similarities: smaller is closer. With cosine space, similarity = 1 − distance.",
            "Run the script twice. The second run finds the folder, upserts the same ids and still reports 5 questions.",
            "Recent Chroma versions also accept the distance setting through a configuration argument; the metadata form above is the long-standing one.",
          ],
        },
        { type: "h", text: "Metadata filters and your own embeddings" },
        {
          type: "p",
          text: `Pure similarity is rarely what a user wants. "Dynamic programming questions from DSA papers since 2022" is a meaning search inside a metadata filter. In Chroma the filter is the where argument. The example below also shows the second common pattern: creating the vectors yourself (here with text-embedding-3-small) and handing them to Chroma, which then embeds nothing.`,
        },
        {
          type: "code",
          lang: "python",
          code: `# pip install chromadb openai
import chromadb
from openai import OpenAI

oai = OpenAI()
EMBED_MODEL = "text-embedding-3-small"

def embed(texts: list[str]) -> list[list[float]]:
    resp = oai.embeddings.create(model=EMBED_MODEL, input=texts)
    return [d.embedding for d in resp.data]

client = chromadb.PersistentClient(path="./chroma_db")
papers = client.get_or_create_collection(
    name="question_papers_openai",   # a separate collection: never mix models in one
    metadata={"hnsw:space": "cosine", "embedding_model": EMBED_MODEL},
)

texts = [
    "Explain Dijkstra's algorithm and find the shortest path in the given graph.",
    "Solve the 0/1 knapsack problem using dynamic programming.",
    "Normalise the given relation to third normal form.",
]
papers.upsert(
    ids=["dsa-2023-q4", "dsa-2022-q7", "dbms-2023-q2"],
    embeddings=embed(texts),   # your vectors, so Chroma does not embed anything
    documents=texts,
    metadatas=[
        {"subject": "DSA", "year": 2023},
        {"subject": "DSA", "year": 2022},
        {"subject": "DBMS", "year": 2023},
    ],
)

hits = papers.query(
    query_embeddings=embed(["optimisation with overlapping subproblems"]),   # same model as the documents
    n_results=2,
    where={"$and": [{"subject": "DSA"}, {"year": {"$gte": 2022}}]},
)
for doc, meta, dist in zip(hits["documents"][0], hits["metadatas"][0], hits["distances"][0]):
    print(f"similarity {1 - dist:.2f}  {meta['subject']} {meta['year']}  {doc}")`,
        },
        { type: "h", text: "pgvector: vectors inside Postgres" },
        {
          type: "p",
          text: "Most real applications already have a Postgres database for users, orders or lessons. pgvector is an extension that adds a vector column type and similarity operators to Postgres, so your embeddings live in the same database as everything else. You get SQL filters, joins, transactions and backups you already know, and managed Postgres services such as Supabase and Neon offer it. The whole idea fits in a few lines of SQL:",
        },
        {
          type: "code",
          lang: "sql",
          code: `CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE questions (
    id        bigserial PRIMARY KEY,
    subject   text NOT NULL,
    year      int  NOT NULL,
    content   text NOT NULL,
    embedding vector(1536)   -- must match your embedding model's dimension
);

-- HNSW index built for cosine distance
CREATE INDEX ON questions USING hnsw (embedding vector_cosine_ops);

-- <=> is cosine distance, so similarity = 1 - distance. $1 is the query vector.
SELECT content, year, 1 - (embedding <=> $1) AS similarity
FROM questions
WHERE subject = 'DSA' AND year >= 2022
ORDER BY embedding <=> $1
LIMIT 5;`,
        },
        {
          type: "p",
          text: "And the same thing from Python, using psycopg 3 and the pgvector helper package so NumPy arrays can be passed straight into queries:",
        },
        {
          type: "code",
          lang: "python",
          code: `# pip install "psycopg[binary]" pgvector openai numpy
# A local Postgres with pgvector, for example:
#   docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres pgvector/pgvector:pg16
import numpy as np
import psycopg
from openai import OpenAI
from pgvector.psycopg import register_vector

oai = OpenAI()

def embed(text: str) -> np.ndarray:
    resp = oai.embeddings.create(model="text-embedding-3-small", input=[text])
    return np.array(resp.data[0].embedding)

conn = psycopg.connect("postgresql://postgres:postgres@localhost:5432/postgres", autocommit=True)
conn.execute("CREATE EXTENSION IF NOT EXISTS vector")
register_vector(conn)   # teaches psycopg to send and receive vector columns

conn.execute("""
    CREATE TABLE IF NOT EXISTS questions (
        id bigserial PRIMARY KEY,
        subject text NOT NULL,
        year int NOT NULL,
        content text NOT NULL UNIQUE,
        embedding vector(1536)
    )
""")
conn.execute(
    "CREATE INDEX IF NOT EXISTS questions_embedding_idx "
    "ON questions USING hnsw (embedding vector_cosine_ops)"
)

text = "Solve the 0/1 knapsack problem using dynamic programming."
conn.execute(
    "INSERT INTO questions (subject, year, content, embedding) VALUES (%s, %s, %s, %s) "
    "ON CONFLICT (content) DO NOTHING",   # safe to run twice
    ("DSA", 2022, text, embed(text)),
)

q = embed("optimisation with overlapping subproblems")
rows = conn.execute(
    """
    SELECT content, year, 1 - (embedding <=> %s) AS similarity
    FROM questions
    WHERE subject = %s
    ORDER BY embedding <=> %s
    LIMIT 5
    """,
    (q, "DSA", q),
).fetchall()

for content, year, similarity in rows:
    print(f"{similarity:.2f}  {year}  {content}")
conn.close()`,
        },
        { type: "h", text: "Which one should you use?" },
        {
          type: "list",
          items: [
            "A NumPy array: a script or notebook with up to tens of thousands of vectors. Nothing to install, nothing to run.",
            "Chroma: prototypes, hackathons and college projects. Local, persistent, filters included, minutes to set up.",
            "pgvector: an application that already uses Postgres. One database to run, back up and secure, and you can join search results with your normal tables.",
            "A dedicated vector database (Qdrant, Milvus, Weaviate, Pinecone and others): when vector search is the core of the product and the data or traffic outgrows a single Postgres instance.",
          ],
        },
        {
          type: "p",
          text: "Do not start with the biggest tool. Interviewers are far more impressed by a clear reason for a simple choice than by a famous name on your resume.",
        },
        { type: "h", text: "Common mistakes" },
        {
          type: "list",
          items: [
            "Using an in-memory client, then wondering why everything is re-embedded on every run. Use PersistentClient and stable ids.",
            "Generating new random ids each run, so every run adds duplicates. Derive ids from the content (paper, year, question number) and upsert.",
            "Reading a distance as a similarity. Smaller distance is better; sort the wrong way and you show the worst matches first.",
            "Leaving Chroma's default L2 distance while reasoning about cosine scores. Set the space when you create the collection; it cannot be changed afterwards without rebuilding.",
            "Embedding documents with one model and queries with another, or changing the model without re-embedding the collection.",
            "Storing no metadata. Without subject, year and page you cannot filter, and you cannot tell the user where an answer came from.",
            "Expecting an ANN index to be exact. With pgvector a very selective WHERE clause on top of an HNSW index can even return fewer rows than your LIMIT, because the filter runs after the index scan.",
          ],
        },
        { type: "h", text: "How this shows up in interviews" },
        {
          type: "list",
          items: [
            `"Why not just loop over all the vectors?" Brute force is exact but costs O(N × d) per query and keeps everything in memory. It is fine up to thousands of vectors. A vector database adds persistence, metadata filtering and an ANN index, so query time grows far more slowly than the data.`,
            `"What is HNSW?" A layered graph where each vector links to its near neighbours. Search starts in a sparse top layer, greedily hops towards the query, and drops down through denser layers. It visits a small fraction of the vectors, so it is fast, and it is approximate: you trade a little recall for speed and can tune that trade.`,
            `"When would you choose pgvector over a dedicated vector database?" When the application already runs on Postgres and the scale is moderate: one system to operate, SQL filters and joins with existing tables, and transactional consistency between rows and their vectors. I would move to a dedicated engine when vector search itself becomes the bottleneck.`,
          ],
        },
        {
          type: "tip",
          text: "Always store metadata (year, subject, page). Filtering by metadata together with vector search is what makes results actually useful, and it is what lets you show the user the source.",
        },
        {
          type: "tip",
          text: "Keep one small script that rebuilds your collection from the raw files. When you change the chunking or the embedding model, you delete the collection and run it again, with no manual steps.",
        },
      ],
      quiz: {
        question:
          "You move 2 million vectors from brute-force NumPy search to an HNSW index. Queries become much faster, but now and then a document you know is the true best match is missing from the top 5. What is the most likely explanation?",
        options: [
          "The index is corrupted and must be rebuilt",
          "HNSW is approximate: it explores only part of the graph, trading a little recall for speed, and a higher search-effort setting would recover accuracy at some cost in speed",
          "Vector databases modify embeddings when they store them",
          "Cosine similarity stops working beyond a million vectors",
        ],
        answer: 1,
        explanation:
          "ANN indexes skip most of the data, so they can occasionally miss a true nearest neighbour. That is the designed trade-off, measured as recall, and it is tunable: search harder for better recall, or less hard for more speed.",
      },
      task: `Module project: paper_search.py. Take 5 past question papers from your college, split them into individual questions, and upsert each one into a persistent Chroma collection with metadata (subject, year, paper, question number). Add a small command line: python paper_search.py "dynamic programming" --subject DSA --year 2023 should print the top 5 questions with similarity and source. Run the loader twice to prove nothing is duplicated, and put three example searches and their output in the README.`,
    },
  ],
};
