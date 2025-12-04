import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Pencil, MapPin, Maximize, Building2, Layers, DoorOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockProperties, mockOffers, mockClients, mockRealtors } from '@/data/mockData';
import { getShortAddress, formatPrice, formatDate, getFullName, getPropertyTypeLabel } from '@/lib/utils';
import { PropertyTypeBadge } from '@/components/ui/PropertyTypeBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function PropertyDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const property = mockProperties.find(p => p.id === id);
  
  if (!property) {
    return (
      <div className="page-container">
        <div className="text-center py-12">
          <h1 className="text-xl font-semibold mb-2">Объект не найден</h1>
          <Button variant="outline" onClick={() => navigate('/properties')}>
            Вернуться к списку
          </Button>
        </div>
      </div>
    );
  }

  const propertyOffers = mockOffers.filter(o => o.propertyId === property.id);

  const getPropertyDetails = () => {
    const details: { icon: any; label: string; value: string }[] = [];
    
    if ('area' in property && property.area) {
      details.push({ icon: Maximize, label: 'Площадь', value: `${property.area} м²` });
    }
    
    if ('rooms' in property && property.rooms) {
      details.push({ icon: DoorOpen, label: 'Комнаты', value: String(property.rooms) });
    }
    
    if ('floor' in property && property.floor) {
      details.push({ icon: Layers, label: 'Этаж', value: String(property.floor) });
    }
    
    if ('floors' in property && property.floors) {
      details.push({ icon: Building2, label: 'Этажность', value: String(property.floors) });
    }
    
    return details;
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <PropertyTypeBadge type={property.type} />
            </div>
            <h1 className="page-title">{getShortAddress(property.address)}</h1>
            <p className="text-muted-foreground text-sm">Создан: {formatDate(property.createdAt)}</p>
          </div>
        </div>
        <Link to={`/properties/${property.id}/edit`}>
          <Button variant="outline">
            <Pencil className="w-4 h-4 mr-2" />
            Редактировать
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="form-section">
            <h2 className="font-heading font-semibold text-lg mb-4">Характеристики</h2>
            
            <div className="space-y-4">
              {getPropertyDetails().map((detail, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <detail.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{detail.label}</p>
                    <p className="font-medium">{detail.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {property.coordinates && (
            <div className="form-section">
              <h2 className="font-heading font-semibold text-lg mb-4">Координаты</h2>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Широта / Долгота</p>
                  <p className="font-medium">{property.coordinates.latitude}, {property.coordinates.longitude}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Offers */}
        <div className="lg:col-span-2">
          <div className="form-section">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-lg">
                Предложения ({propertyOffers.length})
              </h2>
              <Link to={`/offers/new?propertyId=${property.id}`}>
                <Button size="sm">Создать предложение</Button>
              </Link>
            </div>
            
            {propertyOffers.length === 0 ? (
              <p className="text-muted-foreground text-sm">Нет предложений для этого объекта</p>
            ) : (
              <div className="space-y-3">
                {propertyOffers.map(offer => {
                  const client = mockClients.find(c => c.id === offer.clientId);
                  const realtor = mockRealtors.find(r => r.id === offer.realtorId);
                  return (
                    <Link
                      key={offer.id}
                      to={`/offers/${offer.id}`}
                      className="block p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <StatusBadge status={offer.status} />
                        <span className="font-semibold text-primary text-lg">{formatPrice(offer.price)}</span>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Клиент: </span>
                          {client ? getFullName(client) : '—'}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Риэлтор: </span>
                          {realtor ? getFullName(realtor) : '—'}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Создано: {formatDate(offer.createdAt)}
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
