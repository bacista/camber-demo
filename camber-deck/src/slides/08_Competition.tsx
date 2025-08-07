import React from 'react';
import { Slide } from '../components/Slide';
import { Shield, Zap, Users, Brain } from 'lucide-react';

export const CompetitionSlide: React.FC = () => {
  const competitors = [
    { name: "Legacy ERPs", weakness: "Complex, expensive, slow" },
    { name: "Generic CRMs", weakness: "Not built for materials/distribution" },
    { name: "Point Solutions", weakness: "Fragmented, no AI integration" }
  ];

  const advantages = [
    { icon: Brain, title: "AI-Native", desc: "Built from ground up with AI" },
    { icon: Zap, title: "Industry-Specific", desc: "Deep domain expertise" },
    { icon: Users, title: "Voice-First", desc: "Unique interface for field sales" },
    { icon: Shield, title: "Fast Deploy", desc: "2 weeks vs 6+ months" }
  ];

  return (
    <Slide notes="We're not competing with generic tools. We're purpose-built for materials distribution with AI at the core.">
      <div>
        <h2 className="text-4xl lg:text-5xl font-bold mb-12 text-gray-900">
          Competitive Landscape
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold mb-6">Current Solutions</h3>
            <div className="space-y-4">
              {competitors.map((comp, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold">{comp.name}</p>
                  <p className="text-sm text-red-600">{comp.weakness}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-semibold mb-6">Camber Advantages</h3>
            <div className="space-y-4">
              {advantages.map((adv, index) => (
                <div key={index} className="flex items-start gap-3">
                  <adv.icon className="w-5 h-5 text-camber mt-1" />
                  <div>
                    <p className="font-semibold">{adv.title}</p>
                    <p className="text-sm text-gray-600">{adv.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-12 p-6 bg-camber/10 rounded-lg">
          <h3 className="font-semibold mb-2">Our Moat:</h3>
          <p className="text-gray-700">
            Combination of deep industry knowledge, AI-first architecture, and focus on voice interface creates a unique position that's hard to replicate
          </p>
        </div>
      </div>
    </Slide>
  );
};