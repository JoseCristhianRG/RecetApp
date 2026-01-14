import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { db } from '../firebase';
import { setDoc, doc } from 'firebase/firestore';

function SignupPage() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!displayName.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }
    if (!emailRegex.test(email)) {
      setError('El correo electrónico no es válido.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signup(email, password);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: userCredential.user.email,
        displayName: displayName.trim(),
        role: 'user',
        createdAt: new Date(),
      });
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
        <div className="absolute top-10 right-20 w-80 h-80 bg-honey/15 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-mint/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-fade-in-up">
        {/* Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-soft-xl p-8 border border-white/50">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-tangerine mb-4">
              <span className="text-3xl">🍳</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-cocoa">
              ¡Crea tu cuenta!
            </h1>
            <p className="font-body text-cocoa-light mt-2">
              Únete a nuestra comunidad de cocineros
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-display font-medium text-cocoa text-sm mb-2">
                Tu nombre
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                placeholder="¿Cómo te llamamos?"
                className="input"
              />
            </div>

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
                placeholder="Mínimo 6 caracteres"
                className="input"
              />
            </div>

            <div>
              <label className="block font-display font-medium text-cocoa text-sm mb-2">
                Confirmar contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Repite tu contraseña"
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
              className="w-full btn-accent py-4 text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creando cuenta...
                </span>
              ) : (
                'Crear mi cuenta'
              )}
            </button>
          </form>

          {/* Terms */}
          <p className="mt-4 text-center font-body text-cocoa-lighter text-xs">
            Al registrarte, aceptas nuestros términos de uso y política de privacidad
          </p>

          {/* Footer */}
          <p className="mt-4 text-center font-body text-cocoa-light text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link
              to="/login"
              className="font-semibold text-forest hover:text-forest-dark transition-colors"
            >
              Iniciar sesión
            </Link>
          </p>
        </div>

        {/* Decorative element */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-tangerine/5 rounded-full blur-xl" />
      </div>
    </div>
  );
}

export default SignupPage;
