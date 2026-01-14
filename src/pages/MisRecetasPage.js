import React, { useContext, useState } from 'react';
import { RecipesContext } from '../RecipesContext';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import RecipeCard from '../components/RecipeCard';
import { EmptyState } from '../components/ui';
import { BookIcon, PencilIcon, TrashIcon } from '../components/icons';

function MisRecetasPage() {
  const { recipes } = useContext(RecipesContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [modal, setModal] = useState({ open: false, recipeId: null, recipeName: '' });

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'recipes', id));
    setModal({ open: false, recipeId: null, recipeName: '' });
  };

  const myRecipes = recipes.filter(r => r.createdBy === user?.uid);

  return (
    <div className="min-h-screen animate-fade-in">
      {/* Header Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-mint/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-honey/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 pt-8 pb-6 lg:px-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-forest flex items-center justify-center">
              <BookIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-display text-2xl lg:text-3xl font-bold text-cocoa">
                Mis Recetas
              </h1>
              <p className="font-body text-cocoa-light">
                {myRecipes.length} {myRecipes.length === 1 ? 'receta creada' : 'recetas creadas'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {myRecipes.length === 0 ? (
            <div className="py-12">
              <EmptyState
                icon={<BookIcon className="w-20 h-20" />}
                title="Sin recetas aún"
                description="Aún no has creado ninguna receta. Empieza a compartir tus creaciones culinarias."
                action
                actionText="Crear receta"
                onAction={() => navigate('/add')}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myRecipes.map((recipe, index) => (
                <div
                  key={recipe.id}
                  className="relative group animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <RecipeCard recipe={recipe} />

                  {/* Visibility Badge */}
                  {typeof recipe.isPublic === 'boolean' && (
                    <span className={`absolute top-3 left-3 z-20 px-3 py-1 rounded-full text-xs font-display font-semibold
                      ${recipe.isPublic
                        ? 'bg-mint/90 backdrop-blur-sm text-forest-dark'
                        : 'bg-cocoa/80 backdrop-blur-sm text-white'
                      }`}
                    >
                      {recipe.isPublic ? 'Pública' : 'Privada'}
                    </span>
                  )}

                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigate(`/edit-recipe/${recipe.id}`);
                      }}
                      className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-soft
                        text-forest hover:bg-white hover:scale-105 transition-all duration-200"
                      title="Editar"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setModal({ open: true, recipeId: recipe.id, recipeName: recipe.name });
                      }}
                      className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-soft
                        text-tangerine hover:bg-white hover:scale-105 transition-all duration-200"
                      title="Eliminar"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={modal.open}
        title="Eliminar receta"
        subtitle="Esta acción no se puede deshacer"
        onClose={() => setModal({ open: false, recipeId: null, recipeName: '' })}
        actions={
          <div className="flex gap-3">
            <button
              onClick={() => setModal({ open: false, recipeId: null, recipeName: '' })}
              className="flex-1 btn-secondary py-3"
            >
              Cancelar
            </button>
            <button
              onClick={() => handleDelete(modal.recipeId)}
              className="flex-1 btn px-6 py-3 rounded-full bg-tangerine text-white hover:bg-tangerine-dark focus:ring-tangerine"
            >
              Eliminar
            </button>
          </div>
        }
      >
        <p className="font-body text-cocoa-light">
          ¿Estás seguro de que deseas eliminar la receta <span className="font-semibold text-cocoa">"{modal.recipeName}"</span>?
        </p>
      </Modal>
    </div>
  );
}

export default MisRecetasPage;
