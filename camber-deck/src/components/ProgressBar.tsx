import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const progress = (current / total) * 100;
  
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gray-200 no-print">
        <motion.div
          className="h-full bg-camber"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      <div className="fixed bottom-4 right-4 text-sm text-gray-600 no-print">
        Slide {current} / {total}
      </div>
    </>
  );
};