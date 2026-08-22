import React from 'react';
import { clsx } from 'clsx';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'neutral',
  size = 'md',
  dot = false,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full border';

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  const variantStyles = {
    primary: 'bg-primary/10 text-primary-light border-primary/30',
    secondary: 'bg-surface-secondary text-text-secondary border-border',
    success: 'bg-success-surface text-success border-success-border',
    warning: 'bg-warning-surface text-warning border-warning-border',
    danger: 'bg-danger-surface text-danger border-danger-border',
    neutral: 'bg-surface text-text-secondary border-border',
  };

  const dotStyles = {
    primary: 'bg-primary',
    secondary: 'bg-text-secondary',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
    neutral: 'bg-text-muted',
  };

  return (
    <span
      className={clsx(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {dot && (
        <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0 animate-pulse', dotStyles[variant])} />
      )}
      <span>{children}</span>
    </span>
  );
};
