// Importaciones principales de React, hooks, contextos y dependencias de Firebase
import React, { useState, useContext, useMemo } from 'react';
import { addDoc, collection, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, uploadImage } from '../firebase';
import { CategoriesContext } from '../CategoriesContext';
import { AuthContext } from '../AuthContext';
import Modal from '../components/Modal';
import { useNavigate } from 'react-router-dom';
import RecipeForm from '../components/RecipeForm';

// Componente para agregar una nueva receta
function AddRecipePage() {
  // Obtiene las categorías y el usuario autenticado desde el contexto
  const { categories } = useContext(CategoriesContext);
  const { user } = useContext(AuthContext);
  // Estados para los campos del formulario y control de errores
  const [errors, setErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [createdRecipeId, setCreatedRecipeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Función de validación de campos del formulario
  const validate = (form) => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'El nombre es obligatorio.';
    if (!form.category) newErrors.category = 'Selecciona una categoría.';
    if (!form.ingredients[0] || form.ingredients.some((i) => !i.trim())) newErrors.ingredients = 'Agrega al menos un ingrediente.';
    if (!form.steps[0].title.trim() || form.steps.some((s) => !s.title.trim())) newErrors.steps = 'Cada paso debe tener un nombre.';
    if (!form.steps[0].description.trim() || form.steps.some((s) => !s.description.trim())) newErrors.stepsDesc = 'Cada paso debe tener una descripción.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Maneja el envío del formulario para agregar la receta y sus pasos
  const handleSubmit = async (form) => {
    if (!validate(form)) return;
    setLoading(true);
    try {
      let imageUrl = '';
      // 1. Crea la receta con todos los campos menos imageUrl
      const recipeData = {
        name: form.name,
        category: form.category,
        ingredients: form.ingredients,
        imageUrl: '', // se actualizará después si hay imagen
        createdBy: user?.uid || null,
        createdAt: serverTimestamp(),
        isPublic: form.isPublic,
        status: form.status,
        publishedAt: form.status === 'published' ? serverTimestamp() : null,
        tags: form.tags,
      };
      // 2. Agrega la receta a Firestore
      const recipeRef = await addDoc(collection(db, 'recipes'), recipeData);
      // Si hay imagen, sube la imagen y actualiza la receta
      if (form.image) {
        imageUrl = await uploadImage(form.image, `recipes/${recipeRef.id}/imagen.png`);
        await updateDoc(recipeRef, { imageUrl });
      }
      // 3. Agrega los pasos
      for (let i = 0; i < form.steps.length; i++) {
        let stepImageUrl = '';
        if (form.steps[i].image) {
          stepImageUrl = await uploadImage(form.steps[i].image, `steps/${recipeRef.id}`);
        }
        await addDoc(collection(db, 'steps'), {
          recipeId: recipeRef.id,
          order: i,
          title: form.steps[i].title,
          description: form.steps[i].description,
          imageUrl: stepImageUrl,
        });
      }
      setCreatedRecipeId(recipeRef.id);
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const initialValues = useMemo(() => ({
    name: '',
    category: '',
    ingredients: [''],
    steps: [{ title: '', description: '', image: null, imageUrl: '' }],
    image: null,
    imageUrl: '',
    isPublic: true,
    status: 'draft',
    tags: [],
  }), []);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
            <span className="loader mb-4"></span>
            <span className="text-lg font-bold text-pantonegreen">Generando receta...</span>
          </div>
        </div>
      )}
      <RecipeForm
        initialValues={initialValues}
        categories={categories}
        loading={loading}
        errors={errors}
        onSubmit={handleSubmit}
        title="Agregar Receta"
        submitText="Agregar receta"
      />
      <Modal
        isOpen={modalOpen}
        title="Receta creada"
        onClose={() => setModalOpen(false)}
        actions={
          <button
            onClick={() => {
              setModalOpen(false);
              if (createdRecipeId) navigate(`/edit-recipe/${createdRecipeId}`);
            }}
            className="w-full px-4 py-2 bg-pantonegreen text-white rounded hover:bg-pantoneyellow hover:text-pantoneblack transition font-bold"
          >
            ¡A cocinar!
          </button>
        }
      >
        ¡La receta se ha creado correctamente!
      </Modal>
    </>
  );
}

// Exporta el componente para su uso en las rutas
export default AddRecipePage;