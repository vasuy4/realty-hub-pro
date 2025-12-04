import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Pencil, Search, User, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockNeeds, mockOffers, mockProperties, mockClients, mockRealtors } from '@/data/mockData';
import { getFullName, getShortAddress, formatPrice, formatDate, isOfferMatchingNeed } from '@/lib/utils';
import { PropertyTypeBadge } from '@/components/ui/PropertyTypeBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function NeedDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const need = mockNeeds.find(n => n.id === id);
  
  if (!need) {
    return (
      <div className="page-container">
        <div className="text-center py-12">
          <h1 className="text-xl font-semibold mb-2">Потребность не найдена</h1>
          <Button variant="outline" onClick={() => navigate('/needs')}>
            Вернуться к списку
          </Button>
        </div>
      </div>
    );
  }

  const client = mockClients.find(c => c.id === need.clientId);
  const realtor = mockRealtors.find(r => r.id === need.realtorId);

  // Find matching offers
  const matchingOffers = mockOffers
    .filter(offer => offer.status === 'active')
    .filter(offer => {
      const property = mockProperties.find(p => p.id === offer.propertyId);
      return property && isOfferMatchingNeed(offer, need, property);
    });

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <PropertyTypeBadge type={need.propertyType} />
              <StatusBadge status={need.status} />
            </div>
            <h1 className="page-title">Потребность: {client ? getFullName(client) : 'Клиент'}</h1>
            <p className="text-muted-foreground text-sm">Создана: {formatDate(need.createdAt)}</p>
          </div>
        </div>
        <Link to={`/needs/${need.id}/edit`}>
          <Button variant="outline">
            <Pencil className="w-4 h-4 mr-2" />
            Редактировать
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-1 space-y-6">
          {need.priceRange && (need.priceRange.min || need.priceRange.max) && (
            <div className="form-section">
              <h2 className="font-heading font-semibold text-lg mb-4">Бюджет</h2>
              <p className="text-xl font-heading font-bold text-primary">
                {need.priceRange.min && formatPrice(need.priceRange.min)}
                {need.priceRange.min && need.priceRange.max && ' — '}
                {need.priceRange.max && formatPrice(need.priceRange.max)}
              </p>
            </div>
          )}

          <div className="form-section">
            <h2 className="font-heading font-semibold text-lg mb-4">Участники</h2>
            
            <div className="space-y-4">
              <Link to={client ? `/clients/${client.id}` : '#'} className="flex items-center gap-3 hover:bg-muted/50 -mx-2 px-2 py-2 rounded-lg transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Покупатель</p>
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
            </div>
          </div>

          {need.address && (need.address.city || need.address.street) && (
            <div className="form-section">
              <h2 className="font-heading font-semibold text-lg mb-4">Желаемый район</h2>
              <p>{getShortAddress(need.address)}</p>
            </div>
          )}
        </div>

        {/* Matching Offers */}
        <div className="lg:col-span-2">
          <div className="form-section">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-lg flex items-center gap-2">
                <Search className="w-5 h-5" />
                Подходящие предложения ({matchingOffers.length})
              </h2>
            </div>
            
            {matchingOffers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Нет подходящих предложений</p>
                <p className="text-sm mt-1">Предложения отображаются, если совпадают тип, адрес и ценовой диапазон</p>
              </div>
            ) : (
              <div className="space-y-3">
                {matchingOffers.map(offer => {
                  const property = mockProperties.find(p => p.id === offer.propertyId);
                  const offerClient = mockClients.find(c => c.id === offer.clientId);
                  const offerRealtor = mockRealtors.find(r => r.id === offer.realtorId);
                  return (
                    <div
                      key={offer.id}
                      className="p-4 rounded-lg border border-border hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {property && <PropertyTypeBadge type={property.type} />}
                          <StatusBadge status={offer.status} />
                        </div>
                        <Link to={`/deals/new?offerId=${offer.id}&needId=${need.id}`}>
                          <Button size="sm">Создать сделку</Button>
                        </Link>
                      </div>
                      <p className="font-semibold text-primary text-lg mb-2">{formatPrice(offer.price)}</p>
                      <p className="text-sm mb-2">{property ? getShortAddress(property.address) : '—'}</p>
                      <div className="grid sm:grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Продавец: </span>
                          {offerClient ? getFullName(offerClient) : '—'}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Риэлтор: </span>
                          {offerRealtor ? getFullName(offerRealtor) : '—'}
                        </div>
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
