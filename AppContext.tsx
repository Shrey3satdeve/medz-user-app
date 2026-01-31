import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, CartItem, Order, LabPackage } from './types';
import firestore from '@react-native-firebase/firestore';

interface ToastData {
  message: string;
  type: 'success' | 'error';
  visible: boolean;
}

interface AppContextType {
  cart: CartItem[];
  orders: Order[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  placeOrder: () => Promise<string | null>;
  getQuantity: (productId: string) => number;
  cartTotal: number;
  cartCount: number;
  showToast: (message: string, type?: 'success' | 'error') => void;
  toast: ToastData;
  // Detail Selection State
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  selectedLabPackage: LabPackage | null;
  setSelectedLabPackage: (pkg: LabPackage | null) => void;
  // Global Navigation State (Search & Filters)
  globalSearch: string;
  setGlobalSearch: (query: string) => void;
  globalCategory: string;
  setGlobalCategory: (category: string) => void;
  // Auth State
  user: any;
  setUser: (user: any) => void;
  // Order tracking
  currentOrderId: string | null;
  setCurrentOrderId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [toast, setToast] = useState<ToastData>({ message: '', type: 'success', visible: false });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedLabPackage, setSelectedLabPackage] = useState<LabPackage | null>(null);

  // Global Filter State
  const [globalSearch, setGlobalSearch] = useState('');
  const [globalCategory, setGlobalCategory] = useState('All');

  const [user, setUser] = useState<any>(null);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 2000);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map(item =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter(item => item.product.id !== productId);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const placeOrder = async (): Promise<string | null> => {
    if (!user?.uid) {
      showToast('Please login to place order', 'error');
      return null;
    }

    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const newOrder: Order = {
      id: orderId,
      items: [...cart],
      total: cartTotal,
      date: new Date().toISOString(),
      status: 'Processing'
    };

    try {
      // Save to Firestore
      await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('orders')
        .doc(orderId)
        .set({
          ...newOrder,
          userName: user.name || 'User',
          userEmail: user.email || '',
          createdAt: firestore.FieldValue.serverTimestamp(),
          driverLocation: null
        });

      setOrders(prev => [newOrder, ...prev]);
      setCurrentOrderId(orderId);
      clearCart();
      return orderId;
    } catch (error) {
      console.error('Error placing order:', error);
      showToast('Failed to place order', 'error');
      return null;
    }
  };

  const getQuantity = (productId: string) => {
    return cart.find(item => item.product.id === productId)?.quantity || 0;
  };

  return (
    <AppContext.Provider value={{
      cart,
      orders,
      addToCart,
      removeFromCart,
      clearCart,
      placeOrder,
      getQuantity,
      cartTotal,
      cartCount,
      showToast,
      toast,
      selectedProduct,
      setSelectedProduct,
      selectedLabPackage,
      setSelectedLabPackage,
      globalSearch,
      setGlobalSearch,
      globalCategory,
      setGlobalCategory,
      user,
      setUser,
      currentOrderId,
      setCurrentOrderId
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};