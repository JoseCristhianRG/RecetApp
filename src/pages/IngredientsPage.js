import React, { useState, useContext } from 'react';
import { IngredientsContext } from '../IngredientsContext';

function IngredientsPage() {
  const { ingredients, addIngredient } = useContext(IngredientsContext);
  const [newIngredient, setNewIngredient] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newIngredient.trim()) {
      try {
        await addIngredient(newIngredient);
        setNewIngredient('');
      } catch (err) {
        console.error('Error al agregar ingrediente:', err);
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gestión de Ingredientes</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex items-center">
          <input
            type="text"
            value={newIngredient}
            onChange={(e) => setNewIngredient(e.target.value)}
            placeholder="Nombre del ingrediente"
            required
            className="flex-grow p-2 border rounded mr-2"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Agregar Ingrediente
          </button>
        </div>
      </form>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Ingrediente</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((ing) => (
            <tr key={ing.id}>
              <td className="py-2 px-4 border-b">{ing.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default IngredientsPage;