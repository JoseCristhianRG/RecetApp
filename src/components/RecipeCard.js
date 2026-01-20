import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { HeartIcon, StarIcon } from './icons';

function RecipeCard({ recipe }) {
  const { user } = useContext(AuthContext);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFav, setLoadingFav] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Check if user has favorited this recipe
  React.useEffect(() => {
    if (!user || !recipe?.id) return;
    const checkFavorite = async () => {
      const favQuery = query(
        collection(db, 'favorites'),
        where('userId', '==', user.uid),
        where('recipeId', '==', recipe.id)
      );
      const favSnap = await getDocs(favQuery);
      setIsFavorite(!favSnap.empty);
    };
    checkFavorite();
  }, [user, recipe?.id]);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user || loadingFav) return;

    setLoadingFav(true);
    try {
      const favQuery = query(
        collection(db, 'favorites'),
        where('userId', '==', user.uid),
        where('recipeId', '==', recipe.id)
      );
      const favSnap = await getDocs(favQuery);

      if (!favSnap.empty) {
        await deleteDoc(favSnap.docs[0].ref);
        setIsFavorite(false);
      } else {
        await addDoc(collection(db, 'favorites'), {
          userId: user.uid,
          recipeId: recipe.id,
          addedAt: new Date()
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
    setLoadingFav(false);
  };

  if (!recipe) return null;

  return (
    <Link
      to={`/recipe/${recipe.id}`}
      className="group block opacity-0 animate-fade-in-up"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <article className="card-interactive h-full flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-recipe overflow-hidden bg-cream-200">
          {/* Recipe Image */}
          <img
            src={recipe.imageUrl || require('../images/no_image.png')}
            alt={recipe.name}
            className={`w-full h-full object-cover transition-transform duration-500 ease-out
              ${isHovered ? 'scale-110' : 'scale-100'}`}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-cocoa/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Category Badge */}
          {recipe.category && (
            <div className="absolute top-3 left-3 z-10">
              <span className="badge-forest shadow-soft backdrop-blur-sm bg-forest/90 text-white">
                {recipe.category}
              </span>
            </div>
          )}

          {/* Favorite Button */}
          {user && (
            <button
              onClick={handleToggleFavorite}
              disabled={loadingFav}
              className={`absolute top-3 right-3 z-10 heart-btn
                ${isFavorite ? 'active' : ''}
                ${loadingFav ? 'opacity-50 cursor-wait' : ''}`}
              aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              <HeartIcon
                className={`w-5 h-5 transition-all duration-200
                  ${isFavorite ? 'text-white' : 'text-tangerine'}`}
                filled={isFavorite}
              />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Title */}
          <h3 className="font-display font-bold text-lg text-cocoa line-clamp-2 mb-2 group-hover:text-forest transition-colors duration-200">
            {recipe.name}
          </h3>

          {/* Rating */}
          {recipe.averageRating > 0 && (
            <div className="flex items-center gap-1.5 mb-2">
              <StarIcon className="w-4 h-4 text-honey" filled />
              <span className="font-display font-semibold text-sm text-cocoa">
                {recipe.averageRating.toFixed(1)}
              </span>
              <span className="text-cocoa-lighter text-xs">
                ({recipe.totalReviews || 0})
              </span>
            </div>
          )}

          {/* Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-auto pt-3">
              {recipe.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="badge-honey text-xs"
                >
                  {tag}
                </span>
              ))}
              {recipe.tags.length > 3 && (
                <span className="badge bg-cream-200 text-cocoa-light text-xs">
                  +{recipe.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Hover Indicator Line */}
        <div className={`h-1 bg-gradient-tangerine transition-all duration-300 ease-out
          ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        />
      </article>
    </Link>
  );
}

export default RecipeCard;
