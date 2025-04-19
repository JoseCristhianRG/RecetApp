// Importaciones principales de React, hooks, rutas y contextos
import React, { useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RecipesContext } from '../RecipesContext';
import { CategoriesContext } from '../CategoriesContext';

// Componente para mostrar recetas por categoría
function CategoryPage() {
  // Obtiene el ID de la categoría desde la URL
  const { categoryId } = useParams();
  // Obtiene las categorías y recetas desde el contexto
  const { categories } = useContext(CategoriesContext);
  const { recipes } = useContext(RecipesContext);
  // Busca la categoría correspondiente por ID
  const categoryObj = categories.find((c) => c.id === categoryId);
  if (!categoryObj) {
    // Si no existe la categoría, muestra mensaje de error
    return <h2>Categoría no encontrada.</h2>;
  }
  // Obtiene el nombre de la categoría
  const categoryName = categoryObj.name;
  // Filtra las recetas por el nombre de la categoría
  const filtered = recipes.filter((r) => r.category === categoryName);

  if (filtered.length === 0) {
    // Si no hay recetas para la categoría, muestra mensaje
    return <h2>No se encontraron recetas para la categoría {categoryName}</h2>;
  }

  return (
    // Layout principal de la página de recetas por categoría
    <div className="p-6 py-3">
      <h1 className="text-2xl font-bold mb-4">Recetas de {categoryName}</h1>
      {/* Lista de recetas filtradas por categoría */}
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

// Exporta el componente para su uso en las rutas
export default CategoryPage;