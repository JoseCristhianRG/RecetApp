import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signin, signinWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signin(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signinWithGoogle();
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-mint/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-tangerine/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-fade-in-up">
        {/* Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-soft-xl p-8 border border-white/50">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-forest mb-4">
              <span className="text-3xl">👋</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-cocoa">
              ¡Bienvenido de nuevo!
            </h1>
            <p className="font-body text-cocoa-light mt-2">
              Inicia sesión para continuar cocinando
            </p>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5
              bg-white border-2 border-cocoa/10 rounded-2xl
              font-display font-semibold text-cocoa
              transition-all duration-300
              hover:border-forest hover:shadow-soft
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img
              src={require('../images/google_logo.png')}
              alt="Google"
              className="w-5 h-5"
            />
            Continuar con Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-cocoa/10" />
            <span className="font-body text-cocoa-lighter text-sm">o con email</span>
            <div className="flex-1 h-px bg-cocoa/10" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-display font-medium text-cocoa text-sm mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
                className="input"
              />
            </div>

            <div>
              <label className="block font-display font-medium text-cocoa text-sm mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="input"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-tangerine-50 text-tangerine-dark text-sm">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Iniciando...
                </span>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center font-body text-cocoa-light text-sm">
            ¿No tienes cuenta?{' '}
            <Link
              to="/signup"
              className="font-semibold text-forest hover:text-forest-dark transition-colors"
            >
              Crear cuenta
            </Link>
          </p>
        </div>

        {/* Decorative element */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-forest/5 rounded-full blur-xl" />
      </div>
    </div>
  );
}

export default LoginPage;
