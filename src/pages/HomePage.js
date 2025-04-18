import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CategoriesContext } from '../CategoriesContext';

function HomePage() {
  const { categories } = useContext(CategoriesContext);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Categorías de recetas</h1>
      <ul className="space-y-2">
        {categories.map((cat) => (
          <li key={cat.id}>
            <Link
              to={`/category/${cat.id}`}
              className="block p-4 bg-white rounded shadow hover:bg-gray-50 transition"
            >
              {cat.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;