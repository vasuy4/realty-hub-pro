import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/DataTable';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { PropertyTypeBadge } from '@/components/ui/PropertyTypeBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockNeeds, mockClients, mockRealtors, mockDeals } from '@/data/mockData';
import { getFullName, getShortAddress, formatPrice } from '@/lib/utils';
import { Need, PropertyType } from '@/types';
import { toast } from 'sonner';

export default function NeedsList() {
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState<PropertyType | 'all'>('all');
  const [deleteTarget, setDeleteTarget] = useState<Need | null>(null);

  let filteredNeeds = mockNeeds;
  if (typeFilter !== 'all') {
    filteredNeeds = filteredNeeds.filter(n => n.propertyType === typeFilter);
  }

  const isNeedInDeal = (needId: string) => mockDeals.some(d => d.needId === needId);

  const handleDelete = (need: Need) => {
    if (isNeedInDeal(need.id)) {
      toast.error('Невозможно удалить потребность', {
        description: 'Потребность участвует в сделке',
      });
      return;
    }
    setDeleteTarget(need);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      toast.success('Потребность удалена');
      setDeleteTarget(null);
    }
  };

  const columns = [
    {
      key: 'client',
      header: 'Клиент',
      render: (need: Need) => {
        const client = mockClients.find(c => c.id === need.clientId);
        return <span className="font-medium">{client ? getFullName(client) : '—'}</span>;
      },
    },
    {
      key: 'realtor',
      header: 'Риэлтор',
      render: (need: Need) => {
        const realtor = mockRealtors.find(r => r.id === need.realtorId);
        return realtor ? getFullName(realtor) : '—';
      },
    },
    {
      key: 'type',
      header: 'Тип объекта',
      render: (need: Need) => <PropertyTypeBadge type={need.propertyType} />,
    },
    {
      key: 'price',
      header: 'Бюджет',
      render: (need: Need) => (
        need.priceRange ? (
          <span className="text-sm">
            {need.priceRange.min && formatPrice(need.priceRange.min)}
            {need.priceRange.min && need.priceRange.max && ' — '}
            {need.priceRange.max && formatPrice(need.priceRange.max)}
          </span>
        ) : '—'
      ),
    },
    {
      key: 'address',
      header: 'Адрес',
      render: (need: Need) => need.address?.city || '—',
    },
    {
      key: 'status',
      header: 'Статус',
      render: (need: Need) => <StatusBadge status={need.status} />,
    },
    {
      key: 'actions',
      header: '',
      render: (need: Need) => (
        <div className="flex items-center gap-1 justify-end" onClick={e => e.stopPropagation()}>
          <Link to={`/needs/${need.id}/edit`}>
            <Button variant="ghost" size="sm">
              <Pencil className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(need)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
      className: 'w-24',
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Потребности</h1>
        <Link to="/needs/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Создать потребность
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as PropertyType | 'all')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Тип объекта" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все типы</SelectItem>
            <SelectItem value="apartment">Квартира</SelectItem>
            <SelectItem value="house">Дом</SelectItem>
            <SelectItem value="land">Земля</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        data={filteredNeeds}
        columns={columns}
        onRowClick={(need) => navigate(`/needs/${need.id}`)}
        emptyMessage="Потребности не найдены"
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Удалить потребность?"
        description="Вы уверены, что хотите удалить эту потребность?"
        confirmLabel="Удалить"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
