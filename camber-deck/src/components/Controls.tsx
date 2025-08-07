import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext
}) => {
  return (
    <div className="fixed bottom-4 left-4 flex gap-2 no-print">
      <button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className={`p-2 rounded-lg transition-colors ${
          canGoPrevious 
            ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
            : 'bg-gray-50 text-gray-300 cursor-not-allowed'
        }`}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <button
        onClick={onNext}
        disabled={!canGoNext}
        className={`p-2 rounded-lg transition-colors ${
          canGoNext 
            ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
            : 'bg-gray-50 text-gray-300 cursor-not-allowed'
        }`}
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};