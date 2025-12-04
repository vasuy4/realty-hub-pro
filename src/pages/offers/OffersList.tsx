import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/DataTable';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { PropertyTypeBadge } from '@/components/ui/PropertyTypeBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockOffers, mockProperties, mockClients, mockRealtors, mockDeals } from '@/data/mockData';
import { getFullName, getShortAddress, formatPrice } from '@/lib/utils';
import { Offer, PropertyType } from '@/types';
import { toast } from 'sonner';

export default function OffersList() {
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState<PropertyType | 'all'>('all');
  const [deleteTarget, setDeleteTarget] = useState<Offer | null>(null);

  let filteredOffers = mockOffers;
  if (typeFilter !== 'all') {
    filteredOffers = filteredOffers.filter(o => {
      const property = mockProperties.find(p => p.id === o.propertyId);
      return property?.type === typeFilter;
    });
  }

  const isOfferInDeal = (offerId: string) => mockDeals.some(d => d.offerId === offerId);

  const handleDelete = (offer: Offer) => {
    if (isOfferInDeal(offer.id)) {
      toast.error('Невозможно удалить предложение', {
        description: 'Предложение участвует в сделке',
      });
      return;
    }
    setDeleteTarget(offer);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      toast.success('Предложение удалено');
      setDeleteTarget(null);
    }
  };

  const columns = [
    {
      key: 'property',
      header: 'Объект',
      render: (offer: Offer) => {
        const property = mockProperties.find(p => p.id === offer.propertyId);
        return (
          <div>
            {property && <PropertyTypeBadge type={property.type} className="mb-1" />}
            <p className="font-medium">{property ? getShortAddress(property.address) : '—'}</p>
          </div>
        );
      },
    },
    {
      key: 'client',
      header: 'Клиент',
      render: (offer: Offer) => {
        const client = mockClients.find(c => c.id === offer.clientId);
        return client ? getFullName(client) : '—';
      },
    },
    {
      key: 'realtor',
      header: 'Риэлтор',
      render: (offer: Offer) => {
        const realtor = mockRealtors.find(r => r.id === offer.realtorId);
        return realtor ? getFullName(realtor) : '—';
      },
    },
    {
      key: 'price',
      header: 'Цена',
      render: (offer: Offer) => (
        <span className="font-semibold text-primary">{formatPrice(offer.price)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Статус',
      render: (offer: Offer) => <StatusBadge status={offer.status} />,
    },
    {
      key: 'actions',
      header: '',
      render: (offer: Offer) => (
        <div className="flex items-center gap-1 justify-end" onClick={e => e.stopPropagation()}>
          <Link to={`/offers/${offer.id}/edit`}>
            <Button variant="ghost" size="sm">
              <Pencil className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(offer)}
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
        <h1 className="page-title">Предложения</h1>
        <Link to="/offers/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Создать предложение
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
        data={filteredOffers}
        columns={columns}
        onRowClick={(offer) => navigate(`/offers/${offer.id}`)}
        emptyMessage="Предложения не найдены"
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Удалить предложение?"
        description="Вы уверены, что хотите удалить это предложение?"
        confirmLabel="Удалить"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
