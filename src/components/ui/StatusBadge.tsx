import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'active' | 'in_deal' | 'closed' | 'satisfied';
  className?: string;
}

const statusLabels: Record<string, string> = {
  active: 'Активно',
  in_deal: 'В сделке',
  closed: 'Закрыто',
  satisfied: 'Удовлетворено',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'entity-badge',
        (status === 'active') && 'badge-active',
        (status === 'in_deal' || status === 'closed' || status === 'satisfied') && 'badge-closed',
        className
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
