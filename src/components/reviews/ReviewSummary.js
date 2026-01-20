import React from 'react';
import StarDisplay from './StarDisplay';

function ReviewSummary({ averageRating = 0, totalReviews = 0, className = '' }) {
  if (totalReviews === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-2">
        <StarDisplay rating={averageRating} size="md" />
        <span className="font-display font-bold text-xl text-cocoa">
          {averageRating.toFixed(1)}
        </span>
      </div>
      <span className="text-cocoa-light font-body text-sm">
        ({totalReviews} {totalReviews === 1 ? 'valoración' : 'valoraciones'})
      </span>
    </div>
  );
}

export default ReviewSummary;
