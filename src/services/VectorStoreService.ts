import { PGVectorStore } from "@langchain/community/vectorstores/pgvector"
import { Document } from "@langchain/core/documents"
import { Embeddings } from "@langchain/core/embeddings"
import { vectorStoreConfig } from "../config/database"

export class VectorStoreService {
    private store?: PGVectorStore

    constructor(private readonly embeddings: Embeddings) {}

    private async getStore(): Promise<PGVectorStore> {
        if (!this.store) {
        this.store = await PGVectorStore.initialize(this.embeddings, vectorStoreConfig)
        }
        return this.store
    }

    async addDocuments(docs: Document[]): Promise<void> {
        if (!docs?.length) return
        const store = await this.getStore()
        await store.addDocuments(docs)
    }

    async similaritySearch(query: string, k = 2): Promise<Document[]> {
        if (!query?.trim()) return []
        const store = await this.getStore()
        return store.similaritySearch(query, k)
    }

    async similaritySearchWithScore(query: string, k = 2): Promise<[Document, number][]> {
        if (!query?.trim()) return []
        const store = await this.getStore()
        return store.similaritySearchWithScore(query, k)
    }

    async close(): Promise<void> {
        await this.store?.end()
        this.store = undefined
    }
}
