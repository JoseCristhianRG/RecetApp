import React, { useState } from 'react';

function CategoryCard({ category, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative w-full aspect-square rounded-3xl overflow-hidden shadow-soft
        transition-all duration-500 ease-out
        hover:shadow-soft-xl hover:scale-[1.02]
        focus:outline-none focus:ring-4 focus:ring-forest/20
        active:scale-[0.98]
        opacity-0 animate-fade-in-up"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        {category.image ? (
          <img
            src={category.image}
            alt={category.name}
            className={`w-full h-full object-cover transition-transform duration-700 ease-out
              ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-mint via-forest-100 to-forest-200" />
        )}
      </div>

      {/* Gradient Overlay */}
      <div className={`absolute inset-0 transition-all duration-500
        ${isHovered
          ? 'bg-gradient-to-t from-cocoa/80 via-cocoa/40 to-transparent'
          : 'bg-gradient-to-t from-cocoa/70 via-cocoa/20 to-transparent'}`}
      />

      {/* Decorative Elements */}
      <div className={`absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm
        flex items-center justify-center transition-all duration-300
        ${isHovered ? 'scale-110 bg-tangerine/80' : 'scale-100'}`}
      >
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>

      {/* Category Name */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className={`font-handwritten text-2xl text-white drop-shadow-lg
          transition-all duration-300
          ${isHovered ? 'translate-y-0' : 'translate-y-1'}`}
        >
          {category.name}
        </h3>

        {/* Underline animation */}
        <div className={`h-0.5 bg-tangerine mt-1 transition-all duration-500 ease-out
          ${isHovered ? 'w-full' : 'w-0'}`}
        />
      </div>

      {/* Shine effect on hover */}
      <div className={`absolute inset-0 pointer-events-none
        bg-gradient-to-r from-transparent via-white/10 to-transparent
        transition-transform duration-700 ease-out
        ${isHovered ? 'translate-x-full' : '-translate-x-full'}`}
      />
    </button>
  );
}

export default CategoryCard;
