import React from 'react';

const Skeleton = ({ className = '', variant = 'rect' }) => {
  const variants = {
    rect: 'rounded-2xl',
    circle: 'rounded-full',
    text: 'rounded-md h-4 w-full',
  };

  return (
    <div 
      className={`
        bg-slate-100 animate-pulse 
        ${variants[variant]} 
        ${className}
      `}
    />
  );
};

export const DashboardSkeleton = () => (
  <div className="space-y-8 animate-fade-in">
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="h-14 w-40 rounded-2xl" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <Skeleton className="h-32 rounded-3xl" />
      <Skeleton className="h-32 rounded-3xl" />
      <Skeleton className="h-32 rounded-3xl" />
    </div>
    <Skeleton className="h-96 rounded-bento" />
  </div>
);

export default Skeleton;
