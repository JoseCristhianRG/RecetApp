// Importaciones principales de React, hooks, contextos y dependencias de Firebase
import React, { useState, useContext } from 'react';
import { CategoriesContext } from '../CategoriesContext';
import { addDoc, collection, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Modal from '../components/Modal';

// Componente para gestionar las categorías de recetas
function CategoriesPage() {
  // Obtiene las categorías desde el contexto
  const { categories } = useContext(CategoriesContext);
  // Estados para el formulario, imagen, edición y modal
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null); // ID de la categoría que se está editando
  const [modal, setModal] = useState({ open: false, title: '', message: '', onConfirm: null });

  // Maneja el envío del formulario para agregar o actualizar una categoría
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setModal({
        open: true,
        title: 'Campo obligatorio',
        message: 'El nombre de la categoría es obligatorio.',
        onConfirm: null
      });
      return;
    }
    let imageBase64 = '';
    if (image) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        imageBase64 = reader.result;
        if (editingId) {
          // Actualizar categoría existente
          await updateDoc(doc(db, 'categories', editingId), {
            name,
            image: imageBase64,
          });
        } else {
          // Agregar nueva categoría
          await addDoc(collection(db, 'categories'), {
            name,
            image: imageBase64,
          });
        }
        resetForm();
      };
      reader.readAsDataURL(image);
    } else {
      if (editingId) {
        await updateDoc(doc(db, 'categories', editingId), {
          name,
        });
      } else {
        await addDoc(collection(db, 'categories'), {
          name,
          image: '',
        });
      }
      resetForm();
    }
  };

  // Resetea el formulario a su estado inicial
  const resetForm = () => {
    setName('');
    setImage(null);
    setEditingId(null);
  };

  // Maneja la edición de una categoría existente
  const handleEdit = (category) => {
    setName(category.name);
    setImage(null); // No cargamos la imagen existente
    setEditingId(category.id);
  };

  // Maneja la eliminación de una categoría con confirmación en modal
  const handleDelete = (id) => {
    setModal({
      open: true,
      title: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar esta categoría?',
      onConfirm: async () => {
        await deleteDoc(doc(db, 'categories', id));
        setModal((m) => ({ ...m, open: false }));
      }
    });
  };

  return (
    // Layout principal de la página de categorías
    <div className="p-6 py-3">
      <h1 className="text-2xl font-bold mb-4">Categorías</h1>
      {/* Formulario para agregar o editar una categoría */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4 bg-white/80 p-4 rounded shadow">
        <input
          type="text"
          placeholder="Nombre de la categoría"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-cocoa rounded text-cocoa"
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full p-2 border border-cocoa rounded text-cocoa"
        />
        <button
          type="submit"
          className={`w-full px-4 py-2 text-white rounded shadow transition ${editingId ? 'bg-honey hover:bg-forest text-cocoa' : 'bg-forest hover:bg-honey text-cocoa'}`}
        >
          {editingId ? 'Actualizar categoría' : 'Agregar categoría'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            className="w-full px-4 py-2 bg-cocoa text-white rounded shadow hover:bg-cocoa transition"
          >
            Cancelar
          </button>
        )}
      </form>
      {/* Lista de categorías existentes */}
      <ul className="grid grid-cols-1 gap-3">
        {categories.map((cat) => (
          <li key={cat.id} className="bg-white/80 rounded shadow p-3 flex items-center justify-between">
            <div className="flex items-center">
              {cat.image && (
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-12 h-12 object-cover rounded-full mr-3 border-2 border-cocoa"
                />
              )}
              <h2 className="text-lg font-bold text-cocoa">{cat.name}</h2>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(cat)}
                className="px-2 py-1 bg-honey text-cocoa rounded hover:bg-forest transition"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
                className="px-2 py-1 bg-cocoa text-white rounded hover:bg-cocoa transition"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
      {/* Modal de confirmación para eliminar */}
      <Modal
        isOpen={modal.open}
        title={modal.title}
        onClose={() => setModal((m) => ({ ...m, open: false }))}
        actions={modal.onConfirm && (
          <button
            onClick={() => {
              if (modal.onConfirm) modal.onConfirm();
            }}
            className="px-4 py-2 bg-cocoa text-white rounded hover:bg-cocoa transition"
          >
            Confirmar
          </button>
        )}
      >
        {modal.message}
      </Modal>
    </div>
  );
}

// Exporta el componente para su uso en las rutas
export default CategoriesPage;