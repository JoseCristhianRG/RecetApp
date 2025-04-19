// Importaciones principales de React, hooks, rutas y contexto de autenticación
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { db } from '../firebase';
import { setDoc, doc } from 'firebase/firestore';

// Componente para la página de registro de usuario
function SignupPage() {
  // Estados para el email y la contraseña
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Obtiene la función de registro y navegación
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  // Maneja el envío del formulario de registro
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signup(email, password);
      // Guardar usuario en Firestore con rol 'user'
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: userCredential.user.email,
        role: 'user',
        createdAt: new Date(),
      });
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    // Layout principal del formulario de registro
    <div className="p-6 py-3">
      <div className="max-w-md md:max-w-2xl xl:max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Registrarse</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo para el correo electrónico */}
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
          {/* Campo para la contraseña */}
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