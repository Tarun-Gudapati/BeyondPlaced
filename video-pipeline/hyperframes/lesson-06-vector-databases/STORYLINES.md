# Lesson 6 — Vector databases: Chroma and pgvector: storylines

Source: `src/lib/modules/m2.ts` lesson `vector-databases`. Every claim below comes from that lesson. The graph of
sixteen points and its four hops are a sketch of an HNSW index and are labelled illustrative; no speeds, sizes or
prices are stated.

**The one idea:** a vector database stores vectors with metadata and uses an index to find near neighbours without
checking everything.
**Remembered as:** "Embed once, store with metadata, let the index find the neighbours."

Assumptions for all three: 1920×1080, about 90 s, ElevenLabs narration, no music (voice only, as in lesson 1),
BeyondPlaced look. Picked without a stop, as the brief asks: **A**.

---

## A. From five papers to every paper (recommended — the viewer's own module project is the thing that breaks)

- **Device / form:** a moment in a student's project + one diagram that grows; one frame that rebuilds.
- **What you see and feel:** Meera's search over five question papers is instant. Then every paper from every
  department arrives and the same search has to scan a wall of points. The wall is rewired into a graph, a query
  hops across it in four steps, and each point turns out to carry its subject, year and page.
- **First 2 seconds:** a query point with five document points around it and "5 comparisons per search".
- **Beats:** five comparisons → millions, every search scans them all → and it only lives in memory → the index:
  points linked to near neighbours → a search hops towards the query, most points untouched → approximate: a little
  recall for a lot of speed → one record: vector + text + metadata → filter to DSA since 2022, then search by
  meaning → the result carries its source → Chroma: a database in a folder → pgvector: a vector column in Postgres
  → the one line.
- **Look:** the site's own brand — mist ground, white cards, deep teal structure, coral only on the key item of each
  scene, Inter for words and JetBrains Mono for vectors, code and SQL.
- **Sound:** warm, unhurried narration; no music.

## B. Finding a house in Bengaluru

- **Device / form:** something everyone already knows; a flight through one world.
- **What you see and feel:** a city map. Brute force knocks on every door; the index takes the highway, a main
  road, a cross road and the lane. The map then turns into the layers of an HNSW graph.
- **First 2 seconds:** a pin drops on one house while thousands of doors light up one by one.
- **Beats:** every door → highway, main road, cross, lane → the same idea as graph layers → approximate → each
  house has an address card (metadata) → Chroma and pgvector as two ways to keep the map → the one line.
- **Look:** flat teal street map on mist, white roads, coral on the route.
- **Sound:** narration with a soft tick per turn.

## C. The same search, twice (the bold one)

- **Device / form:** before and after; split screen that collapses to one.
- **What you see and feel:** two panes run the same query. On the left a loop crawls through every vector; on the
  right an index answers at once. The left pane keeps churning while the right calmly adds filters and sources.
- **First 2 seconds:** two identical search boxes, one result already back.
- **Beats:** the race → why the right side is fast (graph hops) → what it costs (approximate) → metadata filters
  only the right side has → Chroma, then pgvector → the panes collapse into the one line.
- **Look:** two white panes on mist, teal progress marks, coral on the finished result.
- **Sound:** narration; a quiet tick as the loop crawls.
