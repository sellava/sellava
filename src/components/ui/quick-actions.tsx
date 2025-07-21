import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Plus, Package, ShoppingCart, Settings, Store, Users } from 'lucide-react';
import Link from 'next/link';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    id: 'add-product',
    title: 'إضافة منتج',
    description: 'أضف منتج جديد إلى متجرك',
    icon: Plus,
    href: '/dashboard/products/add',
    color: 'bg-green-500 hover:bg-green-600',
  },
  {
    id: 'view-products',
    title: 'إدارة المنتجات',
    description: 'عرض وتعديل منتجاتك',
    icon: Package,
    href: '/dashboard/products',
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    id: 'view-orders',
    title: 'الطلبات',
    description: 'عرض وإدارة طلبات العملاء',
    icon: ShoppingCart,
    href: '/dashboard/orders',
    color: 'bg-purple-500 hover:bg-purple-600',
  },
  {
    id: 'view-customers',
    title: 'العملاء',
    description: 'عرض معلومات العملاء',
    icon: Users,
    href: '/dashboard/customers',
    color: 'bg-indigo-500 hover:bg-indigo-600',
  },
  {
    id: 'store-settings',
    title: 'إعدادات المتجر',
    description: 'تخصيص إعدادات متجرك',
    icon: Settings,
    href: '/dashboard/settings/general',
    color: 'bg-orange-500 hover:bg-orange-600',
  },
  {
    id: 'view-store',
    title: 'عرض المتجر',
    description: 'شاهد متجرك كما يراه العملاء',
    icon: Store,
    href: `/public-store/${typeof window !== 'undefined' ? localStorage.getItem('current_user_id') || 'default' : 'default'}`,
    color: 'bg-pink-500 hover:bg-pink-600',
  },
];

interface QuickActionsProps {
  className?: string;
}

export function QuickActions({ className = '' }: QuickActionsProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mr-2">
            <span className="text-indigo-600 text-sm font-bold">⚡</span>
          </div>
          الإجراءات السريعة
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.id} href={action.href}>
                <Button
                  variant="outline"
                  className="w-full h-auto p-4 flex flex-col items-center space-y-2 hover:shadow-md transition-all duration-200 border-gray-200 hover:border-gray-300"
                >
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-900">{action.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                  </div>
                </Button>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
} 