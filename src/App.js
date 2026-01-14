import React, { useContext, useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
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
import BottomNavBar from './components/BottomNavBar';
import { PlusIcon, ChefHatIcon } from './components/icons';
import { LoadingSpinner } from './components/ui';

function App() {
  const { user, signout, userRole } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userPhoto, setUserPhoto] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

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

  // Nav link component with pill styling
  const NavLink = ({ to, children, accent = false }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`px-4 py-2 rounded-full text-sm font-display font-semibold transition-all duration-300
          ${isActive
            ? 'bg-forest text-white shadow-soft'
            : accent
              ? 'text-tangerine hover:bg-tangerine-50'
              : 'text-cocoa hover:bg-cream-200'
          }`}
      >
        {children}
      </Link>
    );
  };

  return (
    <CategoriesProvider>
      <IngredientsProvider>
        <RecipesProvider>
          <div className="min-h-screen">
            {/* Fresh Modern Header */}
            <header className="glass sticky top-0 z-30 border-b border-white/50">
              <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8" aria-label="Main">
                {/* Logo */}
                <Link
                  to="/"
                  className="flex items-center gap-3 group"
                  aria-label="Inicio"
                >
                  <div className="relative">
                    <img
                      src={require('./images/icono.png')}
                      alt="RecetApp Logo"
                      className="w-12 h-12 object-contain transition-all duration-300
                        group-hover:scale-110 drop-shadow-md"
                    />
                    {/* Decorative glow on hover */}
                    <div className="absolute inset-0 bg-tangerine/20 rounded-full blur-xl
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display font-bold text-xl text-forest tracking-tight
                      group-hover:text-forest-dark transition-colors duration-300">
                      RecetApp
                    </span>
                    <span className="font-handwritten text-xs text-cocoa-light -mt-1 hidden sm:block">
                      Cocina con amor
                    </span>
                  </div>
                </Link>

                {/* Mobile: User Avatar */}
                <div className="flex items-center gap-3 lg:hidden">
                  {user && (
                    <Link
                      to="/perfil"
                      className="relative group"
                      title="Mi Perfil"
                    >
                      <div className="absolute inset-0 bg-gradient-tangerine rounded-full opacity-0
                        group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                      <img
                        src={userPhoto || require('./images/icono.png')}
                        alt="Avatar"
                        className="relative w-10 h-10 rounded-full border-2 border-white object-cover
                          shadow-soft transition-all duration-300 group-hover:scale-105"
                      />
                      {/* Online indicator */}
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-mint border-2 border-white rounded-full" />
                    </Link>
                  )}
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-2">
                  {!user ? (
                    <Link
                      to="/login"
                      className="btn-primary text-sm"
                    >
                      Iniciar sesión
                    </Link>
                  ) : (
                    <>
                      <NavLink to="/add">Agregar receta</NavLink>
                      {userRole === 'admin' && (
                        <NavLink to="/categories">Categorías</NavLink>
                      )}
                      <NavLink to="/mis-recetas">Mis Recetas</NavLink>
                      <NavLink to="/mis-favoritos">Favoritos</NavLink>
                      {userRole === 'admin' && (
                        <NavLink to="/admin/usuarios" accent>Usuarios</NavLink>
                      )}

                      {/* User Avatar - Desktop */}
                      <Link
                        to="/perfil"
                        className="relative ml-3 group"
                        title="Mi Perfil"
                      >
                        <div className="absolute inset-0 bg-gradient-tangerine rounded-full opacity-0
                          group-hover:opacity-100 transition-opacity duration-300 blur-sm scale-110" />
                        <img
                          src={userPhoto || require('./images/icono.png')}
                          alt="Avatar"
                          className="relative w-10 h-10 rounded-full border-2 border-white object-cover
                            shadow-soft transition-all duration-300 group-hover:scale-105 group-hover:border-tangerine"
                        />
                        {/* Online indicator */}
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-mint border-2 border-white rounded-full" />
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </header>

            {/* Main Content Area */}
            <main className="pb-32 lg:pb-8">
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
                <Route path="/admin/usuarios" element={<RequireAuth><AdminRoute><UsersPage /></AdminRoute></RequireAuth>} />
                <Route path="/perfil" element={<RequireAuth><UserProfilePage /></RequireAuth>} />
              </Routes>
            </main>

            {/* Bottom Navigation */}
            <BottomNavBar />

            {/* Floating Add Recipe Button */}
            {user && !location.pathname.startsWith('/add') && !location.pathname.startsWith('/edit-recipe') && (
              <button
                onClick={() => navigate('/add')}
                className="fixed bottom-24 right-5 z-50 lg:bottom-8
                  w-14 h-14 rounded-2xl
                  bg-gradient-tangerine text-white
                  shadow-glow-tangerine
                  flex items-center justify-center
                  transition-all duration-300 ease-out
                  hover:scale-110 hover:shadow-lg
                  active:scale-95
                  animate-fade-in-up"
                title="Añadir receta"
              >
                <PlusIcon className="w-7 h-7" />
                {/* Decorative ring */}
                <div className="absolute inset-0 rounded-2xl border-2 border-white/30 pointer-events-none" />
              </button>
            )}
          </div>
        </RecipesProvider>
      </IngredientsProvider>
    </CategoriesProvider>
  );
}

// AdminRoute: component to protect routes for administrators only
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

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <LoadingSpinner text="Cargando..." />
      </div>
    );
  }

  if (role !== 'admin') return <Navigate to="/" replace />;

  return children;
}

export default App;
