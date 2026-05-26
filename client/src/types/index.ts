// ---------------------------------------------------------------------------
// Domain types — mirror the API response shapes.
// ---------------------------------------------------------------------------

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  _count?: { products: number };
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  priceCents: number;
  comparePriceCents?: number | null;
  currency: string;
  stock: number;
  images: string[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  category?: Pick<Category, 'name' | 'slug'>;
  // Populated only by the product-detail endpoint.
  reviews?: Review[];
}

export interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  user: { firstName: string; lastName: string };
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotalCents: number;
  itemCount: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CUSTOMER' | 'ADMIN';
}

export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED' | 'FAILED';

export interface OrderItem {
  id: string;
  productId: string;
  unitPriceCents: number;
  quantity: number;
  titleSnapshot: string;
  product?: Product;
}

export interface Order {
  id: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalCents: number;
  currency: string;
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingCountry: string;
  shippingZip: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface AuthResult {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Generic API envelopes
export interface ApiList<T> {
  success: boolean;
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiItem<T> {
  success: boolean;
  data: T;
}

export type ProductSort = 'newest' | 'price_asc' | 'price_desc' | 'rating';

export interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: ProductSort;
  featured?: boolean;
}
