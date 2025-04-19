import React from 'react';

function Modal({ isOpen, title, children, onClose, actions }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px] max-w-[90vw]">
        {title && <h2 className="text-lg font-bold mb-4">{title}</h2>}
        <div className="mb-4">{children}</div>
        <div className="flex justify-end gap-2">
          {actions}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
