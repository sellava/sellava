import type { CartItem } from '@/types';

// Get current store ID from URL or localStorage
const getCurrentStoreId = (): string => {
  if (typeof window === 'undefined') return 'default';
  
  // Try to get from URL first
  const pathname = window.location.pathname;
  const storeMatch = pathname.match(/\/public-store\/([^\/]+)/);
  if (storeMatch) {
    return storeMatch[1];
  }
  
  // Fallback to localStorage
  return localStorage.getItem('current_store_id') || 'default';
};

const getCartStorageKey = (): string => {
  const storeId = getCurrentStoreId();
  return `sellava_cart_${storeId}`;
};

const getCouponStorageKey = (): string => {
  const storeId = getCurrentStoreId();
  return `sellava_coupon_${storeId}`;
};

export const getCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const cartData = localStorage.getItem(getCartStorageKey());
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.error('Error reading cart from localStorage:', error);
    return [];
  }
};

export const saveCart = (cart: CartItem[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(getCartStorageKey(), JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

export const addToCart = (item: Omit<CartItem, 'quantity'>): void => {
  try {
    // Validate data before adding
    if (!item.productId || !item.name || typeof item.price !== 'number' || !item.image) {
      console.error('Invalid item data:', item);
      return;
    }
    
    // Clean data
    const cleanItem = {
      productId: item.productId.toString().trim(),
      name: item.name.toString().trim(),
      price: Number(item.price) || 0,
      image: item.image.toString().trim(),
    };
    
    const cart = getValidCart();
    const existingItemIndex = cart.findIndex(cartItem => cartItem.productId === cleanItem.productId);
    
    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push({ ...cleanItem, quantity: 1 });
    }
    
    saveCart(cart);
  } catch (error) {
    console.error('Error adding item to cart:', error);
  }
};

export const removeFromCart = (productId: string): void => {
  const cart = getCart();
  const updatedCart = cart.filter(item => item.productId !== productId);
  saveCart(updatedCart);
};

export const updateCartItemQuantity = (productId: string, quantity: number): void => {
  try {
    const cart = getCart();
    const itemIndex = cart.findIndex(item => item.productId === productId);
    
    if (itemIndex >= 0) {
      if (quantity <= 0) {
        cart.splice(itemIndex, 1);
      } else {
        cart[itemIndex].quantity = Math.max(1, quantity); // Ensure quantity is at least 1
      }
      saveCart(cart);
    }
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
  }
};

export const clearCart = (): void => {
  saveCart([]);
  // Clear applied coupon when cart is cleared
  if (typeof window !== 'undefined') {
    localStorage.removeItem(getCouponStorageKey());
  }
};

export const getCartTotal = (): number => {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const getCartItemCount = (): number => {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
};

// Coupon functions
export const getAppliedCoupon = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    return localStorage.getItem(getCouponStorageKey());
  } catch (error) {
    console.error('Error reading applied coupon:', error);
    return null;
  }
};

export const setAppliedCoupon = (couponCode: string | null): void => {
  if (typeof window === 'undefined') return;
  
  try {
    if (couponCode) {
      localStorage.setItem(getCouponStorageKey(), couponCode);
    } else {
      localStorage.removeItem(getCouponStorageKey());
    }
  } catch (error) {
    console.error('Error saving applied coupon:', error);
  }
};

export const validateCoupon = (couponCode: string, subtotal: number): { valid: boolean; discount: number; message: string } => {
  const coupons = {
    'WELCOME20': { discount: subtotal * 0.2, message: '20% Discount' },
    'PREMIUM15': { discount: subtotal * 0.15, message: '15% Discount' },
    'YEARLY30': { discount: subtotal * 0.3, message: '30% Discount' },
  };

  const coupon = coupons[couponCode.toUpperCase() as keyof typeof coupons];
  
  if (coupon) {
    return {
      valid: true,
      discount: coupon.discount,
      message: coupon.message
    };
  }
  
  return {
    valid: false,
    discount: 0,
    message: 'Invalid coupon'
  };
};

// Helper function to validate cart item
const isValidCartItem = (item: CartItem): boolean => {
  return (
    item &&
    typeof item === 'object' &&
    typeof item.productId === 'string' && item.productId.trim() !== '' &&
    typeof item.name === 'string' && item.name.trim() !== '' &&
    typeof item.price === 'number' && !isNaN(item.price) && item.price >= 0 &&
    typeof item.quantity === 'number' && !isNaN(item.quantity) && item.quantity > 0 &&
    typeof item.image === 'string' && item.image.trim() !== ''
  );
};

// Function to clean cart from invalid items
export const cleanCart = (): void => {
  try {
    const cart = getCart();
    const validItems = cart.filter(isValidCartItem);
    
    if (validItems.length !== cart.length) {
      console.log('Cleaning cart: removed', cart.length - validItems.length, 'invalid items');
      saveCart(validItems);
    }
  } catch (error) {
    console.error('Error cleaning cart:', error);
  }
};

// Enhanced getCart function with validation
export const getValidCart = (): CartItem[] => {
  const cart = getCart();
  const validItems = cart.filter(isValidCartItem);
  
  if (validItems.length !== cart.length) {
    console.log('Found invalid items in cart, cleaning...');
    saveCart(validItems);
  }
  
  return validItems;
}; 