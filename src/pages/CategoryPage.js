import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RecipesContext } from '../RecipesContext';
import { CategoriesContext } from '../CategoriesContext';
import RecipeCard from '../components/RecipeCard';
import { EmptyState } from '../components/ui';
import { ChefHatIcon } from '../components/icons';

function CategoryPage() {
  const { categoryId } = useParams();
  const { categories } = useContext(CategoriesContext);
  const { recipes } = useContext(RecipesContext);
  const navigate = useNavigate();

  const categoryObj = categories.find((c) => c.id === categoryId);

  if (!categoryObj) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <EmptyState
          icon={<ChefHatIcon className="w-20 h-20" />}
          title="Categoría no encontrada"
          description="La categoría que buscas no existe o ha sido eliminada."
          action
          actionText="Ver todas las categorías"
          onAction={() => navigate('/')}
        />
      </div>
    );
  }

  const categoryName = categoryObj.name;
  const filtered = recipes.filter((r) => r.category === categoryName && r.isPublic && r.status === 'published');

  return (
    <div className="min-h-screen animate-fade-in">
      {/* Category Header */}
      <section className="relative overflow-hidden">
        {/* Background */}
        {categoryObj.image ? (
          <div className="relative h-48 lg:h-64">
            <img
              src={categoryObj.image}
              alt={categoryName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cocoa/70 via-cocoa/30 to-transparent" />
          </div>
        ) : (
          <div className="h-48 lg:h-64 bg-gradient-forest" />
        )}

        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 left-4 z-10 p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-soft
            text-cocoa hover:bg-white transition-all duration-300 hover:scale-105"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Category Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-7xl mx-auto">
            <span className="font-handwritten text-white/80 text-xl">Categoría</span>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">
              {categoryName}
            </h1>
            <p className="font-body text-white/80 mt-1">
              {filtered.length} {filtered.length === 1 ? 'receta' : 'recetas'}
            </p>
          </div>
        </div>
      </section>

      {/* Recipes Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {filtered.length === 0 ? (
            <div className="py-12">
              <EmptyState
                icon={<ChefHatIcon className="w-20 h-20" />}
                title="Sin recetas aún"
                description={`Aún no hay recetas publicadas en ${categoryName}.`}
                action
                actionText="Agregar receta"
                onAction={() => navigate('/add')}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((recipe, index) => (
                <div
                  key={recipe.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default CategoryPage;
