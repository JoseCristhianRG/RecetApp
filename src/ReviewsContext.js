import React, { createContext, useState, useContext, useCallback } from 'react';
import { db } from './firebase';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  getDoc,
  limit,
  startAfter,
} from 'firebase/firestore';
import { AuthContext } from './AuthContext';

export const ReviewsContext = createContext({
  reviews: {},
  loading: false,
  fetchReviews: async () => {},
  fetchMoreReviews: async () => {},
  addReview: async () => {},
  updateReview: async () => {},
  deleteReview: async () => {},
  getUserReview: () => null,
  getRecipeStats: () => ({ averageRating: 0, totalReviews: 0 }),
});

const REVIEWS_PER_PAGE = 5;

export function ReviewsProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [reviewsByRecipe, setReviewsByRecipe] = useState({});
  const [loading, setLoading] = useState(false);
  const [lastDocs, setLastDocs] = useState({});
  const [hasMore, setHasMore] = useState({});

  const fetchReviews = useCallback(async (recipeId) => {
    if (!recipeId) return;

    setLoading(true);
    try {
      const q = query(
        collection(db, 'reviews'),
        where('recipeId', '==', recipeId),
        orderBy('createdAt', 'desc'),
        limit(REVIEWS_PER_PAGE)
      );

      const snapshot = await getDocs(q);
      const reviews = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      }));

      setReviewsByRecipe((prev) => ({
        ...prev,
        [recipeId]: reviews,
      }));

      const lastDoc = snapshot.docs[snapshot.docs.length - 1];
      setLastDocs((prev) => ({ ...prev, [recipeId]: lastDoc }));
      setHasMore((prev) => ({ ...prev, [recipeId]: snapshot.docs.length === REVIEWS_PER_PAGE }));
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMoreReviews = useCallback(async (recipeId) => {
    if (!recipeId || !lastDocs[recipeId] || !hasMore[recipeId]) return;

    setLoading(true);
    try {
      const q = query(
        collection(db, 'reviews'),
        where('recipeId', '==', recipeId),
        orderBy('createdAt', 'desc'),
        startAfter(lastDocs[recipeId]),
        limit(REVIEWS_PER_PAGE)
      );

      const snapshot = await getDocs(q);
      const newReviews = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      }));

      setReviewsByRecipe((prev) => ({
        ...prev,
        [recipeId]: [...(prev[recipeId] || []), ...newReviews],
      }));

      const lastDoc = snapshot.docs[snapshot.docs.length - 1];
      setLastDocs((prev) => ({ ...prev, [recipeId]: lastDoc }));
      setHasMore((prev) => ({ ...prev, [recipeId]: snapshot.docs.length === REVIEWS_PER_PAGE }));
    } catch (error) {
      console.error('Error fetching more reviews:', error);
    } finally {
      setLoading(false);
    }
  }, [lastDocs, hasMore]);

  const addReview = useCallback(async (recipeId, rating, comment) => {
    if (!user || !recipeId) return null;

    try {
      const reviewData = {
        recipeId,
        userId: user.uid,
        rating,
        comment: comment.trim(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'reviews'), reviewData);

      const newReview = {
        id: docRef.id,
        ...reviewData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setReviewsByRecipe((prev) => ({
        ...prev,
        [recipeId]: [newReview, ...(prev[recipeId] || [])],
      }));

      await updateRecipeStats(recipeId);

      return newReview;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  }, [user]);

  const updateReview = useCallback(async (reviewId, recipeId, rating, comment) => {
    if (!user || !reviewId) return null;

    try {
      const reviewRef = doc(db, 'reviews', reviewId);
      await updateDoc(reviewRef, {
        rating,
        comment: comment.trim(),
        updatedAt: serverTimestamp(),
      });

      setReviewsByRecipe((prev) => ({
        ...prev,
        [recipeId]: (prev[recipeId] || []).map((review) =>
          review.id === reviewId
            ? { ...review, rating, comment: comment.trim(), updatedAt: new Date() }
            : review
        ),
      }));

      await updateRecipeStats(recipeId);

      return true;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  }, [user]);

  const deleteReview = useCallback(async (reviewId, recipeId) => {
    if (!user || !reviewId) return false;

    try {
      await deleteDoc(doc(db, 'reviews', reviewId));

      setReviewsByRecipe((prev) => ({
        ...prev,
        [recipeId]: (prev[recipeId] || []).filter((review) => review.id !== reviewId),
      }));

      await updateRecipeStats(recipeId);

      return true;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }, [user]);

  const updateRecipeStats = async (recipeId) => {
    try {
      const q = query(collection(db, 'reviews'), where('recipeId', '==', recipeId));
      const snapshot = await getDocs(q);

      const totalReviews = snapshot.size;
      const averageRating =
        totalReviews > 0
          ? snapshot.docs.reduce((sum, doc) => sum + doc.data().rating, 0) / totalReviews
          : 0;

      const recipeRef = doc(db, 'recipes', recipeId);
      await updateDoc(recipeRef, {
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews,
      });
    } catch (error) {
      console.error('Error updating recipe stats:', error);
    }
  };

  const getUserReview = useCallback((recipeId) => {
    if (!user || !reviewsByRecipe[recipeId]) return null;
    return reviewsByRecipe[recipeId].find((review) => review.userId === user.uid) || null;
  }, [user, reviewsByRecipe]);

  const getRecipeStats = useCallback((recipeId) => {
    const reviews = reviewsByRecipe[recipeId] || [];
    if (reviews.length === 0) {
      return { averageRating: 0, totalReviews: 0 };
    }

    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
    };
  }, [reviewsByRecipe]);

  const value = {
    reviews: reviewsByRecipe,
    loading,
    hasMore,
    fetchReviews,
    fetchMoreReviews,
    addReview,
    updateReview,
    deleteReview,
    getUserReview,
    getRecipeStats,
  };

  return (
    <ReviewsContext.Provider value={value}>
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
}
