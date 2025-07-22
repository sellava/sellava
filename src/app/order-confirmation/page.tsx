'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, CreditCard, Banknote, Home, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

export default function OrderConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderData, setOrderData] = useState<any>(null);

  const orderId = searchParams?.get('orderId');
  const paymentMethod = searchParams?.get('paymentMethod');
  const total = searchParams?.get('total');

  useEffect(() => {
    if (orderId) {
      // In a real app, you would fetch order details from the database
      setOrderData({
        orderId,
        paymentMethod: paymentMethod || 'cash',
        total: parseFloat(total || '0'),
        status: 'confirmed',
        estimatedDelivery: '2-3 business days',
      });
    }
  }, [orderId, paymentMethod, total]);

  const getPaymentMethodIcon = (method: string) => {
    return method === 'electronic' ? <CreditCard className="h-4 w-4" /> : <Banknote className="h-4 w-4" />;
  };

  const getPaymentMethodText = (method: string) => {
    return method === 'electronic' ? 'Electronic Payment' : 'Cash on Delivery';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Order Confirmed';
      case 'pending':
        return 'Order Pending';
      default:
        return 'Order Status';
    }
  };

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Clock className="h-8 w-8 mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">
            Thank you for your order. We'll send you updates about your delivery.
          </p>
            </div>

        {/* Order Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                    <span className="text-gray-600">Order ID:</span>
                <span className="font-semibold">#{orderData.orderId}</span>
                  </div>
              
              <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                <Badge className={getStatusColor(orderData.status)}>
                  {getStatusText(orderData.status)}
                </Badge>
                  </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Payment Method:</span>
                <div className="flex items-center">
                  {getPaymentMethodIcon(orderData.paymentMethod)}
                  <span className="ml-2 font-semibold">
                    {getPaymentMethodText(orderData.paymentMethod)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Amount:</span>
                <span className="text-lg font-bold text-green-600">
                  ${orderData.total}
                      </span>
                    </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Estimated Delivery:</span>
                <span className="font-semibold">{orderData.estimatedDelivery}</span>
                    </div>
                  </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-sm font-bold text-blue-600">1</span>
                  </div>
                <div>
                  <h4 className="font-semibold">Order Confirmation</h4>
                  <p className="text-sm text-gray-600">
                    You'll receive an email confirmation with your order details.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-sm font-bold text-blue-600">2</span>
                </div>
                <div>
                  <h4 className="font-semibold">Order Processing</h4>
                  <p className="text-sm text-gray-600">
                    We'll prepare your order and notify you when it's ready for shipping.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-sm font-bold text-blue-600">3</span>
                  </div>
                <div>
                  <h4 className="font-semibold">Delivery</h4>
                  <p className="text-sm text-gray-600">
                    {orderData.paymentMethod === 'electronic' 
                      ? 'Your order will be delivered to your address.'
                      : 'Pay with cash when you receive your order.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="flex items-center"
          >
            <Home className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <Button
            onClick={() => router.push('/')}
            className="bg-gradient-primary hover:opacity-90 text-white flex items-center"
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            View Orders
          </Button>
        </div>

        {/* Contact Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact us at support@example.com
          </p>
        </div>
      </div>
    </div>
  );
} 