import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { HomeIcon, BookIcon, HeartIcon } from './icons';

function BottomNavBar() {
  const location = useLocation();
  const { user } = React.useContext(AuthContext);

  const navItems = [
    {
      to: '/',
      label: 'Inicio',
      icon: HomeIcon,
    },
    {
      to: '/mis-recetas',
      label: 'Mis Recetas',
      icon: BookIcon,
    },
    {
      to: '/mis-favoritos',
      label: 'Favoritos',
      icon: HeartIcon,
    },
  ];

  if (!user) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow flex justify-around items-center h-16 lg:hidden">
        <Link
          to="/login"
          className="w-11/12 mx-auto bg-pantonegreen text-white font-bold rounded-full py-3 text-center text-base transition hover:bg-primary-dark"
        >
          Iniciar sesion
        </Link>
      </nav>
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow flex justify-around items-center h-16 lg:hidden">
      {navItems.map((item) => {
        const isActive = location.pathname === item.to;
        const IconComponent = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center justify-center flex-1 h-full transition text-xs ${isActive ? 'text-pantonegreen font-bold' : 'text-gray-500 hover:text-pantonegreen'}`}
          >
            <IconComponent className={`w-6 h-6 transition-transform ${isActive ? 'scale-110' : ''}`} />
            <span className="mt-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default BottomNavBar;
