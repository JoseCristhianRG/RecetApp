import React from 'react';

function CategoryCard({ category, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col items-center h-full transition hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-pantonegreen group p-4 cursor-pointer"
    >
      {category.image ? (
        <img
          src={category.image}
          alt={category.name}
          className="w-24 h-24 object-cover object-center rounded-full mb-3 border-2 border-pantonebrown bg-gray-100"
        />
      ) : (
        <img
          src={require('../images/icono.png')}
          alt="Icono categoría"
          className="w-24 h-24 object-cover object-center rounded-full mb-3 border-2 border-pantonebrown bg-gray-100"
        />
      )}
      <h3 className="text-lg font-bold text-pantoneblack mb-1 text-center line-clamp-1">{category.name}</h3>
    </button>
  );
}

export default CategoryCard;
