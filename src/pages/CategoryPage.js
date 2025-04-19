import React, { useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RecipesContext } from '../RecipesContext';
import { CategoriesContext } from '../CategoriesContext';

function CategoryPage() {
  const { categoryId } = useParams();
  const { categories } = useContext(CategoriesContext);
  const { recipes } = useContext(RecipesContext);
  // Find the category object by ID
  const categoryObj = categories.find((c) => c.id === categoryId);
  if (!categoryObj) {
    return <h2>Categoría no encontrada.</h2>;
  }
  const categoryName = categoryObj.name;
  // Filter recipes by category name
  const filtered = recipes.filter((r) => r.category === categoryName);

  if (filtered.length === 0) {
    return <h2>No se encontraron recetas para la categoría {categoryName}</h2>;
  }

  return (
    <div className="p-6 py-3">
      <h1 className="text-2xl font-bold mb-4">Recetas de {categoryName}</h1>
      <ul className="space-y-2">
        {filtered.map((recipe) => (
          <li key={recipe.id}>
            <Link
              to={`/recipe/${recipe.id}`}
              className="block p-4 bg-white rounded shadow hover:bg-gray-50 transition"
            >
              {recipe.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryPage;