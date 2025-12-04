import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Pencil, Phone, Mail, Tag, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockClients, mockNeeds, mockOffers, mockProperties, mockRealtors } from '@/data/mockData';
import { getFullName, getShortAddress, formatPrice, formatDate } from '@/lib/utils';
import { PropertyTypeBadge } from '@/components/ui/PropertyTypeBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function ClientDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const client = mockClients.find(c => c.id === id);
  
  if (!client) {
    return (
      <div className="page-container">
        <div className="text-center py-12">
          <h1 className="text-xl font-semibold mb-2">Клиент не найден</h1>
          <Button variant="outline" onClick={() => navigate('/clients')}>
            Вернуться к списку
          </Button>
        </div>
      </div>
    );
  }

  const clientNeeds = mockNeeds.filter(n => n.clientId === client.id);
  const clientOffers = mockOffers.filter(o => o.clientId === client.id);

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="page-title">{getFullName(client)}</h1>
            <p className="text-muted-foreground text-sm">Создан: {formatDate(client.createdAt)}</p>
          </div>
        </div>
        <Link to={`/clients/${client.id}/edit`}>
          <Button variant="outline">
            <Pencil className="w-4 h-4 mr-2" />
            Редактировать
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Contact Info */}
        <div className="lg:col-span-1">
          <div className="form-section">
            <h2 className="font-heading font-semibold text-lg mb-4">Контактные данные</h2>
            
            <div className="space-y-4">
              {client.phone && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Телефон</p>
                    <p className="font-medium">{client.phone}</p>
                  </div>
                </div>
              )}
              
              {client.email && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">E-mail</p>
                    <p className="font-medium">{client.email}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Needs & Offers */}
        <div className="lg:col-span-2 space-y-6">
          {/* Needs */}
          <div className="form-section">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-lg flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Потребности ({clientNeeds.length})
              </h2>
              <Link to={`/needs/new?clientId=${client.id}`}>
                <Button size="sm">Добавить</Button>
              </Link>
            </div>
            
            {clientNeeds.length === 0 ? (
              <p className="text-muted-foreground text-sm">Нет потребностей</p>
            ) : (
              <div className="space-y-3">
                {clientNeeds.map(need => {
                  const realtor = mockRealtors.find(r => r.id === need.realtorId);
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
                        {need.priceRange && (
                          <span className="text-sm font-medium">
                            {need.priceRange.min && formatPrice(need.priceRange.min)}
                            {need.priceRange.min && need.priceRange.max && ' — '}
                            {need.priceRange.max && formatPrice(need.priceRange.max)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Риэлтор: {realtor ? getFullName(realtor) : '—'}
                      </p>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Offers */}
          <div className="form-section">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-lg flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Предложения ({clientOffers.length})
              </h2>
              <Link to={`/offers/new?clientId=${client.id}`}>
                <Button size="sm">Добавить</Button>
              </Link>
            </div>
            
            {clientOffers.length === 0 ? (
              <p className="text-muted-foreground text-sm">Нет предложений</p>
            ) : (
              <div className="space-y-3">
                {clientOffers.map(offer => {
                  const property = mockProperties.find(p => p.id === offer.propertyId);
                  const realtor = mockRealtors.find(r => r.id === offer.realtorId);
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
                      <p className="text-sm text-muted-foreground">
                        Риэлтор: {realtor ? getFullName(realtor) : '—'}
                      </p>
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
