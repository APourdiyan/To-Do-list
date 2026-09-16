import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon | React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: IconOrNode,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = '',
}) => {
  const renderIcon = () => {
    if (!IconOrNode) return null;
    if (typeof IconOrNode === 'function') {
      const IconComponent = IconOrNode as LucideIcon;
      return <IconComponent size={28} className="text-amber-800" aria-hidden="true" />;
    }
    return IconOrNode;
  };

  return (
    <div
      role="region"
      aria-label={title}
      className={`text-center py-12 px-4 bg-stone-50/70 border border-dashed border-stone-300 rounded-3xl space-y-3 max-w-md mx-auto my-6 select-none ${className}`}
      dir="rtl"
    >
      {IconOrNode && (
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100/90 text-amber-900 flex items-center justify-center border border-amber-200/80 shadow-2xs">
          {renderIcon()}
        </div>
      )}

      <div className="space-y-1">
        <h3 className="text-sm font-black text-stone-800">{title}</h3>
        {description && (
          <p className="text-xs text-stone-600 leading-relaxed max-w-xs mx-auto">
            {description}
          </p>
        )}
      </div>

      {(onAction || onSecondaryAction) && (
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
          {onAction && actionLabel && (
            <button
              type="button"
              onClick={onAction}
              className="min-h-11 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70 focus:ring-offset-1 focus:ring-offset-white"
            >
              {actionLabel}
            </button>
          )}

          {onSecondaryAction && secondaryActionLabel && (
            <button
              type="button"
              onClick={onSecondaryAction}
              className="min-h-11 px-4 py-2 bg-stone-100 hover:bg-stone-200/80 text-stone-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70 focus:ring-offset-1 focus:ring-offset-white"
            >
              {secondaryActionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
