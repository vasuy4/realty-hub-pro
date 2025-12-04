import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, Users, Building2, UserCheck } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchInput } from '@/components/ui/SearchInput';
import { PropertyTypeBadge } from '@/components/ui/PropertyTypeBadge';
import { mockClients, mockRealtors, mockProperties } from '@/data/mockData';
import { getFullName, fuzzySearchByName, fuzzySearchByAddress, getShortAddress } from '@/lib/utils';

export default function SearchPage() {
  const [clientSearch, setClientSearch] = useState('');
  const [realtorSearch, setRealtorSearch] = useState('');
  const [propertySearch, setPropertySearch] = useState('');

  const filteredClients = fuzzySearchByName(mockClients, clientSearch);
  const filteredRealtors = fuzzySearchByName(mockRealtors, realtorSearch);
  const filteredProperties = fuzzySearchByAddress(mockProperties, propertySearch);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-3">
            <SearchIcon className="w-8 h-8" />
            Поиск
          </h1>
          <p className="text-muted-foreground mt-1">Нечёткий поиск по клиентам, риэлторам и объектам</p>
        </div>
      </div>

      <Tabs defaultValue="clients" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="clients" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Клиенты
          </TabsTrigger>
          <TabsTrigger value="realtors" className="flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            Риэлторы
          </TabsTrigger>
          <TabsTrigger value="properties" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Объекты
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clients">
          <div className="form-section">
            <div className="mb-6 max-w-md">
              <SearchInput
                value={clientSearch}
                onChange={setClientSearch}
                placeholder="Поиск по ФИО (нечёткий поиск, допуск 3 символа)..."
              />
            </div>

            {clientSearch && (
              <p className="text-sm text-muted-foreground mb-4">
                Найдено: {filteredClients.length} клиентов
              </p>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClients.map(client => (
                <Link
                  key={client.id}
                  to={`/clients/${client.id}`}
                  className="p-4 rounded-lg border border-border hover:border-primary/30 hover:shadow-card transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{getFullName(client)}</p>
                      <p className="text-sm text-muted-foreground">
                        {client.phone || client.email || 'Нет контактов'}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {clientSearch && filteredClients.length === 0 && (
              <p className="text-center py-8 text-muted-foreground">Клиенты не найдены</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="realtors">
          <div className="form-section">
            <div className="mb-6 max-w-md">
              <SearchInput
                value={realtorSearch}
                onChange={setRealtorSearch}
                placeholder="Поиск по ФИО..."
              />
            </div>

            {realtorSearch && (
              <p className="text-sm text-muted-foreground mb-4">
                Найдено: {filteredRealtors.length} риэлторов
              </p>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRealtors.map(realtor => (
                <Link
                  key={realtor.id}
                  to={`/realtors/${realtor.id}`}
                  className="p-4 rounded-lg border border-border hover:border-primary/30 hover:shadow-card transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <UserCheck className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium">{getFullName(realtor)}</p>
                      <p className="text-sm text-muted-foreground">
                        Комиссия: {realtor.commissionShare ?? 45}%
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {realtorSearch && filteredRealtors.length === 0 && (
              <p className="text-center py-8 text-muted-foreground">Риэлторы не найдены</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="properties">
          <div className="form-section">
            <div className="mb-6 max-w-md">
              <SearchInput
                value={propertySearch}
                onChange={setPropertySearch}
                placeholder="Поиск по адресу (город, улица, номер дома)..."
              />
            </div>

            {propertySearch && (
              <p className="text-sm text-muted-foreground mb-4">
                Найдено: {filteredProperties.length} объектов
              </p>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProperties.map(property => (
                <Link
                  key={property.id}
                  to={`/properties/${property.id}`}
                  className="p-4 rounded-lg border border-border hover:border-primary/30 hover:shadow-card transition-all"
                >
                  <PropertyTypeBadge type={property.type} className="mb-2" />
                  <p className="font-medium">{getShortAddress(property.address)}</p>
                  {'area' in property && property.area && (
                    <p className="text-sm text-muted-foreground">{property.area} м²</p>
                  )}
                </Link>
              ))}
            </div>

            {propertySearch && filteredProperties.length === 0 && (
              <p className="text-center py-8 text-muted-foreground">Объекты не найдены</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
