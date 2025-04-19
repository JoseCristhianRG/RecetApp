import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { CategoriesContext } from '../CategoriesContext';
import { AuthContext } from '../AuthContext';
import { Switch } from '@headlessui/react';

import { uploadImage } from '../firebase';

function EditRecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories } = useContext(CategoriesContext);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  const [steps, setSteps] = useState([{ title: '', description: '', image: null, imageUrl: '' }]);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [status, setStatus] = useState('draft');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
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
    fetchRecipe();
  }, [id]);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'El nombre es obligatorio.';
    if (!category) newErrors.category = 'Selecciona una categoría.';
    if (!ingredients[0] || ingredients.some((i) => !i.trim())) newErrors.ingredients = 'Agrega al menos un ingrediente.';
    if (!steps[0].title.trim() || steps.some((s) => !s.title.trim())) newErrors.steps = 'Cada paso debe tener un nombre.';
    if (!steps[0].description.trim() || steps.some((s) => !s.description.trim())) newErrors.stepsDesc = 'Cada paso debe tener una descripción.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddTag = () => {
    const newTag = tagInput.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setTagInput('');
    }
  };
  const handleRemoveTag = (tag) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    let newImageUrl = imageUrl;
    if (image) {
      // Subir imagen principal a recipes/ID_RECETA/imagen.png
      newImageUrl = await uploadImage(image, `recipes/${id}/imagen.png`);
    }
    await updateDoc(doc(db, 'recipes', id), {
      name,
      category,
      ingredients,
      imageUrl: newImageUrl,
      isPublic,
      status,
      tags,
    });
    // Actualizar pasos existentes y agregar nuevos
    for (let i = 0; i < steps.length; i++) {
      let stepImageUrl = steps[i].imageUrl || '';
      if (steps[i].image) {
        stepImageUrl = await uploadImage(steps[i].image, `steps/${id}`);
      }
      if (steps[i].stepId) {
        // Actualizar paso existente
        await updateDoc(doc(db, 'steps', steps[i].stepId), {
          title: steps[i].title,
          description: steps[i].description,
          imageUrl: stepImageUrl,
        });
      } else {
        // Crear nuevo paso
        await addDoc(collection(db, 'steps'), {
          recipeId: id,
          order: i,
          title: steps[i].title,
          description: steps[i].description,
          imageUrl: stepImageUrl,
        });
      }
    }
    navigate('/mis-recetas');
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="p-6 py-3">
      <div className="max-w-md md:max-w-2xl xl:max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Editar Receta</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ...resto del formulario... */}
          <div>
            <input
              type="text"
              placeholder="Nombre de la receta"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full p-2 border rounded ${errors.category ? 'border-red-500' : ''}`}
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>
          <div>
            <label className="block font-medium mb-1">Ingredientes</label>
            {ingredients.map((ing, idx) => (
              <div key={idx} className="flex gap-2 mb-1">
                <input
                  type="text"
                  value={ing}
                  onChange={(e) => {
                    const newIngs = [...ingredients];
                    newIngs[idx] = e.target.value;
                    setIngredients(newIngs);
                  }}
                  className={`flex-1 p-2 border rounded ${errors.ingredients ? 'border-red-500' : ''}`}
                />
                {ingredients.length > 1 && (
                  <button type="button" onClick={() => setIngredients(ingredients.filter((_, i) => i !== idx))} className="px-2 text-red-600">✕</button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => setIngredients([...ingredients, ''])} className="text-xs text-pantonegreen underline">Agregar ingrediente</button>
            {errors.ingredients && <p className="text-red-500 text-xs mt-1">{errors.ingredients}</p>}
          </div>
          <div>
            <label className="block font-medium mb-1">Pasos</label>
            {steps.map((step, idx) => (
              <div key={idx} className="mb-3 p-2 border rounded bg-gray-50">
                <input
                  type="text"
                  placeholder="Nombre del paso"
                  value={step.title}
                  onChange={e => {
                    const newSteps = [...steps];
                    newSteps[idx].title = e.target.value;
                    setSteps(newSteps);
                  }}
                  className={`w-full p-2 border rounded mb-1 ${errors.steps ? 'border-red-500' : ''}`}
                />
                <textarea
                  placeholder="Descripción del paso"
                  value={step.description}
                  onChange={e => {
                    const newSteps = [...steps];
                    newSteps[idx].description = e.target.value;
                    setSteps(newSteps);
                  }}
                  className={`w-full p-2 border rounded mb-1 ${errors.stepsDesc ? 'border-red-500' : ''}`}
                />
                <input
                  type="file"
                  onChange={e => {
                    const newSteps = [...steps];
                    newSteps[idx].image = e.target.files[0];
                    setSteps(newSteps);
                  }}
                  className="w-full p-2 border rounded mb-1"
                />
                {step.imageUrl && !step.image && (
                  <img src={step.imageUrl} alt="Paso" className="w-16 h-16 object-cover rounded mb-1" />
                )}
                {steps.length > 1 && (
                  <button type="button" onClick={() => setSteps(steps.filter((_, i) => i !== idx))} className="text-xs text-red-600">Eliminar paso</button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => setSteps([...steps, { title: '', description: '', image: null, imageUrl: '' }])} className="text-xs text-pantonegreen underline">Agregar paso</button>
            {(errors.steps || errors.stepsDesc) && <p className="text-red-500 text-xs mt-1">{errors.steps || errors.stepsDesc}</p>}
          </div>
          <div>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full p-2 border rounded"
            />
            {imageUrl && !image && (
              <img src={imageUrl} alt="Receta" className="w-20 h-20 object-cover rounded mt-2" />
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Visibilidad</label>
            <Switch
              checked={isPublic}
              onChange={setIsPublic}
              className={`${isPublic ? 'bg-pantonegreen' : 'bg-pantonebrown'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
            >
              <span className="sr-only">Pública</span>
              <span
                className={`${isPublic ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
            <span className="ml-3 text-sm font-medium">{isPublic ? 'Pública' : 'Privada'}</span>
          </div>
          <div>
            <label className="block font-medium mb-1">Estado</label>
            <Switch
              checked={status === 'published'}
              onChange={v => setStatus(v ? 'published' : 'draft')}
              className={`${status === 'published' ? 'bg-blue-600' : 'bg-pantoneyellow'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
            >
              <span className="sr-only">Publicada</span>
              <span
                className={`${status === 'published' ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
            <span className="ml-3 text-sm font-medium">{status === 'published' ? 'Publicada' : 'Borrador'}</span>
          </div>
          <div>
            <label className="block font-medium mb-1">Etiquetas</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                className="flex-1 p-2 border rounded"
                placeholder="Añadir etiqueta"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <button type="button" onClick={handleAddTag} className="px-3 py-1 bg-pantonegreen text-white rounded">Agregar</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span key={tag} className="bg-pantoneyellow text-pantoneblack px-2 py-1 rounded text-xs flex items-center gap-1">
                  {tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="text-pantonebrown font-bold ml-1">×</button>
                </span>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition w-full"
          >
            Guardar cambios
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditRecipePage;
