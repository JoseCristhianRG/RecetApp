// Importaciones principales de React, hooks, rutas y contexto de autenticación
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

// Componente para la página de inicio de sesión
function LoginPage() {
  // Estados para el email y la contraseña
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Obtiene la función de inicio de sesión y navegación
  const { signin } = useContext(AuthContext);
  const navigate = useNavigate();

  // Maneja el envío del formulario de inicio de sesión
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signin(email, password);
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    // Layout principal del formulario de login
    <div className="p-6 py-3">
      <div className="max-w-md md:max-w-2xl xl:max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Iniciar sesión</h1>
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
            Iniciar sesión
          </button>
        </form>
        {/* Enlace para registrarse si no tiene cuenta */}
        <p className="mt-4 text-sm">
          ¿No tienes cuenta? <Link to="/signup" className="text-blue-600 hover:underline">Registrarse</Link>
        </p>
      </div>
    </div>
  );
}

// Exporta el componente para su uso en las rutas
export default LoginPage;