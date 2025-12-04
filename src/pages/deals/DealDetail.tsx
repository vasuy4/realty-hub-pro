import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, UserCheck, Building2, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockDeals, mockNeeds, mockOffers, mockProperties, mockClients, mockRealtors } from '@/data/mockData';
import { getFullName, getShortAddress, formatPrice, formatDate, calculateDealCommissions } from '@/lib/utils';
import { PropertyTypeBadge } from '@/components/ui/PropertyTypeBadge';

export default function DealDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const deal = mockDeals.find(d => d.id === id);
  
  if (!deal) {
    return (
      <div className="page-container">
        <div className="text-center py-12">
          <h1 className="text-xl font-semibold mb-2">Сделка не найдена</h1>
          <Button variant="outline" onClick={() => navigate('/deals')}>
            Вернуться к списку
          </Button>
        </div>
      </div>
    );
  }

  const offer = mockOffers.find(o => o.id === deal.offerId);
  const need = mockNeeds.find(n => n.id === deal.needId);
  const property = offer ? mockProperties.find(p => p.id === offer.propertyId) : null;
  
  const sellerClient = offer ? mockClients.find(c => c.id === offer.clientId) : null;
  const buyerClient = need ? mockClients.find(c => c.id === need.clientId) : null;
  const sellerRealtor = offer ? mockRealtors.find(r => r.id === offer.realtorId) : null;
  const buyerRealtor = need ? mockRealtors.find(r => r.id === need.realtorId) : null;

  const commissions = offer && property && sellerRealtor && buyerRealtor
    ? calculateDealCommissions(offer, property, sellerRealtor, buyerRealtor)
    : null;

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
            </div>
            <h1 className="page-title">Сделка #{deal.id}</h1>
            <p className="text-muted-foreground text-sm">Дата: {formatDate(deal.createdAt)}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Property */}
          <div className="form-section">
            <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Объект сделки
            </h2>
            
            {property ? (
              <Link to={`/properties/${property.id}`} className="block p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <PropertyTypeBadge type={property.type} className="mb-2" />
                <p className="text-lg font-medium">{getShortAddress(property.address)}</p>
                {offer && (
                  <p className="text-2xl font-heading font-bold text-primary mt-2">{formatPrice(offer.price)}</p>
                )}
              </Link>
            ) : (
              <p className="text-muted-foreground">Объект не найден</p>
            )}
          </div>

          {/* Participants */}
          <div className="form-section">
            <h2 className="font-heading font-semibold text-lg mb-4">Участники сделки</h2>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Seller side */}
              <div className="p-4 rounded-lg border border-border">
                <h3 className="font-medium mb-3 text-muted-foreground">Продавец</h3>
                <div className="space-y-3">
                  <Link to={sellerClient ? `/clients/${sellerClient.id}` : '#'} className="flex items-center gap-3 hover:bg-muted/50 -mx-2 px-2 py-1 rounded-lg transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Клиент</p>
                      <p className="font-medium text-sm">{sellerClient ? getFullName(sellerClient) : '—'}</p>
                    </div>
                  </Link>
                  <Link to={sellerRealtor ? `/realtors/${sellerRealtor.id}` : '#'} className="flex items-center gap-3 hover:bg-muted/50 -mx-2 px-2 py-1 rounded-lg transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                      <UserCheck className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Риэлтор</p>
                      <p className="font-medium text-sm">{sellerRealtor ? getFullName(sellerRealtor) : '—'}</p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Buyer side */}
              <div className="p-4 rounded-lg border border-border">
                <h3 className="font-medium mb-3 text-muted-foreground">Покупатель</h3>
                <div className="space-y-3">
                  <Link to={buyerClient ? `/clients/${buyerClient.id}` : '#'} className="flex items-center gap-3 hover:bg-muted/50 -mx-2 px-2 py-1 rounded-lg transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Клиент</p>
                      <p className="font-medium text-sm">{buyerClient ? getFullName(buyerClient) : '—'}</p>
                    </div>
                  </Link>
                  <Link to={buyerRealtor ? `/realtors/${buyerRealtor.id}` : '#'} className="flex items-center gap-3 hover:bg-muted/50 -mx-2 px-2 py-1 rounded-lg transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                      <UserCheck className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Риэлтор</p>
                      <p className="font-medium text-sm">{buyerRealtor ? getFullName(buyerRealtor) : '—'}</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Commissions */}
        <div className="lg:col-span-1">
          <div className="form-section">
            <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Финансовый расчёт
            </h2>
            
            {commissions ? (
              <div className="space-y-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Комиссия с продавца</p>
                  <p className="text-lg font-semibold">{formatPrice(commissions.sellerServiceCost)}</p>
                </div>
                
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Комиссия с покупателя</p>
                  <p className="text-lg font-semibold">{formatPrice(commissions.buyerServiceCost)}</p>
                </div>

                <hr className="border-border" />
                
                <div className="p-3 bg-accent/10 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Риэлтору продавца</p>
                  <p className="font-semibold text-accent">{formatPrice(commissions.sellerRealtorPayment)}</p>
                </div>
                
                <div className="p-3 bg-accent/10 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Риэлтору покупателя</p>
                  <p className="font-semibold text-accent">{formatPrice(commissions.buyerRealtorPayment)}</p>
                </div>

                <hr className="border-border" />
                
                <div className="p-4 bg-primary/10 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Доход компании</p>
                  <p className="text-xl font-bold text-primary">{formatPrice(commissions.companyIncome)}</p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Невозможно рассчитать комиссии</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
