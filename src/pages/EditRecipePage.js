// Importaciones principales de React, hooks, contextos y dependencias de Firebase
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { CategoriesContext } from '../CategoriesContext';
import { AuthContext } from '../AuthContext';
import { Switch } from '@headlessui/react';

import { uploadImage } from '../firebase';
import RecipeForm from '../components/RecipeForm';
import Modal from '../components/Modal';
import { LoadingSpinner } from '../components/ui';

// Componente para editar una receta existente
function EditRecipePage() {
  // Obtiene el ID de la receta desde la URL y navegación
  const { id } = useParams();
  const navigate = useNavigate();
  // Obtiene las categorías y el usuario autenticado desde el contexto
  const { categories } = useContext(CategoriesContext);
  const { user } = useContext(AuthContext);
  // Estados para los campos del formulario, pasos, imagen y control de errores
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  const [steps, setSteps] = useState([{ title: '', description: '', image: null, imageUrl: '' }]);
  const [imageUrl, setImageUrl] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [status, setStatus] = useState('draft');
  const [tags, setTags] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // --- EXTRAE fetchRecipe FUERA DEL useEffect ---
  async function fetchRecipe() {
    const recipeRef = doc(db, 'recipes', id);
    const recipeSnap = await getDoc(recipeRef);
    if (recipeSnap.exists()) {
      const data = recipeSnap.data();
      setName(data.name || '');
      setCategory(data.category || '');
      setIngredients(data.ingredients || ['']);
      setImageUrl(data.imageUrl || '');
      setIsPublic(data.isPublic !== false);
      setStatus(data.status || 'draft');
      setTags(data.tags || []);
      // Cargar pasos relacionados
      const stepsQuery = query(collection(db, 'steps'), where('recipeId', '==', id));
      const stepsSnap = await getDocs(stepsQuery);
      const stepsArr = stepsSnap.docs
        .map(doc => ({ ...doc.data(), id: doc.id }))
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setSteps(
        stepsArr.length > 0
          ? stepsArr.map(s => ({
              title: s.title || '',
              description: s.description || '',
              image: null,
              imageUrl: s.imageUrl || '',
              stepId: s.id
            }))
          : [{ title: '', description: '', image: null, imageUrl: '' }]
      );
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchRecipe();
  }, [id]);

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

  const handleSubmit = async (form) => {
    if (!validate(form)) return;
    setLoading(true);
    let newImageUrl = form.imageUrl;
    if (form.image) {
      newImageUrl = await uploadImage(form.image, `recipes/${id}/imagen.png`);
    }
    await updateDoc(doc(db, 'recipes', id), {
      name: form.name,
      category: form.category,
      ingredients: form.ingredients,
      imageUrl: newImageUrl,
      isPublic: form.isPublic,
      status: form.status,
      tags: form.tags,
    });
    for (let i = 0; i < form.steps.length; i++) {
      let stepImageUrl = form.steps[i].imageUrl || '';
      if (form.steps[i].image) {
        stepImageUrl = await uploadImage(form.steps[i].image, `steps/${id}`);
      }
      if (form.steps[i].stepId) {
        await updateDoc(doc(db, 'steps', form.steps[i].stepId), {
          title: form.steps[i].title,
          description: form.steps[i].description,
          imageUrl: stepImageUrl,
        });
      } else {
        await addDoc(collection(db, 'steps'), {
          recipeId: id,
          order: i,
          title: form.steps[i].title,
          description: form.steps[i].description,
          imageUrl: stepImageUrl,
        });
      }
    }
    setModalOpen(true);
    setLoading(false);
  };

  if (loading || !name) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner size="lg" text="Cargando receta..." />
      </div>
    );
  }

  const initialValues = {
    name,
    category,
    ingredients,
    steps,
    image: null,
    imageUrl,
    isPublic,
    status,
    tags,
  };

  return (
    <>
      <RecipeForm
        initialValues={initialValues}
        categories={categories}
        loading={loading}
        errors={errors}
        onSubmit={handleSubmit}
        title="Editar Receta"
        submitText="Guardar cambios"
        isEdit={true}
      />
      <Modal
        isOpen={modalOpen}
        title="Receta actualizada"
        subtitle="¡Tus cambios se han guardado correctamente!"
        onClose={() => {
          setModalOpen(false);
          fetchRecipe();
        }}
        actions={
          <button
            onClick={() => {
              setModalOpen(false);
              fetchRecipe();
            }}
            className="w-full px-4 py-2 bg-forest text-white rounded hover:bg-honey hover:text-cocoa transition font-bold"
          >
            ¡A cocinar!
          </button>
        }
      >
        Puedes seguir editando o volver a tus recetas.
      </Modal>
    </>
  );
}

// Exporta el componente para su uso en las rutas
export default EditRecipePage;
