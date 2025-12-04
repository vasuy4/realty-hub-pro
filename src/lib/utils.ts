import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Client, Realtor, Property, PropertyType, DealCommissions, Offer, Need } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFullName(entity: { lastName?: string; firstName?: string; middleName?: string }): string {
  return [entity.lastName, entity.firstName, entity.middleName].filter(Boolean).join(' ') || 'Без имени';
}

export function getShortAddress(address?: { city?: string; street?: string; houseNumber?: string; apartmentNumber?: string }): string {
  if (!address) return 'Адрес не указан';
  const parts = [address.city, address.street, address.houseNumber && `д.${address.houseNumber}`, address.apartmentNumber && `кв.${address.apartmentNumber}`].filter(Boolean);
  return parts.join(', ') || 'Адрес не указан';
}

export function getPropertyTypeLabel(type: PropertyType): string {
  const labels: Record<PropertyType, string> = {
    apartment: 'Квартира',
    house: 'Дом',
    land: 'Земля',
  };
  return labels[type];
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(price);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
}

// Levenshtein distance for fuzzy search
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  const aLower = a.toLowerCase();
  const bLower = b.toLowerCase();

  for (let i = 0; i <= bLower.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= aLower.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= bLower.length; i++) {
    for (let j = 1; j <= aLower.length; j++) {
      if (bLower.charAt(i - 1) === aLower.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
      }
    }
  }

  return matrix[bLower.length][aLower.length];
}

export function fuzzySearchByName<T extends { lastName?: string; firstName?: string; middleName?: string }>(items: T[], query: string, maxDistance = 3): T[] {
  if (!query.trim()) return items;
  
  return items.filter(item => {
    const fullName = getFullName(item);
    const parts = query.split(' ').filter(Boolean);
    
    return parts.some(part => {
      const itemParts = [item.lastName, item.firstName, item.middleName].filter(Boolean) as string[];
      return itemParts.some(itemPart => levenshteinDistance(part, itemPart) <= maxDistance);
    });
  });
}

export function fuzzySearchByAddress(items: Property[], query: string): Property[] {
  if (!query.trim()) return items;
  
  return items.filter(item => {
    const { address } = item;
    if (!address) return false;
    
    const cityMatch = address.city ? levenshteinDistance(query, address.city) <= 3 : false;
    const streetMatch = address.street ? levenshteinDistance(query, address.street) <= 3 : false;
    const houseMatch = address.houseNumber ? levenshteinDistance(query, address.houseNumber) <= 1 : false;
    
    return cityMatch || streetMatch || houseMatch || 
           getShortAddress(address).toLowerCase().includes(query.toLowerCase());
  });
}

export function calculateDealCommissions(offer: Offer, property: Property, sellerRealtor: Realtor, buyerRealtor: Realtor): DealCommissions {
  const price = offer.price;
  
  // Seller service cost based on property type
  let sellerServiceCost: number;
  switch (property.type) {
    case 'apartment':
      sellerServiceCost = 36000 + price * 0.01;
      break;
    case 'land':
      sellerServiceCost = 30000 + price * 0.02;
      break;
    case 'house':
      sellerServiceCost = 30000 + price * 0.01;
      break;
  }
  
  // Buyer service cost is 3% of price
  const buyerServiceCost = price * 0.03;
  
  // Realtor shares (default 45% if not specified)
  const sellerRealtorShare = (sellerRealtor.commissionShare ?? 45) / 100;
  const buyerRealtorShare = (buyerRealtor.commissionShare ?? 45) / 100;
  
  const sellerRealtorPayment = sellerServiceCost * sellerRealtorShare;
  const buyerRealtorPayment = buyerServiceCost * buyerRealtorShare;
  
  const companyIncome = (sellerServiceCost - sellerRealtorPayment) + (buyerServiceCost - buyerRealtorPayment);
  
  return {
    sellerServiceCost,
    buyerServiceCost,
    sellerRealtorPayment,
    buyerRealtorPayment,
    companyIncome,
  };
}

export function isOfferMatchingNeed(offer: Offer, need: Need, property: Property): boolean {
  // Type must match
  if (property.type !== need.propertyType) return false;
  
  // Price range check
  if (need.priceRange) {
    if (need.priceRange.min && offer.price < need.priceRange.min) return false;
    if (need.priceRange.max && offer.price > need.priceRange.max) return false;
  }
  
  // Address check (only if need has address requirements)
  if (need.address) {
    const propAddr = property.address;
    if (need.address.city && propAddr.city !== need.address.city) return false;
    if (need.address.street && propAddr.street !== need.address.street) return false;
  }
  
  // Type-specific checks
  if (need.propertyType === 'apartment' && property.type === 'apartment') {
    const apartmentNeed = need as { areaRange?: { min?: number; max?: number }; roomsRange?: { min?: number; max?: number }; floorRange?: { min?: number; max?: number } };
    if (apartmentNeed.areaRange) {
      if (apartmentNeed.areaRange.min && property.area && property.area < apartmentNeed.areaRange.min) return false;
      if (apartmentNeed.areaRange.max && property.area && property.area > apartmentNeed.areaRange.max) return false;
    }
    if (apartmentNeed.roomsRange) {
      if (apartmentNeed.roomsRange.min && property.rooms && property.rooms < apartmentNeed.roomsRange.min) return false;
      if (apartmentNeed.roomsRange.max && property.rooms && property.rooms > apartmentNeed.roomsRange.max) return false;
    }
    if (apartmentNeed.floorRange) {
      if (apartmentNeed.floorRange.min && property.floor && property.floor < apartmentNeed.floorRange.min) return false;
      if (apartmentNeed.floorRange.max && property.floor && property.floor > apartmentNeed.floorRange.max) return false;
    }
  }
  
  return true;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
  return phoneRegex.test(phone);
}
