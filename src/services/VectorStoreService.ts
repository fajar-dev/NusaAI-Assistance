import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { Document } from "@langchain/core/documents";
import { Embeddings } from "@langchain/core/embeddings";
import { vectorStoreConfig } from "../config/database";

export class VectorStoreService {
    private vectorStore: PGVectorStore | null = null;
    private embeddings: Embeddings;

    constructor(embeddings: Embeddings) {
        this.embeddings = embeddings;
    }

    async initialize(): Promise<void> {
        this.vectorStore = await PGVectorStore.initialize(this.embeddings, vectorStoreConfig);
    }

    async addDocuments(docs: Document[]): Promise<void> {
        if (!this.vectorStore) {
            await this.initialize();
        }
        
        try {
            await this.vectorStore!.addDocuments(docs);
            console.log(`✅ Berhasil menyimpan ${docs.length} dokumen!`);
        } catch (error) {
            console.error("❌ Gagal menyimpan data:", error);
            throw error;
        }
    }

    async similaritySearch(query: string, k: number = 2): Promise<Document[]> {
        if (!this.vectorStore) {
            await this.initialize();
        }
        return await this.vectorStore!.similaritySearch(query, k);
    }

    async close(): Promise<void> {
        if (this.vectorStore) {
            await this.vectorStore.end();
        }
    }
}
