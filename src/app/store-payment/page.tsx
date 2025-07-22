'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Banknote, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getStore } from '@/lib/firebase-services';
import type { Store } from '@/types';

interface PaymentPageProps {
  params: {
    userId: string;
  };
}

export default function StorePaymentPage({ params }: PaymentPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [store, setStore] = useState<Store | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'electronic' | 'cash' | null>(null);
  const [orderData, setOrderData] = useState<any>(null);

  // Get order data from URL params
  const orderId = searchParams?.get('orderId');
  const total = searchParams?.get('total');
  const customerName = searchParams?.get('customerName');
  const customerEmail = searchParams?.get('customerEmail');
  const customerPhone = searchParams?.get('customerPhone');

  useEffect(() => {
    if (params.userId) {
      loadStoreData();
    }
  }, [params.userId]);

  const loadStoreData = async () => {
    try {
      setLoading(true);
      const storeData = await getStore(params.userId);
      
      if (storeData) {
        setStore(storeData);
        
        // Set order data
        setOrderData({
          orderId,
          total: parseFloat(total || '0'),
          customerName,
          customerEmail,
          customerPhone,
        });

        // Auto-select payment method based on store settings
        if (storeData.paymentMethod === 'electronic') {
          setSelectedPaymentMethod('electronic');
        } else if (storeData.paymentMethod === 'cash') {
          setSelectedPaymentMethod('cash');
        }
      } else {
        toast.error('Store not found');
        router.push('/');
      }
    } catch (error) {
      console.error('Error loading store:', error);
      toast.error('Error loading store');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentMethodSelect = (method: 'electronic' | 'cash') => {
    setSelectedPaymentMethod(method);
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod || !orderData) return;

    setProcessing(true);

    try {
      if (selectedPaymentMethod === 'electronic') {
        // Redirect to Stripe payment
        await handleStripePayment();
      } else {
        // Handle cash on delivery
        await handleCashOnDelivery();
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleStripePayment = async () => {
    // This would integrate with Stripe
    // For now, we'll simulate the payment process
    toast.success('Redirecting to Stripe payment...');
    
    // Simulate redirect to Stripe
    setTimeout(() => {
      // In a real implementation, this would redirect to Stripe Checkout
      toast.success('Payment completed successfully!');
      router.push(`/order-confirmation?orderId=${orderId}`);
    }, 2000);
  };

  const handleCashOnDelivery = async () => {
    // Handle cash on delivery order
    toast.success('Order placed successfully! Pay on delivery.');
    router.push(`/order-confirmation?orderId=${orderId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading payment options...</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-600" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Store Not Found</h1>
          <p className="text-gray-600">The store you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Order</h1>
          <p className="text-gray-600">
            {store.storeTitle} - Choose your payment method
          </p>
        </div>

        {/* Order Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-semibold">#{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Customer:</span>
                <span className="font-semibold">{customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-semibold">{customerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-semibold">{customerPhone}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${total}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>
              Choose how you would like to pay for your order
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Electronic Payment */}
              {(store.paymentMethod === 'both' || store.paymentMethod === 'electronic') && (
                <div
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPaymentMethod === 'electronic'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handlePaymentMethodSelect('electronic')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CreditCard className="h-6 w-6 text-blue-600 mr-3" />
                      <div>
                        <h3 className="font-semibold">Electronic Payment</h3>
                        <p className="text-sm text-gray-600">
                          Pay securely with your credit card via Stripe
                        </p>
                      </div>
                    </div>
                    {selectedPaymentMethod === 'electronic' && (
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                </div>
              )}

              {/* Cash on Delivery */}
              {(store.paymentMethod === 'both' || store.paymentMethod === 'cash') && (
                <div
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPaymentMethod === 'cash'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handlePaymentMethodSelect('cash')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Banknote className="h-6 w-6 text-green-600 mr-3" />
                      <div>
                        <h3 className="font-semibold">Cash on Delivery</h3>
                        <p className="text-sm text-gray-600">
                          Pay with cash when you receive your order
                        </p>
                      </div>
                    </div>
                    {selectedPaymentMethod === 'cash' && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Button */}
        <div className="flex justify-end">
          <Button
            onClick={handlePayment}
            disabled={!selectedPaymentMethod || processing}
            className="bg-gradient-primary hover:opacity-90 text-white px-8 py-3"
          >
            {processing ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </div>
            ) : (
              <>
                {selectedPaymentMethod === 'electronic' ? (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay with Card
                  </>
                ) : (
                  <>
                    <Banknote className="h-4 w-4 mr-2" />
                    Place Order
                  </>
                )}
              </>
            )}
          </Button>
        </div>

        {/* Store Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Powered by {store.storeTitle}
          </p>
        </div>
      </div>
    </div>
  );
} 