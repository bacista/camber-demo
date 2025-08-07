import { useEffect } from 'react';

export const useKeyboardNav = (onPrevious: () => void, onNext: () => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        onPrevious();
      } else if (event.key === 'ArrowRight') {
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onPrevious, onNext]);
};