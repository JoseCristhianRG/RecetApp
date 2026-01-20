import React, { useState } from 'react';
import { StarIcon } from '../icons';

function StarRating({ value = 0, onChange, size = 'lg', disabled = false, className = '' }) {
  const [hoverValue, setHoverValue] = useState(0);

  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const starSize = sizes[size] || sizes.lg;

  const handleClick = (rating) => {
    if (!disabled && onChange) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating) => {
    if (!disabled) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    setHoverValue(0);
  };

  const displayValue = hoverValue || value;

  return (
    <div
      className={`flex items-center gap-1 ${className}`}
      onMouseLeave={handleMouseLeave}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= displayValue;

        return (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            disabled={disabled}
            className={`p-1 rounded-lg transition-all duration-200
              ${disabled
                ? 'cursor-not-allowed opacity-50'
                : 'cursor-pointer hover:scale-110 active:scale-95'
              }
              ${isFilled ? 'text-honey' : 'text-cream-300 hover:text-honey/50'}
              focus:outline-none focus:ring-2 focus:ring-honey/50 focus:ring-offset-2`}
            aria-label={`${star} estrella${star !== 1 ? 's' : ''}`}
          >
            <StarIcon
              className={`${starSize} transition-all duration-200 ${isFilled ? 'drop-shadow-sm' : ''}`}
              filled={isFilled}
            />
          </button>
        );
      })}
    </div>
  );
}

export default StarRating;
