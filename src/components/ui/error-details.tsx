'use client';

import { useState } from 'react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { AlertTriangle, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ErrorDetailsProps {
  error: any;
  title?: string;
  className?: string;
}

export function ErrorDetails({ error, title = 'تفاصيل الخطأ', className = '' }: ErrorDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      const errorText = JSON.stringify(error, null, 2);
      await navigator.clipboard.writeText(errorText);
      setCopied(true);
      toast.success('تم نسخ تفاصيل الخطأ');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('فشل في نسخ التفاصيل');
    }
  };

  const getErrorType = () => {
    if (error?.message?.includes('Invalid cart items')) return 'cart-error';
    if (error?.message?.includes('Firebase')) return 'firebase-error';
    if (error?.message?.includes('undefined')) return 'data-error';
    return 'general-error';
  };

  const getErrorColor = () => {
    switch (getErrorType()) {
      case 'cart-error': return 'border-orange-200 bg-orange-50';
      case 'firebase-error': return 'border-red-200 bg-red-50';
      case 'data-error': return 'border-yellow-200 bg-yellow-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getErrorIcon = () => {
    switch (getErrorType()) {
      case 'cart-error': return '🛒';
      case 'firebase-error': return '🔥';
      case 'data-error': return '📊';
      default: return '⚠️';
    }
  };

  return (
    <Card className={`${getErrorColor()} ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <span className="mr-2">{getErrorIcon()}</span>
            {title}
            <Badge 
              variant="outline" 
              className="mr-2 text-xs"
            >
              {getErrorType().replace('-', ' ')}
            </Badge>
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
            {error?.message && (
              <div>
                <h4 className="font-medium text-gray-800 mb-2">رسالة الخطأ:</h4>
                <p className="text-sm text-gray-700 bg-white p-2 rounded border">
                  {error.message}
                </p>
              </div>
            )}
            
            {error?.stack && (
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Stack Trace:</h4>
                <pre className="text-xs bg-white p-2 rounded border overflow-x-auto max-h-32">
                  {error.stack}
                </pre>
              </div>
            )}
            
            <div>
              <h4 className="font-medium text-gray-800 mb-2">تفاصيل كاملة:</h4>
              <pre className="text-xs bg-white p-2 rounded border overflow-x-auto max-h-48">
                {JSON.stringify(error, null, 2)}
              </pre>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
} 