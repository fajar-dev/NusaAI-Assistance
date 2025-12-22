import { Hono } from 'hono';
import { Models } from './config/models';
import { VectorStoreService } from './services/VectorStoreService';
import { RAGService } from './services/RAGService';

const app = new Hono();

const embeddingModel = Models.createEmbeddingModel();
const chatModel = Models.createChatModel();
const vectorStoreService = new VectorStoreService(embeddingModel);
const ragService = new RAGService(vectorStoreService, chatModel);


app.get('/', (c) => {
    return c.text('NusaAI RAG Service is running!');
});

// app.post('/ask', async (c) => {
//     try {
//         const body = await c.req.json();
//         const question = body.question;
//         if (!question) {
//             return c.json({ message: 'Question is required' }, 400);
//         }
//         const result = await ragService.askQuestion(question);
        
//         if (!result) {
//             return c.json({ message: 'No relevant answer found.' }, 404);
//         }

//         return c.json({ 
//             question, 
//             answer: result.answer,
//             sources: result.sources
//         });
//     } catch (error: any) {
//         return c.json({ message: 'Error processing request', error: error.message }, 500);
//     }
// });

process.on('SIGINT', async () => {
    await vectorStoreService.close();
    process.exit(0);
});

export default app;
