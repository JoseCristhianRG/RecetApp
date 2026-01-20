import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../AuthContext';
import { useReviews } from '../../ReviewsContext';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { PencilIcon, TrashIcon } from '../icons';
import StarDisplay from './StarDisplay';
import ReviewForm from './ReviewForm';

function ReviewItem({ review, recipeId, isOwnReview = false }) {
  const { user } = useContext(AuthContext);
  const { deleteReview } = useReviews();
  const [authorInfo, setAuthorInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchAuthor = async () => {
      if (!review.userId) return;
      try {
        const userDoc = await getDoc(doc(db, 'users', review.userId));
        if (userDoc.exists()) {
          setAuthorInfo(userDoc.data());
        }
      } catch (error) {
        console.error('Error fetching author:', error);
      }
    };
    fetchAuthor();
  }, [review.userId]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteReview(review.id, recipeId);
    } catch (error) {
      console.error('Error deleting review:', error);
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isEditing) {
    return (
      <ReviewForm
        recipeId={recipeId}
        existingReview={review}
        onCancel={() => setIsEditing(false)}
        onSuccess={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div
      className={`relative p-4 rounded-2xl transition-all duration-200 animate-fade-in
        ${isOwnReview ? 'bg-mint/10 border-2 border-mint/30' : 'bg-white border border-cream-200'}`}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <img
            src={authorInfo?.photoURL || require('../../images/icono.png')}
            alt={authorInfo?.displayName || 'Usuario'}
            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-soft"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display font-semibold text-cocoa truncate">
              {authorInfo?.displayName || 'Usuario'}
            </span>
            {isOwnReview && (
              <span className="px-2 py-0.5 bg-mint text-forest text-xs font-display font-semibold rounded-full">
                Tu valoración
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <StarDisplay rating={review.rating} size="sm" />
            <span className="text-cocoa-lighter text-xs font-body">
              {formatDate(review.createdAt)}
              {review.updatedAt && review.updatedAt > review.createdAt && ' (editado)'}
            </span>
          </div>
        </div>

        {/* Actions */}
        {isOwnReview && user && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-lg text-cocoa-light hover:text-forest hover:bg-forest/10
                transition-all duration-200"
              title="Editar"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 rounded-lg text-cocoa-light hover:text-tangerine hover:bg-tangerine/10
                transition-all duration-200"
              title="Eliminar"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Comment */}
      {review.comment && (
        <p className="font-body text-cocoa-light leading-relaxed pl-13">
          {review.comment}
        </p>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl flex items-center justify-center p-4 animate-fade-in">
          <div className="text-center">
            <p className="font-display font-semibold text-cocoa mb-3">
              ¿Eliminar tu valoración?
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="px-4 py-2 rounded-full font-display font-semibold text-sm
                  text-cocoa-light hover:bg-cream-200 transition-all duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-full font-display font-semibold text-sm
                  bg-tangerine text-white hover:bg-tangerine-dark
                  disabled:opacity-50 transition-all duration-200"
              >
                {deleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewItem;
