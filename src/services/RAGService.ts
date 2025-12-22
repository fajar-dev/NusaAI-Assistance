import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { VectorStoreService } from "./VectorStoreService";

export class RAGService {
    private vectorStoreService: VectorStoreService;
    private chatModel: BaseChatModel;

    constructor(vectorStoreService: VectorStoreService, chatModel: BaseChatModel) {
        this.vectorStoreService = vectorStoreService;
        this.chatModel = chatModel;
    }

    async askQuestion(question: string): Promise<string | null> {
        console.log(`\n🕵️  Mencari jawaban untuk: "${question}"...`);

        try {
            // 1. Retrieval
            const relevantDocs = await this.vectorStoreService.similaritySearch(question, 2);

            if (relevantDocs.length === 0) {
                console.log("⚠️ Tidak ada data relevan ditemukan.");
                return null;
            }

            const context = relevantDocs.map(d => d.pageContent).join("\n\n");

            // 2. Prompting
            const prompt = PromptTemplate.fromTemplate(`
            Jawab pertanyaan berdasarkan konteks berikut ini saja.
            
            Konteks:
            {context}
            
            Pertanyaan: {question}
            Jawaban:
            `);

            // 3. Chain Execution
            const chain = RunnableSequence.from([
                prompt,
                this.chatModel,
                new StringOutputParser(),
            ]);

            const response = await chain.invoke({ context, question });
            
            console.log("🤖 Jawaban:", response);
            return response;

        } catch (error) {
            console.error("❌ Error saat RAG:", error);
            throw error;
        }
    }
}
