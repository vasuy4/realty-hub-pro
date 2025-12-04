import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockNeeds, mockOffers, mockProperties, mockClients, mockRealtors, mockDeals } from '@/data/mockData';
import { getFullName, getShortAddress, formatPrice, calculateDealCommissions, getPropertyTypeLabel } from '@/lib/utils';
import { DealCommissions } from '@/types';
import { toast } from 'sonner';

interface FormErrors {
  needId?: string;
  offerId?: string;
}

export default function DealForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    needId: searchParams.get('needId') || '',
    offerId: searchParams.get('offerId') || '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [commissions, setCommissions] = useState<DealCommissions | null>(null);

  // Filter available needs and offers (not already in deals)
  const usedNeedIds = new Set(mockDeals.map(d => d.needId));
  const usedOfferIds = new Set(mockDeals.map(d => d.offerId));
  
  const availableNeeds = mockNeeds.filter(n => n.status === 'active' && !usedNeedIds.has(n.id));
  const availableOffers = mockOffers.filter(o => o.status === 'active' && !usedOfferIds.has(o.id));

  // Calculate commissions when both are selected
  useEffect(() => {
    if (formData.needId && formData.offerId) {
      const offer = mockOffers.find(o => o.id === formData.offerId);
      const need = mockNeeds.find(n => n.id === formData.needId);
      
      if (offer && need) {
        const property = mockProperties.find(p => p.id === offer.propertyId);
        const sellerRealtor = mockRealtors.find(r => r.id === offer.realtorId);
        const buyerRealtor = mockRealtors.find(r => r.id === need.realtorId);
        
        if (property && sellerRealtor && buyerRealtor) {
          const calc = calculateDealCommissions(offer, property, sellerRealtor, buyerRealtor);
          setCommissions(calc);
        }
      }
    } else {
      setCommissions(null);
    }
  }, [formData.needId, formData.offerId]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.needId) {
      newErrors.needId = 'Выберите потребность';
    }
    if (!formData.offerId) {
      newErrors.offerId = 'Выберите предложение';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error('Проверьте заполнение формы');
      return;
    }

    toast.success('Сделка создана');
    navigate('/deals');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="page-title">Новая сделка</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="form-section">
              <h2 className="font-heading font-semibold text-lg mb-4">Потребность (покупатель)</h2>
              
              <div>
                <Label className="form-label">Выберите потребность *</Label>
                <Select value={formData.needId} onValueChange={(v) => setFormData(prev => ({ ...prev, needId: v }))}>
                  <SelectTrigger className={errors.needId ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Выберите потребность" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableNeeds.map(need => {
                      const client = mockClients.find(c => c.id === need.clientId);
                      return (
                        <SelectItem key={need.id} value={need.id}>
                          {getPropertyTypeLabel(need.propertyType)} — {client ? getFullName(client) : 'Клиент'}
                          {need.priceRange?.max && ` (до ${formatPrice(need.priceRange.max)})`}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {errors.needId && <p className="form-error">{errors.needId}</p>}
              </div>

              {formData.needId && (() => {
                const need = mockNeeds.find(n => n.id === formData.needId);
                const client = need ? mockClients.find(c => c.id === need.clientId) : null;
                const realtor = need ? mockRealtors.find(r => r.id === need.realtorId) : null;
                return need ? (
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm space-y-1">
                    <p><span className="text-muted-foreground">Покупатель:</span> {client ? getFullName(client) : '—'}</p>
                    <p><span className="text-muted-foreground">Риэлтор:</span> {realtor ? getFullName(realtor) : '—'}</p>
                  </div>
                ) : null;
              })()}
            </div>

            <div className="form-section">
              <h2 className="font-heading font-semibold text-lg mb-4">Предложение (продавец)</h2>
              
              <div>
                <Label className="form-label">Выберите предложение *</Label>
                <Select value={formData.offerId} onValueChange={(v) => setFormData(prev => ({ ...prev, offerId: v }))}>
                  <SelectTrigger className={errors.offerId ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Выберите предложение" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableOffers.map(offer => {
                      const property = mockProperties.find(p => p.id === offer.propertyId);
                      const client = mockClients.find(c => c.id === offer.clientId);
                      return (
                        <SelectItem key={offer.id} value={offer.id}>
                          {property ? getShortAddress(property.address) : 'Объект'} — {formatPrice(offer.price)}
                          {client && ` (${getFullName(client)})`}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {errors.offerId && <p className="form-error">{errors.offerId}</p>}
              </div>

              {formData.offerId && (() => {
                const offer = mockOffers.find(o => o.id === formData.offerId);
                const property = offer ? mockProperties.find(p => p.id === offer.propertyId) : null;
                const client = offer ? mockClients.find(c => c.id === offer.clientId) : null;
                const realtor = offer ? mockRealtors.find(r => r.id === offer.realtorId) : null;
                return offer ? (
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm space-y-1">
                    <p><span className="text-muted-foreground">Объект:</span> {property ? getShortAddress(property.address) : '—'}</p>
                    <p><span className="text-muted-foreground">Продавец:</span> {client ? getFullName(client) : '—'}</p>
                    <p><span className="text-muted-foreground">Риэлтор:</span> {realtor ? getFullName(realtor) : '—'}</p>
                    <p><span className="text-muted-foreground">Цена:</span> {formatPrice(offer.price)}</p>
                  </div>
                ) : null;
              })()}
            </div>
          </div>

          {/* Commission calculation */}
          <div className="form-section h-fit">
            <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Финансовый расчёт
            </h2>
            
            {commissions ? (
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Комиссия с продавца</p>
                  <p className="text-xl font-semibold">{formatPrice(commissions.sellerServiceCost)}</p>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Комиссия с покупателя</p>
                  <p className="text-xl font-semibold">{formatPrice(commissions.buyerServiceCost)}</p>
                </div>

                <hr className="border-border" />
                
                <div className="p-4 bg-accent/10 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Выплата риэлтору продавца</p>
                  <p className="text-lg font-semibold text-accent">{formatPrice(commissions.sellerRealtorPayment)}</p>
                </div>
                
                <div className="p-4 bg-accent/10 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Выплата риэлтору покупателя</p>
                  <p className="text-lg font-semibold text-accent">{formatPrice(commissions.buyerRealtorPayment)}</p>
                </div>

                <hr className="border-border" />
                
                <div className="p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Доход компании</p>
                  <p className="text-2xl font-bold text-primary">{formatPrice(commissions.companyIncome)}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calculator className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Выберите потребность и предложение для расчёта комиссий</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button type="submit" disabled={!commissions}>
            <Save className="w-4 h-4 mr-2" />
            Создать сделку
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Отмена
          </Button>
        </div>
      </form>
    </div>
  );
}
