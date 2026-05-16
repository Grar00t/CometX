"""CometX Memory — Local vector store using ChromaDB"""

import chromadb
from chromadb.utils import embedding_functions
from typing import List
import hashlib
import os


class MemoryStore:
    def __init__(self):
        self.client = chromadb.PersistentClient(
            path=os.path.expanduser("~/.cometx/memory")
        )
        self.ef = embedding_functions.DefaultEmbeddingFunction()
        self.collection = self.client.get_or_create_collection(
            name="browser_memory",
            embedding_function=self.ef,
        )

    def store(self, content: str, metadata: dict = None):
        """Store a memory chunk."""
        doc_id = hashlib.md5(content.encode()).hexdigest()
        self.collection.upsert(
            documents=[content],
            ids=[doc_id],
            metadatas=[metadata or {}],
        )

    def retrieve(self, query: str, top_k: int = 3) -> str:
        """Retrieve relevant memories for LLM context injection."""
        if not query:
            return ""
        results = self.collection.query(
            query_texts=[query],
            n_results=top_k,
        )
        docs = results.get("documents", [[]])[0]
        return "\n".join(docs) if docs else ""

    def clear(self):
        self.collection.delete(where={"doc_id": {"$ne": ""}})
