import React, { useContext, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import RecipePage from './pages/RecipePage';
import AddRecipePage from './pages/AddRecipePage';
import CategoriesPage from './pages/CategoriesPage';
import IngredientsPage from './pages/IngredientsPage';
import { RecipesProvider } from './RecipesContext';
import { CategoriesProvider } from './CategoriesContext';
import { IngredientsProvider } from './IngredientsContext';
import { AuthContext, RequireAuth } from './AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

function App() {
  const { user, signout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <CategoriesProvider>
      <IngredientsProvider>
        <RecipesProvider>
          <div className="min-h-screen bg-pantonebg text-pantoneblack">
            <div className="max-w-lg mx-auto p-2 sm:p-4">
              {/* Menú hamburguesa */}
              <nav className="bg-pantoneyellow text-pantoneblack rounded-b-xl shadow mb-4 p-3 flex items-center justify-between relative">
                <Link to="/" className="text-lg font-bold tracking-wide">RecetApp</Link>
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
                  <Link to="/add" className="text-xs sm:text-sm px-2 py-1 rounded bg-pantonegreen hover:bg-pantoneyellow transition text-white block">Agregar</Link>
                  <Link to="/categories" className="text-xs sm:text-sm px-2 py-1 rounded bg-pantonegreen hover:bg-pantoneyellow transition text-white block">Categorías</Link>
                  <Link to="/ingredients" className="text-xs sm:text-sm px-2 py-1 rounded bg-pantonegreen hover:bg-pantoneyellow transition text-white block">Ingredientes</Link>
                </div>
              </nav>
              {/* Card general blanco */}
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4">
                <div className="py-2 sm:py-4">
                  <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/" element={<HomePage />} />
                    <Route path="/add" element={<RequireAuth><AddRecipePage /></RequireAuth>} />
                    <Route path="/category/:categoryId" element={<CategoryPage />} />
                    <Route path="/recipe/:recipeId" element={<RecipePage />} />
                    <Route path="/categories" element={<RequireAuth><CategoriesPage /></RequireAuth>} />
                    <Route path="/ingredients" element={<RequireAuth><IngredientsPage /></RequireAuth>} />
                  </Routes>
                </div>
              </div>
            </div>
            <footer className="bg-pantonebrown text-pantoneblack text-xs text-center py-2 mt-4 rounded-t-xl">
              © 2025 RecetApp
            </footer>
          </div>
        </RecipesProvider>
      </IngredientsProvider>
    </CategoriesProvider>
  );
}

export default App;