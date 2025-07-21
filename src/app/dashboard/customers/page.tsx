"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ShoppingCart, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import { getOrders } from '@/lib/firebase-services';
import type { Order, Customer } from '@/types';

// ترجمة النصوص بجميع اللغات
const translations = {
  en: {
    customers: "Customers",
    noCustomers: "No customers yet",
    newCustomer: "New Customer",
    phoneNumber: "Phone Number:",
    orders: "Orders:",
    totalSpent: "Total Spent:",
    lastOrder: "Last Order:",
    viewOrders: "View Orders",
    whatsapp: "WhatsApp",
    email: "Email",
    loading: "Loading...",
  },
  ar: {
    customers: "العملاء",
    noCustomers: "لا يوجد عملاء بعد",
    newCustomer: "عميل جديد",
    phoneNumber: "رقم الجوال:",
    orders: "الطلبات:",
    totalSpent: "إجمالي الإنفاق:",
    lastOrder: "آخر طلب:",
    viewOrders: "عرض الطلبات",
    whatsapp: "واتساب",
    email: "إيميل",
    loading: "جاري التحميل...",
  },
  es: {
    customers: "Clientes",
    noCustomers: "Aún no hay clientes",
    newCustomer: "Cliente Nuevo",
    phoneNumber: "Número de Teléfono:",
    orders: "Pedidos:",
    totalSpent: "Gasto Total:",
    lastOrder: "Último Pedido:",
    viewOrders: "Ver Pedidos",
    whatsapp: "WhatsApp",
    email: "Correo",
    loading: "Cargando...",
  },
  de: {
    customers: "Kunden",
    noCustomers: "Noch keine Kunden",
    newCustomer: "Neuer Kunde",
    phoneNumber: "Telefonnummer:",
    orders: "Bestellungen:",
    totalSpent: "Gesamtausgaben:",
    lastOrder: "Letzte Bestellung:",
    viewOrders: "Bestellungen anzeigen",
    whatsapp: "WhatsApp",
    email: "E-Mail",
    loading: "Laden...",
  },
  fr: {
    customers: "Clients",
    noCustomers: "Aucun client pour l'instant",
    newCustomer: "Nouveau Client",
    phoneNumber: "Numéro de Téléphone:",
    orders: "Commandes:",
    totalSpent: "Dépenses Totales:",
    lastOrder: "Dernière Commande:",
    viewOrders: "Voir les Commandes",
    whatsapp: "WhatsApp",
    email: "E-mail",
    loading: "Chargement...",
  },
  it: {
    customers: "Clienti",
    noCustomers: "Nessun cliente ancora",
    newCustomer: "Nuovo Cliente",
    phoneNumber: "Numero di Telefono:",
    orders: "Ordini:",
    totalSpent: "Spesa Totale:",
    lastOrder: "Ultimo Ordine:",
    viewOrders: "Visualizza Ordini",
    whatsapp: "WhatsApp",
    email: "Email",
    loading: "Caricamento...",
  },
  pt: {
    customers: "Clientes",
    noCustomers: "Ainda não há clientes",
    newCustomer: "Novo Cliente",
    phoneNumber: "Número de Telefone:",
    orders: "Pedidos:",
    totalSpent: "Gasto Total:",
    lastOrder: "Último Pedido:",
    viewOrders: "Ver Pedidos",
    whatsapp: "WhatsApp",
    email: "Email",
    loading: "Carregando...",
  },
  ru: {
    customers: "Клиенты",
    noCustomers: "Пока нет клиентов",
    newCustomer: "Новый клиент",
    phoneNumber: "Номер телефона:",
    orders: "Заказы:",
    totalSpent: "Общие расходы:",
    lastOrder: "Последний заказ:",
    viewOrders: "Просмотр заказов",
    whatsapp: "WhatsApp",
    email: "Эл. почта",
    loading: "Загрузка...",
  },
  zh: {
    customers: "客户",
    noCustomers: "暂无客户",
    newCustomer: "新客户",
    phoneNumber: "电话号码:",
    orders: "订单:",
    totalSpent: "总支出:",
    lastOrder: "最后一单:",
    viewOrders: "查看订单",
    whatsapp: "WhatsApp",
    email: "邮箱",
    loading: "加载中...",
  },
  ja: {
    customers: "顧客",
    noCustomers: "まだ顧客がいません",
    newCustomer: "新規顧客",
    phoneNumber: "電話番号:",
    orders: "注文:",
    totalSpent: "総支出:",
    lastOrder: "最後の注文:",
    viewOrders: "注文を表示",
    whatsapp: "WhatsApp",
    email: "メール",
    loading: "読み込み中...",
  },
  tr: {
    customers: "Müşteriler",
    noCustomers: "Henüz müşteri yok",
    newCustomer: "Yeni Müşteri",
    phoneNumber: "Telefon Numarası:",
    orders: "Siparişler:",
    totalSpent: "Toplam Harcama:",
    lastOrder: "Son Sipariş:",
    viewOrders: "Siparişleri Görüntüle",
    whatsapp: "WhatsApp",
    email: "E-posta",
    loading: "Yükleniyor...",
  },
  hi: {
    customers: "ग्राहक",
    noCustomers: "अभी तक कोई ग्राहक नहीं",
    newCustomer: "नया ग्राहक",
    phoneNumber: "फ़ोन नंबर:",
    orders: "आदेश:",
    totalSpent: "कुल खर्च:",
    lastOrder: "अंतिम आदेश:",
    viewOrders: "आदेश देखें",
    whatsapp: "WhatsApp",
    email: "ईमेल",
    loading: "लोड हो रहा है...",
  },
  id: {
    customers: "Pelanggan",
    noCustomers: "Belum ada pelanggan",
    newCustomer: "Pelanggan Baru",
    phoneNumber: "Nomor Telepon:",
    orders: "Pesanan:",
    totalSpent: "Total Pengeluaran:",
    lastOrder: "Pesanan Terakhir:",
    viewOrders: "Lihat Pesanan",
    whatsapp: "WhatsApp",
    email: "Email",
    loading: "Memuat...",
  },
  ko: {
    customers: "고객",
    noCustomers: "아직 고객이 없습니다",
    newCustomer: "신규 고객",
    phoneNumber: "전화번호:",
    orders: "주문:",
    totalSpent: "총 지출:",
    lastOrder: "마지막 주문:",
    viewOrders: "주문 보기",
    whatsapp: "WhatsApp",
    email: "이메일",
    loading: "로드 중...",
  },
  nl: {
    customers: "Klanten",
    noCustomers: "Nog geen klanten",
    newCustomer: "Nieuwe Klant",
    phoneNumber: "Telefoonnummer:",
    orders: "Bestellingen:",
    totalSpent: "Totale Uitgaven:",
    lastOrder: "Laatste Bestelling:",
    viewOrders: "Bestellingen Bekijken",
    whatsapp: "WhatsApp",
    email: "E-mail",
    loading: "Laden...",
  },
  pl: {
    customers: "Klienci",
    noCustomers: "Brak klientów",
    newCustomer: "Nowy Klient",
    phoneNumber: "Numer Telefonu:",
    orders: "Zamówienia:",
    totalSpent: "Całkowite Wydatki:",
    lastOrder: "Ostatnie Zamówienie:",
    viewOrders: "Zobacz Zamówienia",
    whatsapp: "WhatsApp",
    email: "E-mail",
    loading: "Ładowanie...",
  },
};

export default function CustomersPage() {
  const { user } = useAuth();
  const [lang, setLang] = useState<keyof typeof translations>('en');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: string) => translations[lang]?.[key as keyof typeof translations[typeof lang]] || translations.en[key as keyof typeof translations.en] || key;

  useEffect(() => {
    if (user) loadCustomersFromOrders();
  }, [user]);

  const loadCustomersFromOrders = async () => {
    if (!user) {
      setCustomers([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const orders: Order[] = await getOrders(user.uid);
      // بناء العملاء من الطلبات
      const customersMap = new Map<string, Customer>();
      orders.forEach((order) => {
        const key = order.customerEmail || order.customerPhone || order.customerName;
        if (!customersMap.has(key)) {
          customersMap.set(key, {
            id: key,
            name: order.customerName,
            email: order.customerEmail,
            phone: order.customerPhone,
            totalOrders: 1,
            totalSpent: order.total,
            lastOrderDate: order.createdAt,
            address: order.customerAddress,
            createdAt: order.createdAt,
          });
        } else {
          const existing = customersMap.get(key)!;
          existing.totalOrders += 1;
          existing.totalSpent += order.total;
          if (!existing.lastOrderDate || order.createdAt > existing.lastOrderDate) {
            existing.lastOrderDate = order.createdAt;
          }
        }
      });
      setCustomers(Array.from(customersMap.values()));
    } catch (error) {
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-primary text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">{t('customers')}</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={lang}
                onChange={e => setLang(e.target.value as keyof typeof translations)}
                className="border rounded-md px-3 py-2 bg-white text-gray-900"
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
                <option value="es">Español</option>
                <option value="de">Deutsch</option>
                <option value="fr">Français</option>
                <option value="it">Italiano</option>
                <option value="pt">Português</option>
                <option value="ru">Русский</option>
                <option value="zh">中文</option>
                <option value="ja">日本語</option>
                <option value="tr">Türkçe</option>
                <option value="hi">हिन्दी</option>
                <option value="id">Bahasa Indonesia</option>
                <option value="ko">한국어</option>
                <option value="nl">Nederlands</option>
                <option value="pl">Polski</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {customers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">{t('noCustomers')}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customers.map((customer) => (
              <Card key={customer.id} className="hover-lift shadow-glow">
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-indigo-700" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      {customer.name}
                      {customer.totalOrders === 1 && (
                        <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{t('newCustomer')}</span>
                      )}
                    </CardTitle>
                    {customer.email && (
                      <CardDescription className="text-xs text-gray-500">{customer.email}</CardDescription>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-gray-700">{t('phoneNumber')}</span>
                      <span className="text-gray-900">{customer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-gray-700">{t('orders')}</span>
                      <span className="text-indigo-700 font-bold">{customer.totalOrders}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-gray-700">{t('totalSpent')}</span>
                      <span className="text-green-700 font-bold">${customer.totalSpent.toFixed(2)}</span>
                    </div>
                    {customer.lastOrderDate && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-gray-700">{t('lastOrder')}</span>
                        <span className="text-gray-600">{new Date(customer.lastOrderDate).toLocaleDateString('ar-EG')}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Link href={`/dashboard/orders?customer=${encodeURIComponent(customer.email || customer.phone || customer.name)}`}>
                      <Button size="sm" variant="outline" className="flex items-center gap-1 text-indigo-700 border-indigo-300">
                        <ShoppingCart className="h-4 w-4" />
                        {t('viewOrders')}
                      </Button>
                    </Link>
                    {customer.phone && (
                      <a href={`https://wa.me/${customer.phone.replace(/[^\d]/g, '')}`} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline" className="flex items-center gap-1 text-green-700 border-green-300">
                          <Phone className="h-4 w-4" />
                          {t('whatsapp')}
                        </Button>
                      </a>
                    )}
                    {customer.email && (
                      <a href={`mailto:${customer.email}`} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline" className="flex items-center gap-1 text-blue-700 border-blue-300">
                          <Mail className="h-4 w-4" />
                          {t('email')}
                        </Button>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 