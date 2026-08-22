import React from 'react';
import { clsx } from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'surface' | 'glass' | 'interactive' | 'highlight';
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  glow = false,
  ...props
}) => {
  const baseStyles = 'rounded-2xl border transition-all duration-200';

  const variantStyles = {
    default: 'bg-surface border-border shadow-glow-card',
    surface: 'bg-surface-secondary border-border',
    glass: 'glass-surface shadow-glow-card',
    interactive: 'bg-surface border-border hover:border-primary/50 hover:shadow-glow-primary cursor-pointer',
    highlight: 'bg-surface border-primary/40 shadow-glow-primary',
  };

  return (
    <div
      className={clsx(
        baseStyles,
        variantStyles[variant],
        glow && 'shadow-glow-primary border-primary/40',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
