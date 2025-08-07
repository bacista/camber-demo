import React from 'react';
import { Slide } from '../components/Slide';
import { Award, Briefcase, Home, Code } from 'lucide-react';
import { onePagerContent } from '../data/onePagerContent';

export const TeamSlide: React.FC = () => {
  const experiences = [
    { icon: Briefcase, text: onePagerContent.team.founder.experience[0] },
    { icon: Award, text: onePagerContent.team.founder.experience[1] },
    { icon: Home, text: onePagerContent.team.founder.experience[2] },
    { icon: Code, text: onePagerContent.team.founder.experience[3] }
  ];

  return (
    <Slide notes="Our team combines deep industry expertise with technical excellence. We've lived this problem and built the solution.">
      <div>
        <h2 className="text-4xl lg:text-5xl font-bold mb-12 text-gray-900">
          Team & Experience
        </h2>
        
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-8">Why We'll Win</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {experiences.map((exp, index) => (
              <div key={index} className="flex items-start gap-4">
                <exp.icon className="w-6 h-6 text-camber mt-1 flex-shrink-0" />
                <p className="text-gray-700">{exp.text}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <p className="text-3xl font-bold text-camber">20+</p>
            <p className="text-gray-600">Years Industry Experience</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <p className="text-3xl font-bold text-camber">$2B+</p>
            <p className="text-gray-600">Distribution P&L Managed</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <p className="text-3xl font-bold text-camber">100%</p>
            <p className="text-gray-600">Technical + Business</p>
          </div>
        </div>
        
        <div className="p-6 bg-camber/10 rounded-lg">
          <h3 className="font-semibold mb-2">Unique Insight:</h3>
          <p className="text-gray-700">
            "I've seen firsthand how manual workflows eat away at profits. I've lived this problem my whole life, 
            and I've built the solution that I wish existed when I was running sales transformation."
          </p>
        </div>
      </div>
    </Slide>
  );
};