import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RecipesContext } from '../RecipesContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy, addDoc, deleteDoc } from 'firebase/firestore';
import { AuthContext } from '../AuthContext';
import { Link } from 'react-router-dom';

function RecipePage() {
  const { recipeId } = useParams();
  const { recipes } = useContext(RecipesContext);
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = React.useContext(AuthContext);
  const recipe = recipes.find((r) => r.id === recipeId);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

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
    // Contar favoritos de la receta
    async function fetchFavoriteCount() {
      if (!recipeId) return;
      const favsQuery = query(collection(db, 'favorites'), where('recipeId', '==', recipeId));
      const favsSnap = await getDocs(favsQuery);
      setFavoriteCount(favsSnap.size);
    }
    fetchFavoriteCount();
    // Saber si el usuario actual la tiene en favoritos
    async function fetchIsFavorite() {
      if (!user || !recipeId) return setIsFavorite(false);
      const favQuery = query(
        collection(db, 'favorites'),
        where('userId', '==', user.uid),
        where('recipeId', '==', recipeId)
      );
      const favSnap = await getDocs(favQuery);
      setIsFavorite(!favSnap.empty);
    }
    fetchIsFavorite();
  }, [recipeId, user]);

  const handleToggleFavorite = async () => {
    if (!user) return;
    const favQuery = query(
      collection(db, 'favorites'),
      where('userId', '==', user.uid),
      where('recipeId', '==', recipe.id)
    );
    const favSnap = await getDocs(favQuery);
    if (!favSnap.empty) {
      // Eliminar favorito
      await deleteDoc(favSnap.docs[0].ref);
      setFavoriteCount(favoriteCount - 1);
      setIsFavorite(false);
    } else {
      // Agregar favorito
      await addDoc(collection(db, 'favorites'), {
        userId: user.uid,
        recipeId: recipe.id,
        addedAt: new Date()
      });
      setFavoriteCount(favoriteCount + 1);
      setIsFavorite(true);
    }
    // Forzar actualización visual si se usa en otros lugares
  };

  if (!recipe) {
    return <h2 className="text-center text-2xl mt-10">Receta no encontrada</h2>;
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
          {recipe.imageUrl ? (
            <img
              src={recipe.imageUrl}
              alt={recipe.name}
              className="w-full h-[400px] object-cover object-center m-0 p-0 border-0 rounded-none"
              style={{ display: 'block' }}
            />
          ) : (
            <img
              src={require('../images/no_image.png')}
              alt="Sin imagen"
              className="w-full h-[400px] object-cover object-center m-0 p-0 border-0 rounded-none"
              style={{ display: 'block' }}
            />
          )}
        </div>
        <div className="p-6 py-3">
          {/* Icono de editar si el usuario es el creador, justo debajo de la imagen a la derecha */}
          {user && recipe.createdBy === user.uid && (
            <div className="flex justify-end mb-7">
              <Link to={`/edit-recipe/${recipe.id}`} className="text-pantonegreen hover:text-pantonebrown flex items-center gap-1" title="Editar receta">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.862 3.487a2.25 2.25 0 113.182 3.182l-10.61 10.61a2 2 0 01-.878.513l-4.01 1.07a.5.5 0 01-.617-.617l1.07-4.01a2 2 0 01.513-.878l10.61-10.61z" />
                </svg>
                <span className="text-sm font-medium">Editar</span>
              </Link>
            </div>
          )}
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="mb-3 mt-2 flex items-center justify-between w-full">
              <div className="flex flex-wrap items-center gap-2">
                {recipe.tags.map((tag, idx) => (
                  <span key={idx} className="bg-pantoneyellow text-pantoneblack px-2 py-1 rounded text-xs">{tag}</span>
                ))}
              </div>
              <button
                type="button"
                onClick={handleToggleFavorite}
                className="inline-flex items-center gap-1 px-3 py-1 font-semibold rounded-full shadow transition ml-4 cursor-pointer"
                tabIndex={-1}
                style={{
                  '--tw-ring-offset-shadow': 'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)',
                  '--tw-ring-shadow': 'var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color)',
                  boxShadow: 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)',
                  '--tw-ring-opacity': '1',
                  '--tw-ring-color': '#ef4444',
                  alignItems: 'center',
                  padding: '5px 10px',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill={isFavorite ? '#F43F5E' : 'none'}
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#F43F5E"
                  className="w-5 h-5"
                  style={{ top: '2px', left: '-1px', position: 'relative' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 7.592c0-2.386-1.93-4.316-4.316-4.316-1.31 0-2.617.617-3.436 1.617-.82-1-2.127-1.617-3.436-1.617-2.386 0-4.316 1.93-4.316 4.316 0 4.09 7.752 9.408 7.752 9.408s7.752-5.318 7.752-9.408z" />
                </svg>
                {favoriteCount}
              </button>
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
        </div>
      </div>
    </div>
  );
}

export default RecipePage;