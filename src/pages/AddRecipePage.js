import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecipesContext } from '../RecipesContext';
import { CategoriesContext } from '../CategoriesContext';
import { IngredientsContext } from '../IngredientsContext';

function AddRecipePage() {
  const { addRecipe } = useContext(RecipesContext);
  // Load available categories and ingredients from context
  const { categories } = useContext(CategoriesContext);
  const { ingredients: availableIngredients } = useContext(IngredientsContext);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [instructions, setInstructions] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const recipeData = {
      name: name.trim(),
      category: category.trim(),
      ingredients: selectedIngredients,
      instructions: instructions.trim(),
    };
    // Add to Firestore and navigate to its detail page
    try {
      const id = await addRecipe(recipeData);
      navigate(`/recipe/${id}`);
    } catch (err) {
      console.error('Error al agregar receta:', err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Agregar nueva receta</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre de la receta */}
        <div>
          <label className="block font-medium mb-1">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        {/* Selección de categoría */}
        <div>
          <label className="block font-medium mb-1">Categoría</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full p-2 border rounded"
          >
            <option value="" disabled>-- Selecciona una categoría --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>
        {/* Selección de ingredientes */}
        <div>
          <label className="block font-medium mb-1">Ingredientes</label>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-auto border p-2 rounded">
            {availableIngredients.map((ing) => (
              <label key={ing.id} className="inline-flex items-center">
                <input
                  type="checkbox"
                  value={ing.name}
                  checked={selectedIngredients.includes(ing.name)}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedIngredients((prev) =>
                      prev.includes(value)
                        ? prev.filter((i) => i !== value)
                        : [...prev, value]
                    );
                  }}
                  className="mr-2"
                />
                {ing.name}
              </label>
            ))}
          </div>
        </div>
        {/* Instrucciones */}
        <div>
          <label className="block font-medium mb-1">Instrucciones</label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
            className="w-full p-2 border rounded h-32"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Agregar receta
        </button>
      </form>
    </div>
  );
}

export default AddRecipePage;