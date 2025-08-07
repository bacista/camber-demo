import React from 'react';
import { Slide } from '../components/Slide';
import { Rocket, Target, Users, Globe } from 'lucide-react';

export const AskSlide: React.FC = () => {
  const useOfFunds = [
    { icon: Users, category: "Team", allocation: "40%", details: "Engineering & Sales" },
    { icon: Rocket, category: "Product", allocation: "30%", details: "AI & Voice development" },
    { icon: Target, category: "GTM", allocation: "20%", details: "Sales & Marketing" },
    { icon: Globe, category: "Operations", allocation: "10%", details: "Infrastructure & Support" }
  ];

  return (
    <Slide notes="We're raising our seed round to accelerate growth and capture the massive opportunity ahead of us.">
      <div>
        <h2 className="text-4xl lg:text-5xl font-bold mb-12 text-gray-900">
          The Ask
        </h2>
        
        <div className="text-center mb-12">
          <h3 className="text-5xl font-bold text-camber mb-4">$3M Seed Round</h3>
          <p className="text-xl text-gray-700">18 months runway to $1M ARR and Series A</p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {useOfFunds.map((item, index) => (
            <div key={index} className="text-center">
              <item.icon className="w-8 h-8 text-camber mx-auto mb-3" />
              <p className="font-semibold">{item.category}</p>
              <p className="text-2xl font-bold text-gray-900 my-1">{item.allocation}</p>
              <p className="text-xs text-gray-600">{item.details}</p>
            </div>
          ))}
        </div>
        
        <div className="bg-gray-50 rounded-lg p-8 mb-8">
          <h3 className="text-xl font-semibold mb-4">Milestones This Funding Enables</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-camber mr-2">✓</span>
                25 paying customers
              </li>
              <li className="flex items-start">
                <span className="text-camber mr-2">✓</span>
                Voice interface general availability
              </li>
            </ul>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-camber mr-2">✓</span>
                3 channel partnerships signed
              </li>
              <li className="flex items-start">
                <span className="text-camber mr-2">✓</span>
                Team of 10 (6 eng, 4 GTM)
              </li>
            </ul>
          </div>
        </div>
        
        <div className="p-6 bg-camber text-white rounded-lg text-center">
          <p className="text-2xl font-bold mb-2">Join us in transforming the $2T materials supply chain</p>
          <p className="text-lg">Let's build the future of B2B commerce together</p>
        </div>
      </div>
    </Slide>
  );
};