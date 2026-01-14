import React, { useContext, useState } from 'react';
import { AuthContext } from '../AuthContext';
import { db } from '../firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Modal from '../components/Modal';

function UserProfilePage() {
  const { user, signout } = useContext(AuthContext);
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [logoutModal, setLogoutModal] = useState(false);
  const fileInputRef = React.useRef();

  React.useEffect(() => {
    if (!user) return;
    const fetchUser = async () => {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setDisplayName(data.displayName || '');
        setPhotoURL(data.photoURL || '');
      } else {
        setDisplayName(user.displayName || '');
        setPhotoURL(user.photoURL || '');
      }
    };
    fetchUser();
  }, [user]);

  if (!user) {
    return <div className="p-8 text-center">Debes iniciar sesión para ver tu perfil.</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      // Actualizar en Firebase Auth (si usas updateProfile) y en Firestore si tienes colección de usuarios
      // Aquí solo se muestra Firestore, ajusta según tu lógica
      await updateDoc(doc(db, 'users', user.uid), {
        displayName,
        photoURL,
      });
      setSuccess(true);
    } catch (err) {
      setError('Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `profile_photos/${user.uid}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setPhotoURL(url);
      await updateDoc(doc(db, 'users', user.uid), { photoURL: url });
      setSuccess(true);
    } catch (err) {
      setError('Error al subir la foto');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-10 rounded-xl flex flex-col sm:flex-row items-center sm:items-start gap-10">
      {/* Foto de perfil a la izquierda en desktop, arriba en mobile */}
      <div className="flex-shrink-0 flex flex-col items-center w-full sm:w-auto">
        <img
          src={photoURL || require('../images/icono.png')}
          alt="Foto de perfil"
          className="w-40 h-40 rounded-full object-cover border-2 border-pantonegreen mb-4 cursor-pointer hover:opacity-80 transition"
          onClick={handlePhotoClick}
          title="Cambiar foto"
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handlePhotoChange}
        />
      </div>
      {/* Formulario a la derecha en desktop, debajo en mobile */}
      <div className="flex-1 w-full">
        <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-md mx-auto">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Email</label>
            <input type="email" value={user.email} disabled className="input bg-gray-100" />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Nombre</label>
            <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} className="input" />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">¡Perfil actualizado!</div>}
          <button type="submit" disabled={saving} className="w-full bg-pantonegreen text-white py-2 rounded-lg font-bold hover:bg-primary-dark transition disabled:opacity-50">
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
        <div className="w-full mt-8 max-w-md mx-auto">
          <button
            onClick={() => setLogoutModal(true)}
            className="w-full bg-red-500 text-white py-2 rounded font-bold hover:bg-red-700 transition"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
      <Modal
        isOpen={logoutModal}
        title="¿Cerrar sesión?"
        onClose={() => setLogoutModal(false)}
        actions={
          <div className="flex gap-2">
            <button
              onClick={() => setLogoutModal(false)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              onClick={() => { setLogoutModal(false); signout(); }}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 font-bold"
            >
              Confirmar
            </button>
          </div>
        }
      >
        ¿Estás seguro de que deseas cerrar sesión?
      </Modal>
    </div>
  );
}

export default UserProfilePage;
