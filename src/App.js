import React, { useContext } from 'react';
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
  return (
    <CategoriesProvider>
      <IngredientsProvider>
        <RecipesProvider>
          <div className="max-w-3xl mx-auto p-4">
            <nav className="bg-white shadow mb-6 p-4 rounded flex items-center">
              <Link to="/" className="text-xl font-semibold text-gray-800">Inicio</Link>
              <Link to="/add" className="ml-6 text-xl font-semibold text-blue-600 hover:text-blue-800">Agregar Receta</Link>
              <Link to="/categories" className="ml-6 text-xl font-semibold text-blue-600 hover:text-blue-800">Categorías</Link>
              <Link to="/ingredients" className="ml-6 text-xl font-semibold text-blue-600 hover:text-blue-800">Ingredientes</Link>
              <div className="ml-auto">
                {user ? (
                  <button onClick={signout} className="text-red-600 hover:text-red-800">
                    Cerrar sesión
                  </button>
                ) : (
                  <>
                    <Link to="/login" className="text-blue-600 hover:text-blue-800 mr-4">
                      Iniciar sesión
                    </Link>
                    <Link to="/signup" className="text-blue-600 hover:text-blue-800">
                      Registrarse
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
          <div className="max-w-3xl mx-auto p-4">
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

        </RecipesProvider>
      </IngredientsProvider>
    </CategoriesProvider>
  );
}

export default App;