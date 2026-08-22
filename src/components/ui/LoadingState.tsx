import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

export interface LoadingStateProps {
  message?: string;
  description?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading data...',
  description,
  className,
  size = 'md',
}) => {
  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center py-12 px-6 text-center animate-fade-in',
        className
      )}
    >
      <div className="relative mb-4">
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-lg animate-pulse" />
        <Loader2 className={clsx('text-primary animate-spin relative z-10', iconSizes[size])} />
      </div>
      <h4 className="text-base font-semibold text-text mb-1">{message}</h4>
      {description && <p className="text-xs text-text-secondary max-w-sm">{description}</p>}
    </div>
  );
};
