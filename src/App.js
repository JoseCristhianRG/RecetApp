import React, { useContext, useState } from 'react';
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
                  <Link to="/add" className="text-xs sm:text-sm px-2 py-1 rounded bg-pantonegreen hover:bg-pantoneyellow transition text-white block">Agregar</Link>
                  <Link to="/categories" className="text-xs sm:text-sm px-2 py-1 rounded bg-pantonegreen hover:bg-pantoneyellow transition text-white block">Categorías</Link>
                  <Link to="/mis-recetas" className="text-xs sm:text-sm px-2 py-1 rounded bg-pantonegreen hover:bg-pantoneyellow transition text-white block">Mis Recetas</Link>
                </div>
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