'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Store } from 'lucide-react';
import Link from 'next/link';
import { getStore, getProducts } from '@/lib/firebase-services';
import type { Store as StoreType, Product } from '@/types';

export default function PublicStorePage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.userId as string;
  const [store, setStore] = useState<StoreType | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const storeData = await getStore(userId);
        setStore(storeData);
        const productsData = await getProducts(userId);
        setProducts(productsData);
      } catch (error) {
        setStore(null);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    if (userId) fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading store...</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Store Not Found</h1>
          <p className="text-gray-600 mb-4">This store does not exist or is unavailable.</p>
          <Link href="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Store className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">{store.storeTitle || 'Store'}</h1>
          </div>
          <Link href="/cart">
            <Button className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Cart
            </Button>
          </Link>
        </div>
      </header>

      {/* Store Info */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">About this store</h2>
          <p className="text-gray-600">{store.storeBio || 'Welcome to our online store!'}</p>
        </div>

        {/* Product Grid */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Products</h2>
          {products.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No products available</h3>
              <p className="text-gray-500">Please check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {product.images && product.images[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-40 object-cover rounded mb-3"
                      />
                    )}
                    <p className="text-gray-700 font-semibold mb-2">${product.price} USD</p>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                    <Button className="w-full" onClick={() => router.push('/cart')}>Add to Cart</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t py-4">
        <div className="max-w-5xl mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} {store.storeTitle || 'Store'}. All rights reserved.
        </div>
      </footer>
    </div>
  );
} 