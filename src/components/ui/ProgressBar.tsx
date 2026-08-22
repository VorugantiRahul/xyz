import React from 'react';
import { clsx } from 'clsx';

export interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'auto';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  variant = 'auto',
  size = 'md',
  showLabel = false,
  label,
  className,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  let colorClass = 'bg-primary';
  if (variant === 'auto') {
    if (percentage >= 80) {
      colorClass = 'bg-success';
    } else if (percentage >= 50) {
      colorClass = 'bg-warning';
    } else {
      colorClass = 'bg-danger';
    }
  } else if (variant === 'primary') {
    colorClass = 'bg-primary';
  } else if (variant === 'success') {
    colorClass = 'bg-success';
  } else if (variant === 'warning') {
    colorClass = 'bg-warning';
  } else if (variant === 'danger') {
    colorClass = 'bg-danger';
  }

  const heightStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={clsx('w-full', className)}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
          <span className="text-text-secondary">{label}</span>
          <span className="text-text font-mono">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={clsx('w-full bg-surface-secondary rounded-full overflow-hidden border border-border/60 p-[1px]', heightStyles[size])}>
        <div
          className={clsx('h-full rounded-full transition-all duration-500 ease-out', colorClass)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
