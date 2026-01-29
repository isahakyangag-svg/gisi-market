
export type Language = 'en' | 'ru' | 'hy';
export type UserRole = 'super_admin' | 'admin' | 'customer';
// Updated OrderStatus to include 'подтвержден' used in the app
export type OrderStatus = 'new' | 'pending_payment' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | 'подтвержден';
export type ReturnStatus = 'created' | 'under_review' | 'approved' | 'rejected' | 'completed';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  joinedDate: string;
  loyaltyPoints: number;
  loyaltyLevel: 'basic' | 'silver' | 'gold' | 'platinum';
  address?: string;
  status: 'active' | 'blocked';
  // Added missing properties found in usage
  isPhoneVerified?: boolean;
  smsNotificationsEnabled?: boolean;
}

export interface Address {
  id: string;
  label: string; // 'Дом', 'Офис'
  city: string;
  street: string;
  house: string;
  apartment?: string;
  isDefault: boolean;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  deliveryAddress: string;
  trackingNumber?: string;
  // Added missing properties found in usage
  customerName?: string;
  customerEmail?: string;
}

export interface BonusTransaction {
  id: string;
  type: 'accrual' | 'spending';
  amount: number;
  description: string;
  date: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'answered' | 'closed';
  lastUpdate: string;
}

export interface UserSession {
  id: string;
  device: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface StoreSettings {
  storeName: string;
  currency: string;
  primaryColor: string;
  borderRadius: string;
  design: any;
  background: any;
  footer: any;
  security: {
    is2FAEnabled: boolean;
    allowedIPs?: string[];
    loginLogs?: any[];
      pageBackground?: string;   // фон всего сайта
  pageTextColor?: string;    // основной цвет текста
  };
  // Added missing properties used in App.tsx
  linkColor?: string;
  headerBackground?: string;
  footerBackground?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  buttonHoverColor?: string;
  buttonBorderRadius?: string;
  fontFamily?: string;
  domain?: string;
  textColor?: string;
  homeBlocks?: any[];
  globalSeo?: any;
  bannerAutoPlay?: boolean;
  bannerAutoPlaySpeed?: number;
}

export interface Banner {
  id: string;
  title?: string;
  imageUrl?: string;
  videoUrl?: string;
  status: 'active' | 'inactive';
  order: number;
  animationType?: 'fade' | 'slide';
  overlayOpacity?: number;
  contentAlignment?: 'left' | 'center' | 'right';
  link?: string;
  buttonText?: string;
  subtitle?: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discountValue: number;
  type: 'percent' | 'fixed';
  status: 'active' | 'expired';
  minOrderAmount?: number;
  usageLimit?: number;
  usedCount: number;
  expiresAt?: string;
}

export interface AuditLog {
  id: string;
  adminName: string;
  adminEmail: string;
  action: string;
  details: string;
  type: 'product' | 'category' | 'order' | 'settings' | 'cms' | 'auth' | 'system';
  timestamp: string;
}

// Updated Category to include SEO and other missing properties
export interface Category {
  id: string;
  name: string;
  slug?: string;
  order?: number;
  status?: string;
  seo?: SEOData;
  subcategories?: { id: string, name: string, icon: string, slug: string }[];
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number;
  image: string;
  images: string[];
  stock: number;
  categoryId: string;
  subCategoryId?: string;
  sku: string;
  rating: number;
  description: string;
  features: string[];
  attributes: { label: string, value: string }[];
  isPromo?: boolean;
  reviews?: Review[];
  // Added missing properties found in usage
  status?: string;
  costPrice?: number;
  maxDiscount?: number;
  allowDiscounts?: boolean;
  unit?: string;
  isNew?: boolean;
  isHit?: boolean;
}

export interface Review {
  id: string;
  productId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
  images?: string[];
  videos?: string[];
  // Added missing properties found in usage
  productName?: string;
  status?: string;
  verified?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

// Added missing interfaces for CMS, SEO, Chat, Media and AI tasks
export interface CMSPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'published' | 'draft';
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  image: string;
  status: 'active' | 'expired';
}

export interface SEOData {
  title: string;
  description: string;
  keywords: string;
  slug: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface SecurityLog {
  id: string;
  action: string;
  timestamp: string;
  ip: string;
}

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document';
  size: number;
  folder: string;
  createdAt: string;
  dimensions?: string;
}

export interface AITask {
  id: string;
  title: string;
  status: 'pending' | 'completed';
}
