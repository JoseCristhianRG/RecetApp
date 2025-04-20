import React from 'react';
import { Link } from 'react-router-dom';
import Modal from './Modal';
import { AuthContext } from '../AuthContext';
import { db } from '../firebase';
import { doc, setDoc, deleteDoc, getDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';

function RecipeCard({ recipe }) {
  const { user } = React.useContext(AuthContext);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [loadingFav, setLoadingFav] = React.useState(false);

  React.useEffect(() => {
    if (!user && !recipe.id) return;
    // Comprobar si el usuario ha marcado como favorito
    const checkFavorite = async () => {
      if (!user) {
        setIsFavorite(false);
        return;
      }
      const favQuery = query(
        collection(db, 'favorites'),
        where('userId', '==', user.uid),
        where('recipeId', '==', recipe.id)
      );
      const favSnap = await getDocs(favQuery);
      setIsFavorite(!favSnap.empty);
    };
    checkFavorite();
  }, [user, recipe.id]);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoadingFav(true);
    const favQuery = query(
      collection(db, 'favorites'),
      where('userId', '==', user.uid),
      where('recipeId', '==', recipe.id)
    );
    const favSnap = await getDocs(favQuery);
    if (!favSnap.empty) {
      // Eliminar favorito
      await deleteDoc(favSnap.docs[0].ref);
      setIsFavorite(false);
    } else {
      // Agregar favorito
      await addDoc(collection(db, 'favorites'), {
        userId: user.uid,
        recipeId: recipe.id,
        addedAt: new Date()
      });
      setIsFavorite(true);
    }
    setLoadingFav(false);
  };

  return (
    <>
      <Link
        to={`/recipe/${recipe.id}`}
        className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full transition hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-pantonegreen group relative"
        tabIndex={0}
      >
        <img
          src={recipe.imageUrl || require('../images/no_image.png')}
          alt={recipe.name}
          className="w-full h-40 object-cover object-center bg-gray-100 group-hover:scale-105 transition-transform"
        />
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-bold text-pantoneblack line-clamp-1">{recipe.name}</h3>
            {user && (
              <button
                type="button"
                onClick={handleToggleFavorite}
                className="ml-2"
                aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                disabled={loadingFav}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill={isFavorite ? '#F43F5E' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="#F43F5E" className="w-7 h-7 drop-shadow">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 7.592c0-2.386-1.93-4.316-4.316-4.316-1.31 0-2.617.617-3.436 1.617-.82-1-2.127-1.617-3.436-1.617-2.386 0-4.316 1.93-4.316 4.316 0 4.09 7.752 9.408 7.752 9.408s7.752-5.318 7.752-9.408z" />
                </svg>
              </button>
            )}
          </div>
          <p className="text-xs text-pantonebrown mb-2 line-clamp-2">{recipe.description}</p>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {recipe.category && (
              <span className="text-xs bg-pantoneyellow text-pantoneblack rounded px-2 py-0.5 font-semibold">{recipe.category}</span>
            )}
            {Array.isArray(recipe.tags) && recipe.tags.length > 0 && recipe.tags.map((tag, idx) => (
              <span key={idx} className="text-xs bg-pantonegreen text-white rounded px-2 py-0.5">#{tag}</span>
            ))}
          </div>
          <button
            type="button"
            onClick={e => {
              e.preventDefault();
              setModalOpen(true);
            }}
            className="text-xs text-pantonegreen underline absolute bottom-3 right-3"
          >
            Ver ingredientes
          </button>
        </div>
      </Link>
      <Modal
        isOpen={modalOpen}
        title="Ingredientes necesarios"
        onClose={() => setModalOpen(false)}
        actions={
          <button
            onClick={() => setModalOpen(false)}
            className="w-full px-4 py-2 bg-pantonegreen text-white rounded hover:bg-pantoneyellow hover:text-pantoneblack transition font-bold mt-4"
          >
            Listo
          </button>
        }
      >
        <ul className="list-disc pl-5">
          {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 ? (
            recipe.ingredients.map((ing, idx) => (
              <li key={idx}>{ing}</li>
            ))
          ) : (
            <li>No hay ingredientes.</li>
          )}
        </ul>
      </Modal>
    </>
  );
}

export default RecipeCard;
