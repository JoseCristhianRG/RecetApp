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
      label: 'Recetas',
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
      <nav className="fixed bottom-4 left-4 right-4 z-40 lg:hidden">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-soft-lg border border-white/50 p-3">
          <Link
            to="/login"
            className="block w-full bg-gradient-forest text-white font-display font-bold rounded-xl py-3.5 text-center text-base transition-all duration-300 hover:shadow-glow-forest hover:scale-[1.02] active:scale-[0.98]"
          >
            Iniciar sesion
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-40 lg:hidden">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-soft-lg border border-white/50 px-2 py-2">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            const IconComponent = item.icon;

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative flex flex-col items-center justify-center flex-1 py-2 px-3 rounded-xl transition-all duration-300
                  ${isActive
                    ? 'text-forest'
                    : 'text-cocoa-lighter hover:text-forest'}`}
              >
                {/* Active indicator pill */}
                {isActive && (
                  <div className="absolute inset-0 bg-forest/10 rounded-xl animate-scale-in" />
                )}

                <div className={`relative z-10 transition-transform duration-300
                  ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}
                >
                  <IconComponent
                    className={`w-6 h-6 transition-all duration-300
                      ${isActive ? 'text-forest' : ''}`}
                    filled={isActive}
                  />
                </div>

                <span className={`relative z-10 mt-1 text-[11px] font-medium transition-all duration-300
                  ${isActive ? 'font-bold text-forest' : ''}`}
                >
                  {item.label}
                </span>

                {/* Active dot indicator */}
                {isActive && (
                  <div className="absolute -bottom-0.5 w-1 h-1 bg-tangerine rounded-full animate-scale-in" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default BottomNavBar;
