export enum Tab {
  Home = 'Home',
  Pharmacy = 'Pharmacy',
  LabTests = 'LabTests',
  PetCare = 'PetCare',
  Profile = 'Profile',
  // New "Hidden" Tabs for Navigation
  Cart = 'Cart',
  Checkout = 'Checkout',
  OrderSuccess = 'OrderSuccess',
  ProductDetails = 'ProductDetails',
  LabDetails = 'LabDetails',
  LabReports = 'LabReports',
  Appointments = 'Appointments',
  TrackOrder = 'TrackOrder',
  Categories = 'Categories',
  Print = 'Print',
  Consult = 'Consult'
}

export interface Medicine {
  id: string;
  name: string;
  brand: string;
  strength: string;
  price: number;
  mrp: number;
  discountPercent: number;
  requiresPrescription: boolean;
  eta: string; // e.g. "8 mins"
  condition: string;
  image: string;
  type: 'medicine';
  description?: string;
  safetyInfo?: string;
}

export interface LabPackage {
  id: string;
  title: string;
  includesTests: string[];
  testCount: number;
  fastingHours: number | null;
  reportTime: string;
  price: number;
  mrp: number;
  isHomeCollection: boolean;
  discountTag?: string; // e.g. "50% OFF"
  description?: string;
}

export interface PetItem {
  id: string;
  name: string;
  brand: string;
  petType: 'Dog' | 'Cat';
  category: 'Food' | 'Toy' | 'Care';
  price: number;
  mrp: number;
  rating: number;
  image: string;
  deliveryTime: string;
  type: 'pet';
  description?: string;
}

export type Product = Medicine | PetItem;

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'Processing' | 'Delivered' | 'Cancelled';
}

export interface UserProfile {
  name: string;
  address: string;
  avatarUrl: string;
  age: number;
  gender: string;
  bloodGroup: string;
}

export interface TimelineEvent {
  id: string;
  type: 'Order' | 'LabReport' | 'Consultation';
  title: string;
  date: string;
  status: string;
}

// For the category grid on Home
export interface QuickCategory {
  id: string;
  title: string;
  icon: any;
  color: string;
  route: Tab;
}