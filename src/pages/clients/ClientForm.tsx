import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mockClients } from '@/data/mockData';
import { validateEmail, validatePhone } from '@/lib/utils';
import { toast } from 'sonner';

interface FormErrors {
  contact?: string;
  email?: string;
  phone?: string;
}

export default function ClientForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  
  const existingClient = isEdit ? mockClients.find(c => c.id === id) : null;

  const [formData, setFormData] = useState({
    lastName: existingClient?.lastName || '',
    firstName: existingClient?.firstName || '',
    middleName: existingClient?.middleName || '',
    phone: existingClient?.phone || '',
    email: existingClient?.email || '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // At least phone or email must be filled
    if (!formData.phone && !formData.email) {
      newErrors.contact = 'Необходимо указать телефон или email';
    }

    // Validate email format if provided
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Некорректный формат email';
    }

    // Validate phone format if provided
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Некорректный формат телефона';
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

    toast.success(isEdit ? 'Клиент обновлён' : 'Клиент создан');
    navigate('/clients');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="page-title">{isEdit ? 'Редактирование клиента' : 'Новый клиент'}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="form-section mb-6">
          <h2 className="font-heading font-semibold text-lg mb-4">Персональные данные</h2>
          
          <div className="grid gap-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="lastName" className="form-label">Фамилия</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Иванов"
                />
              </div>
              <div>
                <Label htmlFor="firstName" className="form-label">Имя</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="Иван"
                />
              </div>
              <div>
                <Label htmlFor="middleName" className="form-label">Отчество</Label>
                <Input
                  id="middleName"
                  value={formData.middleName}
                  onChange={(e) => setFormData(prev => ({ ...prev, middleName: e.target.value }))}
                  placeholder="Иванович"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-section mb-6">
          <h2 className="font-heading font-semibold text-lg mb-4">Контактные данные</h2>
          
          {errors.contact && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-4">
              {errors.contact}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone" className="form-label">Телефон</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+7 (999) 123-45-67"
                className={errors.phone ? 'border-destructive' : ''}
              />
              {errors.phone && <p className="form-error">{errors.phone}</p>}
            </div>
            <div>
              <Label htmlFor="email" className="form-label">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@example.com"
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>
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
