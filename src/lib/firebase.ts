import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDcH5PaBaGbJABPsfd-T-gU15eejuQZuS8',
  authDomain: 'my-store-builder.firebaseapp.com',
  projectId: 'my-store-builder',
  storageBucket: 'my-store-builder.appspot.com',
  messagingSenderId: '701578700344',
  appId: '1:701578700344:web:6e8a654496f15335dfa8cd',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app; 