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
  onFormChange,
}) {
  // Ensure all required fields have default values
  const safeInitialValues = {
    name: '',
    category: '',
    ingredients: [''],
    steps: [{ title: '', description: '', image: null, imageUrl: '' }],
    image: null,
    imageUrl: '',
    isPublic: true,
    status: 'draft',
    tags: [],
    ...initialValues,
  };

  const [form, setForm] = useState(safeInitialValues);
  const [tagInput, setTagInput] = useState('');
  const [step, setStep] = useState(0);

  useEffect(() => {
    setForm({
      name: '',
      category: '',
      ingredients: [''],
      steps: [{ title: '', description: '', image: null, imageUrl: '' }],
      image: null,
      imageUrl: '',
      isPublic: true,
      status: 'draft',
      tags: [],
      ...initialValues,
    });
  }, [initialValues]);

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
    const currentTags = form.tags || [];
    if (newTag && !currentTags.includes(newTag)) {
      handleChange('tags', [...currentTags, newTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    const currentTags = form.tags || [];
    handleChange('tags', currentTags.filter((t) => t !== tag));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      localStorage.removeItem('recetapp_add_recipe_draft');
    } catch (err) {}
    onSubmit(form);
  };

  const validateStep = () => {
    if (step === 0) return form.name.trim();
    if (step === 1) return form.category;
    if (step === 2) return form.ingredients.length > 0 && form.ingredients.every(i => i.trim());
    if (step === 3) return form.steps.length > 0 && form.steps.every(s => s.title.trim() && s.description.trim());
    return true;
  };

  const stepLabels = [
    { label: 'Básico', icon: '📝' },
    { label: 'Categoría', icon: '📂' },
    { label: 'Ingredientes', icon: '🥗' },
    { label: 'Pasos', icon: '👨‍🍳' },
    { label: 'Publicar', icon: '🚀' }
  ];

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

  const renderStepper = () => (
    <div className="mb-8">
      {/* Progress bar */}
      <div className="relative h-2 bg-cream-200 rounded-full overflow-hidden mb-6">
        <div
          className="absolute left-0 top-0 h-full bg-gradient-forest rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(step / (stepLabels.length - 1)) * 100}%` }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex justify-between">
        {stepLabels.map((item, idx) => (
          <button
            key={item.label}
            type="button"
            disabled={!canGoToStep(idx)}
            onClick={() => canGoToStep(idx) && setStep(idx)}
            className={`flex flex-col items-center transition-all duration-300 group
              ${canGoToStep(idx) ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-2
              transition-all duration-300 shadow-soft
              ${step === idx
                ? 'bg-gradient-forest text-white scale-110 shadow-glow-forest'
                : step > idx
                  ? 'bg-mint text-forest'
                  : 'bg-cream-200 text-cocoa-light'
              }
              ${canGoToStep(idx) && step !== idx ? 'group-hover:scale-105' : ''}`}
            >
              {step > idx ? '✓' : item.icon}
            </div>
            <span className={`text-xs font-display font-medium hidden sm:block
              ${step === idx ? 'text-forest' : 'text-cocoa-light'}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <div className="text-center mb-6">
              <h2 className="font-display text-2xl font-bold text-cocoa">Nombre e imagen</h2>
              <p className="font-body text-cocoa-light text-sm mt-1">Dale un nombre a tu receta y sube una foto</p>
            </div>

            {/* Image upload */}
            <div className="flex flex-col items-center">
              <label
                htmlFor="main-image-upload"
                className="relative w-full max-w-sm aspect-video rounded-2xl overflow-hidden cursor-pointer
                  border-2 border-dashed border-cocoa/20 hover:border-forest transition-all duration-300
                  group bg-cream-100"
              >
                {form.image ? (
                  <img
                    src={URL.createObjectURL(form.image)}
                    alt="Previsualización"
                    className="w-full h-full object-cover"
                  />
                ) : form.imageUrl ? (
                  <img
                    src={form.imageUrl}
                    alt="Receta"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-forest/10 flex items-center justify-center mb-3
                      group-hover:bg-forest/20 transition-colors">
                      <svg className="w-8 h-8 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="font-display font-medium text-cocoa-light">Subir imagen</span>
                    <span className="text-xs text-cocoa-lighter mt-1">Click para seleccionar</span>
                  </div>
                )}
                {(form.image || form.imageUrl) && (
                  <div className="absolute inset-0 bg-cocoa/50 opacity-0 group-hover:opacity-100
                    flex items-center justify-center transition-opacity">
                    <span className="text-white font-display font-medium">Cambiar imagen</span>
                  </div>
                )}
              </label>
              <input
                id="main-image-upload"
                type="file"
                accept="image/*"
                onChange={e => handleChange('image', e.target.files[0])}
                className="hidden"
              />
            </div>

            {/* Name input */}
            <div>
              <label className="block font-display font-medium text-cocoa text-sm mb-2">
                Nombre de la receta
              </label>
              <input
                type="text"
                placeholder="Ej: Pasta a la carbonara"
                value={form.name}
                onChange={e => handleChange('name', e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (form.name.trim()) setStep(step + 1);
                  }
                }}
                className={`input ${errors.name ? 'input-error' : ''}`}
              />
              {errors.name && <p className="text-tangerine text-xs mt-2">{errors.name}</p>}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <div className="text-center mb-6">
              <h2 className="font-display text-2xl font-bold text-cocoa">Categoría</h2>
              <p className="font-body text-cocoa-light text-sm mt-1">¿En qué categoría encaja tu receta?</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleChange('category', cat.name)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300
                    flex flex-col items-center justify-center text-center min-h-[100px]
                    ${form.category === cat.name
                      ? 'border-forest bg-forest/10 shadow-soft'
                      : 'border-cream-200 bg-white hover:border-forest/50 hover:bg-cream-100'
                    }`}
                >
                  {cat.image && (
                    <img src={cat.image} alt={cat.name} className="w-10 h-10 rounded-full object-cover mb-2" />
                  )}
                  <span className={`font-display font-semibold text-sm
                    ${form.category === cat.name ? 'text-forest' : 'text-cocoa'}`}>
                    {cat.name}
                  </span>
                  {form.category === cat.name && (
                    <span className="text-forest text-lg mt-1">✓</span>
                  )}
                </button>
              ))}
            </div>
            {errors.category && <p className="text-tangerine text-xs mt-2 text-center">{errors.category}</p>}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <div className="text-center mb-6">
              <h2 className="font-display text-2xl font-bold text-cocoa">Ingredientes</h2>
              <p className="font-body text-cocoa-light text-sm mt-1">Lista todos los ingredientes necesarios</p>
            </div>

            <div className="space-y-3">
              {form.ingredients.map((ing, idx) => (
                <div key={idx} className="flex gap-2 items-center animate-fade-in-up"
                  style={{ animationDelay: `${idx * 0.05}s` }}>
                  <div className="w-8 h-8 rounded-full bg-forest/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-forest font-display font-bold text-sm">{idx + 1}</span>
                  </div>
                  <input
                    type="text"
                    value={ing}
                    onChange={e => handleIngredientChange(idx, e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (idx < form.ingredients.length - 1) {
                          const nextInput = document.getElementById(`ingredient-input-${idx + 1}`);
                          if (nextInput) nextInput.focus();
                        } else {
                          handleAddIngredient();
                          setTimeout(() => {
                            const newInput = document.getElementById(`ingredient-input-${form.ingredients.length}`);
                            if (newInput) newInput.focus();
                          }, 50);
                        }
                      }
                    }}
                    placeholder="Ej: 200g de harina"
                    className={`input flex-1 ${errors.ingredients ? 'input-error' : ''}`}
                    id={`ingredient-input-${idx}`}
                  />
                  {form.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(idx)}
                      className="p-2 rounded-full text-tangerine hover:bg-tangerine-50 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddIngredient}
              className="w-full py-3 border-2 border-dashed border-forest/30 rounded-2xl
                text-forest font-display font-medium hover:bg-forest/5 transition-colors
                flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Agregar ingrediente
            </button>

            {errors.ingredients && <p className="text-tangerine text-xs mt-2 text-center">{errors.ingredients}</p>}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <div className="text-center mb-6">
              <h2 className="font-display text-2xl font-bold text-cocoa">Pasos de preparación</h2>
              <p className="font-body text-cocoa-light text-sm mt-1">Describe cada paso para preparar tu receta</p>
            </div>

            <div className="space-y-4">
              {form.steps.map((stepObj, idx) => (
                <div key={idx} className="bg-cream-100 rounded-2xl p-4 animate-fade-in-up"
                  style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-forest flex items-center justify-center">
                      <span className="text-white font-display font-bold">{idx + 1}</span>
                    </div>
                    <span className="font-display font-semibold text-cocoa">Paso {idx + 1}</span>
                    {form.steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveStep(idx)}
                        className="ml-auto p-2 text-tangerine hover:bg-tangerine-50 rounded-full transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    placeholder="Título del paso (ej: Preparar la masa)"
                    value={stepObj.title}
                    onChange={e => handleStepChange(idx, 'title', e.target.value)}
                    className={`input mb-3 ${errors.steps ? 'input-error' : ''}`}
                  />

                  <textarea
                    placeholder="Describe este paso en detalle..."
                    value={stepObj.description}
                    onChange={e => handleStepChange(idx, 'description', e.target.value)}
                    rows={3}
                    className={`input resize-none mb-3 ${errors.stepsDesc ? 'input-error' : ''}`}
                  />

                  <div className="flex items-center gap-3">
                    <label className="flex-1 py-2 px-4 border-2 border-dashed border-cocoa/20 rounded-xl
                      text-cocoa-light text-sm font-medium cursor-pointer hover:border-forest/50 transition-colors
                      flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {stepObj.image ? 'Cambiar imagen' : 'Agregar imagen'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleStepChange(idx, 'image', e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                    {(stepObj.imageUrl || stepObj.image) && (
                      <img
                        src={stepObj.image ? URL.createObjectURL(stepObj.image) : stepObj.imageUrl}
                        alt={`Paso ${idx + 1}`}
                        className="w-16 h-16 object-cover rounded-xl"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddStep}
              className="w-full py-3 border-2 border-dashed border-forest/30 rounded-2xl
                text-forest font-display font-medium hover:bg-forest/5 transition-colors
                flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Agregar paso
            </button>

            {(errors.steps || errors.stepsDesc) && (
              <p className="text-tangerine text-xs mt-2 text-center">{errors.steps || errors.stepsDesc}</p>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <div className="text-center mb-6">
              <h2 className="font-display text-2xl font-bold text-cocoa">Configuración final</h2>
              <p className="font-body text-cocoa-light text-sm mt-1">Configura la visibilidad y añade etiquetas</p>
            </div>

            {/* Recipe Summary */}
            <div className="bg-gradient-to-br from-forest/5 to-mint/10 rounded-2xl p-4 border border-forest/10">
              <h3 className="font-display font-semibold text-forest mb-3 flex items-center gap-2">
                <span className="text-lg">📋</span> Resumen de tu receta
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-cocoa-light">Nombre:</span>
                  <span className="font-medium text-cocoa">{form.name || 'Sin nombre'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-cocoa-light">Categoría:</span>
                  <span className="font-medium text-cocoa">{form.category || 'Sin categoría'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-cocoa-light">Ingredientes:</span>
                  <span className="font-medium text-cocoa">{form.ingredients?.filter(i => i.trim()).length || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-cocoa-light">Pasos:</span>
                  <span className="font-medium text-cocoa">{form.steps?.length || 0}</span>
                </div>
              </div>
            </div>

            {/* Visibility Toggle */}
            <div className="bg-cream-100 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-semibold text-cocoa">Visibilidad</h3>
                  <p className="text-sm text-cocoa-light">
                    {form.isPublic !== false ? 'Todos pueden ver tu receta' : 'Solo tú puedes ver esta receta'}
                  </p>
                </div>
                <Switch
                  checked={form.isPublic !== false}
                  onChange={v => handleChange('isPublic', v)}
                  className={`${form.isPublic !== false ? 'bg-forest' : 'bg-cocoa-lighter'}
                    relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none`}
                >
                  <span className={`${form.isPublic !== false ? 'translate-x-6' : 'translate-x-1'}
                    inline-block h-5 w-5 transform rounded-full bg-white shadow-soft transition-transform`}
                  />
                </Switch>
              </div>
            </div>

            {/* Status Toggle */}
            <div className="bg-cream-100 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-semibold text-cocoa">Estado</h3>
                  <p className="text-sm text-cocoa-light">
                    {form.status === 'published' ? 'Publicada y lista' : 'Guardada como borrador'}
                  </p>
                </div>
                <Switch
                  checked={form.status === 'published'}
                  onChange={v => handleChange('status', v ? 'published' : 'draft')}
                  className={`${form.status === 'published' ? 'bg-tangerine' : 'bg-honey'}
                    relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none`}
                >
                  <span className={`${form.status === 'published' ? 'translate-x-6' : 'translate-x-1'}
                    inline-block h-5 w-5 transform rounded-full bg-white shadow-soft transition-transform`}
                  />
                </Switch>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-cream-100 rounded-2xl p-4">
              <h3 className="font-display font-semibold text-cocoa mb-3">Etiquetas</h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  className="input flex-1"
                  placeholder="Añadir etiqueta..."
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="btn-primary px-4"
                >
                  Agregar
                </button>
              </div>
              {(form.tags?.length > 0) && (
                <div className="flex flex-wrap gap-2">
                  {form.tags.map(tag => (
                    <span key={tag} className="badge-honey flex items-center gap-2">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-tangerine transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft-lg p-6 border border-white/50">
        {renderStepper()}

        <form onSubmit={handleSubmit}>
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-cream-200">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="btn-secondary"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Anterior
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => validateStep() && setStep(step + 1)}
                className={`btn-primary ${!validateStep() ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!validateStep()}
              >
                Siguiente
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                type="submit"
                className={`btn-accent ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Guardando...
                  </>
                ) : (
                  <>
                    {submitText}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default RecipeForm;
