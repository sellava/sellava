'use client';

import { useState } from 'react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Package, AlertTriangle, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { cleanCart, getValidCart } from '@/lib/cart-service';
import { toast } from 'sonner';

interface InvalidItemsDetailsProps {
  invalidItems: any[];
  onCartUpdate?: (items: any[]) => void;
  className?: string;
}

export function InvalidItemsDetails({ invalidItems, onCartUpdate, className = '' }: InvalidItemsDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCleanCart = () => {
    try {
      cleanCart();
      const validItems = getValidCart();
      
      if (onCartUpdate) {
        onCartUpdate(validItems);
      }
      
      toast.success(`تم تنظيف السلة. ${validItems.length} منتج صحيح متبقي.`);
    } catch (error) {
      console.error('Error cleaning cart:', error);
      toast.error('فشل في تنظيف السلة');
    }
  };

  const getItemIssues = (item: any) => {
    const issues = [];
    
    if (!item.productId || item.productId === '') issues.push('معرف المنتج مفقود');
    if (!item.name || item.name === '') issues.push('اسم المنتج مفقود');
    if (!item.price || item.price === 0 || isNaN(item.price)) issues.push('سعر المنتج غير صحيح');
    if (!item.quantity || item.quantity <= 0 || isNaN(item.quantity)) issues.push('كمية المنتج غير صحيحة');
    if (!item.image || item.image === '') issues.push('صورة المنتج مفقودة');
    
    return issues;
  };

  return (
    <Card className={`border-orange-200 bg-orange-50 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
            المنتجات غير الصحيحة
            <Badge variant="destructive" className="mr-2">
              {invalidItems.length}
            </Badge>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCleanCart}
              className="text-orange-600 border-orange-300 hover:bg-orange-100"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              تنظيف السلة
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-600 border-gray-300 hover:bg-gray-50"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-orange-700">
              تم العثور على {invalidItems.length} منتج غير صحيح في السلة. 
              هذه المنتجات لن يتم تضمينها في الطلب.
            </p>
            
            <div className="space-y-2">
              {invalidItems.map((item, index) => {
                const issues = getItemIssues(item);
                return (
                  <div key={index} className="bg-white p-3 rounded border border-orange-200">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-orange-600" />
                        <div>
                          <p className="font-medium text-gray-800">
                            {item.name || 'اسم غير محدد'}
                          </p>
                          <p className="text-sm text-gray-600">
                            معرف: {item.productId || 'غير محدد'}
                          </p>
                        </div>
                      </div>
                      <Badge variant="destructive" className="text-xs">
                        {issues.length} مشكلة
                      </Badge>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-xs font-medium text-orange-700 mb-1">المشاكل:</p>
                      <div className="flex flex-wrap gap-1">
                        {issues.map((issue, issueIndex) => (
                          <Badge key={issueIndex} variant="outline" className="text-xs border-orange-300 text-orange-700">
                            {issue}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-600">
                      <p>السعر: {item.price || 'غير محدد'} | الكمية: {item.quantity || 'غير محدد'}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
} 