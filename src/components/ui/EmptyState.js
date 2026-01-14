import React from 'react';

function EmptyState({
  icon,
  title,
  description,
  action,
  actionText,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in">
      {icon && (
        <div className="w-20 h-20 mb-4 text-cocoa/50">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold text-cocoa mb-2">{title}</h3>
      {description && (
        <p className="text-cocoa max-w-sm mb-6">{description}</p>
      )}
      {action && (
        <button
          onClick={onAction}
          className="px-6 py-2 bg-forest text-white rounded-lg font-semibold hover:bg-forest-dark transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
