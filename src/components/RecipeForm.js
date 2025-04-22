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
  onFormChange, // Nuevo prop para detectar cambios
}) {
  const [form, setForm] = useState({ ...initialValues });
  const [tagInput, setTagInput] = useState('');
  const [step, setStep] = useState(0); // Paso actual del wizard

  useEffect(() => {
    setForm({ ...initialValues });
  }, [initialValues]);

  // Notificar cambios al padre (AddRecipePage)
  useEffect(() => {
    if (onFormChange) onFormChange(form);
    // eslint-disable-next-line
  }, [form]);

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
    // Borra el localStorage al guardar la receta
    try {
      localStorage.removeItem('recetapp_add_recipe_draft');
    } catch (err) {
      // Ignorar errores de localStorage
    }
    onSubmit(form);
  };

  // Validación por paso (puedes mejorarla según tus reglas)
  const validateStep = () => {
    if (step === 0) {
      return form.name.trim();
    }
    if (step === 1) {
      return form.category;
    }
    if (step === 2) {
      return form.ingredients.length > 0 && form.ingredients.every(i => i.trim());
    }
    if (step === 3) {
      return form.steps.length > 0 && form.steps.every(s => s.title.trim() && s.description.trim());
    }
    // No validación estricta para los últimos pasos
    return true;
  };

  const steps = [
    'Básico',
    'Categoría',
    'Ingredientes',
    'Pasos',
    'Visibilidad'
  ];

  // Permitir ir a un step si ya está completado o es anterior al actual
  const canGoToStep = (targetStep) => {
    if (targetStep <= step) return true;
    for (let i = 0; i < targetStep; i++) {
      if (i === 0 && !form.name.trim()) return false;
      if (i === 1 && !form.category) return false;
      if (i === 2 && (!form.ingredients.length || !form.ingredients.every(ing => ing.trim()))) return false;
      if (i === 3 && (!form.steps.length || !form.steps.every(s => s.title.trim() && s.description.trim()))) return false;
    }
    return true;
  };

  // Stepper visual mejorado
  const renderStepper = () => (
    <div className="flex items-center justify-between mb-8 relative">
      {/* Línea de fondo completa */}
      <div className="absolute left-0 right-0 h-1 bg-gray-200 z-0" style={{ top: '115%' }}></div>
      {/* Línea de progreso */}
      <div
        className="absolute left-0 h-1 bg-pantoneyellow z-10 transition-all"
        style={{
          width: `${(step / (steps.length - 1)) * 100}%`,
          top: '115%',
        }}
      ></div>
      {steps.map((label, idx) => (
        <div key={label} className="flex-1 flex flex-col items-center relative z-20">
          <button
            type="button"
            disabled={!canGoToStep(idx)}
            onClick={() => canGoToStep(idx) && setStep(idx)}
            className={`w-8 h-8 flex items-center justify-center rounded-full font-bold border-2 transition-all focus:outline-none
              ${step === idx ? 'bg-pantonegreen text-white border-pantonegreen' : step > idx ? 'bg-pantoneyellow text-pantoneblack border-pantoneyellow' : 'bg-gray-200 text-gray-400 border-gray-300'}
              ${canGoToStep(idx) ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            title={label}
          >
            {idx + 1}
          </button>
          <span className={`text-xs mt-1 text-center ${step === idx ? 'text-pantonegreen font-bold' : 'text-gray-500'}`}>{label}</span>
        </div>
      ))}
    </div>
  );

  // Renderizado de cada paso
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <>
            <h2 className="text-xl font-bold mb-2">Nombre e imagen</h2>
            <div>
              <input
                type="text"
                placeholder="Nombre de la receta"
                value={form.name}
                onChange={e => handleChange('name', e.target.value)}
                className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : ''}`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block font-medium mb-1">Imagen principal</label>
              <input
                type="file"
                onChange={e => handleChange('image', e.target.files[0])}
                className="w-full p-2 border rounded"
              />
              {form.imageUrl && !form.image && (
                <img src={form.imageUrl} alt="Receta" className="w-20 h-20 object-cover rounded mt-2" />
              )}
            </div>
          </>
        );
      case 1:
        return (
          <>
            <h2 className="text-xl font-bold mb-2">Categoría</h2>
            <div>
              <select
                value={form.category}
                onChange={e => handleChange('category', e.target.value)}
                className={`w-full p-2 border rounded ${errors.category ? 'border-red-500' : ''}`}
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h2 className="text-xl font-bold mb-2">Ingredientes</h2>
            <div>
              <label className="block font-medium mb-1">Ingredientes</label>
              {form.ingredients.map((ing, idx) => (
                <div key={idx} className="flex gap-2 mb-1">
                  <input
                    type="text"
                    value={ing}
                    onChange={e => handleIngredientChange(idx, e.target.value)}
                    className={`flex-1 p-2 border rounded ${errors.ingredients ? 'border-red-500' : ''}`}
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
          </>
        );
      case 3:
        return (
          <>
            <h2 className="text-xl font-bold mb-2">Pasos de preparación</h2>
            <div>
              <label className="block font-medium mb-1">Pasos</label>
              {form.steps.map((stepObj, idx) => (
                <div key={idx} className="mb-3 p-2 border rounded bg-gray-50">
                  <input
                    type="text"
                    placeholder="Nombre del paso"
                    value={stepObj.title}
                    onChange={e => handleStepChange(idx, 'title', e.target.value)}
                    className={`w-full p-2 border rounded mb-1 ${errors.steps ? 'border-red-500' : ''}`}
                  />
                  <textarea
                    placeholder="Descripción del paso"
                    value={stepObj.description}
                    onChange={e => handleStepChange(idx, 'description', e.target.value)}
                    className={`w-full p-2 border rounded mb-1 ${errors.stepsDesc ? 'border-red-500' : ''}`}
                  />
                  <input
                    type="file"
                    onChange={e => handleStepChange(idx, 'image', e.target.files[0])}
                    className="w-full p-2 border rounded mb-1"
                  />
                  {stepObj.imageUrl && !stepObj.image && (
                    <img src={stepObj.imageUrl} alt="Paso" className="w-16 h-16 object-cover rounded mb-1" />
                  )}
                  {form.steps.length > 1 && (
                    <button type="button" onClick={() => handleRemoveStep(idx)} className="text-xs text-red-600">Eliminar paso</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={handleAddStep} className="text-xs text-pantonegreen underline">Agregar paso</button>
              {(errors.steps || errors.stepsDesc) && <p className="text-red-500 text-xs mt-1">{errors.steps || errors.stepsDesc}</p>}
            </div>
          </>
        );
      case 4:
        return (
          <>
            <h2 className="text-xl font-bold mb-2">Visibilidad y estado</h2>
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
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-7">
      <div className="max-w-4xl mx-auto bg-white rounded">
        {renderStepper()}
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderStep()}
          <div className="flex justify-between mt-6">
            {step > 0 && (
              <button type="button" onClick={() => setStep(step - 1)} className="px-4 py-2 bg-pantonebrown text-white rounded hover:bg-pantoneblack transition font-bold">
                Anterior
              </button>
            )}
            <div className="flex-1"></div>
            {step < 4 && (
              <button
                type="button"
                onClick={() => validateStep() && setStep(step + 1)}
                className={`px-4 py-2 bg-pantonegreen text-white rounded hover:bg-pantoneyellow hover:text-pantoneblack transition font-bold ml-auto ${!validateStep() ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!validateStep()}
              >
                Siguiente
              </button>
            )}{
              step === 4 && (
                <button
                  type="submit"
                  className={`px-4 py-2 bg-pantonegreen text-white rounded hover:bg-pantoneyellow hover:text-pantoneblack transition font-bold ml-auto ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : submitText}
                </button>
              )
            }
          </div>
        </form>
      </div>
    </div>
  );
}

export default RecipeForm;
