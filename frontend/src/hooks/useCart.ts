import { useState, useCallback } from 'react';
import { CartItem } from '../types';

const CART_STORAGE_KEY = 'nimitarra_cart';

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const persist = useCallback((next: CartItem[]) => {
    setCart(next);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
  }, []);

  const addItem = useCallback(
    (item: CartItem) => {
      const existing = cart.find((i) => i.id === item.id);
      if (existing) {
        persist(
          cart.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
          )
        );
      } else {
        persist([...cart, item]);
      }
    },
    [cart, persist]
  );

  const removeItem = useCallback(
    (id: string) => {
      persist(cart.filter((i) => i.id !== id));
    },
    [cart, persist]
  );

  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      persist(
        cart.map((i) => (i.id === id ? { ...i, quantity } : i))
      );
    },
    [cart, persist]
  );

  const clearCart = useCallback(() => {
    persist([]);
  }, [persist]);

  return {
    items: cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
}
