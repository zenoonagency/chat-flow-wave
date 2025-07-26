import { useState } from 'react';

const WEBHOOK_URL = 'https://fluxos-n8n.mgmxhs.easypanel.host/webhook/aiagentchat';

export const useChatApi = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (message: string): Promise<string> => {
    setIsLoading(true);
    
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Assumindo que a resposta vem no formato { message: "resposta do bot" }
      // Ajuste conforme o formato real da sua API
      return data.message || data.response || 'Resposta recebida';
      
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      throw new Error('Falha ao enviar mensagem. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    isLoading,
  };
};