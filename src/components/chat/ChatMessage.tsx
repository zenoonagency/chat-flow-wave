import { ChatMessage as ChatMessageType } from '@/hooks/use-chat-storage';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.sender === 'user';
  
  return (
    <div 
      className={cn(
        "flex w-full mb-4 animate-bounce-in",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div 
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 relative shadow-md",
          isUser 
            ? "bg-chat-bubble-user text-chat-bubble-user-text ml-auto rounded-br-md" 
            : "bg-chat-bubble-bot text-chat-bubble-bot-text mr-auto rounded-bl-md"
        )}
      >
        {message.isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Digitando...</span>
          </div>
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        )}
        
        <div 
          className={cn(
            "text-xs mt-1 opacity-70",
            isUser ? "text-right" : "text-left"
          )}
        >
          {message.timestamp.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
};