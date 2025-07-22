'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Store, CreditCard, Shield, CheckCircle, ShoppingCart, ArrowLeft, MapPin, Globe2, Banknote } from 'lucide-react';
import { toast } from 'sonner';
import { createOrder, getStore } from '@/lib/firebase-services';
import Link from 'next/link';
import { 
  getCart, 
  getValidCart,
  cleanCart,
  clearCart, 
  getCartTotal, 
  getAppliedCoupon, 
  setAppliedCoupon, 
  validateCoupon 
} from '@/lib/cart-service';
import { ConnectionStatus } from '@/components/ui/connection-status';
import { DebugInfo } from '@/components/ui/debug-info';
import { DataPreview } from '@/components/ui/data-preview';
import { CartStatus } from '@/components/ui/cart-status';
import { ErrorDetails } from '@/components/ui/error-details';
import { InvalidItemsDetails } from '@/components/ui/invalid-items-details';
import Image from 'next/image';

export default function CartCheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCouponState, setAppliedCouponState] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });

  const [subtotal, setSubtotal] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [lastError, setLastError] = useState<any>(null);
  const [invalidItems, setInvalidItems] = useState<any[]>([]);

  // ✅ Delivery options
  const [deliveryOptions, setDeliveryOptions] = useState<Record<string, Record<string, number>>>({});
  const [storeLoading, setStoreLoading] = useState(true);

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [deliveryCost, setDeliveryCost] = useState(0);

  // --- Store coupons ---
  const [couponDetails, setCouponDetails] = useState<any>(null);

  // --- Payment settings ---
  const [storePaymentSettings, setStorePaymentSettings] = useState<any>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'electronic' | 'cash' | null>(null);

  const [countryTouched, setCountryTouched] = useState(false);
  const [cityTouched, setCityTouched] = useState(false);

  // Get delivery options from localStorage first, then from store data if not found
  useEffect(() => {
    async function fetchDeliveryOptions() {
      let storeId = localStorage.getItem('current_store_id');
      if (!storeId) {
        const pathname = window.location.pathname;
        const storeMatch = pathname.match(/\/public-store\/([^\/]+)/);
        if (storeMatch) {
          storeId = storeMatch[1];
          localStorage.setItem('current_store_id', storeId);
        }
      }
      if (storeId) {
        setStoreLoading(true);
        // Try getting from localStorage first
        const localOptions = localStorage.getItem(`delivery_options_${storeId}`);
        if (localOptions) {
          try {
            setDeliveryOptions(JSON.parse(localOptions));
            setStoreLoading(false);
            return;
          } catch (e) {
            // If there's an error in conversion, ignore and use from store
          }
        }
        // If not found in localStorage, get from store data
        const storeData = await getStore(storeId);
        setDeliveryOptions(storeData?.deliveryOptions || {});
        
        // Set payment settings
        setStorePaymentSettings({
          enableCashOnDelivery: storeData?.enableCashOnDelivery ?? true,
          enableElectronicPayment: storeData?.enableElectronicPayment ?? false,
          paymentMethod: storeData?.paymentMethod ?? 'both',
        });
        
        // Auto-select payment method based on store settings
        if (storeData?.paymentMethod === 'electronic') {
          setSelectedPaymentMethod('electronic');
        } else if (storeData?.paymentMethod === 'cash') {
          setSelectedPaymentMethod('cash');
        }
        
        setStoreLoading(false);
      }
    }
    fetchDeliveryOptions();
  }, []);

  // Update totals when data changes
  useEffect(() => {
    try {
      const currentSubtotal = getCartTotal();
      setSubtotal(currentSubtotal);
      setFinalTotal(currentSubtotal - discountAmount + deliveryCost);
    } catch (error) {
      console.error('Error updating totals:', error);
    }
  }, [cartItems, discountAmount, deliveryCost]);

  useEffect(() => {
    try {
      // Update current store ID if not set
      if (typeof window !== 'undefined') {
        const currentStoreId = localStorage.getItem('current_store_id');
        if (!currentStoreId) {
          localStorage.setItem('current_store_id', 'default');
        }
      }
      
      // Clean cart from invalid products
      cleanCart();
      
      // Load cart items using getValidCart
      const items = getValidCart();
      setCartItems(items);
      
      // Load applied coupon
      const savedCoupon = getAppliedCoupon();
      if (savedCoupon) {
        setAppliedCouponState(savedCoupon);
        const currentSubtotal = getCartTotal();
        const validation = validateCoupon(savedCoupon, currentSubtotal);
        if (validation.valid) {
          setDiscountAmount(validation.discount);
        }
      }
      
      if (items.length === 0) {
        toast.error('Cart is empty');
        router.push('/cart');
      }
    } catch (error) {
      console.error('Error loading cart data:', error);
      toast.error('Error loading cart data');
      router.push('/cart');
    } finally {
      setInitialLoading(false);
    }
  }, [router]);

  // Add useEffect to update data when cart changes
  useEffect(() => {
    const handleStorageChange = () => {
      const items = getCart();
      setCartItems(items);
      
      // Update coupon if applied
      const savedCoupon = getAppliedCoupon();
      if (savedCoupon) {
        const currentSubtotal = getCartTotal();
        const validation = validateCoupon(savedCoupon, currentSubtotal);
        if (validation.valid) {
          setDiscountAmount(validation.discount);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // ✅ Update delivery cost when country or province changes
  useEffect(() => {
    if (selectedCountry && selectedCity) {
      const countryObj = deliveryOptions[selectedCountry] as Record<string, number>;
      const cost = countryObj?.[selectedCity] || 0;
      setDeliveryCost(cost);
    }
  }, [selectedCountry, selectedCity, deliveryOptions]);

  const handleCartUpdate = (newItems: any[]) => {
    setCartItems(newItems);
    setInvalidItems([]);
    setLastError(null);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCouponApply = () => {
    if (!couponCode.trim()) {
      toast.error('Please enter coupon code');
      return;
    }

    // Get store ID
    let storeId = localStorage.getItem('current_store_id');
    if (!storeId) {
      const pathname = window.location.pathname;
      const storeMatch = pathname.match(/\/public-store\/([^\/]+)/);
      if (storeMatch) {
        storeId = storeMatch[1];
        localStorage.setItem('current_store_id', storeId);
      }
    }
    if (!storeId) {
      toast.error('Store ID not found');
      return;
    }
    // Get coupons from localStorage
    const couponsRaw = localStorage.getItem(`coupons_${storeId}`);
    let coupons: any[] = [];
    if (couponsRaw) {
      try {
        coupons = JSON.parse(couponsRaw);
      } catch {}
    }
    const coupon = coupons.find(c => c.code.toLowerCase() === couponCode.trim().toLowerCase());
    if (!coupon) {
      toast.error('Coupon not found or invalid');
      return;
    }
    if (!coupon.isActive) {
      toast.error('This coupon is not active currently');
      return;
    }
    if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) {
      toast.error('Coupon expired');
      return;
    }
    if (coupon.maxUsage && coupon.usageCount >= coupon.maxUsage) {
      toast.error('Maximum usage reached for this coupon');
      return;
    }
    // Apply discount
    const currentSubtotal = getCartTotal();
    const discount = Math.round((currentSubtotal * coupon.discountPercentage) / 100);
    setAppliedCouponState(coupon.code);
    setDiscountAmount(discount);
    setAppliedCoupon(coupon.code);
    setCouponDetails(coupon);
    toast.success(`Coupon applied! Discount ${coupon.discountPercentage}%`);
  };

  const handleRemoveCoupon = () => {
    setAppliedCouponState(null);
    setDiscountAmount(0);
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponDetails(null);
    toast.success('Coupon removed');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCountryTouched(true);
    setCityTouched(true);
    // Check country and province
    if (!selectedCountry) {
      toast.error('Please select country');
      return;
    }
    if (!selectedCity) {
      toast.error('Please select province');
      return;
    }
    
    // Check data validity
    if (!formData.customerName.trim()) {
      toast.error('Please enter full name');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email');
      return;
    }
    
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
    if (!formData.phone.trim() || !phoneRegex.test(formData.phone)) {
      toast.error('Please enter a valid phone number');
      return;
    }
    
    if (cartItems.length === 0) {
      toast.error('Cart is empty, cannot complete order');
      return;
    }

    // Check product data validity
    const invalidItems = cartItems.filter(item => 
      !item.productId || !item.name || !item.price || !item.quantity
    );
    
    if (invalidItems.length > 0) {
      setInvalidItems(invalidItems);
      console.error('Invalid cart items found:', {
        totalItems: cartItems.length,
        invalidItems: invalidItems.length,
        invalidItemsDetails: invalidItems.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          hasProductId: !!item.productId,
          hasName: !!item.name,
          hasPrice: !!item.price,
          hasQuantity: !!item.quantity,
          priceType: typeof item.price,
          quantityType: typeof item.quantity
        }))
      });
      
      toast.error(`Found ${invalidItems.length} invalid products in cart.`);
      return;
    }

    // Check payment method selection
    if (storePaymentSettings?.paymentMethod === 'both' && !selectedPaymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    // Confirm order submission
    const confirmed = window.confirm('Are you sure you want to submit this order?');
    if (!confirmed) {
      return;
    }

    setLoading(true);

    try {
      // Get store ID from localStorage or URL
      let storeId = localStorage.getItem('current_store_id');
      
      // If there's no store ID in localStorage, try getting it from URL
      if (!storeId) {
        const pathname = window.location.pathname;
        const storeMatch = pathname.match(/\/public-store\/([^\/]+)/);
        if (storeMatch) {
          storeId = storeMatch[1];
          localStorage.setItem('current_store_id', storeId);
        }
      }
      
      console.log('Store ID:', storeId);
      
      if (!storeId) {
        throw new Error('Store ID not found. Please return to the store and try again.');
      }

      // Convert order data to the required format for Firebase
      const orderData = {
        customerName: formData.customerName.trim(),
        customerPhone: formData.phone.trim(),
        customerEmail: formData.email.trim(),
        customerAddress: formData.address.trim() || '',
        items: cartItems.map(item => ({
          productId: item.productId || '',
          productName: item.name || '',
          productImage: item.image || '',
          price: Number(item.price) || 0,
          quantity: Number(item.quantity) || 0,
          total: Number(item.price * item.quantity) || 0,
          ...(item.selectedColor ? { selectedColor: item.selectedColor } : {}),
          ...(item.selectedSize ? { selectedSize: item.selectedSize } : {}),
        })),
        total: Number(finalTotal) || 0,
        status: 'pending' as const,
        notes: formData.notes.trim() || '',
        appliedCoupon: appliedCouponState || '',
        discount: Number(discountAmount) || 0,
        subtotal: Number(subtotal) || 0,
        country: selectedCountry,
        city: selectedCity,
        deliveryCost: deliveryCost,
      };

      console.log('Order data to be saved:', orderData);
      console.log('Attempting to save order for store:', storeId);

      let orderId: string;
      
      // Special handling for test user
      if (storeId === 'wNgsY8iZE7M52xMIhvjDKndYqMh1') {
        // For test user, save to localStorage only
        orderId = `order_${Date.now()}`;
        const order = {
          id: orderId,
          customerInfo: formData,
          items: cartItems,
          subtotal,
          discount: discountAmount,
          total: finalTotal,
          appliedCoupon: appliedCouponState,
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        
        const existingOrders = JSON.parse(localStorage.getItem('store_orders') || '[]');
        existingOrders.push(order);
        localStorage.setItem('store_orders', JSON.stringify(existingOrders));
        console.log('Order saved to localStorage for test user');
      } else {
        // For regular users, save to Firebase
        try {
          console.log('Attempting to create order in Firebase for store:', storeId);
          
          // Test connection first
          const { testFirebaseConnection } = await import('@/lib/firebase-services');
          const connectionTest = await testFirebaseConnection(storeId);
          
          if (!connectionTest.connected) {
            throw new Error(`Firebase connection failed: ${connectionTest.error}`);
          }
          
          orderId = await createOrder(storeId, orderData);
          console.log('Order saved successfully to Firebase with ID:', orderId);
        } catch (firebaseError) {
          console.error('Firebase error details:', firebaseError);
          throw new Error(`Failed to save order to Firebase: ${firebaseError instanceof Error ? firebaseError.message : 'Unknown error'}`);
        }
      }
      
      // Empty cart
      clearCart();
      
      // Handle payment method routing
      const paymentMethod = selectedPaymentMethod || storePaymentSettings?.paymentMethod;
      
      if (paymentMethod === 'electronic') {
        // Redirect to electronic payment page
        toast.success('Redirecting to payment...');
      setTimeout(() => {
          router.push(`/store-payment/${storeId}?orderId=${orderId}&total=${finalTotal}&customerName=${encodeURIComponent(formData.customerName)}&customerEmail=${encodeURIComponent(formData.email)}&customerPhone=${encodeURIComponent(formData.phone)}`);
        }, 1000);
      } else {
        // Cash on delivery - redirect to confirmation
        toast.success('Order submitted successfully! We will contact you soon');
        setTimeout(() => {
          router.push(`/order-confirmation?orderId=${orderId}&paymentMethod=cash&total=${finalTotal}`);
      }, 2000);
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      setLastError(error);
      
      // More detailed error message
      let errorMessage = 'Order submission failed';
      if (error instanceof Error) {
        if (error.message.includes('Store ID not found')) {
          errorMessage = 'Store ID error. Please return to the store and try again.';
        } else if (error.message.includes('Failed to save order to Firebase')) {
          errorMessage = error.message;
        } else if (error.message.includes('Failed to create order')) {
          errorMessage = error.message;
        } else if (error.message.includes('permission-denied')) {
          errorMessage = 'You do not have permission to create orders in this store';
        } else if (error.message.includes('unavailable')) {
          errorMessage = 'Firebase service unavailable. Please check your internet connection and try again.';
        } else if (error.message.includes('not-found')) {
          errorMessage = 'Store not found. It will be created automatically.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
      
      // Add more details to console for debugging
      console.error('Full error details:', {
        error,
        storeId: localStorage.getItem('current_store_id'),
        cartItems,
        formData
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="bg-white shadow-2xl border-0 rounded-2xl overflow-hidden">
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <h1 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h1>
              <p className="text-gray-600">Please wait</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="bg-white shadow-2xl border-0 rounded-2xl overflow-hidden">
            <CardContent className="p-8 text-center">
              <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Cart is empty</h1>
              <p className="text-gray-600 mb-6">No products in cart</p>
              <div className="space-y-3">
                <Link href="/cart">
                  <Button className="w-full">Return to cart</Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full">Return to store</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <Card className="bg-white shadow-2xl border-0 rounded-2xl overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Store className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">Complete Order</CardTitle>
            <CardDescription className="text-indigo-100">
              Final step to complete your order
            </CardDescription>
            <div className="mt-4 flex justify-center">
              <ConnectionStatus 
                storeId={localStorage.getItem('current_store_id') || undefined}
                className="bg-white/20 text-white border-white/30"
              />
            </div>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Customer Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800">Customer Information</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="customerName" className="text-gray-700">Full Name *</Label>
                    <Input
                      id="customerName"
                      value={formData.customerName}
                      onChange={(e) => handleInputChange('customerName', e.target.value)}
                      placeholder="Enter your full name"
                      className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-gray-700">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="example@email.com"
                      className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="text-gray-700">Phone *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+966 50 123 4567"
                      className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address" className="text-gray-700">Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Enter delivery address"
                      rows={3}
                      className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="country" className="text-gray-700 flex items-center gap-1">
                      <Globe2 className="h-4 w-4 text-indigo-500" /> Country *
                    </Label>
                    {storeLoading ? (
                      <div className="text-sm text-gray-500">Loading delivery options...</div>
                    ) : Object.keys(deliveryOptions).length === 0 ? (
                      <div className="text-sm text-red-500">No delivery options available currently</div>
                    ) : (
                      <div className="relative">
                        <select
                          id="country"
                          value={selectedCountry}
                          onChange={(e) => {
                            setSelectedCountry(e.target.value);
                            setSelectedCity('');
                            setCountryTouched(true);
                          }}
                          onBlur={() => setCountryTouched(true)}
                          className={`w-full border rounded-md px-10 py-2 focus:border-indigo-500 focus:ring-indigo-500 appearance-none ${countryTouched && !selectedCountry ? 'border-red-500' : 'border-gray-200'}`}
                          required
                          style={{ direction: 'rtl' }}
                        >
                          <option value="">Select country</option>
                          {Object.keys(deliveryOptions).map((country) => (
                            <option key={country} value={country}>{country}</option>
                          ))}
                        </select>
                        <Globe2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-indigo-400 pointer-events-none" />
                        {countryTouched && !selectedCountry && (
                          <div className="text-xs text-red-500 mt-1">Please select country</div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="city" className="text-gray-700 flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-indigo-500" /> Province *
                    </Label>
                    <div className="relative">
                      <select
                        id="city"
                        value={selectedCity}
                        onChange={(e) => { setSelectedCity(e.target.value); setCityTouched(true); }}
                        onBlur={() => setCityTouched(true)}
                        disabled={!selectedCountry || !deliveryOptions[selectedCountry]}
                        className={`w-full border rounded-md px-10 py-2 focus:border-indigo-500 focus:ring-indigo-500 appearance-none ${cityTouched && !selectedCity ? 'border-red-500' : 'border-gray-200'}`}
                        required
                        style={{ direction: 'rtl' }}
                      >
                        <option value="">Select province</option>
                        {selectedCountry && deliveryOptions[selectedCountry] &&
                          Object.keys(deliveryOptions[selectedCountry]).map((city) => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                      </select>
                      <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-indigo-400 pointer-events-none" />
                      {cityTouched && !selectedCity && (
                        <div className="text-xs text-red-500 mt-1">Please select province</div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="notes" className="text-gray-700">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Any special notes or requests"
                      rows={3}
                      className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </form>
              </div>
              
              {/* Payment Method Selection */}
              {storePaymentSettings && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800">Payment Method</h3>
                  
                  <div className="space-y-4">
                    {/* Electronic Payment */}
                    {(storePaymentSettings.paymentMethod === 'both' || storePaymentSettings.paymentMethod === 'electronic') && (
                      <div
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          selectedPaymentMethod === 'electronic'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedPaymentMethod('electronic')}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <CreditCard className="h-6 w-6 text-blue-600 mr-3" />
                            <div>
                              <h4 className="font-semibold">Electronic Payment</h4>
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
                    {(storePaymentSettings.paymentMethod === 'both' || storePaymentSettings.paymentMethod === 'cash') && (
                      <div
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          selectedPaymentMethod === 'cash'
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedPaymentMethod('cash')}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Banknote className="h-6 w-6 text-green-600 mr-3" />
                            <div>
                              <h4 className="font-semibold">Cash on Delivery</h4>
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
                </div>
              )}
              
              {/* Order Summary */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800">Order Summary</h3>
                
                {/* Cart Items */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Ordered Products ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} products)
                  </h4>
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div
                        key={
                          item.productId +
                          (item.selectedColor ? `-${item.selectedColor}` : '') +
                          (item.selectedSize ? `-${item.selectedSize}` : '')
                        }
                        className="flex justify-between items-center p-3 bg-white rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-lg"
                              width={48}
                              height={48}
                            />
                          )}
                          <div>
                            <p className="font-medium text-gray-800">{item.name}</p>
                            {item.selectedColor && (
                              <p className="text-xs text-gray-600">Color: {item.selectedColor}</p>
                            )}
                            {item.selectedSize && (
                              <p className="text-xs text-gray-600">Size: {item.selectedSize}</p>
                            )}
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-indigo-600">${(item.price * item.quantity).toFixed(2)} USD</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Coupon Section */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">🎫 Discount Coupon</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="couponCode" className="text-gray-700">Coupon Code</Label>
                      <Input
                        id="couponCode"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code"
                        className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                        disabled={!!appliedCouponState}
                      />
                    </div>
                    
                    {!appliedCouponState ? (
                      <Button 
                        onClick={handleCouponApply}
                        variant="outline" 
                        className="w-full border-indigo-300 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-400 transition-colors"
                      >
                        Apply Coupon
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleRemoveCoupon}
                        variant="outline" 
                        className="w-full border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 transition-colors"
                      >
                        Remove Coupon
                      </Button>
                    )}
                    
                    {appliedCouponState && couponDetails && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
                        <p className="text-green-800 text-sm font-medium">
                          <strong>Applied Coupon:</strong> {appliedCouponState}
                        </p>
                        <p className="text-green-800 text-sm font-medium">
                          <strong>Discount Percentage:</strong> {couponDetails.discountPercentage}%
                        </p>
                        <p className="text-green-800 text-sm font-medium">
                          <strong>Expiration Date:</strong> {couponDetails.validUntil}
                        </p>
                        {couponDetails.maxUsage && (
                          <p className="text-green-800 text-sm font-medium">
                            <strong>Maximum Usage:</strong> {couponDetails.maxUsage}
                          </p>
                        )}
                        <p className="text-green-800 text-sm font-medium">
                          <strong>Usage Count:</strong> {couponDetails.usageCount}
                        </p>
                        <p className="text-green-800 text-sm font-medium">
                          <strong>Discount:</strong> {discountAmount.toFixed(2)} USD
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Price Summary */}
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-xl border border-gray-200">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal:</span>
                      <span>{subtotal.toFixed(2)} USD</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-green-600 font-medium">
                        <span>Discount:</span>
                        <span>-{discountAmount.toFixed(2)} USD</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-blue-600 font-medium">
                      <span>Delivery Cost:</span>
                      <span>{deliveryCost.toFixed(2)} USD</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t border-gray-300 pt-2 text-gray-800">
                      <span>Final Total:</span>
                      <span className="text-indigo-600">{finalTotal.toFixed(2)} USD</span>
                    </div>
                  </div>
                </div>
                
                {/* Submit Button */}
                <Button 
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200" 
                  disabled={loading || cartItems.length === 0}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting order...
                    </div>
                  ) : (
                    'Submit Order'
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}