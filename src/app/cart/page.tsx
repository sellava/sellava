'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Trash2, Minus, Plus, Store } from 'lucide-react';
import Link from 'next/link';
import { getCart, removeFromCart, updateCartItemQuantity, getCartTotal, clearCart } from '@/lib/cart-service';
import type { CartItem } from '@/types';
import { toast } from 'sonner';

export default function CartPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [storeUserId, setStoreUserId] = useState<string | null>(null);

  useEffect(() => {
    // تحديث معرف المتجر الحالي إذا لم يكن محدداً
    if (typeof window !== 'undefined') {
      const currentStoreId = localStorage.getItem('current_store_id');
      if (!currentStoreId) {
        // إذا لم يكن هناك متجر محدد، استخدم المتجر الافتراضي
        localStorage.setItem('current_store_id', 'default');
      }
    }
    
    loadCart();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setStoreUserId(localStorage.getItem('current_store_id'));
    }
  }, []);

  const loadCart = () => {
    const items = getCart();
    setCartItems(items);
    setTotal(getCartTotal());
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      toast.error('The quantity must be at least 1');
      return;
    }
    updateCartItemQuantity(productId, newQuantity);
    loadCart();
  };

  const handleRemoveItem = (productId: string) => {
    const confirmed = window.confirm('Are you sure you want to remove this item from the cart?');
    if (confirmed) {
      removeFromCart(productId);
      loadCart();
      toast.success('Item removed from the cart');
    }
  };

  const handleClearCart = () => {
    const confirmed = window.confirm('Are you sure you want to clear the cart?');
    if (confirmed) {
      clearCart();
      loadCart();
      toast.success('Cart cleared');
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    // Redirect to checkout page
    router.push('/cart-checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Store className="h-8 w-8 text-primary mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">Sellava</h1>
              </div>
              
              <Link href={storeUserId ? `/public-store/${storeUserId}` : '/'}>
                <Button>Start Shopping</Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ShoppingCart className="h-16 w-16 text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('emptyCart')}</h2>
              <p className="text-gray-600 mb-6">Your shopping cart is empty</p>
              <Link href={storeUserId ? `/public-store/${storeUserId}` : '/'}>
                <Button>Start Shopping</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-primary text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                <Store className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">{t('yourCart')}</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={handleClearCart} 
                className="text-white border-white/30 hover:bg-white/10"
              >
                Clear Cart
              </Button>
              <Link href={storeUserId ? `/public-store/${storeUserId}` : '/'}>
                <Button variant="outline" className="text-white border-white/30 hover:bg-white/10">Return to Store</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Items ({cartItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={
                      item.productId +
                      (item.selectedColor ? `-${item.selectedColor}` : '') +
                      (item.selectedSize ? `-${item.selectedSize}` : '')
                    }
                    className="flex items-center space-x-4 p-4 border rounded-lg"
                  >
                    <img
                      src={item.image || 'https://via.placeholder.com/64x64/e5e7eb/6b7280?text=No+Image'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      {item.selectedColor && (
                        <p className="text-xs text-gray-600">Color: {item.selectedColor}</p>
                      )}
                      {item.selectedSize && (
                        <p className="text-xs text-gray-600">Size: {item.selectedSize}</p>
                      )}
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value) || 1;
                          handleQuantityChange(item.productId, newQuantity);
                        }}
                        className="w-16 text-center"
                        min="1"
                      />
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-lg">${(item.price * item.quantity).toFixed(2)} USD</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.productId)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Number of Items:</span>
                    <span>{cartItems.length} items</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Quantity:</span>
                    <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)} items</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>{t('total')}:</span>
                      <span>${total.toFixed(2)} USD</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleCheckout}
                  className="w-full"
                  size="lg"
                  disabled={cartItems.length === 0}
                >
                  {cartItems.length === 0 ? 'Cart is empty' : t('checkout')}
                </Button>
                
                <p className="text-sm text-gray-600 text-center">
                  We will contact you via WhatsApp to complete the order
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 