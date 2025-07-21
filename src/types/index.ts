export type Language = 'ar' | 'en';
export type PlanType = 'free' | 'monthly' | 'sixmonths' | 'yearly';
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface User {
  uid: string;
  email: string;
  name: string;
  phone: string;
  country: string;
  planType: PlanType;
  subscriptionStartDate?: Date;
  subscriptionExpiryDate?: Date;
  createdAt: Date;
  emailVerified: boolean;
}

export interface Store {
  userId: string;
  storeTitle: string;
  storeBio?: string;
  storeCountry?: string;
  planType: PlanType;
  whatsapp?: string;
  instagram?: string;
  email?: string;
  tiktok?: string;
  twitter?: string;
  snapchat?: string;
  facebook?: string;
  enableAI?: boolean;
  autoDescription?: boolean;
  localDelivery?: boolean;
  globalDelivery?: boolean;
  deliveryCost?: number;
  // Payment settings
  enableCashOnDelivery?: boolean;
  enableElectronicPayment?: boolean;
  paymentMethod?: 'both' | 'electronic' | 'cash';
  stripeEnabled?: boolean;
  stripeTestMode?: boolean;
  stripePublicKey?: string;
  stripeSecretKey?: string;
  deliveryOptions?: Record<string, Record<string, number>>;
  createdAt: Date;
  updatedAt: Date;
  logo?: string;
  domain?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  images?: string[];
  category?: string;
  tags?: string;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
  sizes?: { value: string; price?: string }[];
  colors?: { value: string; price?: string }[];
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress?: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: Date;
  createdAt: Date;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercentage: number;
  validUntil: Date;
  isActive: boolean;
  usageCount: number;
  maxUsage?: number;
  createdAt: Date;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface AIFeatures {
  generateDescription: boolean;
  generateName: boolean;
  suggestPrice: boolean;
}

export interface DeliverySettings {
  localDelivery: boolean;
  globalDelivery: boolean;
  deliveryCost: number;
}

export interface ContactSettings {
  whatsapp?: string;
  instagram?: string;
  email?: string;
} 