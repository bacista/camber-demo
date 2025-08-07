import React from 'react';
import { Slide } from '../components/Slide';

export const TitleSlide: React.FC = () => {
  return (
    <Slide notes="Welcome everyone. Today I'm excited to share how Camber is transforming the material supply chain through AI-driven sales automation.">
      <div className="text-center">
        <h1 className="text-6xl lg:text-7xl font-bold text-camber mb-8">
          Camber
        </h1>
        <p className="text-2xl lg:text-3xl text-gray-700 mb-12">
          AI-driven sales automation platform for industrial and building material suppliers
        </p>
        <div className="mt-16">
          <p className="text-lg text-gray-600">Investor Deck 2025</p>
        </div>
      </div>
    </Slide>
  );
};