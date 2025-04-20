import React from 'react';
import { Link } from 'react-router-dom';
import Modal from './Modal';

function RecipeCard({ recipe }) {
  const [modalOpen, setModalOpen] = React.useState(false);
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
          <h3 className="text-lg font-bold text-pantoneblack mb-1 line-clamp-1">{recipe.name}</h3>
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
