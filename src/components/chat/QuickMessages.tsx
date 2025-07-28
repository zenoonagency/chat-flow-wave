import { Button } from '@/components/ui/button';
import { MessageSquare, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import images
import resumoExecutivoImg from '@/assets/resumo-executivo.png';
import atualizacaoProjetoImg from '@/assets/atualizacao-projeto.png';
import tarefasTravadasImg from '@/assets/tarefas-travadas.png';
import tarefasDuplicadasImg from '@/assets/tarefas-duplicadas.png';

interface QuickMessageProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const quickMessages = [
  {
    id: 'resumo-executivo',
    title: 'Resumo executivo',
    description: 'Escolha entre mais de 35 ferramentas de geração de relatórios',
    image: resumoExecutivoImg,
    message: 'gerar um resumo executivo',
    badge: 'Novo'
  },
  {
    id: 'atualizacao-projeto',
    title: 'Atualização do projeto',
    description: 'Atualização do status do projeto com base no tempo',
    image: atualizacaoProjetoImg,
    message: 'atualização do projeto',
    badge: 'Novo'
  },
  {
    id: 'tarefas-duplicadas',
    title: 'Encontre tarefas duplicadas',
    description: 'Identifica e mescla tarefas duplicadas gratuitamente',
    image: tarefasDuplicadasImg,
    message: 'encontrar tarefas duplicadas',
    badge: 'Novo'
  },
  {
    id: 'tarefas-travadas',
    title: 'Encontre tarefas que estão travadas',
    description: 'Localiza e resolve rapidamente tarefas estagnadas',
    image: tarefasTravadasImg,
    message: 'encontrar tarefas travadas',
    badge: 'Novo'
  }
];

export const QuickMessages = ({ onSend, disabled }: QuickMessageProps) => {
  return (
    <div className="p-4 border-t bg-background">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">
          Recursos
        </span>
      </div>
      
      <div className="space-y-3">
        {quickMessages.map((quickMsg) => {
          return (
            <Button
              key={quickMsg.id}
              variant="ghost"
              onClick={() => onSend(quickMsg.message)}
              disabled={disabled}
              className={cn(
                "w-full justify-between h-auto p-4 text-left bg-card hover:bg-card/80 border border-border rounded-lg",
                "transition-all duration-200 group"
              )}
            >
              <div className="flex items-start gap-3 flex-1">
                <div className="relative w-8 h-8 flex-shrink-0">
                  <img 
                    src={quickMsg.image} 
                    alt={quickMsg.title}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm text-foreground truncate">
                      {quickMsg.title}
                    </h4>
                    <span className="px-1.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded dark:bg-blue-900/20 dark:text-blue-300">
                      {quickMsg.badge}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {quickMsg.description}
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
            </Button>
          );
        })}
      </div>
    </div>
  );
};