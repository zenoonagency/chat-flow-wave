import { useState, useCallback, useRef } from 'react';

interface Position {
  x: number;
  y: number;
}

interface UseDragOptions {
  initialPosition?: Position;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export const useDrag = ({ 
  initialPosition = { x: 0, y: 0 }, 
  onDragStart, 
  onDragEnd 
}: UseDragOptions = {}) => {
  const [position, setPosition] = useState<Position>(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<Position>({ x: 0, y: 0 });
  const positionStart = useRef<Position>(initialPosition);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    positionStart.current = position;
    onDragStart?.();

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStart.current.x;
      const deltaY = e.clientY - dragStart.current.y;
      
      const newPosition = {
        x: positionStart.current.x + deltaX,
        y: positionStart.current.y + deltaY, // Permite movimento vertical
      };

      // Limita a posição dentro da tela
      const chatWidth = 400; // Largura mínima do chat
      const chatHeight = 200; // Altura mínima para header
      const maxX = window.innerWidth - chatWidth;
      const maxY = window.innerHeight - chatHeight;
      
      newPosition.x = Math.max(0, Math.min(maxX, newPosition.x));
      newPosition.y = Math.max(0, Math.min(maxY, newPosition.y));

      setPosition(newPosition);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      onDragEnd?.();
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [position, onDragStart, onDragEnd]);

  const resetPosition = useCallback(() => {
    setPosition(initialPosition);
  }, [initialPosition]);

  return {
    position,
    isDragging,
    handleMouseDown,
    resetPosition,
  };
};