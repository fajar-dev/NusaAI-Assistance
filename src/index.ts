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

app.post('/ask', async (c) => {
    try {
        const body = await c.req.json();
        const question = body.question;
        if (!question) {
            return c.json({ message: 'Question is required' }, 400);
        }
        const result = await ragService.askQuestion(question);
        
        if (!result) {
            return c.json({ message: 'No relevant answer found.' }, 404);
        }

        return c.json({ 
            question, 
            answer: result.answer,
            sources: result.sources
        });
    } catch (error: any) {
        return c.json({ message: 'Error processing request', error: error.message }, 500);
    }
});

app.post('/webhook/google-chat', async (c) => {
    try {
        const event = await c.req.json();

        if (event.type === 'ADDED_TO_SPACE') {
            return c.json({ text: 'Halo! Tag saya untuk bertanya mengenai dokumen.' });
        }

        if (event.type === 'MESSAGE') {
            const userQuestion = event.message.argumentText?.trim() || event.message.text?.trim();

            if (!userQuestion) {
                return c.json({ text: 'Silakan ketik pertanyaan setelah men-tag saya.' });
            }

            const result = await ragService.askQuestion(userQuestion);

            if (!result || !result.answer) {
                return c.json({ text: 'Maaf, saya tidak menemukan jawaban yang relevan.' });
            }

            let replyText = result.answer;
            if (result.sources && result.sources.length > 0) {
                replyText += `\n\nSumber: ${result.sources.join(', ')}`;
            }

            return c.json({ text: replyText });
        }

        return c.json({});

    } catch (error: any) {
        return c.json({ text: `Error: ${error.message}` });
    }
});

process.on('SIGINT', async () => {
    await vectorStoreService.close();
    process.exit(0);
});

export default app;