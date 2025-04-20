import React from 'react';
import { Link } from 'react-router-dom';

function RecipeCard({ recipe }) {
  return (
    <Link
      to={`/recipe/${recipe.id}`}
      className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full transition hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-pantonegreen group"
      tabIndex={0}
    >
      <img
        src={recipe.imageUrl || require('../images/no_image.png')}
        alt={recipe.name}
        className="w-full h-40 object-cover object-center bg-gray-100 group-hover:scale-105 transition-transform"
      />
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-pantoneblack mb-1 line-clamp-1">{recipe.name}</h3>
        <p className="text-xs text-pantonebrown mb-2 line-clamp-2">{recipe.description}</p>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {recipe.category && (
            <span className="text-xs bg-pantoneyellow text-pantoneblack rounded px-2 py-0.5 font-semibold">{recipe.category}</span>
          )}
          {Array.isArray(recipe.tags) && recipe.tags.length > 0 && recipe.tags.map((tag, idx) => (
            <span key={idx} className="text-xs bg-pantonegreen text-white rounded px-2 py-0.5">#{tag}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export default RecipeCard;
