import React from 'react';

const Input = ({ label, icon: Icon, error, className = '', ...props }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center space-x-2">
          {Icon && <Icon className="h-4 w-4" />}
          <span>{label}</span>
        </label>
      )}
      <input 
        className={`
          w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl 
          focus:border-primary-600 focus:bg-white outline-none transition-all 
          font-bold placeholder:text-slate-300
          ${error ? 'border-red-100 bg-red-50 text-red-900 focus:border-red-600' : ''}
        `}
        {...props}
      />
      {error && <p className="text-xs font-bold text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export const TextArea = ({ label, icon: Icon, error, className = '', ...props }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center space-x-2">
          {Icon && <Icon className="h-4 w-4" />}
          <span>{label}</span>
        </label>
      )}
      <textarea 
        className={`
          w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl 
          focus:border-primary-600 focus:bg-white outline-none transition-all 
          font-medium min-h-[120px] placeholder:text-slate-300
          ${error ? 'border-red-100 bg-red-50 text-red-900 focus:border-red-600' : ''}
        `}
        {...props}
      />
      {error && <p className="text-xs font-bold text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export const Select = ({ label, icon: Icon, error, options = [], className = '', ...props }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center space-x-2">
          {Icon && <Icon className="h-4 w-4" />}
          <span>{label}</span>
        </label>
      )}
      <div className="relative">
        <select 
          className={`
            w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl 
            focus:border-primary-600 focus:bg-white outline-none transition-all 
            font-bold cursor-pointer appearance-none
            ${error ? 'border-red-100 bg-red-50 text-red-900 focus:border-red-600' : ''}
          `}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>
      {error && <p className="text-xs font-bold text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export default Input;
