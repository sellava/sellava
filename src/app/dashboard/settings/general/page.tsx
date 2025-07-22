'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, ArrowLeft, CreditCard, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { getStore, createStore, updateStore } from '@/lib/firebase-services';
import { toast } from 'sonner';
import type { Store as StoreType } from '@/types';

export default function GeneralSettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    storeTitle: '',
    storeBio: '',
    storeCountry: '',
    domain: '',
    logo: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [domainError, setDomainError] = useState('');

  useEffect(() => {
    if (user) {
      loadStoreData();
    }
  }, [user]);

  const loadStoreData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const storeData = await getStore(user.uid);
      const localLogo = localStorage.getItem(`store_logo_${user.uid}`);
      
      if (storeData) {
        setFormData({
          storeTitle: storeData.storeTitle || '',
          storeBio: storeData.storeBio || '',
          storeCountry: storeData.storeCountry || '',
          domain: storeData.domain || '',
          logo: localLogo || storeData.logo || '',
        });
      }
    } catch (error) {
      console.error('Error loading store data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'domain') {
      const pattern = /^sellava-[a-zA-Z0-9-]+\.com$/;
      if (value && !pattern.test(value)) {
        setDomainError('Domain must be in the format: sellava-yourstore.com');
      } else {
        setDomainError('');
      }
    }
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFormData(prev => ({ ...prev, logo: base64 }));
        localStorage.setItem(`store_logo_${user.uid}`, base64);
        toast.success('تم حفظ اللوغو محليًا');
        setLogoUploading(false);
      };
      reader.onerror = () => {
        toast.error('حدث خطأ أثناء قراءة الصورة');
        setLogoUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('حدث خطأ أثناء رفع اللوغو');
      setLogoUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    if (user.planType !== 'free' && domainError) {
      toast.error(domainError);
      return;
    }

    setSaving(true);

    try {
      const storeData: Partial<StoreType> = {
        userId: user.uid,
        storeTitle: formData.storeTitle,
        storeBio: formData.storeBio,
        storeCountry: formData.storeCountry,
        domain: user.planType !== 'free' ? formData.domain : '',
        logo: formData.logo,
        planType: user.planType,
        enableAI: false,
        autoDescription: false,
        localDelivery: false,
        globalDelivery: false,
        deliveryCost: 0,
      };

      const existingStore = await getStore(user.uid);
      
      if (existingStore) {
        await updateStore(user.uid, storeData);
      } else {
        await createStore(storeData as StoreType);
      }

      toast.success('Settings saved successfully');
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving store settings:', error);
      toast.error('حدث خطأ في حفظ الإعدادات');
    } finally {
      setSaving(false);
    }
  };

  const handleUpgrade = () => {
    router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-primary text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                <Store className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">General Settings</h1>
            </div>
            
            <Link href="/dashboard">
              <Button variant="outline" className="flex items-center text-white border-white/30 hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Store Settings */}
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Basic store settings
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="storeTitle">Store Title</Label>
                  <Input
                    id="storeTitle"
                    value={formData.storeTitle}
                    onChange={(e) => handleInputChange('storeTitle', e.target.value)}
                    placeholder="Enter store title"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="storeBio">Store Bio</Label>
                  <Textarea
                    id="storeBio"
                    value={formData.storeBio}
                    onChange={(e) => handleInputChange('storeBio', e.target.value)}
                    placeholder="Short description about your store"
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="storeCountry">Store Country</Label>
                  <Input
                    id="storeCountry"
                    value={formData.storeCountry}
                    onChange={(e) => handleInputChange('storeCountry', e.target.value)}
                    placeholder="Enter country name"
                    required
                  />
                </div>
                
                {/* Logo Upload */}
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo (optional)</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      disabled={logoUploading}
                    />
                    {formData.logo && (
                      <img
                        src={formData.logo}
                        alt="Logo Preview"
                        width={64}
                        height={64}
                        className="w-16 h-16 object-contain rounded border"
                      />
                    )}
                  </div>
                  {logoUploading && <p className="text-xs text-blue-500">Uploading logo...</p>}
                </div>
                
                {/* Custom Domain */}
                {user?.planType !== 'free' ? (
                  <div className="space-y-2">
                    <Label htmlFor="domain">Custom Domain (optional)</Label>
                    <Input
                      id="domain"
                      value={formData.domain}
                      onChange={e => handleInputChange('domain', e.target.value)}
                      placeholder="e.g. sellava-yourstore.com"
                    />
                    <p className="text-xs text-gray-500">Domain must be in the format: <b>sellava-yourstore.com</b></p>
                    {domainError && <p className="text-xs text-red-500">{domainError}</p>}
                    <p className="text-xs text-gray-500">You can link a custom domain to your store (e.g. sellava-yourstore.com). Make sure to set up your DNS settings correctly.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="domain" className="text-gray-400">Custom Domain (paid plans only)</Label>
                    <Input id="domain" value={formData.domain} disabled placeholder="Available for paid plans only" className="bg-gray-100" />
                    <p className="text-xs text-gray-400">Custom domain is available only when you upgrade to a paid plan.</p>
                  </div>
                )}
                
                <div className="flex justify-end space-x-4">
                  <Link href="/dashboard">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" disabled={saving} className="bg-gradient-primary hover:opacity-90 text-white">
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Plan & Coupon Section */}
          <div className="space-y-6">
            {/* Current Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Current Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 shadow-sm">
                  <h4 className="font-bold text-indigo-900 mb-3 text-lg">
                    {user?.planType !== 'free' ? '🚀 Paid Plan' : '📦 Free Plan'}
                  </h4>
                  <ul className="space-y-2 text-sm text-indigo-800">
                    {user?.planType !== 'free' ? (
                      <>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          AI-powered product description
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
                          WhatsApp & Instagram integration
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          Google Analytics
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          Live Support
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          Basic product management
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          Public store
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          Shopping cart
                        </li>
                        <li className="text-gray-500">❌ AI-powered product description</li>
                        <li className="text-gray-500">❌ Mobile App (PWA)</li>
                        <li className="text-gray-500">❌ Custom Domain</li>
                      </>
                    )}
                  </ul>
                  <div className="mt-4 text-2xl font-bold text-indigo-900">
                    {user?.planType !== 'free' ? '15 USD / month' : 'Free'}
                  </div>
                </div>
                
                {user?.planType === 'free' && (
                  <Button 
                    onClick={handleUpgrade}
                    className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Upgrade to Paid Plan
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Coupon Section */}
            <Card>
              <CardHeader>
                <CardTitle>🎫 Discount Coupon</CardTitle>
                <CardDescription>
                  Use a discount coupon to get a discount on the paid plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="couponCode">Coupon Code</Label>
                    <Input
                      id="couponCode"
                      placeholder="Enter coupon code"
                      className="mt-1"
                    />
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-indigo-300 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-400 transition-colors"
                  >
                    Apply Coupon
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 