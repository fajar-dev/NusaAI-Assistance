import { Models } from "./config/models";
import { VectorStoreService } from "./services/VectorStoreService";
import { Document } from "@langchain/core/documents";


const dummyDocs = [
    new Document({ 
        pageContent: "Bun sangat cepat karena ditulis menggunakan bahasa Zig.", 
        metadata: { topic: "bun" } 
    }),
    new Document({ 
        pageContent: "LangChain adalah framework orkestrasi untuk LLM.", 
        metadata: { topic: "langchain" } 
    }),
    new Document({ 
        pageContent: "PGVector adalah ekstensi PostgreSQL untuk pencarian vektor.", 
        metadata: { topic: "database" } 
    }),
];

async function main() {
    try {
        const embeddingModel = Models.createEmbeddingModel();
        const vectorStoreService = new VectorStoreService(embeddingModel);

        await vectorStoreService.addDocuments(dummyDocs);
        
        await vectorStoreService.close();
    } catch (error) {
        console.error("❌ Gagal saat ingestion:", error);
        process.exit(1);
    }
}

main();