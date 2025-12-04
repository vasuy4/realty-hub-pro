import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Pencil, Percent, Tag, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockRealtors, mockNeeds, mockOffers, mockProperties, mockClients } from '@/data/mockData';
import { getFullName, getShortAddress, formatPrice, formatDate } from '@/lib/utils';
import { PropertyTypeBadge } from '@/components/ui/PropertyTypeBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function RealtorDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const realtor = mockRealtors.find(r => r.id === id);
  
  if (!realtor) {
    return (
      <div className="page-container">
        <div className="text-center py-12">
          <h1 className="text-xl font-semibold mb-2">Риэлтор не найден</h1>
          <Button variant="outline" onClick={() => navigate('/realtors')}>
            Вернуться к списку
          </Button>
        </div>
      </div>
    );
  }

  const realtorNeeds = mockNeeds.filter(n => n.realtorId === realtor.id);
  const realtorOffers = mockOffers.filter(o => o.realtorId === realtor.id);

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="page-title">{getFullName(realtor)}</h1>
            <p className="text-muted-foreground text-sm">Создан: {formatDate(realtor.createdAt)}</p>
          </div>
        </div>
        <Link to={`/realtors/${realtor.id}/edit`}>
          <Button variant="outline">
            <Pencil className="w-4 h-4 mr-2" />
            Редактировать
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Info */}
        <div className="lg:col-span-1">
          <div className="form-section">
            <h2 className="font-heading font-semibold text-lg mb-4">Информация</h2>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <Percent className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Доля от комиссии</p>
                <p className="font-medium">{realtor.commissionShare ?? 45}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Needs & Offers */}
        <div className="lg:col-span-2 space-y-6">
          {/* Needs */}
          <div className="form-section">
            <h2 className="font-heading font-semibold text-lg flex items-center gap-2 mb-4">
              <ShoppingCart className="w-5 h-5" />
              Потребности ({realtorNeeds.length})
            </h2>
            
            {realtorNeeds.length === 0 ? (
              <p className="text-muted-foreground text-sm">Нет потребностей</p>
            ) : (
              <div className="space-y-3">
                {realtorNeeds.map(need => {
                  const client = mockClients.find(c => c.id === need.clientId);
                  return (
                    <Link
                      key={need.id}
                      to={`/needs/${need.id}`}
                      className="block p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <PropertyTypeBadge type={need.propertyType} />
                          <StatusBadge status={need.status} />
                        </div>
                        {need.priceRange?.max && (
                          <span className="text-sm font-medium">до {formatPrice(need.priceRange.max)}</span>
                        )}
                      </div>
                      <p className="text-sm mt-2">Клиент: {client ? getFullName(client) : '—'}</p>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Offers */}
          <div className="form-section">
            <h2 className="font-heading font-semibold text-lg flex items-center gap-2 mb-4">
              <Tag className="w-5 h-5" />
              Предложения ({realtorOffers.length})
            </h2>
            
            {realtorOffers.length === 0 ? (
              <p className="text-muted-foreground text-sm">Нет предложений</p>
            ) : (
              <div className="space-y-3">
                {realtorOffers.map(offer => {
                  const property = mockProperties.find(p => p.id === offer.propertyId);
                  const client = mockClients.find(c => c.id === offer.clientId);
                  return (
                    <Link
                      key={offer.id}
                      to={`/offers/${offer.id}`}
                      className="block p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          {property && <PropertyTypeBadge type={property.type} />}
                          <StatusBadge status={offer.status} className="ml-2" />
                        </div>
                        <span className="font-semibold text-primary">{formatPrice(offer.price)}</span>
                      </div>
                      <p className="text-sm mt-2">{property ? getShortAddress(property.address) : '—'}</p>
                      <p className="text-sm text-muted-foreground">Клиент: {client ? getFullName(client) : '—'}</p>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
