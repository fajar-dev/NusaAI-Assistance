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

    async askQuestion(question: string): Promise<any | null> {
        try {
            // 1. Retrieval with score
            const relevantDocsWithScore = await this.vectorStoreService.similaritySearchWithScore(question, 1);

            if (relevantDocsWithScore.length === 0) {
                return null;
            }

            const context = relevantDocsWithScore.map(([d, _]) => d.pageContent).join("\n\n");

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

            const answer = await chain.invoke({ context, question });
            
            // Format sources with score
            const sources = relevantDocsWithScore.map(([doc, score]) => ({
                content: doc.pageContent,
                metadata: doc.metadata,
                score: score
            }));

            return {
                answer,
                sources
            };

        } catch (error) {
            console.error("❌ Error saat RAG:", error);
            throw error;
        }
    }
}
