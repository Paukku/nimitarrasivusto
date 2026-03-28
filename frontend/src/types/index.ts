/**
 * Jaetut TypeScript-tyypit Nimitarra-verkkokauppa sovellukselle
 */

import { z } from 'zod';

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

/**
 * Tilauksen luomisen payload
 */
export interface CreateOrderPayload {
  items: CartItem[];
  customerInfo: CustomerInfo;
}

/**
 * Zod-skeema tilauksen validointia varten
 */
export const CreateOrderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Väri ei ole voimassa olevan hex-koodi'),
      text: z.string().min(1, 'Teksti ei voi olla tyhjä').max(20, 'Teksti ei voi olla yli 20 merkkiä'),
      quantity: z.number().int().min(1, 'Määrä on oltava vähintään 1'),
    })
  ).min(1, 'Tilauksessa on oltava vähintään yksi tuote'),
  customerInfo: z.object({
    name: z.string().min(1, 'Nimi on pakollinen'),
    address: z.string().min(1, 'Osoite on pakollinen'),
  }),
});

export type CreateOrderSchema = z.infer<typeof CreateOrderSchema>;
