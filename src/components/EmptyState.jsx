import React from 'react';
import { Link } from 'react-router-dom';
import { Film } from 'lucide-react';

export default function EmptyState({
  icon: Icon = Film,
  title = 'No movies found',
  description = 'Try adjusting your search or filters to discover more titles.',
  actionText,
  actionLabel,
  onAction,
  actionLink
}) {
  const buttonLabel = actionText || actionLabel;

  return (
    <div className="py-16 px-4 sm:px-6 text-center bg-surface rounded-2xl border border-surface-border shadow-card my-8 max-w-2xl mx-auto">
      <div className="w-16 h-16 rounded-full bg-surface-muted border border-surface-border flex items-center justify-center mx-auto mb-4 text-cine-muted">
        <Icon className="w-8 h-8 stroke-[1.5] text-slate-400" />
      </div>
      <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-2">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-cine-muted max-w-md mx-auto mb-6 leading-relaxed">
        {description}
      </p>

      {actionLink && (
        <Link
          to={actionLink}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cine-accent text-white text-xs sm:text-sm font-semibold hover:bg-cine-accent-hover transition-colors shadow-subtle cursor-pointer"
        >
          {buttonLabel || 'Explore Movies'}
        </Link>
      )}

      {!actionLink && onAction && buttonLabel && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cine-accent text-white text-xs sm:text-sm font-semibold hover:bg-cine-accent-hover transition-colors shadow-subtle cursor-pointer"
        >
          {buttonLabel}
        </button>
      )}
    </div>
  );
}
