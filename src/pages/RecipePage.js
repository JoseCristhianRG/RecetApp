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
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="bg-white w-full h-full min-h-[80vh] relative p-0 rounded shadow-none">
        {/* Título de la receta */}
        <div className='relative rounded overflow-hidden'>
          {/* Imagen de la receta */}
          <div className="titulo-categoria-box flex flex-col items-start">
            <h1 className="text-4xl font-bold mb-1 text-green-800">{recipe.name}</h1>
            <p className="text-gray-600 mb-2 italic text-lg">Categoría: {recipe.category}</p>
          </div>
          {recipe.imageUrl && (
            <img
              src={recipe.imageUrl}
              alt={recipe.name}
              className="w-full h-[400px] object-cover object-center m-0 p-0 border-0 rounded-none"
              style={{ display: 'block' }}
            />
          )}
        </div>
        <div className="p-6 py-3">
          {/* Icono de editar si el usuario es el creador, justo debajo de la imagen a la derecha */}
          {user && recipe.createdBy === user.uid && (
            <div className="flex justify-end mb-2 mt-2 pr-4">
              <Link to={`/edit-recipe/${recipe.id}`} className="text-pantonegreen hover:text-pantonebrown flex items-center gap-1" title="Editar receta">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.862 3.487a2.25 2.25 0 113.182 3.182l-10.61 10.61a2 2 0 01-.878.513l-4.01 1.07a.5.5 0 01-.617-.617l1.07-4.01a2 2 0 01.513-.878l10.61-10.61z" />
                </svg>
                <span className="text-sm font-medium">Editar</span>
              </Link>
            </div>
          )}
          <h2 className="text-xl font-semibold mb-2 text-green-700">Ingredientes</h2>
          <ul className="list-disc list-inside mb-4 pl-4">
            {recipe.ingredients.map((ing, idx) => (
              <li key={idx} className="mb-1">{ing}</li>
            ))}
          </ul>
          <h2 className="text-xl font-semibold mb-2 text-green-700">Pasos</h2>
          {loading ? (
            <p className="text-gray-500">Cargando pasos...</p>
          ) : steps.length === 0 ? (
            <p className="text-gray-500">No hay pasos para esta receta.</p>
          ) : (
            <ol className="space-y-6 mb-4">
              {steps.map((step, idx) => (
                <li key={step.id} className="flex items-start gap-4 border-l-4 border-pantonegreen pl-4 pb-2">
                  {step.imageUrl && (
                    <img src={step.imageUrl} alt={`Paso ${idx + 1}`} className="w-20 h-20 object-cover rounded shadow" />
                  )}
                  <div>
                    <h3 className="font-bold text-lg text-pantonegreen mb-1">Paso {idx + 1}: {step.title}</h3>
                    <p className="text-gray-800 whitespace-pre-line">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {recipe.tags.map((tag, idx) => (
                <span key={idx} className="bg-pantoneyellow text-pantoneblack px-2 py-1 rounded text-xs">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecipePage;