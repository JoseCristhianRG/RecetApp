// Importaciones principales de React, hooks, rutas y contextos
import React, { useContext } from 'react';
import { RecipesContext } from '../RecipesContext';
import { AuthContext } from '../AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import RecipeCard from '../components/RecipeCard';

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myRecipes.map(recipe => (
            <div key={recipe.id} className="relative group">
              <RecipeCard recipe={recipe} />
              {/* Indicador de visibilidad solo en Mis Recetas */}
              {typeof recipe.isPublic === 'boolean' && (
                <span className={`absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded shadow border z-10 ${recipe.isPublic ? 'bg-green-100 text-green-700 border-green-300' : 'bg-red-100 text-red-700 border-red-300'}`}
                  title={recipe.isPublic ? 'Pública' : 'Privada'}>
                  {recipe.isPublic ? 'Pública' : 'Privada'}
                </span>
              )}
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => navigate(`/edit-recipe/${recipe.id}`)}
                  className="px-2 py-1 bg-pantoneyellow text-pantoneblack rounded hover:bg-pantonegreen transition text-xs font-bold shadow"
                  title="Editar"
                >
                  Editar
                </button>
                <button
                  onClick={() => setModal({ open: true, recipeId: recipe.id, recipeName: recipe.name })}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700 transition text-xs font-bold shadow"
                  title="Eliminar"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
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
