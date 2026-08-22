import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { clsx } from 'clsx';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'An error occurred',
  message,
  onRetry,
  className,
}) => {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center py-10 px-6 text-center rounded-2xl bg-danger-surface border border-danger-border animate-fade-in',
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-danger/20 flex items-center justify-center text-danger mb-4 border border-danger/30">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-text mb-1">{title}</h4>
      <p className="text-xs text-text-secondary max-w-md mb-6">{message}</p>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Try Again
        </Button>
      )}
    </div>
  );
};
