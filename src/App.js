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
import { PlusIcon } from './components/icons';
import { LoadingSpinner } from './components/ui';

function App() {
  const { user, signout, userRole } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userPhoto, setUserPhoto] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // <-- Añadido para saber la ruta actual

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
                  {user && (
                    <Link to="/perfil" className="flex items-center group" title="Mi Perfil">
                      <img
                        src={userPhoto || require('./images/icono.png')}
                        alt="Avatar"
                        className="w-9 h-9 rounded-full border-2 border-pantonegreen object-cover group-hover:opacity-80 transition"
                      />
                    </Link>
                  )}
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
              {/* Eliminado menú hamburguesa y menú mobile, ya no es necesario */}
            </header>
            {/* Card general blanco */}
            <div className="bg-white rounded-xl shadow-lg max-w-lg md:max-w-2xl xl:max-w-4xl mx-auto mt-4" style={{ marginBottom: '100px' }}>
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
            <BottomNavBar />
            {/* Botón flotante para añadir receta */}
            {user && !location.pathname.startsWith('/add') && !location.pathname.startsWith('/edit-recipe') && (
              <button
                onClick={() => navigate('/add')}
                className="fixed bottom-20 right-5 z-50 bg-pantonegreen text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center transition-all duration-200 hover:bg-primary-dark hover:scale-110"
                title="Añadir receta"
                style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.18)' }}
              >
                <PlusIcon className="w-8 h-8" />
              </button>
            )}
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
  if (loading) return <div className="p-6 flex justify-center"><LoadingSpinner text="Cargando..." /></div>;
  if (role !== 'admin') return <Navigate to="/" replace />;
  
  return children;
}

export default App;