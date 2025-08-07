import { useState, useEffect } from 'react';
import { slides } from './data/slides';
import { ProgressBar } from './components/ProgressBar';
import { Controls } from './components/Controls';
import { PresenterView } from './components/PresenterView';
import { PrintView } from './components/PrintView';
import { useKeyboardNav } from './hooks/useKeyboardNav';

function App() {
  const [currentIndex, setCurrentIndex] = useState(1);
  const isPresenterMode = new URLSearchParams(window.location.search).get('presenter') === 'true';
  const isPrintMode = window.location.pathname === '/print';

  // Handle hash-based routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '');
      const slideNumber = parseInt(hash) || 1;
      if (slideNumber >= 1 && slideNumber <= slides.length) {
        setCurrentIndex(slideNumber);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    
    // Set initial hash if not present
    if (!window.location.hash) {
      window.location.hash = '#/1';
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const goToPrevious = () => {
    if (currentIndex > 1) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      window.location.hash = `#/${newIndex}`;
    }
  };

  const goToNext = () => {
    if (currentIndex < slides.length) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      window.location.hash = `#/${newIndex}`;
    }
  };

  useKeyboardNav(goToPrevious, goToNext);

  // Print mode - show all slides vertically
  if (isPrintMode) {
    return <PrintView />;
  }

  const CurrentSlide = slides[currentIndex - 1].component;
  const NextSlide = currentIndex < slides.length ? slides[currentIndex].component : null;

  // Presenter mode - show current and next slide
  if (isPresenterMode) {
    return (
      <PresenterView
        currentSlide={CurrentSlide}
        currentIndex={currentIndex}
        totalSlides={slides.length}
        nextSlide={NextSlide || undefined}
      />
    );
  }

  // Regular presentation mode
  return (
    <div className="relative min-h-screen">
      <CurrentSlide />
      <ProgressBar current={currentIndex} total={slides.length} />
      <Controls
        onPrevious={goToPrevious}
        onNext={goToNext}
        canGoPrevious={currentIndex > 1}
        canGoNext={currentIndex < slides.length}
      />
    </div>
  );
}

export default App;