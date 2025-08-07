import React from 'react';
import { slides } from '../data/slides';

export const PrintView: React.FC = () => {
  return (
    <div className="print-view">
      {slides.map((slide) => (
        <div key={slide.id} className="slide-container">
          <slide.component />
        </div>
      ))}
    </div>
  );
};