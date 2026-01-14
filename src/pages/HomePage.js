// Importaciones principales de React, hooks, contextos y dependencias de Firebase
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CategoriesContext } from '../CategoriesContext';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import RecipeCard from '../components/RecipeCard';
import CategoryCard from '../components/CategoryCard';

// Componente principal de la página de inicio
function HomePage() {
  // Obtiene las categorías desde el contexto
  const { categories } = useContext(CategoriesContext);
  // Estado para las últimas recetas
  const [latestRecipes, setLatestRecipes] = useState([]);

  const navigate = useNavigate();

  // Efecto para obtener las últimas recetas públicas y publicadas
  useEffect(() => {
    const fetchLatestRecipes = async () => {
      const q = query(collection(db, 'recipes'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      // Filtrar solo recetas públicas y publicadas, y limitar a 5
      const recipesData = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter(r => r.isPublic && r.status === 'published')
        .slice(0, 5);
      setLatestRecipes(recipesData);
    };

    fetchLatestRecipes();
  }, []);

  return (
    // Layout principal de la página de inicio
    <div className="p-6 animate-fade-in">
      <h2 className="text-xl font-bold mb-4">Últimas recetas añadidas</h2>
      {/* Lista de las últimas recetas con tarjetas visuales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {latestRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
      <h1 className="text-2xl font-bold mt-8 mb-4">Categorías de recetas</h1>
      {/* Lista de categorías */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} onClick={() => navigate(`/category/${cat.id}`)} />
        ))}
      </div>
    </div>
  );
}

// Exporta el componente para su uso en las rutas
export default HomePage;