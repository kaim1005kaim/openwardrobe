'use client';

import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DisabledTooltipProps {
  children: ReactNode;
  disabled: boolean;
  tooltip: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function DisabledTooltip({ 
  children, 
  disabled, 
  tooltip, 
  position = 'top' 
}: DisabledTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!disabled) {
    return <>{children}</>;
  }

  const getTooltipPosition = () => {
    switch (position) {
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      case 'top':
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };

  const getArrowPosition = () => {
    switch (position) {
      case 'bottom':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-1';
      case 'left':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-1';
      case 'right':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-1';
      case 'top':
      default:
        return 'top-full left-1/2 transform -translate-x-1/2 mt-1';
    }
  };

  const getArrowDirection = () => {
    switch (position) {
      case 'bottom':
        return 'border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900';
      case 'left':
        return 'border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-900';
      case 'right':
        return 'border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900';
      case 'top':
      default:
        return 'border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900';
    }
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 ${getTooltipPosition()}`}
          >
            <div className="px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap max-w-xs shadow-lg">
              {tooltip}
            </div>
            <div className={`absolute ${getArrowPosition()}`}>
              <div className={`w-0 h-0 ${getArrowDirection()}`}></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}