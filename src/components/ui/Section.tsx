'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SectionProps {
  children: ReactNode;
  className?: string;
  background?: 'white' | 'gray' | 'gradient';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
}

const Section = ({ 
  children, 
  className = '', 
  background = 'white',
  padding = 'lg',
  animate = true 
}: SectionProps) => {
  const backgrounds = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    gradient: 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
  };
  
  const paddings = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-24'
  };
  
  const classes = `${backgrounds[background]} ${paddings[padding]} ${className}`;
  
  if (animate) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className={classes}
      >
        {children}
      </motion.section>
    );
  }
  
  return (
    <section className={classes}>
      {children}
    </section>
  );
};

export default Section;
