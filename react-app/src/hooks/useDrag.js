import { useState, useCallback, useEffect } from 'react';

export function useDrag(initialPosition, onPositionChange, onDragStart) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('.window-button')) return;

    e.preventDefault();
    setIsDragging(true);

    const rect = e.currentTarget.closest('.window').getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });

    if (onDragStart) onDragStart();
  }, [onDragStart]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;

    const newX = Math.max(0, Math.min(e.clientX - offset.x, window.innerWidth - 400));
    const newY = Math.max(0, Math.min(e.clientY - offset.y, window.innerHeight - 100));

    const newPosition = { top: newY, left: newX };
    setPosition(newPosition);

    if (onPositionChange) {
      onPositionChange(newPosition);
    }
  }, [isDragging, offset, onPositionChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition]);

  return {
    position,
    isDragging,
    handleMouseDown
  };
}
