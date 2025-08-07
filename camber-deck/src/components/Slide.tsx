import React from 'react';
import { motion } from 'framer-motion';

interface SlideProps {
  children: React.ReactNode;
  notes?: string;
  className?: string;
}

export const Slide: React.FC<SlideProps> = ({ 
  children, 
  notes, 
  className = ""
}) => {
  const isPresenterMode = new URLSearchParams(window.location.search).get('presenter') === 'true';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`slide-container min-h-screen bg-white flex items-center justify-center ${className}`}
    >
      <div className="w-full max-w-7xl mx-auto py-16 px-8 lg:px-20">
        {children}
      </div>
      
      {isPresenterMode && notes && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-100 p-4 border-t no-print">
          <h3 className="font-semibold text-sm mb-2">Speaker Notes:</h3>
          <p className="text-sm text-gray-700">{notes}</p>
        </div>
      )}
    </motion.div>
  );
};