import React, { useState } from 'react';
import { uploadImage } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';

function AddRecipePage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = '';
    if (image) {
      imageUrl = await uploadImage(image, 'recipes');
    }
    await addDoc(collection(db, 'recipes'), {
      name,
      description,
      imageUrl,
    });
    setName('');
    setDescription('');
    setImage(null);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Agregar Receta</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nombre de la receta"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
        >
          Agregar receta
        </button>
      </form>
    </div>
  );
}

export default AddRecipePage;