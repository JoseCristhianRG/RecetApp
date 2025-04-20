import React from 'react';

function Modal({ isOpen, title, subtitle, children, onClose, actions }) {
  if (!isOpen) return null;
  // Cierra el modal si se hace click fuera del contenido
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" onClick={handleBackdropClick}>
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px] max-w-[90vw] relative">
        {/* Botón de cerrar (cruz) */}
        <button
          onClick={onClose}
          className="modal-close-btn absolute"
          aria-label="Cerrar"
        >
          ×
        </button>
        {title && <h2 className="text-lg font-bold mb-3">{title}</h2>}
        <div className="mb-1">{children}</div>
        {subtitle && <div className="text-sm text-gray-500 mb-3">{subtitle}</div>}
        <div className="flex justify-end gap-2">
          {actions}
        </div>
      </div>
    </div>
  );
}

export default Modal;
