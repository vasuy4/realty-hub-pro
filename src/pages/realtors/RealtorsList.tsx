import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/SearchInput';
import { DataTable } from '@/components/ui/DataTable';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { mockRealtors, mockNeeds, mockOffers } from '@/data/mockData';
import { getFullName, fuzzySearchByName } from '@/lib/utils';
import { Realtor } from '@/types';
import { toast } from 'sonner';

export default function RealtorsList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Realtor | null>(null);

  const filteredRealtors = fuzzySearchByName(mockRealtors, searchQuery);

  const getRealtorNeeds = (realtorId: string) => mockNeeds.filter(n => n.realtorId === realtorId);
  const getRealtorOffers = (realtorId: string) => mockOffers.filter(o => o.realtorId === realtorId);

  const canDeleteRealtor = (realtorId: string) => {
    return getRealtorNeeds(realtorId).length === 0 && getRealtorOffers(realtorId).length === 0;
  };

  const handleDelete = (realtor: Realtor) => {
    if (!canDeleteRealtor(realtor.id)) {
      toast.error('Невозможно удалить риэлтора', {
        description: 'У риэлтора есть связанные потребности или предложения',
      });
      return;
    }
    setDeleteTarget(realtor);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      toast.success('Риэлтор удалён');
      setDeleteTarget(null);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'ФИО',
      render: (realtor: Realtor) => (
        <span className="font-medium">{getFullName(realtor)}</span>
      ),
    },
    {
      key: 'commission',
      header: 'Доля комиссии',
      render: (realtor: Realtor) => (
        <span className="flex items-center gap-1">
          <Percent className="w-4 h-4 text-muted-foreground" />
          {realtor.commissionShare ?? 45}%
        </span>
      ),
    },
    {
      key: 'needs',
      header: 'Потребности',
      render: (realtor: Realtor) => getRealtorNeeds(realtor.id).length,
      className: 'text-center',
    },
    {
      key: 'offers',
      header: 'Предложения',
      render: (realtor: Realtor) => getRealtorOffers(realtor.id).length,
      className: 'text-center',
    },
    {
      key: 'actions',
      header: '',
      render: (realtor: Realtor) => (
        <div className="flex items-center gap-1 justify-end" onClick={e => e.stopPropagation()}>
          <Link to={`/realtors/${realtor.id}/edit`}>
            <Button variant="ghost" size="sm">
              <Pencil className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(realtor)}
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
        <h1 className="page-title">Риэлторы</h1>
        <Link to="/realtors/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Добавить риэлтора
          </Button>
        </Link>
      </div>

      <div className="mb-6 max-w-md">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Поиск по ФИО..."
        />
      </div>

      <DataTable
        data={filteredRealtors}
        columns={columns}
        onRowClick={(realtor) => navigate(`/realtors/${realtor.id}`)}
        emptyMessage="Риэлторы не найдены"
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Удалить риэлтора?"
        description={`Вы уверены, что хотите удалить риэлтора "${deleteTarget ? getFullName(deleteTarget) : ''}"?`}
        confirmLabel="Удалить"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
