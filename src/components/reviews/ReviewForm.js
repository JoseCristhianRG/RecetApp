import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../AuthContext';
import { useReviews } from '../../ReviewsContext';
import StarRating from './StarRating';

function ReviewForm({ recipeId, existingReview = null, onCancel, onSuccess }) {
  const { user } = useContext(AuthContext);
  const { addReview, updateReview } = useReviews();
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!existingReview;

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment);
    }
  }, [existingReview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (rating === 0) {
      setError('Por favor selecciona una calificación');
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        await updateReview(existingReview.id, recipeId, rating, comment);
      } else {
        await addReview(recipeId, rating, comment);
      }

      if (onSuccess) onSuccess();
      if (!isEditing) {
        setRating(0);
        setComment('');
      }
    } catch (err) {
      setError('Error al guardar la valoración. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-soft animate-fade-in">
      <h3 className="font-display font-bold text-lg text-cocoa mb-4">
        {isEditing ? 'Editar tu valoración' : '¿Qué te pareció esta receta?'}
      </h3>

      <div className="mb-4">
        <label className="block font-body text-sm text-cocoa-light mb-2">
          Tu calificación
        </label>
        <StarRating
          value={rating}
          onChange={setRating}
          size="lg"
          disabled={loading}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="comment" className="block font-body text-sm text-cocoa-light mb-2">
          Tu comentario (opcional)
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Comparte tu experiencia con esta receta..."
          rows={3}
          disabled={loading}
          className="w-full px-4 py-3 rounded-xl border-2 border-cream-200
            font-body text-cocoa placeholder-cocoa-lighter
            focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200 resize-none"
        />
      </div>

      {error && (
        <p className="text-tangerine font-body text-sm mb-4">{error}</p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading || rating === 0}
          className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Publicar valoración'}
        </button>

        {isEditing && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-full font-display font-semibold text-sm
              text-cocoa-light hover:text-cocoa hover:bg-cream-200
              transition-all duration-200"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export default ReviewForm;
