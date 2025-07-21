'use client';

import { useState, useEffect } from 'react';
import { Badge } from './badge';
import { Wifi, WifiOff, CheckCircle, AlertCircle } from 'lucide-react';

interface ConnectionStatusProps {
  storeId?: string;
  className?: string;
}

export function ConnectionStatus({ storeId, className = '' }: ConnectionStatusProps) {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected' | 'error'>('checking');
  const [message, setMessage] = useState('جاري فحص الاتصال...');

  useEffect(() => {
    if (!storeId) {
      setStatus('error');
      setMessage('لا يوجد معرف متجر');
      return;
    }

    const checkConnection = async () => {
      try {
        setStatus('checking');
        setMessage('جاري فحص الاتصال...');

        const { testFirebaseConnection } = await import('@/lib/firebase-services');
        const result = await testFirebaseConnection(storeId);

        if (result.connected) {
          setStatus('connected');
          setMessage('متصل بـ Firebase');
        } else {
          setStatus('disconnected');
          setMessage('غير متصل بـ Firebase');
        }
      } catch (error) {
        setStatus('error');
        setMessage('خطأ في الاتصال');
        console.error('Connection check error:', error);
      }
    };

    checkConnection();

    // فحص الاتصال كل 30 ثانية
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, [storeId]);

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <Wifi className="h-4 w-4 animate-pulse" />;
      case 'connected':
        return <CheckCircle className="h-4 w-4" />;
      case 'disconnected':
        return <WifiOff className="h-4 w-4" />;
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Wifi className="h-4 w-4" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'checking':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'connected':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'disconnected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'error':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={`flex items-center space-x-1 border ${getStatusColor()} ${className}`}
    >
      {getStatusIcon()}
      <span className="text-xs">{message}</span>
    </Badge>
  );
} 