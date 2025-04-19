import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { RecipesContext } from '../RecipesContext';

function RecipePage() {
  const { recipeId } = useParams();
  const { recipes } = useContext(RecipesContext);
  const recipe = recipes.find((r) => r.id === recipeId);

  if (!recipe) {
    return <h2 className="text-center text-2xl mt-10">Receta no encontrada</h2>;
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="bg-white/90 rounded-xl shadow-lg p-8 max-w-2xl w-full">
        {recipe.image && (
          <img
            src={recipe.image}
            alt={recipe.name}
            className="w-full h-64 object-cover rounded-lg mb-6 border"
          />
        )}
        <h1 className="text-3xl font-bold mb-2 text-green-800">{recipe.name}</h1>
        <p className="text-gray-600 mb-4 italic">Categoría: {recipe.category}</p>
        <h2 className="text-xl font-semibold mb-2 text-green-700">Ingredientes</h2>
        <ul className="list-disc list-inside mb-4 pl-4">
          {recipe.ingredients.map((ing, idx) => (
            <li key={idx} className="mb-1">{ing}</li>
          ))}
        </ul>
        <h2 className="text-xl font-semibold mb-2 text-green-700">Instrucciones</h2>
        <p className="mb-2 whitespace-pre-line text-gray-800">{recipe.instructions}</p>
      </div>
    </div>
  );
}

export default RecipePage;