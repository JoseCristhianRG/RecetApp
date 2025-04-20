// Importaciones principales de React, hooks, rutas y contextos
import React, { useContext } from 'react';
import { RecipesContext } from '../RecipesContext';
import { AuthContext } from '../AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

// Componente para mostrar las recetas creadas por el usuario
function MisRecetasPage() {
  // Obtiene las recetas y el usuario autenticado desde el contexto
  const { recipes } = useContext(RecipesContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [modal, setModal] = React.useState({ open: false, recipeId: null, recipeName: '' });

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'recipes', id));
    setModal({ open: false, recipeId: null, recipeName: '' });
  };

  // Filtra las recetas creadas por el usuario actual
  const myRecipes = recipes.filter(r => r.createdBy === user?.uid);

  return (
    // Layout principal de la página de mis recetas
    <div className="p-6 py-3">
      <h1 className="text-2xl font-bold mb-4">Mis Recetas</h1>
      {/* Si no hay recetas, muestra un mensaje */}
      {myRecipes.length === 0 ? (
        <p>No has creado ninguna receta aún.</p>
      ) : (
        // Si hay recetas, muestra la lista
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
                <button
                  onClick={() => setModal({ open: true, recipeId: recipe.id, recipeName: recipe.name })}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700 transition"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Modal
        isOpen={modal.open}
        title="Eliminar receta"
        subtitle="Esta acción no se puede deshacer"
        onClose={() => setModal({ open: false, recipeId: null, recipeName: '' })}
        actions={
          <button
            onClick={() => handleDelete(modal.recipeId)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition font-bold w-full"
          >
            Confirmar eliminación
          </button>
        }
      >
        ¿Estás seguro de que deseas eliminar la receta "{modal.recipeName}"?
      </Modal>
    </div>
  );
}

// Exporta el componente para su uso en las rutas
export default MisRecetasPage;
