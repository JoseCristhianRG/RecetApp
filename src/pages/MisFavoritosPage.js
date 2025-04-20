import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { RecipesContext } from '../RecipesContext';
import RecipeCard from '../components/RecipeCard';

function MisFavoritosPage() {
  const { user } = useContext(AuthContext);
  const { recipes } = useContext(RecipesContext);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchFavorites = async () => {
      const favsSnap = await getDocs(query(collection(db, 'favorites'), where('userId', '==', user.uid)));
      setFavoriteIds(favsSnap.docs.map(doc => doc.data().recipeId));
      setLoading(false);
    };
    fetchFavorites();
  }, [user]);

  if (!user) return <div className="p-6">Debes iniciar sesión para ver tus favoritos.</div>;
  if (loading) return <div className="p-6">Cargando favoritos...</div>;

  const favoriteRecipes = recipes.filter(r => favoriteIds.includes(r.id));

  return (
    <div className="p-6 py-3">
      <h1 className="text-2xl font-bold mb-4">Mis Favoritos</h1>
      {favoriteRecipes.length === 0 ? (
        <p>No tienes recetas favoritas aún.</p>
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
