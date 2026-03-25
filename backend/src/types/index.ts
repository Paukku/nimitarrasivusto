/**
 * Jaetut TypeScript-tyypit Nimitarra-verkkokauppa sovellukselle
 */

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

/**
 * Ostoskorin tuote
 */
export interface CartItem {
  id: string;
  color: string; // hex-koodi, esim. #FF0000
  text: string; // max 20 merkkiä
  quantity: number; // erä-määrä (1 erä = 120 kpl)
}

/**
 * Tilauksen tuoteviiva
 */
export interface OrderItem {
  id: string;
  color: string;
  text: string;
  quantity: number; // erä-määrä
  unitPrice: number; // hinta per yksikkö/erä
}

/**
 * Asiakkaan yhteystiedot
 */
export interface CustomerInfo {
  name: string;
  address: string;
}

/**
 * Tilaus
 */
export interface Order {
  id: string;
  items: OrderItem[];
  customerInfo: CustomerInfo;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string; // ISO 8601 datetime
}
