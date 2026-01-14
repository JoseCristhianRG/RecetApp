import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { RecipesContext } from '../RecipesContext';
import RecipeCard from '../components/RecipeCard';
import { LoadingSpinner, EmptyState } from '../components/ui';
import { HeartIcon } from '../components/icons';

function MisFavoritosPage() {
  const { user } = useContext(AuthContext);
  const { recipes } = useContext(RecipesContext);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const fetchFavorites = async () => {
      const favsSnap = await getDocs(query(collection(db, 'favorites'), where('userId', '==', user.uid)));
      setFavoriteIds(favsSnap.docs.map(doc => doc.data().recipeId));
      setLoading(false);
    };
    fetchFavorites();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <EmptyState
          icon={<HeartIcon className="w-20 h-20" />}
          title="Inicia sesión"
          description="Debes iniciar sesión para ver tus recetas favoritas."
          action
          actionText="Iniciar sesión"
          onAction={() => navigate('/login')}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <LoadingSpinner size="lg" text="Cargando favoritos..." />
      </div>
    );
  }

  const favoriteRecipes = recipes.filter(r => favoriteIds.includes(r.id));

  return (
    <div className="min-h-screen animate-fade-in">
      {/* Header Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-64 h-64 bg-tangerine/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-mint/15 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 pt-8 pb-6 lg:px-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-tangerine flex items-center justify-center">
              <HeartIcon className="w-6 h-6 text-white" filled />
            </div>
            <div>
              <h1 className="font-display text-2xl lg:text-3xl font-bold text-cocoa">
                Mis Favoritos
              </h1>
              <p className="font-body text-cocoa-light">
                {favoriteRecipes.length} {favoriteRecipes.length === 1 ? 'receta guardada' : 'recetas guardadas'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {favoriteRecipes.length === 0 ? (
            <div className="py-12">
              <EmptyState
                icon={<HeartIcon className="w-20 h-20" />}
                title="Sin favoritos aún"
                description="Aún no has agregado ninguna receta a favoritos. Explora recetas y marca las que más te gusten."
                action
                actionText="Explorar recetas"
                onAction={() => navigate('/')}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteRecipes.map((recipe, index) => (
                <div
                  key={recipe.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default MisFavoritosPage;
