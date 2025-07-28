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
        body: JSON.stringify({ 
          type: 'text',
          content: message 
        }),
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

  const sendMediaMessage = async (file: File, fileName: string, messageType: 'image' | 'audio' | 'document'): Promise<string> => {
    setIsLoading(true);
    
    try {
      console.log('Enviando arquivo:', fileName, file.type, 'tipo:', messageType);
      
      // Converte arquivo para base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]); // Remove o prefixo data:...;base64,
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: messageType,
          content: fileName,
          file: base64,
          mimeType: file.type
        }),
      });

      console.log('Response status (media):', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      console.log('Response text (media):', responseText);
      
      try {
        const jsonData = JSON.parse(responseText);
        console.log('Parsed JSON (media):', jsonData);
        
        if (Array.isArray(jsonData) && jsonData[0]?.output) {
          return jsonData[0].output;
        } else if (jsonData.message) {
          return jsonData.message;
        } else if (jsonData.output) {
          return jsonData.output;
        } else {
          return responseText;
        }
      } catch (parseError) {
        console.log('Não é JSON válido, usando texto diretamente (media):', responseText);
        return responseText;
      }
      
    } catch (error) {
      console.error('Erro ao enviar arquivo:', error);
      throw new Error('Falha ao enviar arquivo. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    sendMediaMessage,
    isLoading,
  };
};