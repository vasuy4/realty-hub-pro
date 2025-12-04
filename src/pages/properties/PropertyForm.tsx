import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockProperties } from '@/data/mockData';
import { PropertyType } from '@/types';
import { toast } from 'sonner';

interface FormErrors {
  type?: string;
  latitude?: string;
  longitude?: string;
}

export default function PropertyForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  
  const existingProperty = isEdit ? mockProperties.find(p => p.id === id) : null;

  const [formData, setFormData] = useState({
    type: (existingProperty?.type || 'apartment') as PropertyType,
    city: existingProperty?.address.city || '',
    street: existingProperty?.address.street || '',
    houseNumber: existingProperty?.address.houseNumber || '',
    apartmentNumber: existingProperty?.address.apartmentNumber || '',
    latitude: existingProperty?.coordinates?.latitude?.toString() || '',
    longitude: existingProperty?.coordinates?.longitude?.toString() || '',
    floor: (existingProperty?.type === 'apartment' ? (existingProperty as any).floor?.toString() : '') || '',
    rooms: ((existingProperty?.type === 'apartment' || existingProperty?.type === 'house') ? (existingProperty as any).rooms?.toString() : '') || '',
    floors: (existingProperty?.type === 'house' ? (existingProperty as any).floors?.toString() : '') || '',
    area: ('area' in (existingProperty || {}) ? (existingProperty as any).area?.toString() : '') || '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (formData.latitude) {
      const lat = parseFloat(formData.latitude);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        newErrors.latitude = 'Широта должна быть от -90 до +90';
      }
    }

    if (formData.longitude) {
      const lng = parseFloat(formData.longitude);
      if (isNaN(lng) || lng < -180 || lng > 180) {
        newErrors.longitude = 'Долгота должна быть от -180 до +180';
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

    toast.success(isEdit ? 'Объект обновлён' : 'Объект создан');
    navigate('/properties');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="page-title">{isEdit ? 'Редактирование объекта' : 'Новый объект'}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="form-section mb-6">
          <h2 className="font-heading font-semibold text-lg mb-4">Основная информация</h2>
          
          <div className="mb-4">
            <Label className="form-label">Тип объекта *</Label>
            <Select value={formData.type} onValueChange={(v) => setFormData(prev => ({ ...prev, type: v as PropertyType }))}>
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
          <h2 className="font-heading font-semibold text-lg mb-4">Адрес</h2>
          
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
            <div>
              <Label htmlFor="houseNumber" className="form-label">Номер дома</Label>
              <Input
                id="houseNumber"
                value={formData.houseNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, houseNumber: e.target.value }))}
                placeholder="10"
              />
            </div>
            {formData.type === 'apartment' && (
              <div>
                <Label htmlFor="apartmentNumber" className="form-label">Номер квартиры</Label>
                <Input
                  id="apartmentNumber"
                  value={formData.apartmentNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, apartmentNumber: e.target.value }))}
                  placeholder="25"
                />
              </div>
            )}
          </div>
        </div>

        <div className="form-section mb-6">
          <h2 className="font-heading font-semibold text-lg mb-4">Координаты</h2>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="latitude" className="form-label">Широта</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                placeholder="55.7558"
                className={errors.latitude ? 'border-destructive' : ''}
              />
              {errors.latitude && <p className="form-error">{errors.latitude}</p>}
            </div>
            <div>
              <Label htmlFor="longitude" className="form-label">Долгота</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                placeholder="37.6173"
                className={errors.longitude ? 'border-destructive' : ''}
              />
              {errors.longitude && <p className="form-error">{errors.longitude}</p>}
            </div>
          </div>
        </div>

        <div className="form-section mb-6">
          <h2 className="font-heading font-semibold text-lg mb-4">Характеристики</h2>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="area" className="form-label">Площадь (м²)</Label>
              <Input
                id="area"
                type="number"
                step="any"
                value={formData.area}
                onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                placeholder="54"
              />
            </div>

            {(formData.type === 'apartment' || formData.type === 'house') && (
              <div>
                <Label htmlFor="rooms" className="form-label">Количество комнат</Label>
                <Input
                  id="rooms"
                  type="number"
                  value={formData.rooms}
                  onChange={(e) => setFormData(prev => ({ ...prev, rooms: e.target.value }))}
                  placeholder="2"
                />
              </div>
            )}

            {formData.type === 'apartment' && (
              <div>
                <Label htmlFor="floor" className="form-label">Этаж</Label>
                <Input
                  id="floor"
                  type="number"
                  value={formData.floor}
                  onChange={(e) => setFormData(prev => ({ ...prev, floor: e.target.value }))}
                  placeholder="5"
                />
              </div>
            )}

            {formData.type === 'house' && (
              <div>
                <Label htmlFor="floors" className="form-label">Этажность дома</Label>
                <Input
                  id="floors"
                  type="number"
                  value={formData.floors}
                  onChange={(e) => setFormData(prev => ({ ...prev, floors: e.target.value }))}
                  placeholder="2"
                />
              </div>
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
