import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockOffers, mockClients, mockRealtors, mockProperties } from '@/data/mockData';
import { getFullName, getShortAddress, getPropertyTypeLabel } from '@/lib/utils';
import { toast } from 'sonner';

interface FormErrors {
  clientId?: string;
  realtorId?: string;
  propertyId?: string;
  price?: string;
}

export default function OfferForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEdit = !!id;
  
  const existingOffer = isEdit ? mockOffers.find(o => o.id === id) : null;

  const [formData, setFormData] = useState({
    clientId: existingOffer?.clientId || searchParams.get('clientId') || '',
    realtorId: existingOffer?.realtorId || '',
    propertyId: existingOffer?.propertyId || searchParams.get('propertyId') || '',
    price: existingOffer?.price.toString() || '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.clientId) {
      newErrors.clientId = 'Выберите клиента';
    }
    if (!formData.realtorId) {
      newErrors.realtorId = 'Выберите риэлтора';
    }
    if (!formData.propertyId) {
      newErrors.propertyId = 'Выберите объект';
    }
    if (!formData.price) {
      newErrors.price = 'Укажите цену';
    } else {
      const price = parseInt(formData.price);
      if (isNaN(price) || price <= 0) {
        newErrors.price = 'Цена должна быть положительным числом';
      }
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

    toast.success(isEdit ? 'Предложение обновлено' : 'Предложение создано');
    navigate('/offers');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="page-title">{isEdit ? 'Редактирование предложения' : 'Новое предложение'}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="form-section mb-6">
          <h2 className="font-heading font-semibold text-lg mb-4">Участники</h2>
          
          <div className="grid gap-4">
            <div>
              <Label className="form-label">Клиент *</Label>
              <Select value={formData.clientId} onValueChange={(v) => setFormData(prev => ({ ...prev, clientId: v }))}>
                <SelectTrigger className={errors.clientId ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Выберите клиента" />
                </SelectTrigger>
                <SelectContent>
                  {mockClients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {getFullName(client)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.clientId && <p className="form-error">{errors.clientId}</p>}
            </div>

            <div>
              <Label className="form-label">Риэлтор *</Label>
              <Select value={formData.realtorId} onValueChange={(v) => setFormData(prev => ({ ...prev, realtorId: v }))}>
                <SelectTrigger className={errors.realtorId ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Выберите риэлтора" />
                </SelectTrigger>
                <SelectContent>
                  {mockRealtors.map(realtor => (
                    <SelectItem key={realtor.id} value={realtor.id}>
                      {getFullName(realtor)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.realtorId && <p className="form-error">{errors.realtorId}</p>}
            </div>
          </div>
        </div>

        <div className="form-section mb-6">
          <h2 className="font-heading font-semibold text-lg mb-4">Объект недвижимости</h2>
          
          <div>
            <Label className="form-label">Объект *</Label>
            <Select value={formData.propertyId} onValueChange={(v) => setFormData(prev => ({ ...prev, propertyId: v }))}>
              <SelectTrigger className={errors.propertyId ? 'border-destructive' : ''}>
                <SelectValue placeholder="Выберите объект" />
              </SelectTrigger>
              <SelectContent>
                {mockProperties.map(property => (
                  <SelectItem key={property.id} value={property.id}>
                    {getPropertyTypeLabel(property.type)} — {getShortAddress(property.address)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.propertyId && <p className="form-error">{errors.propertyId}</p>}
          </div>
        </div>

        <div className="form-section mb-6">
          <h2 className="font-heading font-semibold text-lg mb-4">Цена</h2>
          
          <div className="max-w-xs">
            <Label htmlFor="price" className="form-label">Цена (₽) *</Label>
            <Input
              id="price"
              type="number"
              min="1"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              placeholder="8500000"
              className={errors.price ? 'border-destructive' : ''}
            />
            {errors.price && <p className="form-error">{errors.price}</p>}
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit">
            <Save className="w-4 h-4 mr-2" />
            {isEdit ? 'Сохранить' : 'Создать'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Отмена
          </Button>
        </div>
      </form>
    </div>
  );
}
