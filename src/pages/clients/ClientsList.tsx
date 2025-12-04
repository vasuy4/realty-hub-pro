import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/SearchInput';
import { DataTable } from '@/components/ui/DataTable';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { mockClients, mockNeeds, mockOffers } from '@/data/mockData';
import { getFullName, fuzzySearchByName } from '@/lib/utils';
import { Client } from '@/types';
import { toast } from 'sonner';

export default function ClientsList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null);

  const filteredClients = fuzzySearchByName(mockClients, searchQuery);

  const getClientNeeds = (clientId: string) => mockNeeds.filter(n => n.clientId === clientId);
  const getClientOffers = (clientId: string) => mockOffers.filter(o => o.clientId === clientId);

  const canDeleteClient = (clientId: string) => {
    return getClientNeeds(clientId).length === 0 && getClientOffers(clientId).length === 0;
  };

  const handleDelete = (client: Client) => {
    if (!canDeleteClient(client.id)) {
      toast.error('Невозможно удалить клиента', {
        description: 'У клиента есть связанные потребности или предложения',
      });
      return;
    }
    setDeleteTarget(client);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      toast.success('Клиент удалён');
      setDeleteTarget(null);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'ФИО',
      render: (client: Client) => (
        <span className="font-medium">{getFullName(client)}</span>
      ),
    },
    {
      key: 'phone',
      header: 'Телефон',
      render: (client: Client) => (
        client.phone ? (
          <span className="flex items-center gap-2 text-muted-foreground">
            <Phone className="w-4 h-4" />
            {client.phone}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )
      ),
    },
    {
      key: 'email',
      header: 'E-mail',
      render: (client: Client) => (
        client.email ? (
          <span className="flex items-center gap-2 text-muted-foreground">
            <Mail className="w-4 h-4" />
            {client.email}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )
      ),
    },
    {
      key: 'needs',
      header: 'Потребности',
      render: (client: Client) => getClientNeeds(client.id).length,
      className: 'text-center',
    },
    {
      key: 'offers',
      header: 'Предложения',
      render: (client: Client) => getClientOffers(client.id).length,
      className: 'text-center',
    },
    {
      key: 'actions',
      header: '',
      render: (client: Client) => (
        <div className="flex items-center gap-1 justify-end" onClick={e => e.stopPropagation()}>
          <Link to={`/clients/${client.id}/edit`}>
            <Button variant="ghost" size="sm">
              <Pencil className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(client)}
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
        <h1 className="page-title">Клиенты</h1>
        <Link to="/clients/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Добавить клиента
          </Button>
        </Link>
      </div>

      <div className="mb-6 max-w-md">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Поиск по ФИО (нечёткий поиск)..."
        />
      </div>

      <DataTable
        data={filteredClients}
        columns={columns}
        onRowClick={(client) => navigate(`/clients/${client.id}`)}
        emptyMessage="Клиенты не найдены"
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Удалить клиента?"
        description={`Вы уверены, что хотите удалить клиента "${deleteTarget ? getFullName(deleteTarget) : ''}"? Это действие нельзя отменить.`}
        confirmLabel="Удалить"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
