import { Button } from '@/components/ui/button';
import { X, Minus, Move } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatHeaderProps {
  onClose: () => void;
  onMinimize: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  isDragging: boolean;
}

export const ChatHeader = ({ 
  onClose, 
  onMinimize, 
  onMouseDown, 
  isDragging 
}: ChatHeaderProps) => {
  return (
    <div 
      className={cn(
        "flex items-center justify-between p-4 border-b bg-chat-primary text-white",
        "cursor-move select-none",
        isDragging && "cursor-grabbing"
      )}
      onMouseDown={onMouseDown}
    >
      <div className="flex items-center gap-2">
        <Move className="h-4 w-4 opacity-70" />
        <h3 className="font-semibold">Chat Assistant</h3>
      </div>
      
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onMinimize();
          }}
          className="h-8 w-8 p-0 text-white hover:bg-white/20"
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="h-8 w-8 p-0 text-white hover:bg-white/20"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};