import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, MapPin, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/SearchInput';
import { DataTable } from '@/components/ui/DataTable';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { PropertyTypeBadge } from '@/components/ui/PropertyTypeBadge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockProperties, mockOffers } from '@/data/mockData';
import { getShortAddress, fuzzySearchByAddress } from '@/lib/utils';
import { Property, PropertyType } from '@/types';
import { toast } from 'sonner';

export default function PropertiesList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<PropertyType | 'all'>('all');
  const [deleteTarget, setDeleteTarget] = useState<Property | null>(null);

  let filteredProperties = fuzzySearchByAddress(mockProperties, searchQuery);
  if (typeFilter !== 'all') {
    filteredProperties = filteredProperties.filter(p => p.type === typeFilter);
  }

  const getPropertyOffers = (propertyId: string) => mockOffers.filter(o => o.propertyId === propertyId);

  const canDeleteProperty = (propertyId: string) => {
    return getPropertyOffers(propertyId).length === 0;
  };

  const handleDelete = (property: Property) => {
    if (!canDeleteProperty(property.id)) {
      toast.error('Невозможно удалить объект', {
        description: 'Объект связан с предложением',
      });
      return;
    }
    setDeleteTarget(property);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      toast.success('Объект удалён');
      setDeleteTarget(null);
    }
  };

  const getArea = (property: Property): string => {
    if ('area' in property && property.area) {
      return `${property.area} м²`;
    }
    return '—';
  };

  const columns = [
    {
      key: 'type',
      header: 'Тип',
      render: (property: Property) => <PropertyTypeBadge type={property.type} />,
    },
    {
      key: 'address',
      header: 'Адрес',
      render: (property: Property) => (
        <span className="font-medium">{getShortAddress(property.address)}</span>
      ),
    },
    {
      key: 'area',
      header: 'Площадь',
      render: (property: Property) => (
        <span className="flex items-center gap-1">
          <Maximize className="w-4 h-4 text-muted-foreground" />
          {getArea(property)}
        </span>
      ),
    },
    {
      key: 'coordinates',
      header: 'Координаты',
      render: (property: Property) => (
        property.coordinates ? (
          <span className="flex items-center gap-1 text-success">
            <MapPin className="w-4 h-4" />
            Указаны
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )
      ),
    },
    {
      key: 'offers',
      header: 'Предложения',
      render: (property: Property) => getPropertyOffers(property.id).length,
      className: 'text-center',
    },
    {
      key: 'actions',
      header: '',
      render: (property: Property) => (
        <div className="flex items-center gap-1 justify-end" onClick={e => e.stopPropagation()}>
          <Link to={`/properties/${property.id}/edit`}>
            <Button variant="ghost" size="sm">
              <Pencil className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(property)}
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
        <h1 className="page-title">Объекты недвижимости</h1>
        <Link to="/properties/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Добавить объект
          </Button>
        </Link>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Поиск по адресу..."
          />
        </div>
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
        data={filteredProperties}
        columns={columns}
        onRowClick={(property) => navigate(`/properties/${property.id}`)}
        emptyMessage="Объекты не найдены"
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Удалить объект?"
        description={`Вы уверены, что хотите удалить объект "${deleteTarget ? getShortAddress(deleteTarget.address) : ''}"?`}
        confirmLabel="Удалить"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
