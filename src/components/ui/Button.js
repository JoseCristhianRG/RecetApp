import React from 'react';

const variants = {
  primary: 'bg-forest text-white hover:bg-forest-dark focus:ring-forest',
  secondary: 'bg-honey text-cocoa hover:bg-cocoa hover:text-white focus:ring-honey',
  danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
  ghost: 'bg-transparent text-forest hover:bg-forest/10 focus:ring-forest',
  outline: 'border-2 border-forest text-forest hover:bg-forest hover:text-white focus:ring-forest',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  full: 'w-full px-4 py-2 text-base',
};

function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  type = 'button',
  className = '',
  onClick,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg font-semibold
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}

export default Button;
