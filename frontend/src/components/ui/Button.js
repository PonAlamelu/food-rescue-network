import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false, 
  loading = false,
  icon: Icon,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-xl shadow-primary-200',
    secondary: 'bg-white text-slate-700 border-2 border-slate-100 hover:bg-slate-50 hover:border-slate-200 shadow-sm',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-200',
    outline: 'bg-transparent border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
  };

  const sizes = {
    sm: 'px-4 py-2 text-[10px] rounded-xl',
    md: 'px-6 py-3 text-xs rounded-2xl',
    lg: 'px-8 py-4 text-sm rounded-2xl',
  };

  return (
    <motion.button
      whileHover={{ y: disabled ? 0 : -2 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Processing...</span>
        </div>
      ) : (
        <>
          {Icon && <Icon className={`${children ? 'mr-2' : ''} h-4 w-4`} />}
          {children}
        </>
      )}
    </motion.button>
  );
};

export default Button;
