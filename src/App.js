import React, { useContext, useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import RecipePage from './pages/RecipePage';
import AddRecipePage from './pages/AddRecipePage';
import CategoriesPage from './pages/CategoriesPage';
import MisRecetasPage from './pages/MisRecetasPage';
import MisFavoritosPage from './pages/MisFavoritosPage';
import EditRecipePage from './pages/EditRecipePage';
import { RecipesProvider } from './RecipesContext';
import { CategoriesProvider } from './CategoriesContext';
import { IngredientsProvider } from './IngredientsContext';
import { AuthContext, RequireAuth } from './AuthContext';
import LoginPage from './pages/LoginPage';
import { Navigate } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import UsersPage from './pages/admin/UsersPage';
import UserProfilePage from './pages/UserProfilePage';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

function App() {
  const { user, signout, userRole } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userPhoto, setUserPhoto] = useState(null);

  useEffect(() => {
    if (!user) {
      setUserPhoto(null);
      return;
    }
    const fetchPhoto = async () => {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUserPhoto(userDoc.data().photoURL || null);
      } else {
        setUserPhoto(null);
      }
    };
    fetchPhoto();
  }, [user]);

  return (
    <CategoriesProvider>
      <IngredientsProvider>
        <RecipesProvider>
          <div className="bg-pattern min-h-screen text-pantoneblack">
            {/* Header moderno */}
            <header className="bg-white/90 shadow-sm sticky top-0 z-30">
              <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Main">
                <div className="flex items-center gap-3">
                  <Link to="/" className="flex items-center gap-2" aria-label="Inicio">
                    <img src={require('./images/icono.png')} alt="Logo" className="h-10 w-10 rounded-full border border-pantonegreen" />
                    <span className="font-bold text-xl text-pantonegreen tracking-tight">RecetApp</span>
                  </Link>
                </div>
                <div className="flex items-center gap-2 lg:hidden">
                  <button
                    className="inline-flex items-center justify-center rounded-md p-2 text-pantonegreen hover:bg-pantonegreen/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pantonegreen"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Abrir menú"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {menuOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                      )}
                    </svg>
                  </button>
                </div>
                {/* Links desktop */}
                <div className="hidden lg:flex gap-2 items-center">
                  {!user ? (
                    <Link to="/login" className="text-sm font-semibold leading-6 text-pantonegreen hover:text-pantonebrown transition">Iniciar sesión</Link>
                  ) : (
                    <>
                      <Link to="/add" className="text-sm font-semibold leading-6 text-pantonegreen hover:text-pantonebrown transition">Agregar receta</Link>
                      {userRole === 'admin' && (
                        <Link to="/categories" className="text-sm font-semibold leading-6 text-pantonegreen hover:text-pantonebrown transition">Categorías</Link>
                      )}
                      <Link to="/mis-recetas" className="text-sm font-semibold leading-6 text-pantonegreen hover:text-pantonebrown transition">Mis Recetas</Link>
                      <Link to="/mis-favoritos" className="text-sm font-semibold leading-6 text-pantonegreen hover:text-pantonebrown transition">Mis Favoritos</Link>
                      {userRole === 'admin' && (
                        <Link to="/admin/usuarios" className="text-sm font-semibold leading-6 text-pantonebrown hover:text-pantonegreen transition">Usuarios</Link>
                      )}
                      {/* Avatar usuario a la derecha */}
                      <Link to="/perfil" className="ml-4 flex items-center group" title="Mi Perfil">
                        <img
                          src={userPhoto || require('./images/icono.png')}
                          alt="Avatar"
                          className="w-9 h-9 rounded-full border-2 border-pantonegreen object-cover group-hover:opacity-80 transition"
                        />
                      </Link>
                    </>
                  )}
                </div>
              </nav>
              {/* Menú mobile */}
              {menuOpen && (
                <div className="lg:hidden bg-white/95 border-t border-gray-200 shadow-md">
                  <div className="px-4 py-4 flex flex-col gap-2">
                    {!user ? (
                      <Link to="/login" className="text-base font-semibold text-pantonegreen hover:text-pantonebrown transition" onClick={() => setMenuOpen(false)}>Iniciar sesión</Link>
                    ) : (
                      <>
                        <Link to="/add" className="text-base font-semibold text-pantonegreen hover:text-pantonebrown transition" onClick={() => setMenuOpen(false)}>Agregar receta</Link>
                        {userRole === 'admin' && (
                          <Link to="/categories" className="text-base font-semibold text-pantonegreen hover:text-pantonebrown transition" onClick={() => setMenuOpen(false)}>Categorías</Link>
                        )}
                        <Link to="/mis-recetas" className="text-base font-semibold text-pantonegreen hover:text-pantonebrown transition" onClick={() => setMenuOpen(false)}>Mis Recetas</Link>
                        <Link to="/mis-favoritos" className="text-base font-semibold text-pantonegreen hover:text-pantonebrown transition" onClick={() => setMenuOpen(false)}>Mis Favoritos</Link>
                        {userRole === 'admin' && (
                          <Link to="/admin/usuarios" className="text-base font-semibold text-pantonebrown hover:text-pantonegreen transition" onClick={() => setMenuOpen(false)}>Usuarios</Link>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </header>
            {/* Card general blanco */}
            <div className="bg-white rounded-xl shadow-lg max-w-lg md:max-w-2xl xl:max-w-4xl mx-auto mt-8">
              <div className="">
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/" element={<HomePage />} />
                  <Route path="/add" element={<RequireAuth><AddRecipePage /></RequireAuth>} />
                  <Route path="/category/:categoryId" element={<CategoryPage />} />
                  <Route path="/recipe/:recipeId" element={<RecipePage />} />
                  <Route path="/categories" element={<RequireAuth><AdminRoute><CategoriesPage /></AdminRoute></RequireAuth>} />
                  <Route path="/mis-recetas" element={<RequireAuth><MisRecetasPage /></RequireAuth>} />
                  <Route path="/mis-favoritos" element={<RequireAuth><MisFavoritosPage /></RequireAuth>} />
                  <Route path="/edit-recipe/:id" element={<RequireAuth><EditRecipePage /></RequireAuth>} />
                  {/* Ruta protegida solo para admins */}
                  <Route path="/admin/usuarios" element={<RequireAuth><AdminRoute><UsersPage /></AdminRoute></RequireAuth>} />
                  {/* Ruta de perfil de usuario */}
                  <Route path="/perfil" element={<RequireAuth><UserProfilePage /></RequireAuth>} />
                </Routes>
              </div>
            </div>
          </div>
        </RecipesProvider>
      </IngredientsProvider>
    </CategoriesProvider>
  );
}

// AdminRoute: componente para proteger rutas solo para administradores
function AdminRoute({ children }) {
  const { user } = useContext(AuthContext);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!user) return;
    import('firebase/firestore').then(({ getDoc, doc: docRef }) => {
      import('./firebase').then(({ db }) => {
        getDoc(docRef(db, 'users', user.uid)).then((snap) => {
          setRole(snap.data()?.role);
          setLoading(false);
        });
      });
    });
  }, [user]);
  if (loading) return <div>Cargando...</div>;
  if (role !== 'admin') return <Navigate to="/" replace />;
  
  return children;
}

export default App;