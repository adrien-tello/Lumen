import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Cart, CartItem, Product } from '../types';
import { cartService } from '../services/cart.service';
import { tokenStore } from '../api/client';

interface CartState {
  items: CartItem[];
  subtotalCents: number;
  itemCount: number;
  isOpen: boolean;
  loading: boolean;

  openDrawer: () => void;
  closeDrawer: () => void;

  /** Pulls the authoritative cart from the server (when logged in). */
  sync: () => Promise<void>;
  /** Pushes any local guest items into the server cart after authentication. */
  mergeGuestCart: () => Promise<void>;
  add: (product: Product, quantity?: number) => Promise<void>;
  update: (productId: string, quantity: number) => Promise<void>;
  remove: (productId: string) => Promise<void>;
}

/** Recomputes derived totals from items. */
const totals = (items: CartItem[]) => ({
  subtotalCents: items.reduce((s, i) => s + i.product.priceCents * i.quantity, 0),
  itemCount: items.reduce((s, i) => s + i.quantity, 0),
});

const isAuthed = () => Boolean(tokenStore.getAccess());

const applyServerCart = (cart: Cart) => ({
  items: cart.items,
  subtotalCents: cart.subtotalCents,
  itemCount: cart.itemCount,
});

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      subtotalCents: 0,
      itemCount: 0,
      isOpen: false,
      loading: false,

      openDrawer: () => set({ isOpen: true }),
      closeDrawer: () => set({ isOpen: false }),

      sync: async () => {
        if (!isAuthed()) return;
        set({ loading: true });
        try {
          set(applyServerCart(await cartService.get()));
        } finally {
          set({ loading: false });
        }
      },

      mergeGuestCart: async () => {
        if (!isAuthed()) return;

        const guestItems = get().items.filter((item) => item.id.startsWith('local-'));
        if (guestItems.length === 0) {
          await get().sync();
          return;
        }

        set({ loading: true });
        try {
          let serverCart: Cart | null = null;
          for (const item of guestItems) {
            serverCart = await cartService.addItem(item.productId, item.quantity);
          }
          set(applyServerCart(serverCart ?? (await cartService.get())));
        } finally {
          set({ loading: false });
        }
      },

      add: async (product, quantity = 1) => {
        if (isAuthed()) {
          set(applyServerCart(await cartService.addItem(product.id, quantity)));
        } else {
          // Guest cart — kept locally and merged after login.
          const items = [...get().items];
          const existing = items.find((i) => i.productId === product.id);
          if (existing) {
            existing.quantity += quantity;
          } else {
            items.push({
              id: `local-${product.id}`,
              productId: product.id,
              quantity,
              product,
            });
          }
          set({ items, ...totals(items) });
        }
        set({ isOpen: true });
      },

      update: async (productId, quantity) => {
        if (isAuthed()) {
          set(applyServerCart(await cartService.updateItem(productId, quantity)));
        } else {
          let items = get().items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i,
          );
          items = items.filter((i) => i.quantity > 0);
          set({ items, ...totals(items) });
        }
      },

      remove: async (productId) => {
        if (isAuthed()) {
          set(applyServerCart(await cartService.removeItem(productId)));
        } else {
          const items = get().items.filter((i) => i.productId !== productId);
          set({ items, ...totals(items) });
        }
      },
    }),
    {
      name: 'lumen-cart',
      // Only persist the guest cart contents.
      partialize: (s) => ({ items: s.items, subtotalCents: s.subtotalCents, itemCount: s.itemCount }),
    },
  ),
);
