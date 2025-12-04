import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Pencil, Search, User, UserCheck, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockOffers, mockProperties, mockClients, mockRealtors, mockNeeds } from '@/data/mockData';
import { getFullName, getShortAddress, formatPrice, formatDate, isOfferMatchingNeed } from '@/lib/utils';
import { PropertyTypeBadge } from '@/components/ui/PropertyTypeBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function OfferDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const offer = mockOffers.find(o => o.id === id);
  
  if (!offer) {
    return (
      <div className="page-container">
        <div className="text-center py-12">
          <h1 className="text-xl font-semibold mb-2">Предложение не найдено</h1>
          <Button variant="outline" onClick={() => navigate('/offers')}>
            Вернуться к списку
          </Button>
        </div>
      </div>
    );
  }

  const property = mockProperties.find(p => p.id === offer.propertyId);
  const client = mockClients.find(c => c.id === offer.clientId);
  const realtor = mockRealtors.find(r => r.id === offer.realtorId);

  // Find matching needs
  const matchingNeeds = property
    ? mockNeeds.filter(need => need.status === 'active' && isOfferMatchingNeed(offer, need, property))
    : [];

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              {property && <PropertyTypeBadge type={property.type} />}
              <StatusBadge status={offer.status} />
            </div>
            <h1 className="page-title">{property ? getShortAddress(property.address) : 'Предложение'}</h1>
            <p className="text-muted-foreground text-sm">Создано: {formatDate(offer.createdAt)}</p>
          </div>
        </div>
        <Link to={`/offers/${offer.id}/edit`}>
          <Button variant="outline">
            <Pencil className="w-4 h-4 mr-2" />
            Редактировать
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="form-section">
            <h2 className="font-heading font-semibold text-lg mb-4">Цена</h2>
            <p className="text-3xl font-heading font-bold text-primary">{formatPrice(offer.price)}</p>
          </div>

          <div className="form-section">
            <h2 className="font-heading font-semibold text-lg mb-4">Участники</h2>
            
            <div className="space-y-4">
              <Link to={client ? `/clients/${client.id}` : '#'} className="flex items-center gap-3 hover:bg-muted/50 -mx-2 px-2 py-2 rounded-lg transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Клиент</p>
                  <p className="font-medium">{client ? getFullName(client) : '—'}</p>
                </div>
              </Link>
              
              <Link to={realtor ? `/realtors/${realtor.id}` : '#'} className="flex items-center gap-3 hover:bg-muted/50 -mx-2 px-2 py-2 rounded-lg transition-colors">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Риэлтор</p>
                  <p className="font-medium">{realtor ? getFullName(realtor) : '—'}</p>
                </div>
              </Link>
              
              <Link to={property ? `/properties/${property.id}` : '#'} className="flex items-center gap-3 hover:bg-muted/50 -mx-2 px-2 py-2 rounded-lg transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Объект</p>
                  <p className="font-medium">{property ? getShortAddress(property.address) : '—'}</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Matching Needs */}
        <div className="lg:col-span-2">
          <div className="form-section">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-lg flex items-center gap-2">
                <Search className="w-5 h-5" />
                Подходящие потребности ({matchingNeeds.length})
              </h2>
            </div>
            
            {matchingNeeds.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Нет подходящих потребностей</p>
                <p className="text-sm mt-1">Потребности отображаются, если совпадают тип, адрес и ценовой диапазон</p>
              </div>
            ) : (
              <div className="space-y-3">
                {matchingNeeds.map(need => {
                  const needClient = mockClients.find(c => c.id === need.clientId);
                  const needRealtor = mockRealtors.find(r => r.id === need.realtorId);
                  return (
                    <div
                      key={need.id}
                      className="p-4 rounded-lg border border-border hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <PropertyTypeBadge type={need.propertyType} />
                          <StatusBadge status={need.status} />
                        </div>
                        <Link to={`/deals/new?offerId=${offer.id}&needId=${need.id}`}>
                          <Button size="sm">Создать сделку</Button>
                        </Link>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Покупатель: </span>
                          {needClient ? getFullName(needClient) : '—'}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Риэлтор: </span>
                          {needRealtor ? getFullName(needRealtor) : '—'}
                        </div>
                        {need.priceRange && (
                          <div className="sm:col-span-2">
                            <span className="text-muted-foreground">Бюджет: </span>
                            {need.priceRange.min && formatPrice(need.priceRange.min)}
                            {need.priceRange.min && need.priceRange.max && ' — '}
                            {need.priceRange.max && formatPrice(need.priceRange.max)}
                          </div>
                        )}
                      </div>
                    </div>
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
