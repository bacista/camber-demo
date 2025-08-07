import React from 'react';
import { Slide } from '../components/Slide';
import { Target, TrendingUp, Globe } from 'lucide-react';

export const RoadmapSlide: React.FC = () => {
  const phases = [
    {
      quarter: "Q3-Q4 2025",
      title: "Launch & Learn",
      items: ["3 pilot customers", "Core platform stable", "Initial revenue"]
    },
    {
      quarter: "2026",
      title: "Scale & Optimize",
      items: ["25 customers", "$1M ARR", "Voice interface GA"]
    },
    {
      quarter: "2027",
      title: "Expand & Dominate",
      items: ["100+ customers", "$5M ARR", "Category leader"]
    }
  ];

  return (
    <Slide notes="Our roadmap is aggressive but achievable. We're focused on rapid iteration and expansion based on customer feedback.">
      <div>
        <h2 className="text-4xl lg:text-5xl font-bold mb-12 text-gray-900">
          Product Roadmap & Vision
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {phases.map((phase, index) => (
            <div key={index} className="relative">
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-sm font-semibold text-camber mb-2">{phase.quarter}</p>
                <h3 className="text-xl font-bold mb-4">{phase.title}</h3>
                <ul className="space-y-2">
                  {phase.items.map((item, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start">
                      <span className="text-camber mr-2">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              {index < phases.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <span className="text-2xl text-gray-400">→</span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="bg-camber/10 rounded-lg p-8">
          <h3 className="text-2xl font-semibold mb-4">Long-Term Vision</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-camber mt-1" />
              <div>
                <p className="font-semibold">Year 3</p>
                <p className="text-sm text-gray-700">AI platform of record for materials distribution</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-camber mt-1" />
              <div>
                <p className="font-semibold">Year 5</p>
                <p className="text-sm text-gray-700">$100M ARR, 1000+ customers</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 text-camber mt-1" />
              <div>
                <p className="font-semibold">Year 10</p>
                <p className="text-sm text-gray-700">Global leader in supply chain AI</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Slide>
  );
};