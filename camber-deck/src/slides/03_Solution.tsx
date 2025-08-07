import React from 'react';
import { Slide } from '../components/Slide';
import { CheckCircle } from 'lucide-react';
import { onePagerContent } from '../data/onePagerContent';

export const SolutionSlide: React.FC = () => {
  return (
    <Slide notes="Camber automates the entire sales workflow, from quote to cash. We're the AI copilot that handles the repetitive tasks so sales teams can focus on relationships.">
      <div>
        <h2 className="text-4xl lg:text-5xl font-bold mb-12 text-gray-900">
          Our Solution
        </h2>
        
        <p className="text-xl text-gray-700 mb-10">
          AI-powered automation that gives sales teams their time back
        </p>
        
        <div className="space-y-6">
          {onePagerContent.solution.features.map((feature, index) => (
            <div key={index} className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-camber mt-1 flex-shrink-0" />
              <p className="text-lg text-gray-700">{feature}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 p-6 bg-camber/10 rounded-lg">
          <p className="text-lg font-semibold text-gray-900">
            Result: Sales reps save 20+ hours per week, errors drop by 75%, and customers get instant responses
          </p>
        </div>
      </div>
    </Slide>
  );
};