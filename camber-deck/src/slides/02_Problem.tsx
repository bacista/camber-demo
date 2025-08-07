import React from 'react';
import { Slide } from '../components/Slide';
import { AlertCircle } from 'lucide-react';
import { onePagerContent } from '../data/onePagerContent';

export const ProblemSlide: React.FC = () => {
  return (
    <Slide notes="The material supply industry is drowning in manual processes. Sales reps spend more time on admin than selling, and customers are frustrated with slow responses.">
      <div>
        <h2 className="text-4xl lg:text-5xl font-bold mb-12 text-gray-900">
          The Problem
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {onePagerContent.problem.painPoints.map((point, index) => (
            <div key={index} className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
              <p className="text-lg text-gray-700">{point}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-red-600">{onePagerContent.problem.stats.manualError}</p>
            <p className="text-sm text-gray-600 mt-2">Manual Order Error Rate</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-red-600">{onePagerContent.problem.stats.timeWasted}</p>
            <p className="text-sm text-gray-600 mt-2">Weekly Time Wasted</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-red-600">{onePagerContent.problem.stats.costPerOrder}</p>
            <p className="text-sm text-gray-600 mt-2">Cost Comparison</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-red-600">{onePagerContent.problem.stats.abandonment}</p>
            <p className="text-sm text-gray-600 mt-2">Customer Abandonment</p>
          </div>
        </div>
      </div>
    </Slide>
  );
};