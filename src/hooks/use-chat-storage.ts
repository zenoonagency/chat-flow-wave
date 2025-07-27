import { useState, useEffect } from 'react';

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isLoading?: boolean;
}

const STORAGE_KEY = 'chat-messages';

export const useChatStorage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsedMessages = JSON.parse(stored).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(parsedMessages);
      } catch (error) {
        console.error('Erro ao carregar mensagens do localStorage:', error);
      }
    }
  }, []);

  const saveMessages = (newMessages: ChatMessage[]) => {
    setMessages(newMessages);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newMessages));
  };

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    const updatedMessages = [...messages, newMessage];
    console.log('Adicionando mensagem:', newMessage);
    console.log('Total de mensagens após adicionar:', updatedMessages.length);
    saveMessages(updatedMessages);
    return newMessage.id;
  };

  const updateMessage = (id: string, updates: Partial<ChatMessage>) => {
    const updatedMessages = messages.map(msg => 
      msg.id === id ? { ...msg, ...updates } : msg
    );
    saveMessages(updatedMessages);
  };

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    messages,
    addMessage,
    updateMessage,
    clearMessages,
  };
};