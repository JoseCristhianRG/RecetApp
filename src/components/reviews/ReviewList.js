import React, { useEffect, useContext } from 'react';
import { AuthContext } from '../../AuthContext';
import { useReviews } from '../../ReviewsContext';
import ReviewItem from './ReviewItem';
import { LoadingSpinner } from '../ui';

function ReviewList({ recipeId }) {
  const { user } = useContext(AuthContext);
  const { reviews, loading, hasMore, fetchReviews, fetchMoreReviews } = useReviews();

  const recipeReviews = reviews[recipeId] || [];

  useEffect(() => {
    if (recipeId) {
      fetchReviews(recipeId);
    }
  }, [recipeId, fetchReviews]);

  if (loading && recipeReviews.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner text="Cargando valoraciones..." />
      </div>
    );
  }

  if (recipeReviews.length === 0) {
    return (
      <div className="text-center py-8 bg-cream-100 rounded-2xl">
        <span className="text-4xl mb-2 block">⭐</span>
        <p className="font-display font-semibold text-cocoa mb-1">
          Sin valoraciones aún
        </p>
        <p className="font-body text-cocoa-light text-sm">
          ¡Sé el primero en valorar esta receta!
        </p>
      </div>
    );
  }

  // Sort reviews: user's own review first, then by date
  const sortedReviews = [...recipeReviews].sort((a, b) => {
    if (user) {
      if (a.userId === user.uid) return -1;
      if (b.userId === user.uid) return 1;
    }
    return 0;
  });

  return (
    <div className="space-y-4">
      {sortedReviews.map((review, index) => (
        <div
          key={review.id}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <ReviewItem
            review={review}
            recipeId={recipeId}
            isOwnReview={user && review.userId === user.uid}
          />
        </div>
      ))}

      {/* Load More Button */}
      {hasMore[recipeId] && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => fetchMoreReviews(recipeId)}
            disabled={loading}
            className="px-6 py-2 rounded-full font-display font-semibold text-sm
              border-2 border-forest/30 text-forest
              hover:bg-forest hover:text-white hover:border-forest
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200"
          >
            {loading ? 'Cargando...' : 'Ver más valoraciones'}
          </button>
        </div>
      )}
    </div>
  );
}

export default ReviewList;
