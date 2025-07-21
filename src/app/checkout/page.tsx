'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, CreditCard, Lock, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const { user, loading: authLoading, updateUserPlan } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'sixmonths' | 'yearly'>('monthly');
  
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });

  const plans = {
    monthly: {
      name: 'Monthly Plan',
      price: 15,
      duration: '1 Month',
      savings: 0,
      color: 'green'
    },
    sixmonths: {
      name: '6 Months Plan',
      price: 75,
      duration: '6 Months',
      savings: 15, // 6 months * 15 = 90, but we charge 75, so save 15
      color: 'orange'
    },
    yearly: {
      name: 'Yearly Plan',
      price: 150,
      duration: '12 Months',
      savings: 30, // 12 months * 15 = 180, but we charge 150, so save 30
      color: 'purple'
    }
  };

  const coupons = {
    'MONTHLY10': 1.5, // 10% off $15 = $1.5
    'SIXMONTHS15': 11.25, // 15% off $75 = $11.25
    'YEARLY20': 30, // 20% off $150 = $30
  };

  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');

  // Check user
  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push('/auth/signin');
      return;
    }
    
    // Check if user came from signup with paid plan
    const cameFromSignup = sessionStorage.getItem('cameFromSignupWithPaidPlan');
    const pendingPaidPlan = sessionStorage.getItem('pendingPaidPlan');
    
    // If user is already in paid plan and didn't come from signup, redirect to dashboard
    if (user.planType !== 'free' && !cameFromSignup && !pendingPaidPlan) {
      toast.info('You already have an active subscription!');
      router.push('/dashboard');
    }
    
    // If came from signup with paid plan, remove the flag
    if (cameFromSignup) {
      sessionStorage.removeItem('cameFromSignupWithPaidPlan');
    }
  }, [user, authLoading, router]);

  // Show loading if in loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const applyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    const coupon = coupons[couponCode.toUpperCase() as keyof typeof coupons];
    if (coupon) {
      setDiscountAmount(coupon);
      setAppliedCoupon(couponCode.toUpperCase());
      toast.success(`Coupon applied! You saved $${coupon}`);
    } else {
      toast.error('Invalid coupon');
    }
  };

  const removeCoupon = () => {
    setDiscountAmount(0);
    setAppliedCoupon('');
    setCouponCode('');
    toast.info('Coupon removed');
  };

  const getTotalPrice = () => {
    const planPrice = plans[selectedPlan].price;
    return Math.max(0, planPrice - discountAmount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Starting payment process...');
      console.log('Current user:', user);
      console.log('Selected plan:', selectedPlan);
      
      // Mock payment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Payment simulation completed, updating plan...');
      
      // Update plan type in auth-context
      await updateUserPlan(selectedPlan);
      
      // Remove flag
      sessionStorage.removeItem('pendingPaidPlan');
      sessionStorage.removeItem('cameFromSignupWithPaidPlan');
      
      console.log('Plan updated successfully!');
      
      toast.success(`Payment successful! ${plans[selectedPlan].name} activated for your account`);
      
      // Redirect to dashboard after payment
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Purchase</h1>
          <p className="text-gray-600">Choose your plan and complete the payment to activate your subscription</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Plan Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Select Your Plan</h3>
            <div className="space-y-3">
              {Object.entries(plans).map(([key, plan]) => (
                <div
                  key={key}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPlan === key
                      ? `border-${plan.color}-500 bg-${plan.color}-50`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedPlan(key as keyof typeof plans)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">{plan.name}</h4>
                      <p className="text-sm text-gray-600">{plan.duration}</p>
                      {plan.savings > 0 && (
                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-1">
                          Save ${plan.savings}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">${plan.price}</div>
                      <div className="text-sm text-gray-500">
                        {key === 'monthly' ? 'per month' : key === 'sixmonths' ? 'per 6 months' : 'per year'}
              </div>
            </div>
                  </div>
                </div>
              ))}
                </div>
              </div>
            
              {/* Plan Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Plan Details</h3>
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 shadow-sm">
              <h4 className="font-bold text-indigo-900 mb-3 text-lg">🚀 {plans[selectedPlan].name}</h4>
                  <ul className="space-y-2 text-sm text-indigo-800">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      AI for creating product descriptions
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Mobile App (PWA)
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Custom Domain
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Link WhatsApp and Instagram
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Google Analytics
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Live Support
                    </li>
                  </ul>
              <div className="mt-4 text-2xl font-bold text-indigo-900">${plans[selectedPlan].price} / {plans[selectedPlan].duration}</div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Order Summary</h3>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{plans[selectedPlan].name}</span>
                    <span className="font-semibold">${plans[selectedPlan].price}</span>
                  </div>
                  
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedCoupon})</span>
                      <span>-${discountAmount}</span>
                    </div>
                  )}
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${getTotalPrice()}</span>
                    </div>
                </div>
              </div>
              
              {/* Coupon Section */}
                <div className="mt-6 space-y-3">
                  <Label htmlFor="coupon" className="text-sm font-medium">Coupon Code (Optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="coupon"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1"
                    />
                                      {!appliedCoupon ? (
                      <Button type="button" variant="outline" onClick={applyCoupon}>
                        Apply
                      </Button>
                    ) : (
                      <Button type="button" variant="outline" onClick={removeCoupon}>
                        Remove
                      </Button>
                    )}
                  </div>
                  {appliedCoupon && (
                    <p className="text-sm text-green-600">Coupon {appliedCoupon} applied!</p>
                  )}
                </div>
              </CardContent>
            </Card>
                </div>
              </div>
              
              {/* Payment Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Payment Information
            </CardTitle>
            <CardDescription>
              Enter your payment details to complete the purchase
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="cardNumber" className="text-gray-700">Card Number</Label>
                    <Input
                      id="cardNumber"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                      placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cardHolder" className="text-gray-700">Card Holder Name</Label>
                  <Input
                    id="cardHolder"
                    value={formData.cardHolder}
                    onChange={(e) => handleInputChange('cardHolder', e.target.value)}
                    placeholder="John Doe"
                      required
                    />
                  </div>
                  
                <div className="space-y-2">
                      <Label htmlFor="expiryDate" className="text-gray-700">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    
                <div className="space-y-2">
                      <Label htmlFor="cvv" className="text-gray-700">CVV</Label>
                      <Input
                        id="cvv"
                        value={formData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value)}
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                  
              {/* Security Notice */}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Lock className="h-4 w-4" />
                <span>Your payment information is encrypted and secure</span>
                  </div>
                  
              {/* Submit Button */}
                  <Button 
                    type="submit" 
                    disabled={loading}
                className="w-full bg-gradient-primary text-white py-3 rounded-md font-semibold hover:opacity-90 transition shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                      </div>
                    ) : (
                  `Pay $${getTotalPrice()} - Activate ${plans[selectedPlan].name}`
                    )}
                  </Button>
                </form>
          </CardContent>
        </Card>

        {/* Security Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center space-y-2">
            <Shield className="h-8 w-8 text-green-500" />
            <h4 className="font-semibold">Secure Payment</h4>
            <p className="text-sm text-gray-600">256-bit SSL encryption</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Lock className="h-8 w-8 text-blue-500" />
            <h4 className="font-semibold">Privacy Protected</h4>
            <p className="text-sm text-gray-600">Your data is safe with us</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <CheckCircle className="h-8 w-8 text-purple-500" />
            <h4 className="font-semibold">Instant Activation</h4>
            <p className="text-sm text-gray-600">Access features immediately</p>
          </div>
        </div>
      </div>
    </div>
  );
} 