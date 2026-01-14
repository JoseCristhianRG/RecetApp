import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CategoriesContext } from '../CategoriesContext';
import { AuthContext } from '../AuthContext';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import RecipeCard from '../components/RecipeCard';
import CategoryCard from '../components/CategoryCard';

function HomePage() {
  const { categories } = useContext(CategoriesContext);
  const { user } = useContext(AuthContext);
  const [latestRecipes, setLatestRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '¡Buenos días';
    if (hour < 18) return '¡Buenas tardes';
    return '¡Buenas noches';
  };

  // Get user's first name
  const getFirstName = () => {
    if (!user?.displayName) return '';
    return user.displayName.split(' ')[0];
  };

  useEffect(() => {
    const fetchLatestRecipes = async () => {
      setLoading(true);
      const q = query(collection(db, 'recipes'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const recipesData = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter(r => r.isPublic && r.status === 'published')
        .slice(0, 6);
      setLatestRecipes(recipesData);
      setLoading(false);
    };

    fetchLatestRecipes();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-mint/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-honey/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 pt-8 pb-12 lg:px-8">
          {/* Greeting */}
          <div className="mb-8 animate-fade-in-up">
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-cocoa mb-2">
              {getGreeting()}
              {user && (
                <span className="text-forest">, {getFirstName()}</span>
              )}
              ! 👋
            </h1>
            <p className="font-body text-cocoa-light text-lg">
              {user
                ? '¿Qué delicia cocinarás hoy?'
                : 'Descubre recetas deliciosas para cada ocasión'}
            </p>
          </div>

          {/* Quick stats for logged in users */}
          {user && (
            <div className="flex gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <Link
                to="/mis-recetas"
                className="flex-1 max-w-[160px] p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-soft
                  hover:shadow-soft-lg hover:scale-[1.02] transition-all duration-300"
              >
                <span className="block text-2xl mb-1">📖</span>
                <span className="font-display font-semibold text-cocoa text-sm">Mis Recetas</span>
              </Link>
              <Link
                to="/mis-favoritos"
                className="flex-1 max-w-[160px] p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-soft
                  hover:shadow-soft-lg hover:scale-[1.02] transition-all duration-300"
              >
                <span className="block text-2xl mb-1">❤️</span>
                <span className="font-display font-semibold text-cocoa text-sm">Favoritos</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Latest Recipes Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-cocoa">
                Recetas Recientes
              </h2>
              <p className="font-body text-cocoa-light text-sm mt-1">
                Las últimas creaciones de nuestra comunidad
              </p>
            </div>
            <div className="hidden sm:block">
              <span className="font-handwritten text-tangerine text-xl">¡Frescas!</span>
            </div>
          </div>

          {/* Recipe Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton aspect-recipe rounded-3xl" />
              ))}
            </div>
          ) : latestRecipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestRecipes.map((recipe, index) => (
                <div
                  key={recipe.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white/50 rounded-3xl">
              <span className="text-4xl mb-4 block">🍳</span>
              <p className="font-display text-cocoa font-semibold">No hay recetas aún</p>
              <p className="font-body text-cocoa-light text-sm mt-1">¡Sé el primero en compartir!</p>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-cocoa">
                Explora por Categoría
              </h2>
              <p className="font-body text-cocoa-light text-sm mt-1">
                Encuentra la receta perfecta para cada ocasión
              </p>
            </div>
            <div className="hidden sm:block">
              <span className="font-handwritten text-forest text-xl">Descubre</span>
            </div>
          </div>

          {/* Category Grid */}
          {categories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {categories.map((cat, index) => (
                <div
                  key={cat.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CategoryCard
                    category={cat}
                    onClick={() => navigate(`/category/${cat.id}`)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white/50 rounded-3xl">
              <span className="text-4xl mb-4 block">📂</span>
              <p className="font-display text-cocoa font-semibold">Sin categorías</p>
              <p className="font-body text-cocoa-light text-sm mt-1">Pronto habrá más contenido</p>
            </div>
          )}
        </div>
      </section>

      {/* Decorative Footer Banner */}
      {!user && (
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-forest p-8 lg:p-12 text-center">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

              <div className="relative z-10">
                <span className="font-handwritten text-3xl text-mint block mb-4">
                  ¡Únete a nuestra comunidad!
                </span>
                <h3 className="font-display text-2xl lg:text-3xl font-bold text-white mb-4">
                  Guarda y comparte tus recetas favoritas
                </h3>
                <p className="font-body text-white/80 mb-6 max-w-lg mx-auto">
                  Crea tu cuenta gratis y empieza a organizar tu colección de recetas personal
                </p>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full
                    bg-white text-forest font-display font-bold
                    shadow-soft-lg hover:shadow-glow-forest hover:scale-[1.02]
                    transition-all duration-300"
                >
                  Crear cuenta gratis
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default HomePage;
