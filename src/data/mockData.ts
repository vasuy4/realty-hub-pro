import { Client, Realtor, Property, Offer, Need, Deal } from '@/types';

export const mockClients: Client[] = [
  { id: '1', lastName: 'Иванов', firstName: 'Иван', middleName: 'Иванович', phone: '+7 (999) 123-45-67', email: 'ivanov@mail.ru', createdAt: new Date('2024-01-15') },
  { id: '2', lastName: 'Петрова', firstName: 'Мария', middleName: 'Сергеевна', phone: '+7 (999) 234-56-78', email: 'petrova@mail.ru', createdAt: new Date('2024-02-20') },
  { id: '3', lastName: 'Сидоров', firstName: 'Алексей', middleName: 'Петрович', phone: '+7 (999) 345-67-89', createdAt: new Date('2024-03-10') },
  { id: '4', lastName: 'Козлова', firstName: 'Елена', email: 'kozlova@gmail.com', createdAt: new Date('2024-03-25') },
  { id: '5', lastName: 'Морозов', firstName: 'Дмитрий', middleName: 'Александрович', phone: '+7 (999) 456-78-90', email: 'morozov@yandex.ru', createdAt: new Date('2024-04-05') },
];

export const mockRealtors: Realtor[] = [
  { id: '1', lastName: 'Смирнов', firstName: 'Андрей', middleName: 'Викторович', commissionShare: 50, createdAt: new Date('2023-01-01') },
  { id: '2', lastName: 'Новикова', firstName: 'Ольга', middleName: 'Дмитриевна', commissionShare: 45, createdAt: new Date('2023-03-15') },
  { id: '3', lastName: 'Федоров', firstName: 'Сергей', middleName: 'Николаевич', createdAt: new Date('2023-06-20') },
];

export const mockProperties: Property[] = [
  { id: '1', type: 'apartment', address: { city: 'Москва', street: 'Ленина', houseNumber: '10', apartmentNumber: '25' }, coordinates: { latitude: 55.7558, longitude: 37.6173 }, floor: 5, rooms: 2, area: 54, createdAt: new Date('2024-01-10') },
  { id: '2', type: 'apartment', address: { city: 'Москва', street: 'Пушкина', houseNumber: '15' }, floor: 3, rooms: 3, area: 78, createdAt: new Date('2024-02-15') },
  { id: '3', type: 'house', address: { city: 'Подольск', street: 'Садовая', houseNumber: '5' }, coordinates: { latitude: 55.4255, longitude: 37.5447 }, floors: 2, rooms: 5, area: 150, createdAt: new Date('2024-03-01') },
  { id: '4', type: 'land', address: { city: 'Дмитров', street: 'Полевая', houseNumber: '12' }, area: 1500, createdAt: new Date('2024-03-20') },
  { id: '5', type: 'apartment', address: { city: 'Москва', street: 'Гагарина', houseNumber: '8', apartmentNumber: '101' }, floor: 10, rooms: 1, area: 38, createdAt: new Date('2024-04-01') },
];

export const mockOffers: Offer[] = [
  { id: '1', clientId: '1', realtorId: '1', propertyId: '1', price: 8500000, status: 'active', createdAt: new Date('2024-02-01') },
  { id: '2', clientId: '2', realtorId: '2', propertyId: '2', price: 12000000, status: 'active', createdAt: new Date('2024-02-20') },
  { id: '3', clientId: '3', realtorId: '1', propertyId: '3', price: 15000000, status: 'in_deal', createdAt: new Date('2024-03-10') },
  { id: '4', clientId: '1', realtorId: '3', propertyId: '4', price: 3500000, status: 'active', createdAt: new Date('2024-04-01') },
];

export const mockNeeds: Need[] = [
  { id: '1', clientId: '4', realtorId: '2', propertyType: 'apartment', address: { city: 'Москва' }, priceRange: { min: 7000000, max: 10000000 }, areaRange: { min: 45, max: 70 }, roomsRange: { min: 2, max: 3 }, status: 'active', createdAt: new Date('2024-02-15') },
  { id: '2', clientId: '5', realtorId: '1', propertyType: 'house', address: { city: 'Подольск' }, priceRange: { max: 20000000 }, areaRange: { min: 100 }, roomsRange: { min: 4 }, status: 'satisfied', createdAt: new Date('2024-03-01') },
  { id: '3', clientId: '3', realtorId: '3', propertyType: 'land', priceRange: { min: 2000000, max: 5000000 }, areaRange: { min: 1000 }, status: 'active', createdAt: new Date('2024-03-25') },
];

export const mockDeals: Deal[] = [
  { id: '1', needId: '2', offerId: '3', createdAt: new Date('2024-04-15') },
];
