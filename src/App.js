import React, { useContext, useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import RecipePage from './pages/RecipePage';
import AddRecipePage from './pages/AddRecipePage';
import CategoriesPage from './pages/CategoriesPage';
import MisRecetasPage from './pages/MisRecetasPage';
import EditRecipePage from './pages/EditRecipePage';
import { RecipesProvider } from './RecipesContext';
import { CategoriesProvider } from './CategoriesContext';
import { IngredientsProvider } from './IngredientsContext';
import { AuthContext, RequireAuth } from './AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UsersPage from './pages/admin/UsersPage';

function App() {
  const { user, signout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <CategoriesProvider>
      <IngredientsProvider>
        <RecipesProvider>
          <div className="bg-pattern min-h-screen text-pantoneblack">
            <div className="max-w-lg md:max-w-2xl xl:max-w-4xl mx-auto">
              {/* Menú hamburguesa */}
              <nav className="bg-pantoneyellow text-pantoneblack rounded-b-xl shadow mb-4 p-3 flex items-center justify-between relative">
                <Link to="/" className="flex items-center" aria-label="Inicio">
                  {/* Icono de chef desde images/icono.png */}
                  <img src={require('./images/icono.png')} alt="Icono chef" className="w-9 h-9" />
                </Link>
                <button
                  className="sm:hidden flex flex-col justify-center items-center w-8 h-8 focus:outline-none"
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-label="Abrir menú"
                >
                  <span className={`block h-1 w-6 bg-pantoneblack rounded transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                  <span className={`block h-1 w-6 bg-pantoneblack rounded my-1 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`block h-1 w-6 bg-pantoneblack rounded transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </button>
                <div className={`sm:flex gap-2 ${menuOpen ? 'flex flex-col absolute top-12 right-0 bg-pantoneyellow rounded shadow p-4 z-50' : 'hidden sm:flex'}`}>
                  {user ? (
                    <>
                      <Link to="/add" className="text-xs sm:text-sm px-2 py-1 rounded bg-pantonegreen hover:bg-pantoneyellow transition text-white block">Agregar</Link>
                      <Link to="/categories" className="text-xs sm:text-sm px-2 py-1 rounded bg-pantonegreen hover:bg-pantoneyellow transition text-white block">Categorías</Link>
                      <Link to="/mis-recetas" className="text-xs sm:text-sm px-2 py-1 rounded bg-pantonegreen hover:bg-pantoneyellow transition text-white block">Mis Recetas</Link>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="text-xs sm:text-sm px-2 py-1 rounded bg-red-600 hover:bg-red-700 transition text-white block">Iniciar sesión</Link>
                      <Link to="/signup" className="text-xs sm:text-sm px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 transition text-white block">Registrarse</Link>
                    </>
                  )}
                </div>
                {/* Botón de cerrar sesión si el usuario está autenticado */}
                {user && (
                  <button
                    onClick={signout}
                    title="Cerrar sesión"
                    className="ml-2 p-1 rounded hover:bg-red-100 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
                    </svg>
                  </button>
                )}
              </nav>
              {/* Card general blanco */}
              <div className="bg-white rounded-xl shadow-lg">
                <div className="">
                  <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/" element={<HomePage />} />
                    <Route path="/add" element={<RequireAuth><AddRecipePage /></RequireAuth>} />
                    <Route path="/category/:categoryId" element={<CategoryPage />} />
                    <Route path="/recipe/:recipeId" element={<RecipePage />} />
                    <Route path="/categories" element={<RequireAuth><CategoriesPage /></RequireAuth>} />
                    <Route path="/mis-recetas" element={<RequireAuth><MisRecetasPage /></RequireAuth>} />
                    <Route path="/edit-recipe/:id" element={<RequireAuth><EditRecipePage /></RequireAuth>} />
                    {/* Ruta protegida solo para admins */}
                    <Route path="/admin/usuarios" element={<RequireAuth requiredRole="admin"><UsersPage /></RequireAuth>} />
                  </Routes>
                </div>
              </div>
            </div>
          </div>
        </RecipesProvider>
      </IngredientsProvider>
    </CategoriesProvider>
  );
}

export default App;