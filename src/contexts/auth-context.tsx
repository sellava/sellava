'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendEmailVerification } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createUser, getUser, updateUserPlan as updateUserPlanInFirebase } from '@/lib/firebase-services';
import { toast } from 'sonner';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  authLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, phone: string, country: string, planType: 'free' | 'monthly' | 'sixmonths' | 'yearly') => Promise<void>;
  signOutUser: () => Promise<void>;
  updateUserPlan: (planType: 'free' | 'monthly' | 'sixmonths' | 'yearly') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const userData = await getUser(firebaseUser.uid);
          if (userData) {
            // تحقق من نوع الخطة في localStorage للمستخدم الحالي
            const savedPlanType = localStorage.getItem(`planType_${firebaseUser.uid}`) as 'free' | 'monthly' | 'sixmonths' | 'yearly';
            console.log('User data from Firestore:', userData);
            console.log('Saved plan type from localStorage for user:', savedPlanType);
            
            if (savedPlanType && savedPlanType !== userData.planType) {
              // إذا كان هناك اختلاف، استخدم القيمة من localStorage
              console.log('Plan type mismatch, using localStorage value:', savedPlanType);
              setUser({
                ...userData,
                planType: savedPlanType,
              });
            } else {
              console.log('Using plan type from Firestore:', userData.planType);
              setUser(userData);
            }
          } else {
            // إذا لم يكن لديه بيانات في Firestore، أنشئ بيانات افتراضية
            console.log('User exists in Firebase Auth but not in Firestore, creating default data...');
            const savedPlanType = localStorage.getItem(`planType_${firebaseUser.uid}`) as 'free' | 'monthly' | 'sixmonths' | 'yearly' || 'free';
            console.log('Using saved plan type for default user:', savedPlanType);
            const defaultUser: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || 'مستخدم جديد',
              phone: '',
              country: '',
              planType: savedPlanType,
              createdAt: new Date(),
              emailVerified: firebaseUser.emailVerified,
            };
            setUser(defaultUser);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // في حالة الخطأ، أنشئ بيانات افتراضية
          const savedPlanType = localStorage.getItem(`planType_${firebaseUser.uid}`) as 'free' | 'monthly' | 'sixmonths' | 'yearly' || 'free';
          console.log('Error occurred, using saved plan type:', savedPlanType);
          const defaultUser: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || 'مستخدم جديد',
            phone: '',
            country: '',
            planType: savedPlanType,
            createdAt: new Date(),
            emailVerified: firebaseUser.emailVerified,
          };
          setUser(defaultUser);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Remove test user logic: only allow real Firebase users
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string, phone: string, country: string, planType: 'free' | 'monthly' | 'sixmonths' | 'yearly') => {
    try {
      console.log('Creating user with plan type:', planType);
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Send email verification
      await sendEmailVerification(firebaseUser);
      
      // إذا كانت الخطة مدفوعة، احفظها كـ 'free' مؤقتاً حتى يتم الدفع
      const actualPlanType = planType !== 'free' ? 'free' : planType;
      
      // Create user document with correct plan type
      await createUser(firebaseUser.uid, {
        email,
        name,
        phone,
        country,
        planType: actualPlanType,
      });
      
      // Save plan type to localStorage for this specific user (free for now)
      localStorage.setItem(`planType_${firebaseUser.uid}`, actualPlanType);
      
      // إذا كانت الخطة مدفوعة، احفظ هذا في sessionStorage
      if (planType !== 'free') {
        sessionStorage.setItem('pendingPaidPlan', 'true');
      }
      
      // Update local state
      const newUser = {
        uid: firebaseUser.uid,
        email,
        name,
        phone,
        country,
        planType: actualPlanType,
        createdAt: new Date(),
        emailVerified: false,
      };
      
      setUser(newUser);
      console.log('User created successfully with plan:', actualPlanType);
      console.log('User object:', newUser);
      console.log('Pending paid plan:', planType !== 'free');
      
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      // معالجة خاصة للمستخدم في وضع الاختبار
      if (user?.email === 'test@example.com') {
        setUser(null);
        setFirebaseUser(null);
        return;
      }

      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const updateUserPlan = async (planType: 'free' | 'monthly' | 'sixmonths' | 'yearly') => {
    try {
      if (!user) {
        throw new Error('no user logged in');
      }

      console.log('Updating user plan to:', planType, 'for user:', user.email);

              // معالجة خاصة للمستخدم في وضع الاختبار
        if (user.email === 'test@example.com') {
          console.log('Test user detected, updating locally');
          const updatedUser = {
            ...user,
            planType,
          };
          setUser(updatedUser);
          localStorage.setItem('planType_test-user-id', planType);
          console.log('Test user plan updated successfully');
          console.log('Updated test user object:', updatedUser);
          
          // إضافة toast notification للمستخدم في وضع الاختبار
        toast.success(`Plan updated to: ${planType !== 'free' ? 'Paid Plan' : 'Free Plan'}`);
          return;
        }

      // تحديث في Firebase
      console.log('Updating plan in Firebase for user:', user.uid);
      await updateUserPlanInFirebase(user.uid, planType);
      
      // تحديث في localStorage للمستخدم الحالي
      localStorage.setItem(`planType_${user.uid}`, planType);
      
      // تحديث في الحالة المحلية
      const updatedUser = {
        ...user,
        planType,
      };
      setUser(updatedUser);
      
      console.log('User plan updated successfully to:', planType);
      console.log('Updated user object:', updatedUser);
      
      // إضافة toast notification
      toast.success(`Plan updated to: ${planType !== 'free' ? 'Paid Plan' : 'Free Plan'}`);
    } catch (error) {
      console.error('Error updating user plan:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    firebaseUser,
    loading,
    authLoading: loading,
    signIn,
    signUp,
    signOutUser,
    updateUserPlan,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 