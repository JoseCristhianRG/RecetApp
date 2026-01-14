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
      <div className="p-6 animate-fade-in">
        <EmptyState
          icon={<ChefHatIcon className="w-20 h-20" />}
          title="Categoria no encontrada"
          description="La categoria que buscas no existe o ha sido eliminada."
          action
          actionText="Ver todas las categorias"
          onAction={() => navigate('/')}
        />
      </div>
    );
  }

  const categoryName = categoryObj.name;
  const filtered = recipes.filter((r) => r.category === categoryName && r.isPublic && r.status === 'published');

  if (filtered.length === 0) {
    return (
      <div className="p-6 animate-fade-in">
        <h1 className="text-2xl font-bold mb-4">Recetas de {categoryName}</h1>
        <EmptyState
          icon={<ChefHatIcon className="w-20 h-20" />}
          title="Sin recetas"
          description={`Aun no hay recetas publicadas en la categoria ${categoryName}.`}
          action
          actionText="Agregar receta"
          onAction={() => navigate('/add')}
        />
      </div>
    );
  }

  return (
    <div className="p-6 py-3 animate-fade-in">
      <h1 className="text-2xl font-bold mb-4">Recetas de {categoryName}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}

export default CategoryPage;
