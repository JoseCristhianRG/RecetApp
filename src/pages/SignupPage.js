// Importaciones principales de React, hooks, rutas y contexto de autenticación
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { db } from '../firebase';
import { setDoc, doc } from 'firebase/firestore';

// Componente para la página de registro de usuario
function SignupPage() {
  // Estados para el email, la contraseña, el nombre y la confirmación de contraseña
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Obtiene la función de registro y navegación
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  // Maneja el envío del formulario de registro
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!emailRegex.test(email)) {
      setError('El correo electrónico no es válido.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (!displayName.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }
    try {
      const userCredential = await signup(email, password);
      // Guardar usuario en Firestore con rol 'user' y displayName
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
  };

  return (
    // Layout principal del formulario de registro
    <div className="p-6 py-3">
      <div className="max-w-md md:max-w-2xl xl:max-w-4xl mx-auto bg-white p-3 rounded">
        <h1 className="text-2xl font-bold mb-4">Registrarse</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Nombre</label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              required
              className="w-full p-2 border rounded"
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Confirmar contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {/* Botón para enviar el formulario */}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Registrarse
          </button>
        </form>
        {/* Enlace para iniciar sesión si ya tiene cuenta */}
        <p className="mt-4 text-sm">
          ¿Ya tienes cuenta? <Link to="/login" className="text-blue-600 hover:underline">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
}

// Exporta el componente para su uso en las rutas
export default SignupPage;