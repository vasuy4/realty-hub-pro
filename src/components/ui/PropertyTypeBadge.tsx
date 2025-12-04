import { PropertyType } from '@/types';
import { getPropertyTypeLabel, cn } from '@/lib/utils';
import { Building2, Home, Trees } from 'lucide-react';

interface PropertyTypeBadgeProps {
  type: PropertyType;
  className?: string;
}

export function PropertyTypeBadge({ type, className }: PropertyTypeBadgeProps) {
  const icons = {
    apartment: Building2,
    house: Home,
    land: Trees,
  };

  const Icon = icons[type];

  return (
    <span
      className={cn(
        'entity-badge',
        type === 'apartment' && 'badge-apartment',
        type === 'house' && 'badge-house',
        type === 'land' && 'badge-land',
        className
      )}
    >
      <Icon className="w-3 h-3 mr-1" />
      {getPropertyTypeLabel(type)}
    </span>
  );
}
