import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = true, padding = true, bento = false }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -5, scale: 1.01 } : {}}
      className={`
        bg-white border border-slate-100 shadow-bento transition-all duration-300
        ${padding ? 'p-8' : ''}
        ${bento ? 'rounded-bento' : 'rounded-card'}
        ${hover ? 'hover:shadow-bento-hover' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

export default Card;
