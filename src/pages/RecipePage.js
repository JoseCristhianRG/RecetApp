// Importaciones principales de React, hooks, rutas y dependencias de Firebase
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RecipesContext } from '../RecipesContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { AuthContext } from '../AuthContext';
import { Link } from 'react-router-dom';

// Componente principal para mostrar la información de una receta
function RecipePage() {
  // Obtiene el ID de la receta desde la URL
  const { recipeId } = useParams();
  // Obtiene el contexto de recetas y usuario autenticado
  const { recipes } = useContext(RecipesContext);
  const { user } = React.useContext(AuthContext);
  // Busca la receta correspondiente por ID
  const recipe = recipes.find((r) => r.id === recipeId);
  // Estado para los pasos y carga
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);

  // Efecto para cargar los pasos de la receta desde Firestore
  useEffect(() => {
    async function fetchSteps() {
      if (!recipeId) return;
      // Consulta los pasos de la receta ordenados por el campo 'order'
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

  // Si no se encuentra la receta, muestra un mensaje
  if (!recipe) {
    return <h2 className="text-center text-2xl mt-10">Receta no encontrada</h2>;
  }

  return (
    // Layout principal centrado
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="bg-white w-full h-full min-h-[80vh] relative p-0 rounded shadow-none">
        {/* Sección de título y categoría */}
        <div className='relative rounded overflow-hidden'>
          {/* Imagen principal de la receta o imagen por defecto */}
          <div className="titulo-categoria-box flex flex-col items-start">
            <h1 className="text-4xl font-bold mb-1 text-green-800">{recipe.name}</h1>
            <p className="text-gray-600 mb-2 italic text-lg">Categoría: {recipe.category}</p>
          </div>
          {recipe.imageUrl ? (
            // Muestra la imagen principal si existe
            <img
              src={recipe.imageUrl}
              alt={recipe.name}
              className="w-full h-[400px] object-cover object-center m-0 p-0 border-0 rounded-none"
              style={{ display: 'block' }}
            />
          ) : (
            // Si no hay imagen, muestra la imagen por defecto
            <img
              src={require('../images/no_image.png')}
              alt="Sin imagen"
              className="w-full h-[400px] object-cover object-center m-0 p-0 border-0 rounded-none"
              style={{ display: 'block' }}
            />
          )}
        </div>
        <div className="p-6 py-3">
          {/* Botón de editar solo si el usuario es el creador */}
          {user && recipe.createdBy === user.uid && (
            <div className="flex justify-end mb-2 mt-2 pr-4">
              <Link to={`/edit-recipe/${recipe.id}`} className="text-pantonegreen hover:text-pantonebrown flex items-center gap-1" title="Editar receta">
                {/* Icono SVG de editar */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.862 3.487a2.25 2.25 0 113.182 3.182l-10.61 10.61a2 2 0 01-.878.513l-4.01 1.07a.5.5 0 01-.617-.617l1.07-4.01a2 2 0 01.513-.878l10.61-10.61z" />
                </svg>
                <span className="text-sm font-medium">Editar</span>
              </Link>
            </div>
          )}
          {/* Sección de ingredientes */}
          <h2 className="text-xl font-semibold mb-2 text-green-700">Ingredientes</h2>
          <ul className="list-disc list-inside mb-4 pl-4">
            {recipe.ingredients.map((ing, idx) => (
              <li key={idx} className="mb-1">{ing}</li>
            ))}
          </ul>
          {/* Sección de pasos */}
          <h2 className="text-xl font-semibold mb-2 text-green-700">Pasos</h2>
          {loading ? (
            // Mensaje de carga
            <p className="text-gray-500">Cargando pasos...</p>
          ) : steps.length === 0 ? (
            // Mensaje si no hay pasos
            <p className="text-gray-500">No hay pasos para esta receta.</p>
          ) : (
            // Lista de pasos ordenados
            <ol className="space-y-6 mb-4">
              {steps.map((step, idx) => (
                <li key={step.id} className="flex items-start gap-4 border-l-4 border-pantonegreen pl-4 pb-2">
                  {/* Imagen del paso si existe */}
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
          {/* Sección de etiquetas */}
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

// Exporta el componente para su uso en las rutas
export default RecipePage;