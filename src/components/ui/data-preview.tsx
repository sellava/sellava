'use client';

import { useState } from 'react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Eye, EyeOff, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface DataPreviewProps {
  data: any;
  title?: string;
  className?: string;
}

export function DataPreview({ data, title = 'معاينة البيانات', className = '' }: DataPreviewProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      toast.success('تم نسخ البيانات');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('فشل في نسخ البيانات');
    }
  };

  const hasUndefinedValues = (obj: any): boolean => {
    if (obj === undefined || obj === null) return true;
    if (typeof obj === 'object') {
      return Object.values(obj).some(value => hasUndefinedValues(value));
    }
    return false;
  };

  const undefinedFields = hasUndefinedValues(data) ? 
    Object.entries(data).filter(([key, value]) => hasUndefinedValues(value)).map(([key]) => key) : 
    [];

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            {isVisible ? <Eye className="h-5 w-5 mr-2" /> : <EyeOff className="h-5 w-5 mr-2" />}
            {title}
            {undefinedFields.length > 0 && (
              <Badge variant="destructive" className="mr-2">
                {undefinedFields.length} حقول فارغة
              </Badge>
            )}
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
              onClick={() => setIsVisible(!isVisible)}
              className="text-gray-600 border-gray-300 hover:bg-gray-50"
            >
              {isVisible ? 'إخفاء' : 'عرض'}
            </Button>
          </div>
        </div>
      </CardHeader>
      {isVisible && (
        <CardContent>
          <div className="space-y-3">
            {undefinedFields.length > 0 && (
              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                <h4 className="font-medium text-red-800 mb-2">الحقول الفارغة:</h4>
                <div className="flex flex-wrap gap-1">
                  {undefinedFields.map(field => (
                    <Badge key={field} variant="destructive" className="text-xs">
                      {field}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto max-h-96">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </CardContent>
      )}
    </Card>
  );
} 