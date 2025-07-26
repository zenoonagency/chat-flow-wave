import { Button } from '@/components/ui/button';
import { FileText, Calendar, DollarSign, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickMessageProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const quickMessages = [
  {
    id: 'relatório',
    text: 'Gerar um relatório dos leads',
    icon: FileText,
    message: 'gerar um relatório dos leads'
  },
  {
    id: 'reuniões',
    text: 'Quantas reuniões tenho hoje',
    icon: Calendar,
    message: 'quantas reuniões tenho hoje'
  },
  {
    id: 'faturamento',
    text: 'Quanto faturei ontem',
    icon: DollarSign,
    message: 'quanto faturei ontem'
  }
];

export const QuickMessages = ({ onSend, disabled }: QuickMessageProps) => {
  return (
    <div className="p-4 border-t bg-muted/20">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">
          Mensagens rápidas:
        </span>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {quickMessages.map((quickMsg) => {
          const Icon = quickMsg.icon;
          return (
            <Button
              key={quickMsg.id}
              variant="outline"
              size="sm"
              onClick={() => onSend(quickMsg.message)}
              disabled={disabled}
              className={cn(
                "justify-start h-auto p-3 text-left",
                "hover:bg-chat-primary/10 hover:border-chat-primary/30",
                "transition-all duration-200"
              )}
            >
              <Icon className="h-4 w-4 mr-2 shrink-0" />
              <span className="text-xs">{quickMsg.text}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};