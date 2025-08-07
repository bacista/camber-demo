import React from 'react';
import { Slide } from '../components/Slide';
import { DollarSign, Users, Zap } from 'lucide-react';

export const BusinessModelSlide: React.FC = () => {
  return (
    <Slide notes="Our business model is designed for rapid adoption with clear ROI. We charge based on value delivered, not seats or usage.">
      <div>
        <h2 className="text-4xl lg:text-5xl font-bold mb-12 text-gray-900">
          Business Model
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <DollarSign className="w-12 h-12 text-camber mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">SaaS Subscription</h3>
            <p className="text-gray-600">$2-5K/month per sales team</p>
            <p className="text-sm text-gray-500 mt-2">Based on transaction volume</p>
          </div>
          
          <div className="text-center">
            <Zap className="w-12 h-12 text-camber mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Implementation</h3>
            <p className="text-gray-600">$10-25K one-time</p>
            <p className="text-sm text-gray-500 mt-2">2-week deployment</p>
          </div>
          
          <div className="text-center">
            <Users className="w-12 h-12 text-camber mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Success Services</h3>
            <p className="text-gray-600">$500/month optional</p>
            <p className="text-sm text-gray-500 mt-2">Ongoing optimization</p>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-8">
          <h3 className="text-2xl font-semibold mb-6">Unit Economics</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-3xl font-bold text-camber">$36K</p>
              <p className="text-sm text-gray-600">ACV</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-camber">85%</p>
              <p className="text-sm text-gray-600">Gross Margin</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-camber">6 mo</p>
              <p className="text-sm text-gray-600">Payback Period</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-camber">3.5x</p>
              <p className="text-sm text-gray-600">LTV/CAC</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-camber/10 rounded-lg">
          <p className="text-lg">
            <span className="font-semibold">ROI for Customers:</span> 10x return in year one through time savings and error reduction
          </p>
        </div>
      </div>
    </Slide>
  );
};