'use client';

import { useState } from 'react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Bug, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface DebugInfoProps {
  storeId?: string;
  className?: string;
}

export function DebugInfo({ storeId, className = '' }: DebugInfoProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const debugData = {
    storeId: storeId || 'غير محدد',
    timestamp: new Date().toISOString(),
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'غير متاح',
    localStorage: typeof window !== 'undefined' ? {
      current_store_id: localStorage.getItem('current_store_id'),
      sellava_cart: localStorage.getItem('sellava_cart'),
      sellava_coupon: localStorage.getItem('sellava_coupon'),
    } : 'غير متاح',
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(debugData, null, 2));
      setCopied(true);
      toast.success('تم نسخ معلومات التصحيح');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('فشل في نسخ المعلومات');
    }
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={`text-gray-600 border-gray-300 hover:bg-gray-50 ${className}`}
      >
        <Bug className="h-4 w-4 mr-2" />
        معلومات التصحيح
      </Button>
    );
  }

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Bug className="h-5 w-5 mr-2" />
            معلومات التصحيح
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="text-blue-600 border-blue-300 hover:bg-blue-50"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-gray-600 border-gray-300 hover:bg-gray-50"
            >
              إغلاق
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-gray-700">معرف المتجر:</label>
            <Badge variant="outline" className="mt-1">
              {debugData.storeId}
            </Badge>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">الوقت:</label>
            <p className="text-sm text-gray-600 mt-1">{debugData.timestamp}</p>
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-700">بيانات localStorage:</label>
          <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
            {JSON.stringify(debugData.localStorage, null, 2)}
          </pre>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-700">متصفح الويب:</label>
          <p className="text-xs text-gray-600 mt-1 break-all">{debugData.userAgent}</p>
        </div>
      </CardContent>
    </Card>
  );
} 