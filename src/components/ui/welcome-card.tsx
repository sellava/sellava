import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { CheckCircle, ArrowRight, Store, Package, ShoppingCart, Settings } from 'lucide-react';
import Link from 'next/link';

interface WelcomeCardProps {
  isNewUser?: boolean;
  completedSteps?: string[];
}

const steps = [
  {
    id: 'store',
    title: 'إعداد المتجر',
    description: 'أضف معلومات متجرك الأساسية',
    icon: Store,
    href: '/dashboard/settings/general',
  },
  {
    id: 'products',
    title: 'إضافة المنتجات',
    description: 'ابدأ بإضافة منتجاتك الأولى',
    icon: Package,
    href: '/dashboard/products/add',
  },
  {
    id: 'customization',
    title: 'تخصيص المتجر',
    description: 'أضف معلومات التواصل والتوصيل',
    icon: Settings,
    href: '/dashboard/settings/general',
  },
  {
    id: 'first-order',
    title: 'استقبال أول طلب',
    description: 'انتظر أول طلب من العملاء',
    icon: ShoppingCart,
    href: '/dashboard/orders',
  },
];

export function WelcomeCard({ 
  isNewUser = false, 
  completedSteps = [] 
}: WelcomeCardProps) {
  if (!isNewUser) {
    return null;
  }

  const completedCount = completedSteps.length;
  const totalSteps = steps.length;

  return (
    <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
      <CardHeader>
        <CardTitle className="flex items-center text-indigo-900">
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-indigo-600 font-bold">🎉</span>
          </div>
          مرحباً بك في Sellava!
        </CardTitle>
        <CardDescription className="text-indigo-700">
          دعنا نبدأ بإعداد متجرك الإلكتروني. أكمل الخطوات التالية للبدء:
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step) => {
            const isCompleted = completedSteps.includes(step.id);
            const Icon = step.icon;
            
            return (
              <div
                key={step.id}
                className={`flex items-center p-3 rounded-lg border transition-colors ${
                  isCompleted
                    ? 'bg-green-50 border-green-200'
                    : 'bg-white border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                  isCompleted ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Icon className="h-5 w-5 text-gray-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className={`font-medium ${
                    isCompleted ? 'text-green-900' : 'text-gray-900'
                  }`}>
                    {step.title}
                  </h4>
                  <p className={`text-sm ${
                    isCompleted ? 'text-green-700' : 'text-gray-600'
                  }`}>
                    {step.description}
                  </p>
                </div>
                {!isCompleted && (
                  <Link href={step.href}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-indigo-600 hover:text-indigo-700"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 pt-4 border-t border-indigo-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-indigo-700">
              التقدم: {completedCount} من {totalSteps}
            </span>
            <div className="w-24 h-2 bg-indigo-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${(completedCount / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 