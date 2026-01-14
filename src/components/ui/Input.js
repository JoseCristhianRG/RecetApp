import React from 'react';

function Input({
  label,
  error,
  helperText,
  type = 'text',
  className = '',
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-cocoa mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`
          w-full p-3 border rounded-lg transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-0
          ${error
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-forest focus:border-forest'
          }
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-cocoa">{helperText}</p>
      )}
    </div>
  );
}

export default Input;
