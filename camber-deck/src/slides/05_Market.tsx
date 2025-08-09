import React from 'react';
import { Slide } from '../components/Slide';
import { TrendingUp } from 'lucide-react';
import { onePagerContent } from '../data/onePagerContent';

export const MarketSlide: React.FC = () => {
  return (
    <Slide notes="The material supply chain is a $2 trillion market that's ripe for disruption. We're starting with quick wins and expanding from there.">
      <div>
        <h2 className="text-4xl lg:text-5xl font-bold mb-12 text-gray-900">
          Market Opportunity
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="mb-8">
              <TrendingUp className="w-12 h-12 text-camber mb-4" />
              <h3 className="text-5xl font-bold text-camber mb-2">
                {onePagerContent.market.fragmentation}
              </h3>
              <p className="text-gray-600 text-lg font-medium">{onePagerContent.market.fragmentationLabel}</p>
              <p className="text-gray-500 text-sm mt-1">{onePagerContent.market.fragmentationDetail}</p>
            </div>
            
            <div>
              <h3 className="text-5xl font-bold text-gray-900 mb-2">
                {onePagerContent.market.digitalAdoption}
              </h3>
              <p className="text-gray-600 text-lg font-medium">{onePagerContent.market.digitalAdoptionLabel}</p>
              <p className="text-gray-500 text-sm mt-1">{onePagerContent.market.digitalDetail}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-semibold mb-6">Target Channels</h3>
            <div className="grid grid-cols-2 gap-3">
              {onePagerContent.market.channels.map((channel, index) => (
                <div key={index} className="bg-gray-50 rounded px-4 py-2">
                  <p className="font-medium">{channel}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-camber/10 rounded-lg">
              <p className="text-sm">
                <span className="font-semibold">Focus:</span> Most fragmented channels with biggest tech gaps
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-xl text-gray-700">
            Serving the <span className="font-bold">$2 trillion</span> materials distribution market
          </p>
        </div>
      </div>
    </Slide>
  );
};