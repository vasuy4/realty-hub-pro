import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mockRealtors } from '@/data/mockData';
import { toast } from 'sonner';

interface FormErrors {
  lastName?: string;
  firstName?: string;
  middleName?: string;
  commissionShare?: string;
}

export default function RealtorForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  
  const existingRealtor = isEdit ? mockRealtors.find(r => r.id === id) : null;

  const [formData, setFormData] = useState({
    lastName: existingRealtor?.lastName || '',
    firstName: existingRealtor?.firstName || '',
    middleName: existingRealtor?.middleName || '',
    commissionShare: existingRealtor?.commissionShare?.toString() || '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Фамилия обязательна';
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Имя обязательно';
    }
    if (!formData.middleName.trim()) {
      newErrors.middleName = 'Отчество обязательно';
    }

    if (formData.commissionShare) {
      const share = parseFloat(formData.commissionShare);
      if (isNaN(share) || share < 0 || share > 100) {
        newErrors.commissionShare = 'Доля должна быть от 0 до 100';
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

    toast.success(isEdit ? 'Риэлтор обновлён' : 'Риэлтор создан');
    navigate('/realtors');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="page-title">{isEdit ? 'Редактирование риэлтора' : 'Новый риэлтор'}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="form-section mb-6">
          <h2 className="font-heading font-semibold text-lg mb-4">Персональные данные</h2>
          
          <div className="grid gap-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="lastName" className="form-label">Фамилия *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Смирнов"
                  className={errors.lastName ? 'border-destructive' : ''}
                />
                {errors.lastName && <p className="form-error">{errors.lastName}</p>}
              </div>
              <div>
                <Label htmlFor="firstName" className="form-label">Имя *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="Андрей"
                  className={errors.firstName ? 'border-destructive' : ''}
                />
                {errors.firstName && <p className="form-error">{errors.firstName}</p>}
              </div>
              <div>
                <Label htmlFor="middleName" className="form-label">Отчество *</Label>
                <Input
                  id="middleName"
                  value={formData.middleName}
                  onChange={(e) => setFormData(prev => ({ ...prev, middleName: e.target.value }))}
                  placeholder="Викторович"
                  className={errors.middleName ? 'border-destructive' : ''}
                />
                {errors.middleName && <p className="form-error">{errors.middleName}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="form-section mb-6">
          <h2 className="font-heading font-semibold text-lg mb-4">Комиссия</h2>
          
          <div className="max-w-xs">
            <Label htmlFor="commissionShare" className="form-label">Доля от комиссии (%)</Label>
            <Input
              id="commissionShare"
              type="number"
              min="0"
              max="100"
              value={formData.commissionShare}
              onChange={(e) => setFormData(prev => ({ ...prev, commissionShare: e.target.value }))}
              placeholder="45"
              className={errors.commissionShare ? 'border-destructive' : ''}
            />
            {errors.commissionShare && <p className="form-error">{errors.commissionShare}</p>}
            <p className="text-sm text-muted-foreground mt-1">
              Если не указана, используется значение по умолчанию: 45%
            </p>
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
