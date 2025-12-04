import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockNeeds, mockClients, mockRealtors } from '@/data/mockData';
import { getFullName } from '@/lib/utils';
import { PropertyType } from '@/types';
import { toast } from 'sonner';

interface FormErrors {
  clientId?: string;
  realtorId?: string;
  priceRange?: string;
}

export default function NeedForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEdit = !!id;
  
  const existingNeed = isEdit ? mockNeeds.find(n => n.id === id) : null;

  const [formData, setFormData] = useState({
    clientId: existingNeed?.clientId || searchParams.get('clientId') || '',
    realtorId: existingNeed?.realtorId || '',
    propertyType: (existingNeed?.propertyType || 'apartment') as PropertyType,
    city: existingNeed?.address?.city || '',
    street: existingNeed?.address?.street || '',
    minPrice: existingNeed?.priceRange?.min?.toString() || '',
    maxPrice: existingNeed?.priceRange?.max?.toString() || '',
    minArea: '',
    maxArea: '',
    minRooms: '',
    maxRooms: '',
    minFloor: '',
    maxFloor: '',
    minFloors: '',
    maxFloors: '',
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

    // Validate price range
    if (formData.minPrice && formData.maxPrice) {
      const min = parseInt(formData.minPrice);
      const max = parseInt(formData.maxPrice);
      if (min > max) {
        newErrors.priceRange = 'Минимальная цена не может быть больше максимальной';
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

    toast.success(isEdit ? 'Потребность обновлена' : 'Потребность создана');
    navigate('/needs');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="page-title">{isEdit ? 'Редактирование потребности' : 'Новая потребность'}</h1>
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
          <h2 className="font-heading font-semibold text-lg mb-4">Тип недвижимости</h2>
          
          <div>
            <Label className="form-label">Тип объекта *</Label>
            <Select value={formData.propertyType} onValueChange={(v) => setFormData(prev => ({ ...prev, propertyType: v as PropertyType }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment">Квартира</SelectItem>
                <SelectItem value="house">Дом</SelectItem>
                <SelectItem value="land">Земельный участок</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="form-section mb-6">
          <h2 className="font-heading font-semibold text-lg mb-4">Адрес (желаемый)</h2>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city" className="form-label">Город</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                placeholder="Москва"
              />
            </div>
            <div>
              <Label htmlFor="street" className="form-label">Улица</Label>
              <Input
                id="street"
                value={formData.street}
                onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                placeholder="Ленина"
              />
            </div>
          </div>
        </div>

        <div className="form-section mb-6">
          <h2 className="font-heading font-semibold text-lg mb-4">Бюджет</h2>
          
          {errors.priceRange && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-4">
              {errors.priceRange}
            </div>
          )}
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minPrice" className="form-label">Минимальная цена (₽)</Label>
              <Input
                id="minPrice"
                type="number"
                min="0"
                value={formData.minPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, minPrice: e.target.value }))}
                placeholder="5000000"
              />
            </div>
            <div>
              <Label htmlFor="maxPrice" className="form-label">Максимальная цена (₽)</Label>
              <Input
                id="maxPrice"
                type="number"
                min="0"
                value={formData.maxPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, maxPrice: e.target.value }))}
                placeholder="10000000"
              />
            </div>
          </div>
        </div>

        <div className="form-section mb-6">
          <h2 className="font-heading font-semibold text-lg mb-4">Характеристики</h2>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minArea" className="form-label">Мин. площадь (м²)</Label>
              <Input
                id="minArea"
                type="number"
                min="0"
                value={formData.minArea}
                onChange={(e) => setFormData(prev => ({ ...prev, minArea: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="maxArea" className="form-label">Макс. площадь (м²)</Label>
              <Input
                id="maxArea"
                type="number"
                min="0"
                value={formData.maxArea}
                onChange={(e) => setFormData(prev => ({ ...prev, maxArea: e.target.value }))}
              />
            </div>

            {(formData.propertyType === 'apartment' || formData.propertyType === 'house') && (
              <>
                <div>
                  <Label htmlFor="minRooms" className="form-label">Мин. комнат</Label>
                  <Input
                    id="minRooms"
                    type="number"
                    min="1"
                    value={formData.minRooms}
                    onChange={(e) => setFormData(prev => ({ ...prev, minRooms: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="maxRooms" className="form-label">Макс. комнат</Label>
                  <Input
                    id="maxRooms"
                    type="number"
                    min="1"
                    value={formData.maxRooms}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxRooms: e.target.value }))}
                  />
                </div>
              </>
            )}

            {formData.propertyType === 'apartment' && (
              <>
                <div>
                  <Label htmlFor="minFloor" className="form-label">Мин. этаж</Label>
                  <Input
                    id="minFloor"
                    type="number"
                    min="1"
                    value={formData.minFloor}
                    onChange={(e) => setFormData(prev => ({ ...prev, minFloor: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="maxFloor" className="form-label">Макс. этаж</Label>
                  <Input
                    id="maxFloor"
                    type="number"
                    min="1"
                    value={formData.maxFloor}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxFloor: e.target.value }))}
                  />
                </div>
              </>
            )}

            {formData.propertyType === 'house' && (
              <>
                <div>
                  <Label htmlFor="minFloors" className="form-label">Мин. этажность</Label>
                  <Input
                    id="minFloors"
                    type="number"
                    min="1"
                    value={formData.minFloors}
                    onChange={(e) => setFormData(prev => ({ ...prev, minFloors: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="maxFloors" className="form-label">Макс. этажность</Label>
                  <Input
                    id="maxFloors"
                    type="number"
                    min="1"
                    value={formData.maxFloors}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxFloors: e.target.value }))}
                  />
                </div>
              </>
            )}
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
