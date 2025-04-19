// Importaciones principales de React, hooks, contextos y dependencias de Firebase
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CategoriesContext } from '../CategoriesContext';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

// Componente principal de la página de inicio
function HomePage() {
  // Obtiene las categorías desde el contexto
  const { categories } = useContext(CategoriesContext);
  // Estado para las últimas recetas
  const [latestRecipes, setLatestRecipes] = useState([]);

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
    <div className="p-6 py-3">
      <h2 className="text-xl font-bold mb-4">Últimas recetas añadidas</h2>
      {/* Lista de las últimas recetas */}
      <ul className="grid grid-cols-1 gap-3">
        {latestRecipes.map((recipe) => (
          <li key={recipe.id} className="bg-white/80 rounded shadow p-3 flex items-center">
            {recipe.image && (
              <img
                src={recipe.image}
                alt={recipe.name}
                className="w-12 h-12 object-cover rounded-full mr-3 border-2 border-pantonebrown"
              />
            )}
            <div>
              <Link to={`/recipe/${recipe.id}`} className="text-base font-bold text-pantoneblack hover:underline">
                {recipe.name}
              </Link>
              <p className="text-xs text-pantonebrown">{recipe.description}</p>
            </div>
          </li>
        ))}
      </ul>

      <h1 className="text-2xl font-bold mt-8 mb-4">Categorías de recetas</h1>
      {/* Lista de categorías */}
      <ul className="grid grid-cols-1 gap-3">
        {categories.map((cat) => (
          <li key={cat.id} className="bg-white/80 rounded shadow p-3 flex items-center">
            {cat.image && (
              <img
                src={cat.image}
                alt={cat.name}
                className="w-12 h-12 object-cover rounded-full mr-3 border-2 border-pantonebrown"
              />
            )}
            <Link to={`/category/${cat.id}`} className="text-lg font-bold text-pantoneblack hover:underline">
              {cat.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Exporta el componente para su uso en las rutas
export default HomePage;