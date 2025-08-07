import React from 'react';
import { Slide } from '../components/Slide';
import { TrendingUp, DollarSign } from 'lucide-react';

export const FinancialsSlide: React.FC = () => {
  const projections = [
    { year: "2026", arr: "$1M", customers: 25, burn: "$1.5M" },
    { year: "2027", arr: "$5M", customers: 100, burn: "$2M" },
    { year: "2028", arr: "$15M", customers: 300, burn: "Profitable" },
    { year: "2029", arr: "$40M", customers: 800, burn: "+$5M" }
  ];

  return (
    <Slide notes="Our financial model shows a clear path to profitability by year 3 with strong unit economics from day one.">
      <div>
        <h2 className="text-4xl lg:text-5xl font-bold mb-12 text-gray-900">
          Financial Projections
        </h2>
        
        <div className="grid grid-cols-4 gap-4 mb-12">
          {projections.map((year, index) => (
            <div key={index} className="text-center">
              <p className="text-sm font-semibold text-gray-600 mb-2">{year.year}</p>
              <p className="text-2xl font-bold text-camber">{year.arr}</p>
              <p className="text-sm text-gray-600 mt-1">{year.customers} customers</p>
              <p className="text-xs text-gray-500 mt-1">{year.burn}</p>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-camber" />
              Key Metrics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Gross Margin</span>
                <span className="font-semibold">85%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">CAC Payback</span>
                <span className="font-semibold">6 months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Net Revenue Retention</span>
                <span className="font-semibold">120%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Churn</span>
                <span className="font-semibold">&lt;5% annually</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-camber" />
              Growth Drivers
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-camber mr-2">•</span>
                Land & expand within enterprise accounts
              </li>
              <li className="flex items-start">
                <span className="text-camber mr-2">•</span>
                Channel partnerships with ERPs
              </li>
              <li className="flex items-start">
                <span className="text-camber mr-2">•</span>
                Self-serve SMB offering (Year 2)
              </li>
              <li className="flex items-start">
                <span className="text-camber mr-2">•</span>
                International expansion (Year 3)
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-camber/10 rounded-lg text-center">
          <p className="text-xl font-semibold">
            Path to $100M ARR in 5 years with 40% EBITDA margins
          </p>
        </div>
      </div>
    </Slide>
  );
};