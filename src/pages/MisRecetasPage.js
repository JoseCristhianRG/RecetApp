import React, { useContext } from 'react';
import { RecipesContext } from '../RecipesContext';
import { AuthContext } from '../AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function MisRecetasPage() {
  const { recipes } = useContext(RecipesContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const myRecipes = recipes.filter(r => r.createdBy === user?.uid);

  return (
    <div className="p-6 py-3">
      <h1 className="text-2xl font-bold mb-4">Mis Recetas</h1>
      {myRecipes.length === 0 ? (
        <p>No has creado ninguna receta aún.</p>
      ) : (
        <ul className="space-y-3">
          {myRecipes.map(recipe => (
            <li key={recipe.id} className="bg-white/80 rounded shadow p-3 flex items-center justify-between">
              <div className="flex items-center">
                {recipe.imageUrl && (
                  <img src={recipe.imageUrl} alt={recipe.name} className="w-12 h-12 object-cover rounded-full mr-3 border-2 border-pantonebrown" />
                )}
                <Link to={`/recipe/${recipe.id}`} className="text-lg font-bold text-pantoneblack hover:underline">
                  {recipe.name}
                </Link>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/edit-recipe/${recipe.id}`)}
                  className="px-2 py-1 bg-pantoneyellow text-pantoneblack rounded hover:bg-pantonegreen transition"
                >
                  Editar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MisRecetasPage;
