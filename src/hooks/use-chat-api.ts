import { useState } from 'react';

const WEBHOOK_URL = 'https://fluxos-n8n.mgmxhs.easypanel.host/webhook/aiagentchat';

export const useChatApi = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (message: string): Promise<string> => {
    setIsLoading(true);
    
    try {
      console.log('Enviando mensagem:', message);
      
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Primeiro tenta obter o texto da resposta
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      try {
        // Tenta fazer parse como JSON
        const jsonData = JSON.parse(responseText);
        console.log('Parsed JSON:', jsonData);
        
        // Lida com diferentes formatos de resposta JSON
        if (Array.isArray(jsonData) && jsonData[0]?.output) {
          return jsonData[0].output;
        } else if (jsonData.message) {
          return jsonData.message;
        } else if (jsonData.output) {
          return jsonData.output;
        } else {
          return responseText; // Se JSON não tem formato esperado, usa texto
        }
      } catch (parseError) {
        console.log('Não é JSON válido, usando texto diretamente:', responseText);
        // Se não é JSON válido, retorna o texto diretamente
        return responseText;
      }
      
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