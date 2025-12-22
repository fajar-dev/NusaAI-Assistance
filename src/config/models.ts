import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { GEMINI_API_KEY, LLM_MODEL, EMBEDDING_MODEL } from "./config";

export class Models {
    static createChatModel(): ChatGoogleGenerativeAI {
        return new ChatGoogleGenerativeAI({
            model: LLM_MODEL,
            apiKey: GEMINI_API_KEY,
            temperature: 0,
        });
    }

    static createEmbeddingModel(): GoogleGenerativeAIEmbeddings {
        return new GoogleGenerativeAIEmbeddings({
            model: EMBEDDING_MODEL,
            apiKey: GEMINI_API_KEY,
        });
    }
}
