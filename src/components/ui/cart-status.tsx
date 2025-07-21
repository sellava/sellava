'use client';

import { useState, useEffect } from 'react';
import { Badge } from './badge';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { ShoppingCart, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { getValidCart, cleanCart } from '@/lib/cart-service';
import { toast } from 'sonner';

interface CartStatusProps {
  className?: string;
  onCartUpdate?: (items: any[]) => void;
}

export function CartStatus({ className = '', onCartUpdate }: CartStatusProps) {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isValid, setIsValid] = useState(true);
  const [invalidCount, setInvalidCount] = useState(0);

  const checkCartHealth = () => {
    try {
      const items = getValidCart();
      const allItems = JSON.parse(localStorage.getItem('sellava_cart_' + (localStorage.getItem('current_store_id') || 'default')) || '[]');
      
      setCartItems(items);
      setInvalidCount(allItems.length - items.length);
      setIsValid(allItems.length === items.length);
      
      if (onCartUpdate) {
        onCartUpdate(items);
      }
    } catch (error) {
      console.error('Error checking cart health:', error);
      setIsValid(false);
    }
  };

  const handleCleanCart = () => {
    try {
      cleanCart();
      checkCartHealth();
      toast.success('تم تنظيف السلة بنجاح');
    } catch (error) {
      console.error('Error cleaning cart:', error);
      toast.error('فشل في تنظيف السلة');
    }
  };

  useEffect(() => {
    checkCartHealth();
  }, []);

  if (isValid && invalidCount === 0) {
    return (
      <Card className={`${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            حالة السلة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700">
                {cartItems.length} منتج صحيح في السلة
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={checkCartHealth}
              className="text-green-600 border-green-300 hover:bg-green-50"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} border-orange-200`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
          مشكلة في السلة
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-orange-700">
                {invalidCount} منتج غير صحيح في السلة
              </span>
            </div>
            <Badge variant="destructive" className="text-xs">
              {invalidCount} مشكلة
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {cartItems.length} منتج صحيح متبقي
            </span>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={checkCartHealth}
                className="text-blue-600 border-blue-300 hover:bg-blue-50"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCleanCart}
                className="text-orange-600 border-orange-300 hover:bg-orange-50"
              >
                تنظيف السلة
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 