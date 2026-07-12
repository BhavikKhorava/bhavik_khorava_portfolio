// The general RAG pipeline pattern Bhavik builds with — a reusable
// architecture shape, not a specific product. Powers the AI Systems section.

export interface PipelineStage {
  key: string;
  label: string;
  tech: string;
  detail: string;
}

export const ragPipeline: PipelineStage[] = [
  {
    key: "ingest",
    label: "documents",
    tech: "source data",
    detail: "docs, records, user content chunked for processing",
  },
  {
    key: "embed",
    label: "embedding",
    tech: "text-embedding-3-small",
    detail: "chunks converted to dense vectors via OpenAI embeddings",
  },
  {
    key: "store",
    label: "vector_store",
    tech: "Pinecone",
    detail: "vectors indexed for fast approximate nearest-neighbor search",
  },
  {
    key: "retrieve",
    label: "retrieval",
    tech: "top-k similarity",
    detail: "query embedded, closest chunks pulled as context",
  },
  {
    key: "generate",
    label: "llm",
    tech: "GPT-4o-mini / Claude",
    detail: "retrieved context grounds the model's generation",
  },
  {
    key: "respond",
    label: "response",
    tech: "grounded output",
    detail: "answer backed by retrieved facts, not just model memory",
  },
];
