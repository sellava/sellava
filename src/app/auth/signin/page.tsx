'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signIn } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // تسجيل دخول مبسط للاختبار
      if (email === 'test@example.com' && password === '123456') {
        toast.success('تم تسجيل الدخول بنجاح (وضع الاختبار)');
        // تأخير قصير للتأكد من أن الرسالة تظهر
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
        return;
      }

      await signIn(email, password);
      toast.success('تم تسجيل الدخول بنجاح');
      router.push('/dashboard');
    } catch (error: unknown) {
      console.error('Sign in error:', error);
      
      // معالجة أفضل للأخطاء
      let errorMessage = 'حدث خطأ في تسجيل الدخول';
      
      const err = error as { code?: string; message?: string };
      
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'البريد الإلكتروني غير مسجل';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'كلمة المرور غير صحيحة';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'البريد الإلكتروني غير صحيح';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'تم تجاوز عدد المحاولات، حاول لاحقاً';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-2xl border-0 rounded-2xl overflow-hidden">
        <CardHeader className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Store className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl text-white">{t('signIn')}</CardTitle>
          <CardDescription className="text-indigo-100">
            سجل دخولك للوصول إلى لوحة التحكم
          </CardDescription>
          
          {/* معلومات الاختبار */}
          <div className="mt-4 p-3 bg-white/20 rounded-lg backdrop-blur-sm">
            <p className="text-sm text-white font-medium">بيانات الاختبار:</p>
            <p className="text-xs text-indigo-100">البريد: test@example.com</p>
            <p className="text-xs text-indigo-100">كلمة المرور: 123456</p>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="أدخل بريدك الإلكتروني"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 text-white" disabled={loading}>
              {loading ? t('loading') : t('signIn')}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ليس لديك حساب؟{' '}
              <Link href="/auth/signup" className="text-primary hover:underline">
                {t('signUp')}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 