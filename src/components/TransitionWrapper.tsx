
import React from 'react';
import { motion } from 'framer-motion';

interface TransitionWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const TransitionWrapper: React.FC<TransitionWrapperProps> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default TransitionWrapper;
