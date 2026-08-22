import React from 'react';
import { Badge } from './Badge';
import { SkillStatus } from '../../api/types';
import { CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

export interface StatusBadgeProps {
  status: SkillStatus | string;
  size?: 'sm' | 'md';
  className?: string;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className,
  showIcon = true,
}) => {
  const normalized = status.toUpperCase() as SkillStatus;

  switch (normalized) {
    case 'ACTIVE':
      return (
        <Badge variant="success" size={size} dot className={className}>
          {showIcon && <CheckCircle2 className="w-3 h-3 mr-0.5 text-success inline" />}
          ACTIVE
        </Badge>
      );
    case 'AGING':
      return (
        <Badge variant="warning" size={size} dot className={className}>
          {showIcon && <AlertTriangle className="w-3 h-3 mr-0.5 text-warning inline" />}
          AGING
        </Badge>
      );
    case 'STALE':
      return (
        <Badge variant="danger" size={size} dot className={className}>
          {showIcon && <AlertCircle className="w-3 h-3 mr-0.5 text-danger inline" />}
          STALE
        </Badge>
      );
    default:
      return (
        <Badge variant="neutral" size={size} className={className}>
          {status}
        </Badge>
      );
  }
};
