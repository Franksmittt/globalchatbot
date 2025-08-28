'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

const Card = ({ children, className = '', hover = true, padding = 'md' }: CardProps) => {
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  const baseClasses = `bg-white rounded-lg shadow-md border border-gray-200 ${paddings[padding]} ${className}`;
  
  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        className={`${baseClasses} hover:shadow-xl transition-shadow duration-300`}
      >
        {children}
      </motion.div>
    );
  }
  
  return (
    <div className={baseClasses}>
      {children}
    </div>
  );
};

export default Card;
