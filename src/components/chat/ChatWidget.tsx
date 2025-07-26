import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatStorage } from '@/hooks/use-chat-storage';
import { useChatApi } from '@/hooks/use-chat-api';
import { useDrag } from '@/hooks/use-drag';
import { useToast } from '@/hooks/use-toast';
import { ChatHeader } from './ChatHeader';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

type ChatState = 'closed' | 'minimized' | 'open';

export const ChatWidget = () => {
  const [chatState, setChatState] = useState<ChatState>('closed');
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, addMessage, updateMessage } = useChatStorage();
  const { sendMessage, isLoading } = useChatApi();
  const { toast } = useToast();
  
  const { position, isDragging, handleMouseDown, resetPosition } = useDrag({
    initialPosition: { x: window.innerWidth - 420, y: 100 },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (chatState === 'open') {
      scrollToBottom();
    }
  }, [messages, chatState]);

  const handleSendMessage = async (content: string) => {
    let loadingId: string | undefined;
    
    try {
      // Adiciona mensagem do usuário
      addMessage({ content, sender: 'user' });
      
      // Adiciona mensagem de loading do bot
      loadingId = addMessage({ 
        content: '', 
        sender: 'bot',
        isLoading: true 
      });

      // Envia mensagem para API
      const botResponse = await sendMessage(content);
      
      // Atualiza mensagem do bot com a resposta
      updateMessage(loadingId, { 
        content: botResponse, 
        isLoading: false 
      });

      if (chatState === 'minimized' || chatState === 'closed') {
        setHasNewMessage(true);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      // Remove mensagem de loading em caso de erro
      if (loadingId) {
        updateMessage(loadingId, { 
          content: `Erro: ${errorMessage}`, 
          isLoading: false 
        });
      }

      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleOpenChat = () => {
    setChatState('open');
    setHasNewMessage(false);
  };

  const handleMinimizeChat = () => {
    setChatState('minimized');
  };

  const handleCloseChat = () => {
    setChatState('closed');
    resetPosition();
  };

  const isVisible = chatState !== 'closed';
  const isOpen = chatState === 'open';

  return (
    <>
      {/* Chat Button */}
      {!isVisible && (
        <Button
          onClick={handleOpenChat}
          className={cn(
            "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg",
            "bg-chat-primary hover:bg-chat-primary-hover",
            "z-50 animate-bounce-in"
          )}
        >
          <MessageCircle className="h-6 w-6 text-white" />
          {hasNewMessage && (
            <div className="absolute -top-1 -right-1 h-4 w-4 bg-destructive rounded-full animate-pulse-ring" />
          )}
        </Button>
      )}

      {/* Minimized Chat */}
      {chatState === 'minimized' && (
        <div
          className={cn(
            "fixed bottom-6 right-6 z-50",
            "animate-slide-up"
          )}
          style={{
            transform: `translate(${position.x - (window.innerWidth - 420)}px, ${position.y - 100}px)`,
          }}
        >
          <Button
            onClick={handleOpenChat}
            className={cn(
              "h-12 px-4 rounded-lg shadow-lg bg-chat-primary hover:bg-chat-primary-hover",
              "flex items-center gap-2 text-white"
            )}
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Chat Assistant</span>
            {hasNewMessage && (
              <div className="h-2 w-2 bg-white rounded-full animate-pulse" />
            )}
          </Button>
        </div>
      )}

      {/* Full Chat Window */}
      {isOpen && (
        <div
          className={cn(
            "fixed z-50 bg-white rounded-lg shadow-2xl",
            "w-[400px] h-[600px] max-h-[80vh]",
            "flex flex-col overflow-hidden",
            "animate-slide-in-right"
          )}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
        >
          <ChatHeader
            onClose={handleCloseChat}
            onMinimize={handleMinimizeChat}
            onMouseDown={handleMouseDown}
            isDragging={isDragging}
          />
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-muted/30">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Inicie uma conversa!</p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <ChatInput
            onSend={handleSendMessage}
            disabled={isLoading}
            placeholder="Digite sua mensagem..."
          />
        </div>
      )}
    </>
  );
};