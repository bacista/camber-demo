import React from 'react';

interface PresenterViewProps {
  currentSlide: React.ComponentType;
  currentIndex: number;
  totalSlides: number;
  nextSlide?: React.ComponentType;
}

export const PresenterView: React.FC<PresenterViewProps> = ({
  currentSlide: CurrentSlide,
  currentIndex,
  totalSlides,
  nextSlide: NextSlide
}) => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="grid grid-cols-2 gap-4 h-screen">
        {/* Current Slide */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gray-800 text-white px-4 py-2 text-sm">
            Current Slide ({currentIndex}/{totalSlides})
          </div>
          <div className="scale-50 origin-top-left" style={{ width: '200%', height: '200%' }}>
            <CurrentSlide />
          </div>
        </div>
        
        {/* Next Slide Preview */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gray-600 text-white px-4 py-2 text-sm">
            Next Slide ({currentIndex + 1}/{totalSlides})
          </div>
          {NextSlide ? (
            <div className="scale-50 origin-top-left opacity-75" style={{ width: '200%', height: '200%' }}>
              <NextSlide />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              End of Presentation
            </div>
          )}
        </div>
      </div>
    </div>
  );
};