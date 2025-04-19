import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CategoriesContext } from '../CategoriesContext';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function HomePage() {
  const { categories } = useContext(CategoriesContext);
  const [latestRecipes, setLatestRecipes] = useState([]);

  useEffect(() => {
    const fetchLatestRecipes = async () => {
      const q = query(collection(db, 'recipes'), orderBy('createdAt', 'desc'), limit(5));
      const querySnapshot = await getDocs(q);
      const recipesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLatestRecipes(recipesData);
    };

    fetchLatestRecipes();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Últimas recetas añadidas</h2>
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

export default HomePage;