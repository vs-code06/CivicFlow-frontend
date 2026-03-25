import client from './client';

export const sendChatMessage = async (message: string) => {
    const response = await client.post('/chat', { message });
    return response.data;
};

export const sendChatMessageStream = async (message: string, onChunk: (text: string) => void) => {
    // using fetch instead of axios because of native streaming support
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
    const response = await fetch(`${apiUrl}/chat/stream`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ message })
    });

    if (!response.body) throw new Error("No stream found");
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        onChunk(decoder.decode(value, { stream: true }));
    }
};
