import React from 'react';
import { Slide } from '../components/Slide';
import { CheckCircle, Users, Rocket, Target } from 'lucide-react';
import { onePagerContent } from '../data/onePagerContent';

export const TractionSlide: React.FC = () => {
  const milestones = [
    { icon: CheckCircle, text: onePagerContent.traction.milestones[0], status: 'complete' },
    { icon: Users, text: onePagerContent.traction.milestones[1], status: 'complete' },
    { icon: Target, text: onePagerContent.traction.milestones[2], status: 'in-progress' },
    { icon: Rocket, text: onePagerContent.traction.milestones[3], status: 'upcoming' }
  ];

  return (
    <Slide notes="We've built the product, validated the concept, and are now moving into pilots with paying customers.">
      <div>
        <h2 className="text-4xl lg:text-5xl font-bold mb-12 text-gray-900">
          Traction & Milestones
        </h2>
        
        <div className="space-y-6 mb-12">
          {milestones.map((milestone, index) => (
            <div key={index} className="flex items-start gap-4">
              <milestone.icon 
                className={`w-6 h-6 mt-1 flex-shrink-0 ${
                  milestone.status === 'complete' ? 'text-green-500' :
                  milestone.status === 'in-progress' ? 'text-camber' :
                  'text-gray-400'
                }`} 
              />
              <div className="flex-1">
                <p className="text-lg text-gray-700">{milestone.text}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <p className="text-3xl font-bold text-camber">3</p>
            <p className="text-gray-600 mt-2">LOIs in Discussion</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <p className="text-3xl font-bold text-camber">$180K</p>
            <p className="text-gray-600 mt-2">Pipeline ARR</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <p className="text-3xl font-bold text-camber">Q3 2025</p>
            <p className="text-gray-600 mt-2">First Revenue</p>
          </div>
        </div>
        
        <div className="mt-12 p-6 bg-camber/10 rounded-lg">
          <h3 className="font-semibold mb-2">Customer Feedback:</h3>
          <p className="italic text-gray-700">
            "This would save my team hours every day. When can we start?"
          </p>
          <p className="text-sm text-gray-600 mt-2">- VP Sales, Regional Building Materials Distributor</p>
        </div>
      </div>
    </Slide>
  );
};