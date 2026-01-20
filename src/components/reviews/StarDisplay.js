import React from 'react';
import { StarIcon } from '../icons';

function StarDisplay({ rating = 0, size = 'md', showValue = false, className = '' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const starSize = sizes[size] || sizes.md;
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    const isFilled = i <= Math.floor(rating);
    const isHalf = !isFilled && i === Math.ceil(rating) && rating % 1 >= 0.5;

    stars.push(
      <StarIcon
        key={i}
        className={`${starSize} ${isFilled || isHalf ? 'text-honey' : 'text-cream-300'} transition-colors duration-200`}
        filled={isFilled}
        half={isHalf}
      />
    );
  }

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {stars}
      {showValue && rating > 0 && (
        <span className="ml-1.5 font-display font-semibold text-cocoa text-sm">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

export default StarDisplay;
