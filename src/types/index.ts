export type PropertyType = 'apartment' | 'house' | 'land';

export interface Client {
  id: string;
  lastName?: string;
  firstName?: string;
  middleName?: string;
  phone?: string;
  email?: string;
  createdAt: Date;
}

export interface Realtor {
  id: string;
  lastName: string;
  firstName: string;
  middleName: string;
  commissionShare?: number; // 0-100, default 45
  createdAt: Date;
}

export interface Address {
  city?: string;
  street?: string;
  houseNumber?: string;
  apartmentNumber?: string;
}

export interface Coordinates {
  latitude?: number; // -90 to +90
  longitude?: number; // -180 to +180
}

export interface PropertyBase {
  id: string;
  type: PropertyType;
  address: Address;
  coordinates?: Coordinates;
  createdAt: Date;
}

export interface ApartmentProperty extends PropertyBase {
  type: 'apartment';
  floor?: number;
  rooms?: number;
  area?: number;
}

export interface HouseProperty extends PropertyBase {
  type: 'house';
  floors?: number;
  rooms?: number;
  area?: number;
}

export interface LandProperty extends PropertyBase {
  type: 'land';
  area?: number;
}

export type Property = ApartmentProperty | HouseProperty | LandProperty;

export interface Offer {
  id: string;
  clientId: string;
  realtorId: string;
  propertyId: string;
  price: number;
  status: 'active' | 'in_deal' | 'closed';
  createdAt: Date;
}

export interface NeedRange {
  min?: number;
  max?: number;
}

export interface NeedBase {
  id: string;
  clientId: string;
  realtorId: string;
  propertyType: PropertyType;
  address?: Address;
  priceRange?: NeedRange;
  status: 'active' | 'satisfied';
  createdAt: Date;
}

export interface ApartmentNeed extends NeedBase {
  propertyType: 'apartment';
  areaRange?: NeedRange;
  roomsRange?: NeedRange;
  floorRange?: NeedRange;
}

export interface HouseNeed extends NeedBase {
  propertyType: 'house';
  areaRange?: NeedRange;
  roomsRange?: NeedRange;
  floorsRange?: NeedRange;
}

export interface LandNeed extends NeedBase {
  propertyType: 'land';
  areaRange?: NeedRange;
}

export type Need = ApartmentNeed | HouseNeed | LandNeed;

export interface Deal {
  id: string;
  needId: string;
  offerId: string;
  createdAt: Date;
}

export interface DealCommissions {
  sellerServiceCost: number;
  buyerServiceCost: number;
  sellerRealtorPayment: number;
  buyerRealtorPayment: number;
  companyIncome: number;
}

export interface Event {
  id: string;
  realtorId: string;
  dateTime: Date;
  duration?: number; // minutes
  type: 'client_meeting' | 'showing' | 'scheduled_call';
  comment?: string;
}
