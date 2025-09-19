import { useState, useCallback, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';

// Initialiser le client IA
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export const useChat = (systemInstruction: string) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Utiliser une référence pour conserver l'instance de la session de chat
    const chatSessionRef = useRef<Chat | null>(null);

    // Fonction pour initialiser ou obtenir la session de chat
    const getChatSession = useCallback(() => {
        if (!chatSessionRef.current) {
            chatSessionRef.current = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction,
                },
            });
        }
        return chatSessionRef.current;
    }, [systemInstruction]);

    const sendMessage = useCallback(async (messageText: string) => {
        if (!messageText.trim()) return;

        setIsLoading(true);
        setError(null);

        const userMessage: ChatMessage = { role: 'user', text: messageText };
        setMessages(prev => [...prev, userMessage]);

        try {
            const chat = getChatSession();
            const response = await chat.sendMessage({ message: messageText });
            const modelMessage: ChatMessage = { role: 'model', text: response.text };
            setMessages(prev => [...prev, modelMessage]);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Une erreur inconnue est survenue.';
            setError(errorMessage);
            const errorResponseMessage: ChatMessage = { role: 'model', text: `Désolé, j'ai rencontré une erreur: ${errorMessage}` };
            setMessages(prev => [...prev, errorResponseMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [getChatSession]);

    return { messages, isLoading, error, sendMessage };
};
