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
      <div className="p-6 animate-fade-in">
        <EmptyState
          icon={<HeartIcon className="w-20 h-20" />}
          title="Inicia sesion"
          description="Debes iniciar sesion para ver tus recetas favoritas."
          action
          actionText="Iniciar sesion"
          onAction={() => navigate('/login')}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner size="lg" text="Cargando favoritos..." />
      </div>
    );
  }

  const favoriteRecipes = recipes.filter(r => favoriteIds.includes(r.id));

  return (
    <div className="p-6 py-3 animate-fade-in">
      <h1 className="text-2xl font-bold mb-4">Mis Favoritos</h1>
      {favoriteRecipes.length === 0 ? (
        <EmptyState
          icon={<HeartIcon className="w-20 h-20" />}
          title="Sin favoritos"
          description="Aun no has agregado ninguna receta a favoritos. Explora recetas y marca las que mas te gusten."
          action
          actionText="Explorar recetas"
          onAction={() => navigate('/')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteRecipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MisFavoritosPage;
