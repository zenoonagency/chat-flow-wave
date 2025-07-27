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
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsedMessages = JSON.parse(stored).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        console.log('Carregando mensagens do localStorage:', parsedMessages);
        setMessages(parsedMessages);
      } catch (error) {
        console.error('Erro ao carregar mensagens do localStorage:', error);
      }
    }
  }, [forceUpdate]);

  const saveMessages = (newMessages: ChatMessage[]) => {
    console.log('Salvando mensagens:', newMessages);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newMessages));
    setMessages([...newMessages]); // Force new array reference
    setForceUpdate(prev => prev + 1); // Force re-render
  };

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
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
    console.log('Atualizando mensagem:', id, updates);
    console.log('Mensagens após atualização:', updatedMessages);
    saveMessages(updatedMessages);
  };

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    setForceUpdate(prev => prev + 1);
  };

  return {
    messages,
    addMessage,
    updateMessage,
    clearMessages,
  };
};