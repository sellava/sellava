"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { getProducts, deleteProduct } from '@/lib/firebase-services';
import type { Product } from '@/types';
import { Edit, Trash2, Package, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadProducts();
  }, [user]);

  const loadProducts = async () => {
    if (!user) {
      setProducts([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const productsData = await getProducts(user.uid);
      setProducts(productsData || []);
    } catch (error) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!user) return;
    if (!confirm(`Are you sure you want to delete the product "${productName}"?`)) return;
    try {
      await deleteProduct(user.uid, productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast.success(`Product "${productName}" deleted successfully`);
    } catch {
      toast.error('An error occurred while deleting the product');
    }
  };

  // سلايدر صور بسيط
  function ProductImageSlider({ images }: { images?: string[] }) {
    const [current, setCurrent] = useState(0);
    if (!images || images.length === 0) return (
      <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded-lg mb-4">
        <span className="text-gray-400 text-sm">No image</span>
      </div>
    );
    const next = () => setCurrent((prev) => (prev + 1) % images.length);
    const prev = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);
    return (
      <div className="relative w-full h-40 mb-4 flex items-center justify-center">
        <img
          src={images[current]}
          alt={`Product image ${current + 1}`}
          className="w-full h-40 object-cover rounded-lg"
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow"
              aria-label="Previous"
            >
              <span className="text-lg">&#8592;</span>
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow"
              aria-label="Next"
            >
              <span className="text-lg">&#8594;</span>
            </button>
          </>
        )}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`inline-block w-2 h-2 rounded-full ${idx === current ? 'bg-primary' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{t('products')}</h2>
          <Link href="/dashboard/products/add">
            <Button className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              {t('addProduct')}
            </Button>
          </Link>
        </div>
        {products.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 mb-4">{t('noProductsMessage')}</p>
              <Link href="/dashboard/products/add">
                <Button>{t('addProduct')}</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <Badge variant={product.inStock ? "default" : "secondary"}>
                      {product.inStock ? "Available" : "Not Available"}
                    </Badge>
                  </div>
                  <CardDescription>${product.price}</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* سلايدر الصور */}
                  <ProductImageSlider images={product.images} />
                  <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                  <div className="flex justify-end mt-4 space-x-2">
                    <Link href={`/dashboard/products/edit/${product.id}`}>
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Edit className="h-3 w-3 mr-1" />
                        {t('edit')}
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleDeleteProduct(product.id, product.name)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      {t('delete')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 