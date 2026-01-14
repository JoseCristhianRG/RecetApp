import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { RecipesContext } from '../RecipesContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy, addDoc, deleteDoc } from 'firebase/firestore';
import { AuthContext } from '../AuthContext';
import { HeartIcon, PencilIcon } from '../components/icons';
import { LoadingSpinner } from '../components/ui';

function RecipePage() {
  const { recipeId } = useParams();
  const { recipes } = useContext(RecipesContext);
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const recipe = recipes.find((r) => r.id === recipeId);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFav, setLoadingFav] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSteps() {
      if (!recipeId) return;
      const q = query(
        collection(db, 'steps'),
        where('recipeId', '==', recipeId),
        orderBy('order', 'asc')
      );
      const snap = await getDocs(q);
      setSteps(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }
    fetchSteps();

    async function fetchFavoriteCount() {
      if (!recipeId) return;
      const favsQuery = query(collection(db, 'favorites'), where('recipeId', '==', recipeId));
      const favsSnap = await getDocs(favsQuery);
      setFavoriteCount(favsSnap.size);
    }
    fetchFavoriteCount();

    async function fetchIsFavorite() {
      if (!user || !recipeId) return setIsFavorite(false);
      const favQuery = query(
        collection(db, 'favorites'),
        where('userId', '==', user.uid),
        where('recipeId', '==', recipeId)
      );
      const favSnap = await getDocs(favQuery);
      setIsFavorite(!favSnap.empty);
    }
    fetchIsFavorite();
  }, [recipeId, user]);

  const handleToggleFavorite = async () => {
    if (!user || loadingFav) return;
    setLoadingFav(true);
    const favQuery = query(
      collection(db, 'favorites'),
      where('userId', '==', user.uid),
      where('recipeId', '==', recipe.id)
    );
    const favSnap = await getDocs(favQuery);
    if (!favSnap.empty) {
      await deleteDoc(favSnap.docs[0].ref);
      setFavoriteCount(favoriteCount - 1);
      setIsFavorite(false);
    } else {
      await addDoc(collection(db, 'favorites'), {
        userId: user.uid,
        recipeId: recipe.id,
        addedAt: new Date()
      });
      setFavoriteCount(favoriteCount + 1);
      setIsFavorite(true);
    }
    setLoadingFav(false);
  };

  if (!recipe) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <span className="text-6xl mb-4">🍽️</span>
        <h2 className="font-display text-2xl font-bold text-cocoa mb-2">Receta no encontrada</h2>
        <p className="font-body text-cocoa-light mb-6">Esta receta no existe o ha sido eliminada</p>
        <button
          onClick={() => navigate('/')}
          className="btn-primary"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen animate-fade-in">
      {/* Hero Section with Image */}
      <section className="relative">
        {/* Full-width Image */}
        <div className="relative h-[50vh] lg:h-[60vh] overflow-hidden">
          <img
            src={recipe.imageUrl || require('../images/no_image.png')}
            alt={recipe.name}
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-cocoa/80 via-cocoa/30 to-transparent" />

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 z-10 p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-soft
              text-cocoa hover:bg-white transition-all duration-300 hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            {/* Edit Button (if owner) */}
            {user && recipe.createdBy === user.uid && (
              <Link
                to={`/edit-recipe/${recipe.id}`}
                className="p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-soft
                  text-forest hover:bg-white transition-all duration-300 hover:scale-105"
                title="Editar receta"
              >
                <PencilIcon className="w-5 h-5" />
              </Link>
            )}

            {/* Favorite Button */}
            {user && (
              <button
                onClick={handleToggleFavorite}
                disabled={loadingFav}
                className={`p-3 rounded-full shadow-soft transition-all duration-300 hover:scale-105
                  ${isFavorite
                    ? 'bg-tangerine text-white shadow-glow-tangerine'
                    : 'bg-white/90 backdrop-blur-sm text-tangerine hover:bg-white'
                  }
                  ${loadingFav ? 'opacity-50' : ''}`}
                title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              >
                <HeartIcon className="w-5 h-5" filled={isFavorite} />
              </button>
            )}
          </div>

          {/* Recipe Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
              {/* Category Badge */}
              {recipe.category && (
                <span className="inline-block px-4 py-1.5 rounded-full bg-forest/90 backdrop-blur-sm
                  text-white text-sm font-display font-semibold mb-3">
                  {recipe.category}
                </span>
              )}

              {/* Title */}
              <h1 className="font-display text-3xl lg:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                {recipe.name}
              </h1>

              {/* Favorite Count */}
              <div className="flex items-center gap-2 text-white/90">
                <HeartIcon className="w-5 h-5 text-tangerine-light" filled />
                <span className="font-body text-sm">
                  {favoriteCount} {favoriteCount === 1 ? 'persona' : 'personas'} ama esta receta
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="relative -mt-6 z-10">
        <div className="max-w-4xl mx-auto px-4 lg:px-8">
          {/* Main Card */}
          <div className="bg-white rounded-t-3xl shadow-soft-lg">
            {/* Tags */}
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="px-6 pt-6 flex flex-wrap gap-2">
                {recipe.tags.map((tag, idx) => (
                  <span key={idx} className="badge-honey text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Ingredients Section */}
            <div className="p-6 border-b border-cream-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-mint/30 flex items-center justify-center">
                  <span className="text-xl">🥗</span>
                </div>
                <h2 className="font-display text-xl font-bold text-cocoa">Ingredientes</h2>
              </div>

              <ul className="space-y-3">
                {recipe.ingredients.map((ing, idx) => (
                  <li key={idx} className="flex items-start gap-3 group">
                    <div className="w-6 h-6 rounded-full bg-forest/10 flex items-center justify-center flex-shrink-0 mt-0.5
                      group-hover:bg-forest group-hover:text-white transition-colors duration-200">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-body text-cocoa">{ing}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Steps Section */}
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-tangerine-50 flex items-center justify-center">
                  <span className="text-xl">👨‍🍳</span>
                </div>
                <h2 className="font-display text-xl font-bold text-cocoa">Preparación</h2>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner text="Cargando pasos..." />
                </div>
              ) : steps.length === 0 ? (
                <div className="text-center py-8 bg-cream-100 rounded-2xl">
                  <span className="text-4xl mb-2 block">📝</span>
                  <p className="font-body text-cocoa-light">No hay pasos para esta receta</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {steps.map((step, idx) => (
                    <div key={step.id} className="relative flex gap-4 lg:gap-6 animate-fade-in-up"
                      style={{ animationDelay: `${idx * 0.1}s` }}>
                      {/* Step Number */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-forest flex items-center justify-center
                          font-display font-bold text-white text-lg shadow-soft">
                          {idx + 1}
                        </div>
                        {/* Connecting Line */}
                        {idx < steps.length - 1 && (
                          <div className="w-0.5 h-full bg-forest/20 absolute left-6 top-14 -translate-x-1/2" />
                        )}
                      </div>

                      {/* Step Content */}
                      <div className="flex-1 pb-4">
                        <h3 className="font-display font-bold text-lg text-cocoa mb-2">
                          {step.title}
                        </h3>
                        <p className="font-body text-cocoa-light leading-relaxed whitespace-pre-line">
                          {step.description}
                        </p>

                        {/* Step Image */}
                        {step.imageUrl && (
                          <div className="mt-4 rounded-2xl overflow-hidden shadow-soft">
                            <img
                              src={step.imageUrl}
                              alt={`Paso ${idx + 1}`}
                              className="w-full h-48 object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-cream-100 border-t border-cream-200">
              <div className="flex items-center justify-between">
                <span className="font-handwritten text-cocoa-light text-lg">
                  ¡Buen provecho! 🍽️
                </span>

                {user && (
                  <button
                    onClick={handleToggleFavorite}
                    disabled={loadingFav}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-display font-semibold text-sm
                      transition-all duration-300
                      ${isFavorite
                        ? 'bg-tangerine text-white'
                        : 'bg-white text-tangerine border-2 border-tangerine/30 hover:border-tangerine'
                      }`}
                  >
                    <HeartIcon className="w-4 h-4" filled={isFavorite} />
                    {isFavorite ? 'En favoritos' : 'Guardar'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Spacing */}
      <div className="h-8 bg-cream" />
    </div>
  );
}

export default RecipePage;
