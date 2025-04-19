import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RecipesContext } from '../RecipesContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { AuthContext } from '../AuthContext';
import { Link } from 'react-router-dom';

function RecipePage() {
  const { recipeId } = useParams();
  const { recipes } = useContext(RecipesContext);
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = React.useContext(AuthContext);
  const recipe = recipes.find((r) => r.id === recipeId);

  useEffect(() => {
    async function fetchSteps() {
      if (!recipeId) return;
      const q = query(
        collection(db, 'steps'),
        where('recipeId', '==', recipeId),
        orderBy('order', 'asc')
      );
      const snap = await getDocs(q);
      setSteps(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }
    fetchSteps();
  }, [recipeId]);

  if (!recipe) {
    return <h2 className="text-center text-2xl mt-10">Receta no encontrada</h2>;
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="bg-white p-8 max-w-2xl w-full relative">
        {/* Icono de editar si el usuario es el creador */}
        {user && recipe.createdBy === user.uid && (
          <Link to={`/edit-recipe/${recipe.id}`} className="absolute top-4 right-4 text-pantonegreen hover:text-pantonebrown" title="Editar receta">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L5 12.828a2 2 0 010-2.828L9 13z" />
            </svg>
          </Link>
        )}
        {recipe.imageUrl && (
          <img
            src={recipe.imageUrl}
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
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-pantonebrown mb-1 text-green-700">Etiquetas</h3>
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag, idx) => (
                <span key={idx} className="bg-pantoneyellow text-pantoneblack px-2 py-1 rounded text-xs">{tag}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecipePage;