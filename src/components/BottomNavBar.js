import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  {
    to: '/',
    label: 'Inicio',
    icon: <img src={require('../images/icono_home.png')} alt="Inicio" className="w-7 h-7" />, // icono_home.png
  },
  {
    to: '/mis-recetas',
    label: 'Mis Recetas',
    icon: <img src={require('../images/icono_mis_recetas.png')} alt="Mis Recetas" className="w-7 h-7" />, // icono_mis_recetas.png
  },
  {
    to: '/mis-favoritos',
    label: 'Favoritos',
    icon: <img src={require('../images/icono_mis_favoritos.png')} alt="Favoritos" className="w-7 h-7" />, // icono_mis_favoritos.png
  },
];

function BottomNavBar() {
  const location = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow flex justify-around items-center h-16 lg:hidden">
      {navItems.map((item) => {
        const isActive = location.pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center justify-center flex-1 h-full transition text-xs ${isActive ? 'text-pantonegreen font-bold' : 'text-gray-500'}`}
          >
            {item.icon}
            <span className="mt-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default BottomNavBar;
