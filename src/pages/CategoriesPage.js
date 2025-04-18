import React, { useState, useContext } from 'react';
import { CategoriesContext } from '../CategoriesContext';
import { RecipesContext } from '../RecipesContext';

function CategoriesPage() {
  const { categories, addCategory } = useContext(CategoriesContext);
  const { recipes } = useContext(RecipesContext);
  const [newCategory, setNewCategory] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newCategory.trim()) {
      try {
        await addCategory(newCategory);
        setNewCategory('');
      } catch (err) {
        console.error('Error al agregar categoría:', err);
      }
    }
  };
  // Genera categorías únicas basadas en las recetas existentes
  const handleGenerate = async () => {
    try {
      const recipeCats = [...new Set(recipes.map((r) => r.category))];
      for (const name of recipeCats) {
        if (!categories.some((c) => c.name === name)) {
          await addCategory(name);
        }
      }
    } catch (err) {
      console.error('Error generando categorías:', err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gestión de Categorías</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex items-center">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Nombre de la categoría"
            required
            className="flex-grow p-2 border rounded mr-2"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Agregar Categoría
          </button>
        </div>
      </form>
      <div className="mb-4">
        <button
          type="button"
          onClick={handleGenerate}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Generar categorías
        </button>
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Nombre</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td className="py-2 px-4 border-b">{cat.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CategoriesPage;