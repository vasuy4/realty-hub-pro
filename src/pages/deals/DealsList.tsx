import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/DataTable';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { PropertyTypeBadge } from '@/components/ui/PropertyTypeBadge';
import { mockDeals, mockNeeds, mockOffers, mockProperties, mockClients, mockRealtors } from '@/data/mockData';
import { getFullName, getShortAddress, formatPrice, formatDate } from '@/lib/utils';
import { Deal } from '@/types';
import { toast } from 'sonner';

export default function DealsList() {
  const navigate = useNavigate();
  const [deleteTarget, setDeleteTarget] = useState<Deal | null>(null);

  const confirmDelete = () => {
    if (deleteTarget) {
      toast.success('Сделка удалена');
      setDeleteTarget(null);
    }
  };

  const columns = [
    {
      key: 'date',
      header: 'Дата',
      render: (deal: Deal) => formatDate(deal.createdAt),
    },
    {
      key: 'property',
      header: 'Объект',
      render: (deal: Deal) => {
        const offer = mockOffers.find(o => o.id === deal.offerId);
        const property = offer ? mockProperties.find(p => p.id === offer.propertyId) : null;
        return (
          <div>
            {property && <PropertyTypeBadge type={property.type} className="mb-1" />}
            <p className="font-medium">{property ? getShortAddress(property.address) : '—'}</p>
          </div>
        );
      },
    },
    {
      key: 'seller',
      header: 'Продавец',
      render: (deal: Deal) => {
        const offer = mockOffers.find(o => o.id === deal.offerId);
        const client = offer ? mockClients.find(c => c.id === offer.clientId) : null;
        return client ? getFullName(client) : '—';
      },
    },
    {
      key: 'buyer',
      header: 'Покупатель',
      render: (deal: Deal) => {
        const need = mockNeeds.find(n => n.id === deal.needId);
        const client = need ? mockClients.find(c => c.id === need.clientId) : null;
        return client ? getFullName(client) : '—';
      },
    },
    {
      key: 'price',
      header: 'Сумма',
      render: (deal: Deal) => {
        const offer = mockOffers.find(o => o.id === deal.offerId);
        return offer ? (
          <span className="font-semibold text-primary">{formatPrice(offer.price)}</span>
        ) : '—';
      },
    },
    {
      key: 'actions',
      header: '',
      render: (deal: Deal) => (
        <div className="flex items-center gap-1 justify-end" onClick={e => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteTarget(deal)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
      className: 'w-16',
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Сделки</h1>
        <Link to="/deals/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Создать сделку
          </Button>
        </Link>
      </div>

      <DataTable
        data={mockDeals}
        columns={columns}
        onRowClick={(deal) => navigate(`/deals/${deal.id}`)}
        emptyMessage="Сделки не найдены"
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Удалить сделку?"
        description="Вы уверены, что хотите удалить эту сделку? Связанные потребность и предложение станут снова доступны."
        confirmLabel="Удалить"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
