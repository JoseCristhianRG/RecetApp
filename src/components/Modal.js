import React, { useEffect } from 'react';

function Modal({ isOpen, title, subtitle, children, onClose, actions }) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="modal-backdrop animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="modal-content relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-cream-200 text-cocoa
            hover:bg-cream-300 transition-all duration-200 hover:scale-105"
          aria-label="Cerrar"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        {title && (
          <div className="mb-4 pr-8">
            <h2 className="font-display text-xl font-bold text-cocoa">{title}</h2>
            {subtitle && (
              <p className="font-body text-sm text-cocoa-light mt-1">{subtitle}</p>
            )}
          </div>
        )}

        {/* Content */}
        <div className="mb-6">
          {children}
        </div>

        {/* Actions */}
        {actions && (
          <div className="pt-4 border-t border-cream-200">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
