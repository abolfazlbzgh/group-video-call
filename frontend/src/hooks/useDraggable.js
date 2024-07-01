import { useEffect, useRef } from 'react';

export const useDraggable = (initialX, initialY) => {
  const ref = useRef();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.style.position = 'absolute';
    element.style.left = `${initialX}px`;
    element.style.top = `${initialY}px`;

    const handleMouseDown = (event) => startDrag(event.clientX, event.clientY);
    const handleTouchStart = (event) => {
      const touch = event.touches[0];
      startDrag(touch.clientX, touch.clientY);
    };

    const startDrag = (startX, startY) => {
      const initialLeft = element.offsetLeft;
      const initialTop = element.offsetTop;

      const handleMouseMove = (moveEvent) => {
        moveElement(moveEvent.clientX, moveEvent.clientY);
      };
      const handleTouchMove = (moveEvent) => {
        const touch = moveEvent.touches[0];
        moveElement(touch.clientX, touch.clientY);
      };

      const moveElement = (currentX, currentY) => {
        element.style.left = `${initialLeft + currentX - startX}px`;
        element.style.top = `${initialTop + currentY - startY}px`;
      };

      const stopDrag = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', stopDrag);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', stopDrag);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', stopDrag);
    };

    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('touchstart', handleTouchStart);

    return () => {
      element.removeEventListener('mousedown', handleMouseDown);
      element.removeEventListener('touchstart', handleTouchStart);
    };
  }, [initialX, initialY]);

  return ref;
};
