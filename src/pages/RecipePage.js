import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { RecipesContext } from '../RecipesContext';

function RecipePage() {
  const { recipeId } = useParams();
  const { recipes } = useContext(RecipesContext);
  const recipe = recipes.find((r) => r.id === recipeId);

  if (!recipe) {
    return <h2>Receta no encontrada</h2>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{recipe.name}</h1>
      <p className="text-gray-600 mb-4">Categoría: {recipe.category}</p>
      <h2 className="text-xl font-semibold mb-2">Ingredientes</h2>
      <ul className="list-disc list-inside mb-4">
        {recipe.ingredients.map((ing, idx) => (
          <li key={idx}>{ing}</li>
        ))}
      </ul>
      <h2 className="text-xl font-semibold mb-2">Instrucciones</h2>
      <p className="mb-4">{recipe.instructions}</p>
    </div>
  );
}

export default RecipePage;