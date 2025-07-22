import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';
import type { User, Store, Product, Order, Customer, Coupon } from '@/types';

// ضع بياناتك هنا:
const CLOUDINARY_CLOUD_NAME = 'YOUR_CLOUD_NAME'; // ← عدلها لاسم حسابك في Cloudinary
const CLOUDINARY_UNSIGNED_PRESET = 'YOUR_UNSIGNED_PRESET'; // ← عدلها لاسم unsigned preset

// User Services
export const createUser = async (uid: string, userData: Omit<User, 'uid' | 'createdAt' | 'emailVerified'>) => {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, {
    ...userData,
    createdAt: serverTimestamp(),
    emailVerified: false,
  });
};

export const getUser = async (uid: string): Promise<User | null> => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    const data = userSnap.data();
    return {
      ...data,
      uid: userSnap.id,
      createdAt: data.createdAt?.toDate() || new Date(),
    } as User;
  }
  return null;
};

export const updateUser = async (uid: string, updates: Partial<User>) => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

export const updateUserPlan = async (uid: string, planType: 'free' | 'monthly' | 'sixmonths' | 'yearly') => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  const updateData: Partial<User> = {
    planType,
    updatedAt: serverTimestamp(),
  };

  // Calculate subscription dates for paid plans
  if (planType !== 'free') {
    const now = new Date();
    const startDate = now;
    let expiryDate = new Date();

    switch (planType) {
      case 'monthly':
        expiryDate.setMonth(expiryDate.getMonth() + 1);
        break;
      case 'sixmonths':
        expiryDate.setMonth(expiryDate.getMonth() + 6);
        break;
      case 'yearly':
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        break;
    }

    updateData.subscriptionStartDate = startDate;
    updateData.subscriptionExpiryDate = expiryDate;
  } else {
    // Clear subscription dates for free plan
    updateData.subscriptionStartDate = null;
    updateData.subscriptionExpiryDate = null;
  }

  if (!userSnap.exists()) {
    // Create the user document if it doesn't exist
    await setDoc(userRef, {
      ...updateData,
      createdAt: serverTimestamp(),
      emailVerified: false,
    });
  } else {
    await updateDoc(userRef, updateData);
  }
};

export const calculateExpiryDate = (planType: 'monthly' | 'sixmonths' | 'yearly'): Date => {
  const expiryDate = new Date();
  
  switch (planType) {
    case 'monthly':
      expiryDate.setMonth(expiryDate.getMonth() + 1);
      break;
    case 'sixmonths':
      expiryDate.setMonth(expiryDate.getMonth() + 6);
      break;
    case 'yearly':
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      break;
  }
  
  return expiryDate;
};

export const isSubscriptionActive = (user: User): boolean => {
  if (user.planType === 'free') return false;
  if (!user.subscriptionExpiryDate) return false;
  
  const now = new Date();
  const expiryDate = user.subscriptionExpiryDate instanceof Date 
    ? user.subscriptionExpiryDate 
    : new Date(user.subscriptionExpiryDate);
  
  return now < expiryDate;
};

// Store Services
export const createStore = async (storeData: Omit<Store, 'createdAt' | 'updatedAt'>) => {
  const storeRef = doc(db, 'stores', storeData.userId);
  await setDoc(storeRef, {
    ...storeData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const getStore = async (userId: string): Promise<Store | null> => {
  try {
    // التأكد من أن Firebase متاح
    if (typeof window === 'undefined') {
      console.log('getStore called on server side, returning null');
      return null;
    }
    
    const storeRef = doc(db, 'stores', userId);
    const storeSnap = await getDoc(storeRef);
    
    if (storeSnap.exists()) {
      const data = storeSnap.data();
      return {
        ...data,
        userId: storeSnap.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Store;
    }
    return null;
  } catch (error) {
    console.error('Error getting store:', error);
    return null;
  }
};

export const updateStore = async (userId: string, updates: Partial<Store>) => {
  const storeRef = doc(db, 'stores', userId);
  await updateDoc(storeRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

// Product Services
export const createProduct = async (userId: string, productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
  // تنظيف الكائن من undefined/null/فراغ
  const cleanedProductData: Record<string, unknown> = {};
  for (const key in productData) {
    const value = (productData as any)[key];
    if (
      value !== undefined &&
      value !== null &&
      !(typeof value === 'string' && value.trim() === '')
    ) {
      cleanedProductData[key] = value;
    }
  }

  const productsRef = collection(db, 'stores', userId, 'products');
  const docRef = await addDoc(productsRef, {
    ...cleanedProductData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getProducts = async (userId: string): Promise<Product[]> => {
  try {
    // التأكد من أن Firebase متاح
    if (typeof window === 'undefined') {
      console.log('getProducts called on server side, returning empty array');
      return [];
    }
    
    const productsRef = collection(db, 'stores', userId, 'products');
    const q = query(productsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Product[];
  } catch (error) {
    console.error('Error getting products:', error);
    return [];
  }
};

export const getProduct = async (userId: string, productId: string): Promise<Product | null> => {
  const productRef = doc(db, 'stores', userId, 'products', productId);
  const productSnap = await getDoc(productRef);
  
  if (productSnap.exists()) {
    const data = productSnap.data();
    return {
      ...data,
      id: productSnap.id,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Product;
  }
  return null;
};

export const updateProduct = async (userId: string, productId: string, updates: Partial<Product>) => {
  const productRef = doc(db, 'stores', userId, 'products', productId);
  await updateDoc(productRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

export const deleteProduct = async (userId: string, productId: string) => {
  const productRef = doc(db, 'stores', userId, 'products', productId);
  await deleteDoc(productRef);
};

export const deleteOrder = async (userId: string, orderId: string) => {
  const orderRef = doc(db, 'stores', userId, 'orders', orderId);
  await deleteDoc(orderRef);
};

// Order Services
export const createOrder = async (userId: string, orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    console.log('Creating order for user:', userId);
    console.log('Original order data:', orderData);
    
    // تنظيف البيانات من القيم undefined
    const cleanedOrderData = cleanOrderData(orderData);
    console.log('Cleaned order data:', cleanedOrderData);
    
    // التأكد من وجود المتجر أولاً
    const storeExists = await ensureStoreExists(userId);
    if (!storeExists) {
      throw new Error('Failed to ensure store exists');
    }
    
    console.log('Store exists, creating order...');
    
    const ordersRef = collection(db, 'stores', userId, 'orders');
    const docRef = await addDoc(ordersRef, {
      ...cleanedOrderData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    console.log('Order created successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    
    // رسائل خطأ أكثر تفصيلاً
    if (error instanceof Error) {
      if (error.message.includes('You do not have permission to create orders in this store')) {
        throw new Error('You do not have permission to create orders in this store');
      } else if (error.message.includes('Firebase service unavailable. Please check your internet connection')) {
        throw new Error('Firebase service unavailable. Please check your internet connection');
      } else if (error.message.includes('Store not found')) {
        throw new Error('Store not found');
      } else if (error.message.includes('Failed to ensure store exists')) {
        throw new Error('Failed to create default store');
      } else if (error.message.includes('Invalid order data. Please check the entered information')) {
        throw new Error('Invalid order data. Please check the entered information');
      } else {
        throw new Error(`Failed to create order: ${error.message}`);
      }
    }
    
    throw new Error('Failed to create order: Unknown error');
  }
};

export const getOrders = async (userId: string): Promise<Order[]> => {
  const ordersRef = collection(db, 'stores', userId, 'orders');
  const q = query(ordersRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    ...doc.data(),
    id: doc.id,
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as Order[];
};

export const updateOrderStatus = async (userId: string, orderId: string, status: Order['status']) => {
  const orderRef = doc(db, 'stores', userId, 'orders', orderId);
  await updateDoc(orderRef, {
    status,
    updatedAt: serverTimestamp(),
  });
};

// Customer Services
export const createCustomer = async (userId: string, customerData: Omit<Customer, 'id' | 'createdAt'>) => {
  const customersRef = collection(db, 'stores', userId, 'customers');
  const docRef = await addDoc(customersRef, {
    ...customerData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getCustomers = async (userId: string): Promise<Customer[]> => {
  const customersRef = collection(db, 'stores', userId, 'customers');
  const q = query(customersRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    ...doc.data(),
    id: doc.id,
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    lastOrderDate: doc.data().lastOrderDate?.toDate(),
  })) as Customer[];
};

// Coupon Services
export const createCoupon = async (userId: string, couponData: Omit<Coupon, 'id' | 'createdAt'>) => {
  const couponsRef = collection(db, 'stores', userId, 'coupons');
  const docRef = await addDoc(couponsRef, {
    ...couponData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getCoupons = async (userId: string): Promise<Coupon[]> => {
  const couponsRef = collection(db, 'stores', userId, 'coupons');
  const q = query(couponsRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    ...doc.data(),
    id: doc.id,
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    validUntil: doc.data().validUntil?.toDate() || new Date(),
  })) as Coupon[];
};

export const deleteCoupon = async (userId: string, couponId: string) => {
  const couponRef = doc(db, 'stores', userId, 'coupons', couponId);
  await deleteDoc(couponRef);
};

// Storage Services
export const uploadImage = async (file: File, userId: string, productId?: string): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UNSIGNED_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!data.secure_url) {
    console.error('Cloudinary upload error:', data);
    throw new Error(data.error?.message || 'Cloudinary upload failed');
  }
  return data.secure_url;
};

export const deleteImage = async (imageUrl: string) => {
  const imageRef = ref(storage, imageUrl);
  await deleteObject(imageRef);
};

// Helper function to test Firebase connection
export const testFirebaseConnection = async (userId: string): Promise<{ connected: boolean; storeExists: boolean; error?: string }> => {
  try {
    console.log('Testing Firebase connection for user:', userId);
    
    // Test basic connection by trying to read a document
    const storeRef = doc(db, 'stores', userId);
    const storeSnap = await getDoc(storeRef);
    
    return {
      connected: true,
      storeExists: storeSnap.exists(),
      error: undefined
    };
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    return {
      connected: false,
      storeExists: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Helper function to ensure store exists
export const ensureStoreExists = async (userId: string): Promise<boolean> => {
  try {
    const storeRef = doc(db, 'stores', userId);
    const storeSnap = await getDoc(storeRef);
    
    if (!storeSnap.exists()) {
      console.log('Creating default store for user:', userId);
      const defaultStore: Omit<Store, 'createdAt' | 'updatedAt'> = {
        userId: userId,
        storeTitle: 'My New Store',
        storeBio: 'A new online store',
        storeCountry: 'Egypt',
        planType: 'free',
        enableAI: false,
        autoDescription: false,
        localDelivery: false,
        globalDelivery: false,
        deliveryCost: 0,
      };
      
      await createStore(defaultStore);
      console.log('Default store created successfully');
      return true;
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring store exists:', error);
    return false;
  }
};

// Helper function to clean order data
export const cleanOrderData = (orderData: Record<string, any>): Record<string, any> => {
  const cleanData: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(orderData)) {
    if (value === undefined) {
      // تعيين قيم افتراضية حسب نوع الحقل
      switch (key) {
        case 'items':
          cleanData[key] = [];
          break;
        case 'customerAddress':
        case 'notes':
        case 'appliedCoupon':
          cleanData[key] = '';
          break;
        case 'total':
        case 'discount':
        case 'subtotal':
        case 'price':
        case 'quantity':
          cleanData[key] = 0;
          break;
        default:
          cleanData[key] = '';
      }
    } else if (value === null) {
      cleanData[key] = '';
    } else if (typeof value === 'string') {
      cleanData[key] = value.trim();
    } else if (typeof value === 'number') {
      cleanData[key] = isNaN(value) ? 0 : value;
    } else if (Array.isArray(value)) {
      cleanData[key] = value.map(item => 
        typeof item === 'object' ? cleanOrderData(item) : item
      );
    } else if (typeof value === 'object') {
      cleanData[key] = cleanOrderData(value);
    } else {
      cleanData[key] = value;
    }
  }
  
  return cleanData;
}; 