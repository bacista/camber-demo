import React from 'react';
import { Slide } from '../components/Slide';
import { Mic, FileText, Package, Truck, Brain } from 'lucide-react';

export const ProductSlide: React.FC = () => {
  const features = [
    { icon: Mic, title: "Voice Interface", desc: "Natural language processing for hands-free operation" },
    { icon: FileText, title: "Smart Quoting", desc: "Generate accurate quotes in seconds, not hours" },
    { icon: Package, title: "Inventory Sync", desc: "Real-time visibility across all locations" },
    { icon: Truck, title: "Delivery Tracking", desc: "Live updates on shipment status" },
    { icon: Brain, title: "AI Recommendations", desc: "Predictive insights for upsell and reorder" }
  ];

  return (
    <Slide notes="Our product is designed for the way sales teams actually work. Voice-first interface for the field, powerful automation in the background.">
      <div>
        <h2 className="text-4xl lg:text-5xl font-bold mb-12 text-gray-900">
          Product Overview
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-semibold mb-6">Core Platform</h3>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <feature.icon className="w-5 h-5 text-camber mt-1" />
                  <div>
                    <p className="font-semibold">{feature.title}</p>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-semibold mb-6">Integration</h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="font-semibold mb-4">Seamless connectivity with:</p>
              <ul className="space-y-2 text-gray-700">
                <li>• ERP Systems (SAP, Oracle, NetSuite)</li>
                <li>• CRM Platforms (Salesforce, HubSpot)</li>
                <li>• E-commerce (Magento, Shopify B2B)</li>
                <li>• Communication (Email, SMS, Teams)</li>
              </ul>
            </div>
            
            <div className="mt-6 p-4 bg-camber/10 rounded-lg">
              <p className="text-sm font-semibold">Deployment: 2-week implementation</p>
            </div>
          </div>
        </div>
      </div>
    </Slide>
  );
};