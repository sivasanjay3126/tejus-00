import { useRef, useCallback, useEffect, useState } from 'react';

interface GestureState {
  isDragging: boolean;
  isPinching: boolean;
  isLongPress: boolean;
  swipeDirection: 'left' | 'right' | 'up' | 'down' | null;
}

interface GestureHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onLongPress?: () => void;
  onPinch?: (scale: number) => void;
}

export const useGestures = (handlers: GestureHandlers) => {
  const [state, setState] = useState<GestureState>({
    isDragging: false,
    isPinching: false,
    isLongPress: false,
    swipeDirection: null,
  });

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const initialPinchDistanceRef = useRef<number | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };

      // Long press detection
      longPressTimerRef.current = setTimeout(() => {
        setState(prev => ({ ...prev, isLongPress: true }));
        handlers.onLongPress?.();
      }, 500);
    } else if (e.touches.length === 2) {
      // Pinch start
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      initialPinchDistanceRef.current = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      setState(prev => ({ ...prev, isPinching: true }));
    }
  }, [handlers]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (e.touches.length === 2 && initialPinchDistanceRef.current) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      const scale = currentDistance / initialPinchDistanceRef.current;
      handlers.onPinch?.(scale);
    }
  }, [handlers]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    setState(prev => ({ ...prev, isLongPress: false, isPinching: false }));

    if (!touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const deltaTime = Date.now() - touchStartRef.current.time;

    // Only detect swipe if movement is fast enough and long enough
    const minSwipeDistance = 50;
    const maxSwipeTime = 300;

    if (deltaTime < maxSwipeTime) {
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      if (absDeltaX > absDeltaY && absDeltaX > minSwipeDistance) {
        const direction = deltaX > 0 ? 'right' : 'left';
        setState(prev => ({ ...prev, swipeDirection: direction }));
        if (direction === 'left') handlers.onSwipeLeft?.();
        if (direction === 'right') handlers.onSwipeRight?.();
      } else if (absDeltaY > absDeltaX && absDeltaY > minSwipeDistance) {
        const direction = deltaY > 0 ? 'down' : 'up';
        setState(prev => ({ ...prev, swipeDirection: direction }));
        if (direction === 'up') handlers.onSwipeUp?.();
        if (direction === 'down') handlers.onSwipeDown?.();
      }
    }

    touchStartRef.current = null;
    initialPinchDistanceRef.current = null;
    
    // Reset swipe direction after a short delay
    setTimeout(() => {
      setState(prev => ({ ...prev, swipeDirection: null }));
    }, 100);
  }, [handlers]);

  const bindGestures = useCallback((element: HTMLElement | null) => {
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    ...state,
    bindGestures,
  };
};
