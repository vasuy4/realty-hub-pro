import { Users, UserCheck, Building2, Handshake, Tag, ShoppingCart, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatCard } from '@/components/ui/StatCard';
import { mockClients, mockRealtors, mockProperties, mockOffers, mockNeeds, mockDeals } from '@/data/mockData';
import { formatPrice, formatDate, getFullName, getShortAddress } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const activeOffers = mockOffers.filter(o => o.status === 'active');
  const activeNeeds = mockNeeds.filter(n => n.status === 'active');

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Добро пожаловать!</h1>
          <p className="text-muted-foreground mt-1">Обзор вашей деятельности в системе</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard
          title="Клиенты"
          value={mockClients.length}
          icon={<Users className="w-6 h-6" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Риэлторы"
          value={mockRealtors.length}
          icon={<UserCheck className="w-6 h-6" />}
        />
        <StatCard
          title="Объекты"
          value={mockProperties.length}
          icon={<Building2 className="w-6 h-6" />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Предложения"
          value={activeOffers.length}
          icon={<Tag className="w-6 h-6" />}
        />
        <StatCard
          title="Потребности"
          value={activeNeeds.length}
          icon={<ShoppingCart className="w-6 h-6" />}
        />
        <StatCard
          title="Сделки"
          value={mockDeals.length}
          icon={<Handshake className="w-6 h-6" />}
          trend={{ value: 25, isPositive: true }}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Offers */}
        <div className="bg-card rounded-xl border border-border shadow-soft">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-heading font-semibold text-lg">Последние предложения</h2>
            <Link to="/offers">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Все <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="divide-y divide-border">
            {mockOffers.slice(0, 4).map(offer => {
              const property = mockProperties.find(p => p.id === offer.propertyId);
              const client = mockClients.find(c => c.id === offer.clientId);
              return (
                <Link key={offer.id} to={`/offers/${offer.id}`} className="block p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{property ? getShortAddress(property.address) : 'Объект не найден'}</p>
                      <p className="text-sm text-muted-foreground">{client ? getFullName(client) : 'Клиент не найден'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">{formatPrice(offer.price)}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(offer.createdAt)}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Needs */}
        <div className="bg-card rounded-xl border border-border shadow-soft">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-heading font-semibold text-lg">Активные потребности</h2>
            <Link to="/needs">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Все <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="divide-y divide-border">
            {activeNeeds.slice(0, 4).map(need => {
              const client = mockClients.find(c => c.id === need.clientId);
              return (
                <Link key={need.id} to={`/needs/${need.id}`} className="block p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{client ? getFullName(client) : 'Клиент не найден'}</p>
                      <p className="text-sm text-muted-foreground">
                        {need.propertyType === 'apartment' ? 'Квартира' : need.propertyType === 'house' ? 'Дом' : 'Земля'}
                        {need.address?.city && ` • ${need.address.city}`}
                      </p>
                    </div>
                    <div className="text-right">
                      {need.priceRange && (
                        <p className="text-sm font-medium">
                          {need.priceRange.min && formatPrice(need.priceRange.min)}
                          {need.priceRange.min && need.priceRange.max && ' — '}
                          {need.priceRange.max && formatPrice(need.priceRange.max)}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="font-heading font-semibold text-lg mb-4">Быстрые действия</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/clients/new">
            <div className="p-4 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-card transition-all cursor-pointer group">
              <Users className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-medium">Добавить клиента</h3>
              <p className="text-sm text-muted-foreground">Создать нового клиента в системе</p>
            </div>
          </Link>
          <Link to="/properties/new">
            <div className="p-4 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-card transition-all cursor-pointer group">
              <Building2 className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-medium">Добавить объект</h3>
              <p className="text-sm text-muted-foreground">Зарегистрировать новый объект</p>
            </div>
          </Link>
          <Link to="/offers/new">
            <div className="p-4 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-card transition-all cursor-pointer group">
              <Tag className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-medium">Создать предложение</h3>
              <p className="text-sm text-muted-foreground">Разместить объект на продажу</p>
            </div>
          </Link>
          <Link to="/search">
            <div className="p-4 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-card transition-all cursor-pointer group">
              <TrendingUp className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-medium">Подобрать объект</h3>
              <p className="text-sm text-muted-foreground">Найти подходящее предложение</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
