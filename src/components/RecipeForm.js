import React, { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';

function RecipeForm({
  initialValues,
  categories,
  loading,
  errors = {},
  onSubmit,
  title = 'Receta',
  submitText = 'Guardar',
  isEdit = false,
}) {
  const [form, setForm] = useState({ ...initialValues });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    setForm({ ...initialValues });
  }, [initialValues]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleIngredientChange = (idx, value) => {
    const newIngs = [...form.ingredients];
    newIngs[idx] = value;
    handleChange('ingredients', newIngs);
  };

  const handleAddIngredient = () => {
    handleChange('ingredients', [...form.ingredients, '']);
  };

  const handleRemoveIngredient = (idx) => {
    handleChange('ingredients', form.ingredients.filter((_, i) => i !== idx));
  };

  const handleStepChange = (idx, field, value) => {
    const newSteps = [...form.steps];
    newSteps[idx][field] = value;
    handleChange('steps', newSteps);
  };

  const handleAddStep = () => {
    handleChange('steps', [...form.steps, { title: '', description: '', image: null, imageUrl: '' }]);
  };

  const handleRemoveStep = (idx) => {
    handleChange('steps', form.steps.filter((_, i) => i !== idx));
  };

  const handleAddTag = () => {
    const newTag = tagInput.trim();
    if (newTag && !form.tags.includes(newTag)) {
      handleChange('tags', [...form.tags, newTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    handleChange('tags', form.tags.filter((t) => t !== tag));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="p-7">
      <div className="max-w-4xl mx-auto bg-white rounded">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <input
              type="text"
              placeholder="Nombre de la receta"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          {/* Categoría */}
          <div>
            <select
              value={form.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className={`w-full p-2 border rounded ${errors.category ? 'border-red-500' : ''}`}
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>
          {/* Imagen principal */}
          <div>
            <label className="block font-medium mb-1">Imagen principal</label>
            <input
              type="file"
              onChange={(e) => handleChange('image', e.target.files[0])}
              className="w-full p-2 border rounded"
            />
            {form.imageUrl && !form.image && (
              <img src={form.imageUrl} alt="Receta" className="w-20 h-20 object-cover rounded mt-2" />
            )}
          </div>
          {/* Ingredientes */}
          <div>
            <label className="block font-medium mb-1">Ingredientes</label>
            {form.ingredients.map((ing, idx) => (
              <div key={idx} className="flex gap-2 mb-1">
                <input
                  type="text"
                  value={ing}
                  onChange={(e) => handleIngredientChange(idx, e.target.value)}
                  className={`flex-1 p-2 border rounded ${errors.ingredients ? 'border-red-500' : ''}`}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (ing.trim() && (idx === form.ingredients.length - 1 || form.ingredients[idx + 1] !== '')) {
                        handleAddIngredient();
                        setTimeout(() => {
                          const nextInput = document.getElementById(`ingredient-input-${idx + 1}`);
                          if (nextInput) nextInput.focus();
                        }, 0);
                      }
                    }
                  }}
                  id={`ingredient-input-${idx}`}
                />
                {form.ingredients.length > 1 && (
                  <button type="button" onClick={() => handleRemoveIngredient(idx)} className="px-2 text-red-600">✕</button>
                )}
              </div>
            ))}
            <button type="button" onClick={handleAddIngredient} className="text-xs text-pantonegreen underline">Agregar ingrediente</button>
            {errors.ingredients && <p className="text-red-500 text-xs mt-1">{errors.ingredients}</p>}
          </div>
          {/* Pasos */}
          <div>
            <label className="block font-medium mb-1">Pasos</label>
            {form.steps.map((step, idx) => (
              <div key={idx} className="mb-3 p-2 border rounded bg-gray-50">
                <input
                  type="text"
                  placeholder="Nombre del paso"
                  value={step.title}
                  onChange={e => handleStepChange(idx, 'title', e.target.value)}
                  className={`w-full p-2 border rounded mb-1 ${errors.steps ? 'border-red-500' : ''}`}
                />
                <textarea
                  placeholder="Descripción del paso"
                  value={step.description}
                  onChange={e => handleStepChange(idx, 'description', e.target.value)}
                  className={`w-full p-2 border rounded mb-1 ${errors.stepsDesc ? 'border-red-500' : ''}`}
                />
                <input
                  type="file"
                  onChange={e => handleStepChange(idx, 'image', e.target.files[0])}
                  className="w-full p-2 border rounded mb-1"
                />
                {step.imageUrl && !step.image && (
                  <img src={step.imageUrl} alt="Paso" className="w-16 h-16 object-cover rounded mb-1" />
                )}
                {form.steps.length > 1 && (
                  <button type="button" onClick={() => handleRemoveStep(idx)} className="text-xs text-red-600">Eliminar paso</button>
                )}
              </div>
            ))}
            <button type="button" onClick={handleAddStep} className="text-xs text-pantonegreen underline">Agregar paso</button>
            {(errors.steps || errors.stepsDesc) && <p className="text-red-500 text-xs mt-1">{errors.steps || errors.stepsDesc}</p>}
          </div>
          {/* Visibilidad */}
          <div>
            <label className="block font-medium mb-1">Visibilidad</label>
            <Switch
              checked={form.isPublic}
              onChange={v => handleChange('isPublic', v)}
              className={`${form.isPublic ? 'bg-pantonegreen' : 'bg-pantonebrown'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
            >
              <span className="sr-only">Pública</span>
              <span
                className={`${form.isPublic ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
            <span className="ml-3 text-sm font-medium">{form.isPublic ? 'Pública' : 'Privada'}</span>
          </div>
          {/* Estado */}
          <div>
            <label className="block font-medium mb-1">Estado</label>
            <Switch
              checked={form.status === 'published'}
              onChange={v => handleChange('status', v ? 'published' : 'draft')}
              className={`${form.status === 'published' ? 'bg-blue-600' : 'bg-pantoneyellow'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
            >
              <span className="sr-only">Publicada</span>
              <span
                className={`${form.status === 'published' ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
            <span className="ml-3 text-sm font-medium">{form.status === 'published' ? 'Publicada' : 'Borrador'}</span>
          </div>
          {/* Etiquetas */}
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
              {form.tags.map(tag => (
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
            disabled={loading}
          >
            {submitText}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RecipeForm;
