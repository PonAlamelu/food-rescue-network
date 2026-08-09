import React from 'react';

const Badge = ({ children, status = 'default', className = '' }) => {
  const variants = {
    default: 'bg-slate-50 text-slate-600 border-slate-200',
    primary: 'bg-primary-50 text-primary-700 border-primary-100',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    warning: 'bg-amber-50 text-amber-700 border-amber-100',
    danger: 'bg-red-50 text-red-700 border-red-100',
    info: 'bg-blue-50 text-blue-700 border-blue-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
  };

  const statusMap = {
    POSTED: 'info',
    REQUESTED: 'warning',
    APPROVED: 'purple',
    PICKED_UP: 'primary',
    DELIVERED: 'success',
    EXPIRED: 'danger',
  };

  const variant = statusMap[children] || status;

  return (
    <span 
      className={`
        px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border-2 
        ${variants[variant]} 
        ${className}
      `}
    >
      {children.replace('_', ' ')}
    </span>
  );
};

export default Badge;
