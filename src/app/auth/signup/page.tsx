"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Lock, Phone, Globe, CheckCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createStore } from '@/lib/firebase-services';
import type { PlanType, Store } from '@/types';

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    country: '',
  });
  const [plan, setPlan] = useState<PlanType>('free');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      toast.error('Please fill all required fields');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: formData.name
      });

      // Create store
      await createStore({
        userId: userCredential.user.uid,
        storeTitle: `${formData.name}'s Store`,
        planType: plan,
      } as Omit<Store, 'createdAt' | 'updatedAt'>);

      toast.success('Account created successfully!');

      // Redirect based on plan
      if (plan !== 'free') {
        sessionStorage.setItem('cameFromSignupWithPaidPlan', 'true');
        router.push('/checkout');
      } else {
        router.push('/try-for-free');
      }
    } catch (error: unknown) {
      console.error('Signup error:', error);
      
      const err = error as { code?: string; message?: string };
      
      if (err.code === 'auth/email-already-in-use') {
        toast.error('Email already in use. Please try a different email.');
      } else if (err.code === 'auth/weak-password') {
        toast.error('Password is too weak. Please choose a stronger password.');
      } else {
        toast.error('Error creating account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      id: 'free' as PlanType,
      name: 'Free Plan',
      price: '$0',
      duration: 'Forever',
      features: [
        'Basic store setup',
        'Up to 10 products',
        'Email support',
        'Basic analytics'
      ],
      popular: false
    },
    {
      id: 'monthly' as PlanType,
      name: 'Monthly Plan',
      price: '$15',
      duration: 'per month',
      features: [
        'Unlimited products',
        'AI-powered features',
        'Priority support',
        'Advanced analytics',
        'Custom domain',
        'PWA support'
      ],
      popular: true
    },
    {
      id: 'sixmonths' as PlanType,
      name: '6 Months Plan',
      price: '$75',
      duration: 'for 6 months',
      features: [
        'All monthly features',
        '2 months free',
        'Early access to new features',
        'Dedicated support'
      ],
      popular: false
    },
    {
      id: 'yearly' as PlanType,
      name: 'Yearly Plan',
      price: '$120',
      duration: 'per year',
      features: [
        'All monthly features',
        '4 months free',
        'Priority feature requests',
        '24/7 support',
        'Custom integrations'
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Your Store</h1>
          <p className="text-gray-600">Join thousands of entrepreneurs selling online</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Signup Form */}
          <Card className="bg-white shadow-2xl border-0 rounded-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">Account Details</CardTitle>
              <CardDescription>Create your account to start selling</CardDescription>
            </CardHeader>
            <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-gray-700">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
            type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      className="pl-10 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-700">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
            type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email"
                      className="pl-10 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password" className="text-gray-700">Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
            type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Create a password"
                      className="pl-10 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter your phone number"
                      className="pl-10 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>

          <div>
                  <Label htmlFor="country" className="text-gray-700">Country</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="country"
                      type="text"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      placeholder="Enter your country"
                      className="pl-10 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                />
            </div>
          </div>

                <Button
            type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl"
          >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </Button>
                <Link href="/try-for-free">
                  <Button className="w-full mt-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold shadow hover:opacity-90 border-0 py-3 rounded-xl">
                    Try for Free
                  </Button>
                </Link>
        </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link href="/auth/signin" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Plan Selection */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 text-center">Choose Your Plan</h2>
            <p className="text-gray-600 text-center mb-6">Select the plan that best fits your business needs</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plans.map((planOption) => (
                <Card
                  key={planOption.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    plan === planOption.id
                      ? 'border-2 border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setPlan(planOption.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold">{planOption.name}</CardTitle>
                      {planOption.popular && (
                        <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                          Popular
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-gray-900">{planOption.price}</span>
                      <span className="text-gray-600 ml-1">{planOption.duration}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2">
                      {planOption.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
            </ul>
                  </CardContent>
                </Card>
              ))}
          </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Sparkles className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Start Free, Upgrade Later</h4>
                  <p className="text-sm text-blue-800">
                    You can always upgrade your plan later. Start with the free plan to explore all features.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 