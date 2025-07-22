'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Store, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  Plus, 
  TrendingUp,
  DollarSign,
  LogOut,
  CheckCircle,
  Edit,
  Trash2,
  Phone,
  Mail,
  CreditCard
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { getStore, getProducts, getOrders, getCustomers, createStore, deleteProduct } from '@/lib/firebase-services';
import type { Store as StoreType, Product, Order, Customer, User, Coupon } from '@/types';

// --- الترجمة ---
const translations: Record<string, Record<string, string>> = {
  en: {
    dashboardTitle: 'Sellava Dashboard',
    testMode: 'Test Mode:',
    testModeMsg: 'Fake images will be used instead of real uploads. Changes are saved locally in the browser.',
    welcomeTestUser: 'Welcome to test mode! 🎉',
    testUserMsg: 'You are now in test mode. Explore all features without Firebase setup. Orders and customers are saved in Firebase and will appear here.',
    welcomeNewUser: 'Welcome to Sellava! 🎉',
    newUserMsg: 'Welcome to Sellava platform! To start using your store, click "Create and view store" above.',
    finalStep: 'Final step! 🚀',
    finalStepMsg: 'Your account has been created successfully! To activate the paid plan and access all advanced features, click "Activate paid plan" below.',
    products: 'Products',
    addProduct: 'Add Product',
    noProductsMessage: 'No products yet.',
    delete: 'Delete',
    edit: 'Edit',
    orders: 'Orders',
    customers: 'Customers',
    coupons: 'Coupons',
    addCoupon: 'Add Coupon',
    settings: 'Settings',
    generalSettings: 'Basic Store Settings',
    deliverySettings: 'Delivery & Shipping Settings',
    contactSettings: 'Customer Contact Info',
    aiSettings: 'AI Settings',
    paymentSettings: 'Payment Settings',
    currentPlanDetails: 'Current Plan Details',
    premiumFeature: 'Premium feature',
    upgradePlan: 'Upgrade to paid plan',
    totalProducts: 'Total products in store',
    totalOrders: 'Total orders',
    pendingOrders: 'Pending orders',
    completedOrders: 'Completed',
    totalRevenue: 'Total Revenue',
    yourPlan: 'Your plan:',
    paidPlan: 'Paid',
    freePlan: 'Free',
    monthlyCost: '15 USD/month',
    freeCost: '0 USD/month',
    activated: '✅ Activated',
    pendingPayment: '⏳ Pending payment',
    inDevelopment: '🔄 Under development',
    noCustomersMessage: 'No customers yet.',
    productInStock: 'In stock',
    productOutOfStock: 'Out of stock',
    logout: 'Logout',
    viewOrders: 'View Orders',
    note: 'Note:',
    refreshData: 'Refresh Data',
    noOrdersYet: 'No orders yet',
    startSelling: 'Start Selling',
    newCustomer: 'New Customer',
    phone: 'Phone',
    totalSpent: 'Total Spent',
    lastOrder: 'Last Order',
    whatsapp: 'WhatsApp',
    email: 'Email',
    freeCouponMessage: 'Get a free coupon',
    noActiveCoupons: 'No active coupons',
    discountPercentage: 'Discount Percentage',
    validUntil: 'Valid Until',
    maxUsage: 'Max Usage',
    uses: 'uses',
    usageCount: 'Usage Count',
    active: 'Active',
    planType: 'Plan Type',
    aiDescription: 'AI Description',
    pwaDescription: 'PWA Description',
    domainDescription: 'Domain Description',
    whatsappInstagram: 'WhatsApp/Instagram',
    enabled: 'Enabled',
    disabled: 'Disabled',
    googleAnalytics: 'Google Analytics',
    liveSupport: 'Live Support',
    basicStore: 'Basic Store',
    subdomainFree: 'Subdomain Free',
    limitedFeatures: 'Limited Features',
    emailSupport: 'Email Support',
    getAdvancedFeatures: 'Get Advanced Features',
    monthlyPlan: 'Monthly Plan',
    sixMonthsPlan: '6 Months Plan',
    yearlyPlan: 'Yearly Plan',
    subscriptionExpires: 'Subscription expires',
    subscriptionActive: 'Active',
    subscriptionExpired: 'Expired',
    daysRemaining: 'days remaining',
    subscriptionDetails: 'Subscription Details',
    planDuration: 'Duration',
    planPrice: 'Price',
    planStatus: 'Status',
  },
  ar: {
    dashboardTitle: 'لوحة تحكم سيللافا',
    testMode: 'وضع الاختبار:',
    testModeMsg: 'سيتم استخدام صور وهمية بدلاً من التحميل الحقيقي. التغييرات تُحفظ محلياً في المتصفح.',
    welcomeTestUser: 'مرحباً بك في وضع الاختبار! 🎉',
    testUserMsg: 'أنت الآن في وضع الاختبار. استكشاف جميع الميزات بدون إعداد Firebase. الطلبات والعملاء تُحفظ في Firebase وستظهر هنا.',
    welcomeNewUser: 'مرحباً بك في سيللافا! 🎉',
    newUserMsg: 'مرحباً بك في منصة سيللافا! لبدء استخدام متجرك، اضغط على "إنشاء وعرض المتجر" أعلاه.',
    finalStep: 'الخطوة الأخيرة! 🚀',
    finalStepMsg: 'تم إنشاء حسابك بنجاح! لتفعيل الخطة المدفوعة والوصول إلى جميع الميزات المتقدمة، اضغط على "تفعيل الخطة المدفوعة" أدناه.',
    products: 'المنتجات',
    addProduct: 'إضافة منتج',
    noProductsMessage: 'لا توجد منتجات بعد.',
    delete: 'حذف',
    edit: 'تعديل',
    orders: 'الطلبات',
    customers: 'العملاء',
    coupons: 'الكوبونات',
    addCoupon: 'إضافة كوبون',
    settings: 'الإعدادات',
    generalSettings: 'إعدادات المتجر الأساسية',
    deliverySettings: 'إعدادات التوصيل والشحن',
    contactSettings: 'معلومات التواصل مع العملاء',
    aiSettings: 'إعدادات الذكاء الاصطناعي',
    paymentSettings: 'إعدادات الدفع',
    currentPlanDetails: 'تفاصيل الخطة الحالية',
    premiumFeature: 'ميزة مميزة',
    upgradePlan: 'ترقية إلى الخطة المدفوعة',
    totalProducts: 'إجمالي المنتجات',
    totalOrders: 'إجمالي الطلبات',
    pendingOrders: 'طلبات قيد الانتظار',
    completedOrders: 'مكتملة',
    totalRevenue: 'الإيرادات الكلية',
    yourPlan: 'خطتك:',
    paidPlan: 'مدفوعة',
    freePlan: 'مجانية',
    monthlyCost: '15 دولار شهرياً',
    freeCost: '0 دولار شهرياً',
    activated: '✅ مفعلة',
    pendingPayment: '⏳ في انتظار الدفع',
    inDevelopment: '🔄 تحت التطوير',
    noCustomersMessage: 'لا يوجد عملاء بعد.',
    productInStock: 'متوفر',
    productOutOfStock: 'غير متوفر',
    logout: 'تسجيل الخروج',
    viewOrders: 'عرض الطلبات',
    note: 'ملاحظة:',
    refreshData: 'تحديث البيانات',
    noOrdersYet: 'لا توجد طلبات بعد',
    startSelling: 'بدء البيع',
    newCustomer: 'عميل جديد',
    phone: 'الهاتف',
    totalSpent: 'المبلغ المدفوع',
    lastOrder: 'آخر طلب',
    whatsapp: 'واتساب',
    email: 'البريد الإلكتروني',
    freeCouponMessage: 'احصل على كوبون مجاني',
    noActiveCoupons: 'لا توجد كوبونات مفعلة',
    discountPercentage: 'نسبة الخصم',
    validUntil: 'حتى تاريخ',
    maxUsage: 'الحد الأقصى للاستخدام',
    uses: 'مرات استخدام',
    usageCount: 'عدد الاستخدامات',
    active: 'مفعل',
    planType: 'نوع الخطة',
    aiDescription: 'وصف الذكاء الاصطناعي',
    pwaDescription: 'وصف PWA',
    domainDescription: 'وصف النطاق',
    whatsappInstagram: 'واتساب/انستغرام',
    enabled: 'مفعل',
    disabled: 'غير مفعل',
    googleAnalytics: 'اناليتك آناليتك',
    liveSupport: 'دعم حي',
    basicStore: 'متجر بسيط',
    subdomainFree: 'نطاق مجاني',
    limitedFeatures: 'ميزات مقتصرة',
    emailSupport: 'دعم البريد الإلكتروني',
    getAdvancedFeatures: 'الوصول إلى الميزات المتقدمة',
    monthlyPlan: 'خطة شهرية',
    sixMonthsPlan: 'خطة 6 أشهر',
    yearlyPlan: 'خطة سنوية',
    subscriptionExpires: 'ينتهي الاشتراك',
    subscriptionActive: 'مفعل',
    subscriptionExpired: 'منتهي الصلاحية',
    daysRemaining: 'أيام متبقية',
    subscriptionDetails: 'تفاصيل الاشتراك',
    planDuration: 'المدة',
    planPrice: 'السعر',
    planStatus: 'الحالة',
  },
  es: {
    dashboardTitle: 'Panel de Control Sellava',
    testMode: 'Modo de prueba:',
    testModeMsg: 'Se usarán imágenes falsas en lugar de cargas reales. Los cambios se guardan localmente en el navegador.',
    welcomeTestUser: '¡Bienvenido al modo de prueba! 🎉',
    testUserMsg: 'Ahora estás en modo de prueba. Explora todas las funciones sin configurar Firebase. Pedidos y clientes se guardan en Firebase y aparecerán aquí.',
    welcomeNewUser: '¡Bienvenido a Sellava! 🎉',
    newUserMsg: '¡Bienvenido a la plataforma Sellava! Para comenzar a usar tu tienda, haz clic en "Crear y ver tienda" arriba.',
    finalStep: '¡Último paso! 🚀',
    finalStepMsg: '¡Tu cuenta ha sido creada con éxito! Para activar el plan de pago y acceder a todas las funciones avanzadas, haz clic en "Activar plan de pago" abajo.',
    products: 'Productos',
    addProduct: 'Agregar Producto',
    noProductsMessage: 'Aún no hay productos.',
    delete: 'Eliminar',
    edit: 'Editar',
    orders: 'Pedidos',
    customers: 'Clientes',
    coupons: 'Cupones',
    addCoupon: 'Agregar Cupón',
    settings: 'Configuraciones',
    generalSettings: 'Configuraciones básicas de tienda',
    deliverySettings: 'Configuraciones de entrega y envío',
    contactSettings: 'Información de contacto con clientes',
    aiSettings: 'Configuraciones de IA',
    paymentSettings: 'Configuraciones de Pago',
    currentPlanDetails: 'Detalles del plan actual',
    premiumFeature: 'Función premium',
    upgradePlan: 'Actualizar a plan de pago',
    totalProducts: 'Total de productos',
    totalOrders: 'Total de pedidos',
    pendingOrders: 'Pedidos pendientes',
    completedOrders: 'Completados',
    totalRevenue: 'Ingresos totales',
    yourPlan: 'Tu plan:',
    paidPlan: 'Pago',
    freePlan: 'Gratis',
    monthlyCost: '15 USD/mes',
    freeCost: '0 USD/mes',
    activated: '✅ Activado',
    pendingPayment: '⏳ Pendiente de pago',
    inDevelopment: '🔄 En desarrollo',
    noCustomersMessage: 'No hay clientes aún.',
    productInStock: 'En stock',
    productOutOfStock: 'Agotado',
    logout: 'Cerrar sesión',
    viewOrders: 'Ver pedidos',
    note: 'Nota:',
    refreshData: 'Actualizar datos',
    noOrdersYet: 'Aún no hay pedidos',
    startSelling: 'Comenzar a vender',
    newCustomer: 'Nuevo cliente',
    phone: 'Teléfono',
    totalSpent: 'Total gastado',
    lastOrder: 'Último pedido',
    whatsapp: 'WhatsApp',
    email: 'Correo electrónico',
    freeCouponMessage: 'Obtén un cupón gratis',
    noActiveCoupons: 'No hay cupones activos',
    discountPercentage: 'Porcentaje de descuento',
    validUntil: 'Válido hasta',
    maxUsage: 'Uso máximo',
    uses: 'usados',
    usageCount: 'Cantidad de uso',
    active: 'Activo',
    planType: 'Tipo de plan',
    aiDescription: 'Descripción de IA',
    pwaDescription: 'Descripción PWA',
    domainDescription: 'Descripción de dominio',
    whatsappInstagram: 'WhatsApp/Instagram',
    enabled: 'Habilitado',
    disabled: 'Deshabilitado',
    googleAnalytics: 'Google Analytics',
    liveSupport: 'Soporte en vivo',
    basicStore: 'Tienda básica',
    subdomainFree: 'Subdominio gratis',
    limitedFeatures: 'Características limitadas',
    emailSupport: 'Soporte de correo electrónico',
    getAdvancedFeatures: 'Acceder a características avanzadas',
    monthlyPlan: 'Plan Mensual',
    sixMonthsPlan: 'Plan de 6 Meses',
    yearlyPlan: 'Plan Anual',
    subscriptionExpires: 'Vence',
    subscriptionActive: 'Activo',
    subscriptionExpired: 'Vencido',
    daysRemaining: 'días restantes',
    subscriptionDetails: 'Detalles de suscripción',
    planDuration: 'Duración',
    planPrice: 'Precio',
    planStatus: 'Estado',
  },
  de: {
    dashboardTitle: 'Sellava Dashboard',
    testMode: 'Testmodus:',
    testModeMsg: 'Falsche Bilder werden anstelle echter Uploads verwendet. Änderungen werden lokal im Browser gespeichert.',
    welcomeTestUser: 'Willkommen im Testmodus! 🎉',
    testUserMsg: 'Sie sind jetzt im Testmodus. Erkunden Sie alle Funktionen ohne Firebase-Einrichtung. Bestellungen und Kunden werden in Firebase gespeichert und erscheinen hier.',
    welcomeNewUser: 'Willkommen bei Sellava! 🎉',
    newUserMsg: 'Willkommen bei der Sellava Plattform! Um Ihren Shop zu starten, klicken Sie auf "Shop erstellen und anzeigen" oben.',
    finalStep: 'Letzter Schritt! 🚀',
    finalStepMsg: 'Ihr Konto wurde erfolgreich erstellt! Um den bezahlten Plan zu aktivieren und alle erweiterten Funktionen zu nutzen, klicken Sie unten auf "Bezahlten Plan aktivieren".',
    products: 'Produkte',
    addProduct: 'Produkt hinzufügen',
    noProductsMessage: 'Noch keine Produkte.',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    orders: 'Bestellungen',
    customers: 'Kunden',
    coupons: 'Gutscheine',
    addCoupon: 'Gutschein hinzufügen',
    settings: 'Einstellungen',
    generalSettings: 'Grundlegende Shop-Einstellungen',
    deliverySettings: 'Liefer- & Versand-Einstellungen',
    contactSettings: 'Kundenkontaktinformationen',
    aiSettings: 'KI-Einstellungen',
    paymentSettings: 'Zahlungseinstellungen',
    currentPlanDetails: 'Details zum aktuellen Plan',
    premiumFeature: 'Premium-Funktion',
    upgradePlan: 'Auf bezahlten Plan upgraden',
    totalProducts: 'Gesamtprodukte im Shop',
    totalOrders: 'Gesamtbestellungen',
    pendingOrders: 'Ausstehende Bestellungen',
    completedOrders: 'Abgeschlossen',
    totalRevenue: 'Gesamtumsatz',
    yourPlan: 'Ihr Plan:',
    paidPlan: 'Bezahlt',
    freePlan: 'Kostenlos',
    monthlyCost: '15 USD/Monat',
    freeCost: '0 USD/Monat',
    activated: '✅ Aktiviert',
    pendingPayment: '⏳ Ausstehende Zahlung',
    inDevelopment: '🔄 In Entwicklung',
    noCustomersMessage: 'Noch keine Kunden.',
    productInStock: 'Auf Lager',
    productOutOfStock: 'Rupture de stock',
    logout: 'Abmelden',
    viewOrders: 'Bestellungen anzeigen',
    note: 'Hinweis:',
    refreshData: 'Daten aktualisieren',
    noOrdersYet: 'Noch keine Bestellungen',
    startSelling: 'Verkauf starten',
    newCustomer: 'Neuer Kunde',
    phone: 'Telefon',
    totalSpent: 'Gesamtausgaben',
    lastOrder: 'Letzte Bestellung',
    whatsapp: 'WhatsApp',
    email: 'E-Mail',
    freeCouponMessage: 'Einen kostenlosen Gutschein erhalten',
    noActiveCoupons: 'Keine aktiven Gutscheine',
    discountPercentage: 'Rabattprozent',
    validUntil: 'Gültig bis',
    maxUsage: 'Maximaler Verwendungszweck',
    uses: 'verwendet',
    usageCount: 'Verwendungszähler',
    active: 'Aktiv',
    planType: 'Planart',
    aiDescription: 'AI-Beschreibung',
    pwaDescription: 'PWA-Beschreibung',
    domainDescription: 'Domain-Beschreibung',
    whatsappInstagram: 'WhatsApp/Instagram',
    enabled: 'Aktiviert',
    disabled: 'Deaktiviert',
    googleAnalytics: 'Google Analytics',
    liveSupport: 'Live-Support',
    basicStore: 'Einfache Geschäftseinrichtung',
    subdomainFree: 'Subdomain kostenlos',
    limitedFeatures: 'Eingeschränkte Funktionen',
    emailSupport: 'E-Mail-Support',
    getAdvancedFeatures: 'Erweiterte Funktionen erhalten',
    monthlyPlan: 'Monatliche Plan',
    sixMonthsPlan: '6-Monats-Plan',
    yearlyPlan: 'Jährlicher Plan',
    subscriptionExpires: 'Abonnementsduur',
    subscriptionActive: 'Actief',
    subscriptionExpired: 'Afgelopen',
    daysRemaining: 'Dagen resterend',
    subscriptionDetails: 'Abonnementsdetails',
    planDuration: 'Dauer',
    planPrice: 'Preis',
    planStatus: 'Status',
  },
  fr: {
    dashboardTitle: 'Tableau de Bord Sellava',
    testMode: 'Mode de test:',
    testModeMsg: 'De fausses images seront utilisées à la place des téléchargements réels. Les modifications sont enregistrées localement dans le navigateur.',
    welcomeTestUser: 'Bienvenue en mode test! 🎉',
    testUserMsg: 'Vous êtes maintenant en mode test. Explorez toutes les fonctionnalités sans configuration Firebase. Les commandes et clients sont enregistrés dans Firebase et apparaîtront ici.',
    welcomeNewUser: 'Bienvenue sur Sellava! 🎉',
    newUserMsg: 'Bienvenue sur la plateforme Sellava! Pour commencer à utiliser votre boutique, cliquez sur "Créer et voir la boutique" en haut.',
    finalStep: 'Dernière étape! 🚀',
    finalStepMsg: 'Votre compte a été créé avec succès! Pour activer le plan payant et accéder à toutes les fonctionnalités avancées, cliquez sur "Activer le plan payant" ci-dessous.',
    products: 'Produits',
    addProduct: 'Ajouter un produit',
    noProductsMessage: 'Pas encore de produits.',
    delete: 'Supprimer',
    edit: 'Modifier',
    orders: 'Commandes',
    customers: 'Clients',
    coupons: 'Coupons',
    addCoupon: 'Ajouter un coupon',
    settings: 'Paramètres',
    generalSettings: 'Paramètres généraux du magasin',
    deliverySettings: 'Paramètres de livraison & expédition',
    contactSettings: 'Infos contact client',
    aiSettings: 'Paramètres IA',
    paymentSettings: 'Paramètres de Paiement',
    currentPlanDetails: 'Détails du plan actuel',
    premiumFeature: 'Fonction premium',
    upgradePlan: 'Passer au plan payant',
    totalProducts: 'Total des produits',
    totalOrders: 'Total des commandes',
    pendingOrders: 'Commandes en attente',
    completedOrders: 'Terminées',
    totalRevenue: 'Revenu total',
    yourPlan: 'Votre plan:',
    paidPlan: 'Payant',
    freePlan: 'Gratuit',
    monthlyCost: '15 USD/mois',
    freeCost: '0 USD/mois',
    activated: '✅ Activé',
    pendingPayment: '⏳ En attente de paiement',
    inDevelopment: '🔄 En développement',
    noCustomersMessage: 'Pas encore de clients.',
    productInStock: 'En stock',
    productOutOfStock: 'Rupture de stock',
    logout: 'Déconnexion',
    viewOrders: 'Voir les commandes',
    note: 'Remarque:',
    refreshData: 'Actualiser les données',
    noOrdersYet: 'Pas encore de commandes',
    startSelling: 'Démarrer la vente',
    newCustomer: 'Nouveau client',
    phone: 'Téléphone',
    totalSpent: 'Total dépensé',
    lastOrder: 'Dernière commande',
    whatsapp: 'WhatsApp',
    email: 'E-mail',
    freeCouponMessage: 'Obtenir un coupon gratuit',
    noActiveCoupons: 'Pas encore de coupons actifs',
    discountPercentage: 'Pourcentage de réduction',
    validUntil: 'Valide jusqu\'à',
    maxUsage: 'Utilisation maximale',
    uses: 'utilisés',
    usageCount: 'Nombre d\'utilisations',
    active: 'Actif',
    planType: 'Type de plan',
    aiDescription: 'Description de l\'IA',
    pwaDescription: 'Description PWA',
    domainDescription: 'Description de domaine',
    whatsappInstagram: 'WhatsApp/Instagram',
    enabled: 'Activé',
    disabled: 'Désactivé',
    googleAnalytics: 'Google Analytics',
    liveSupport: 'Support en direct',
    basicStore: 'Magasin de base',
    subdomainFree: 'Sous-domaine gratuit',
    limitedFeatures: 'Fonctionnalités limitées',
    emailSupport: 'Support de courrier électronique',
    getAdvancedFeatures: 'Accéder aux fonctionnalités avancées',
    monthlyPlan: 'Plan Mensuel',
    sixMonthsPlan: 'Plan de 6 Mois',
    yearlyPlan: 'Plan Annuel',
    subscriptionExpires: 'Expiration',
    subscriptionActive: 'Actif',
    subscriptionExpired: 'Expiré',
    daysRemaining: 'Jours restants',
    subscriptionDetails: 'Détails de l\'abonnement',
    planDuration: 'Durée',
    planPrice: 'Prix',
    planStatus: 'Statut',
  },
  it: {
    dashboardTitle: 'Pannello di Controllo Sellava',
    testMode: 'Modalità test:',
    testModeMsg: 'Verranno utilizzate immagini fittizie al posto dei caricamenti reali. Le modifiche sono salvate localmente nel browser.',
    welcomeTestUser: 'Benvenuto in modalità test! 🎉',
    testUserMsg: 'Ora sei in modalità test. Esplora tutte le funzionalità senza configurazione Firebase. Ordini e clienti vengono salvati in Firebase e appariranno qui.',
    welcomeNewUser: 'Benvenuto su Sellava! 🎉',
    newUserMsg: 'Benvenuto sulla piattaforma Sellava! Per iniziare, clicca su "Crea e Visualizza il Negozio" in alto.',
    finalStep: 'Ultimo passo! 🚀',
    finalStepMsg: 'Il tuo account è stato creato con successo! Per attivare il piano a pagamento e accedere alle funzionalità avanzate, clicca su "Attiva Piano a Pagamento" qui sotto.',
    products: 'Prodotti',
    addProduct: 'Aggiungi prodotto',
    noProductsMessage: 'Nessun prodotto ancora.',
    delete: 'Elimina',
    edit: 'Modifica',
    orders: 'Ordini',
    customers: 'Clienti',
    coupons: 'Coupon',
    addCoupon: 'Aggiungi coupon',
    settings: 'Impostazioni',
    generalSettings: 'Impostazioni generali del negozio',
    deliverySettings: 'Impostazioni di consegna e spedizione',
    contactSettings: 'Contatti clienti',
    aiSettings: 'Impostazioni IA',
    paymentSettings: 'Impostazioni di Pagamento',
    currentPlanDetails: 'Dettagli piano attuale',
    premiumFeature: 'Funzione premium',
    upgradePlan: 'Passa al piano a pagamento',
    totalProducts: 'Totale prodotti',
    totalOrders: 'Totale ordini',
    pendingOrders: 'Ordini in sospeso',
    completedOrders: 'Completati',
    totalRevenue: 'Entrate totali',
    yourPlan: 'Il tuo piano:',
    paidPlan: 'A pagamento',
    freePlan: 'Gratuito',
    monthlyCost: '15 USD/mese',
    freeCost: '0 USD/mese',
    activated: '✅ Attivato',
    pendingPayment: '⏳ In attesa di pagamento',
    inDevelopment: '🔄 In sviluppo',
    noCustomersMessage: 'Nessun cliente ancora.',
    productInStock: 'Disponibile',
    productOutOfStock: 'Esaurito',
    logout: 'Disconnessione',
    viewOrders: 'Visualizza ordini',
    note: 'Nota:',
    refreshData: 'Aggiornare i dati',
    noOrdersYet: 'Nessun ordine ancora',
    startSelling: 'Iniziare a vendere',
    newCustomer: 'Nuovo cliente',
    phone: 'Telefono',
    totalSpent: 'Totale speso',
    lastOrder: 'Ultimo ordine',
    whatsapp: 'WhatsApp',
    email: 'E-mail',
    freeCouponMessage: 'Ottenere un coupon gratuito',
    noActiveCoupons: 'Nessun coupon attivo',
    discountPercentage: 'Percentuale di sconto',
    validUntil: 'Valido fino a',
    maxUsage: 'Massimo utilizzo',
    uses: 'usati',
    usageCount: 'Numero di utilizzo',
    active: 'Attivo',
    planType: 'Tipo di piano',
    aiDescription: 'Descrizione IA',
    pwaDescription: 'Descrizione PWA',
    domainDescription: 'Descrizione dominio',
    whatsappInstagram: 'WhatsApp/Instagram',
    enabled: 'Attivo',
    disabled: 'Disattivo',
    googleAnalytics: 'Google Analytics',
    liveSupport: 'Supporto live',
    basicStore: 'Negozio di base',
    subdomainFree: 'Sottodominio gratuito',
    limitedFeatures: 'Funzioni limitate',
    emailSupport: 'Supporto email',
    getAdvancedFeatures: 'Accedere alle funzionalità avanzate',
    monthlyPlan: 'Pianificazione Mensile',
    sixMonthsPlan: 'Pianificazione Semestrale',
    yearlyPlan: 'Pianificazione Annuale',
    subscriptionExpires: 'Scadenza',
    subscriptionActive: 'Attivo',
    subscriptionExpired: 'Scaduto',
    daysRemaining: 'Giorni rimanenti',
    subscriptionDetails: 'Dettagli abbonamento',
    planDuration: 'Durata',
    planPrice: 'Prezzo',
    planStatus: 'Stato',
  },
  pt: {
    dashboardTitle: 'Painel Sellava',
    testMode: 'Modo de teste:',
    testModeMsg: 'Imagens falsas serão usadas no lugar dos envios reais. As alterações são salvas localmente no navegador.',
    welcomeTestUser: 'Bem-vindo ao modo de teste! 🎉',
    testUserMsg: 'Você está no modo de teste. Explore todos os recursos sem configurar o Firebase. Pedidos e clientes são salvos no Firebase e aparecerão aqui.',
    welcomeNewUser: 'Bem-vindo ao Sellava! 🎉',
    newUserMsg: 'Bem-vindo à plataforma Sellava! Para começar, clique em "Criar e Ver Loja" no topo.',
    finalStep: 'Etapa final! 🚀',
    finalStepMsg: 'Sua conta foi criada com sucesso! Para ativar o plano pago e acessar recursos avançados, clique em "Ativar Plano Pago" abaixo.',
    products: 'Produtos',
    addProduct: 'Adicionar produto',
    noProductsMessage: 'Ainda não há produtos.',
    delete: 'Excluir',
    edit: 'Editar',
    orders: 'Pedidos',
    customers: 'Clientes',
    coupons: 'Cupons',
    addCoupon: 'Adicionar cupom',
    settings: 'Configurações',
    generalSettings: 'Configurações gerais da loja',
    deliverySettings: 'Configurações de entrega e envio',
    contactSettings: 'Informações de contato do cliente',
    aiSettings: 'Configurações de IA',
    paymentSettings: 'Configurações de Pagamento',
    currentPlanDetails: 'Detalhes do plano atual',
    premiumFeature: 'Recurso premium',
    upgradePlan: 'Atualizar para plano pago',
    totalProducts: 'Total de produtos',
    totalOrders: 'Total de pedidos',
    pendingOrders: 'Pedidos pendentes',
    completedOrders: 'Concluídos',
    totalRevenue: 'Receita total',
    yourPlan: 'Seu plano:',
    paidPlan: 'Pago',
    freePlan: 'Gratuito',
    monthlyCost: '15 USD/mês',
    freeCost: '0 USD/mês',
    activated: '✅ Ativado',
    pendingPayment: '⏳ Pagamento pendente',
    inDevelopment: '🔄 Em desenvolvimento',
    noCustomersMessage: 'Ainda não há clientes.',
    productInStock: 'Em estoque',
    productOutOfStock: 'Fora de estoque',
    logout: 'Logout',
    viewOrders: 'Visualizar pedidos',
    note: 'Nota:',
    refreshData: 'Atualizar dados',
    noOrdersYet: 'Ainda não há pedidos',
    startSelling: 'Começar a vender',
    newCustomer: 'Novo cliente',
    phone: 'Telefone',
    totalSpent: 'Total gasto',
    lastOrder: 'Último pedido',
    whatsapp: 'WhatsApp',
    email: 'E-mail',
    freeCouponMessage: 'Obter um cupão grátis',
    noActiveCoupons: 'Nenhum cupão ativo',
    discountPercentage: 'Porcentagem de desconto',
    validUntil: 'Válido até',
    maxUsage: 'Uso máximo',
    uses: 'usados',
    usageCount: 'Contagem de uso',
    active: 'Ativo',
    planType: 'Tipo de plano',
    aiDescription: 'Descrição IA',
    pwaDescription: 'Descrição PWA',
    domainDescription: 'Descrição de domínio',
    whatsappInstagram: 'WhatsApp/Instagram',
    enabled: 'Habilitado',
    disabled: 'Desabilitado',
    googleAnalytics: 'Google Analytics',
    liveSupport: 'Suporte ao vivo',
    basicStore: 'Loja básica',
    subdomainFree: 'Subdomínio gratuito',
    limitedFeatures: 'Funcionalidades limitadas',
    emailSupport: 'Suporte de e-mail',
    getAdvancedFeatures: 'Acessar recursos avançados',
    monthlyPlan: 'Plano Mensal',
    sixMonthsPlan: 'Plano de 6 Meses',
    yearlyPlan: 'Plano Anual',
    subscriptionExpires: 'Expiração',
    subscriptionActive: 'Ativo',
    subscriptionExpired: 'Expirado',
    daysRemaining: 'Dias restantes',
    subscriptionDetails: 'Detalhes da assinatura',
    planDuration: 'Duração',
    planPrice: 'Preço',
    planStatus: 'Status',
  },
  ru: {
    dashboardTitle: 'Панель Sellava',
    testMode: 'Тестовый режим:',
    testModeMsg: 'Вместо настоящих загрузок будут использоваться фейковые изображения. Изменения сохраняются локально в браузере.',
    welcomeTestUser: 'Добро пожаловать в тестовый режим! 🎉',
    testUserMsg: 'Вы находитесь в тестовом режиме. Изучите все функции без настройки Firebase. Заказы и клиенты сохраняются в Firebase и появятся здесь.',
    welcomeNewUser: 'Добро пожаловать в Sellava! 🎉',
    newUserMsg: 'Добро пожаловать на платформу Sellava! Чтобы начать работу с вашим магазином, нажмите "Создать и просмотреть магазин" вверху.',
    finalStep: 'Финальный шаг! 🚀',
    finalStepMsg: 'Ваш аккаунт успешно создан! Чтобы активировать платный план и получить доступ к расширенным функциям, нажмите "Активировать платный план" ниже.',
    products: 'Товары',
    addProduct: 'Добавить товар',
    noProductsMessage: 'Товаров пока нет.',
    delete: 'Удалить',
    edit: 'Редактировать',
    orders: 'Заказы',
    customers: 'Клиенты',
    coupons: 'Купоны',
    addCoupon: 'Добавить купон',
    settings: 'Настройки',
    generalSettings: 'Общие настройки магазина',
    deliverySettings: 'Настройки доставки и отправки',
    contactSettings: 'Контактная информация клиента',
    aiSettings: 'Настройки ИИ',
    currentPlanDetails: 'Детали текущего плана',
    premiumFeature: 'Премиум-функция',
    upgradePlan: 'Перейти на платный план',
    totalProducts: 'Всего товаров',
    totalOrders: 'Всего заказов',
    pendingOrders: 'Ожидающие заказы',
    completedOrders: 'Завершённые',
    totalRevenue: 'Общий доход',
    yourPlan: 'Ваш план:',
    paidPlan: 'Платный',
    freePlan: 'Бесплатный',
    monthlyCost: '15 USD/месяц',
    freeCost: '0 USD/месяц',
    activated: '✅ Активирован',
    pendingPayment: '⏳ Ожидание оплаты',
    inDevelopment: '🔄 В разработке',
    noCustomersMessage: 'Пока нет клиентов.',
    productInStock: 'В наличии',
    productOutOfStock: 'Нет в наличии',
    logout: 'Выход',
    viewOrders: 'Просмотр заказов',
    note: 'Примечание:',
    refreshData: 'Обновить данные',
    noOrdersYet: 'Пока нет заказов',
    startSelling: 'Начать продавать',
    newCustomer: 'Новый клиент',
    phone: 'Телефон',
    totalSpent: 'Общий расход',
    lastOrder: 'Последний заказ',
    whatsapp: 'WhatsApp',
    email: 'E-mail',
    freeCouponMessage: 'Получить бесплатный купон',
    noActiveCoupons: 'Нет активных купонов',
    discountPercentage: 'Процент скидки',
    validUntil: 'Действительно до',
    maxUsage: 'Максимальное использование',
    uses: 'использовано',
    usageCount: 'Количество использований',
    active: 'Активно',
    planType: 'Тип плана',
    aiDescription: 'Описание ИИ',
    pwaDescription: 'Описание PWA',
    domainDescription: 'Описание домена',
    whatsappInstagram: 'WhatsApp/Instagram',
    enabled: 'Включено',
    disabled: 'Выключено',
    googleAnalytics: 'Google Analytics',
    liveSupport: 'Поддержка в реальном времени',
    basicStore: 'Базовая торговая точка',
    subdomainFree: 'Бесплатный поддомен',
    limitedFeatures: 'Ограниченные функции',
    emailSupport: 'Поддержка по электронной почте',
    getAdvancedFeatures: 'Получить расширенные функции',
    monthlyPlan: 'Ежемесячный план',
    sixMonthsPlan: '6-месячный план',
    yearlyPlan: 'Годовой план',
    subscriptionExpires: 'Срок действия подписки',
    subscriptionActive: 'Активен',
    subscriptionExpired: 'Просрочен',
    daysRemaining: 'Осталось дней',
    subscriptionDetails: 'Детали подписки',
    planDuration: 'Продолжительность',
    planPrice: 'Цена',
    planStatus: 'Статус',
  },
  zh: {
    dashboardTitle: 'Sellava 控制台',
    testMode: '测试模式：',
    testModeMsg: '将使用虚拟图像代替真实上传。更改将保存在本地浏览器中。',
    welcomeTestUser: '欢迎进入测试模式！🎉',
    testUserMsg: '您现在处于测试模式。无需配置 Firebase 即可探索所有功能。订单和客户将保存在 Firebase 中并显示在此处。',
    welcomeNewUser: '欢迎来到 Sellava！🎉',
    newUserMsg: '欢迎使用 Sellava 平台！要开始创建商店，请点击顶部的"创建并查看商店"。',
    finalStep: '最后一步！🚀',
    finalStepMsg: '您的账户已成功创建！要激活付费计划并访问高级功能，请点击下方的"激活付费计划"。',
    products: '商品',
    addProduct: '添加商品',
    noProductsMessage: '暂无商品。',
    delete: '删除',
    edit: '编辑',
    orders: '订单',
    customers: '客户',
    coupons: '优惠券',
    addCoupon: '添加优惠券',
    settings: '设置',
    generalSettings: '商店常规设置',
    deliverySettings: '配送与运输设置',
    contactSettings: '客户联系信息',
    aiSettings: 'AI 设置',
    currentPlanDetails: '当前计划详情',
    premiumFeature: '高级功能',
    upgradePlan: '升级到付费计划',
    totalProducts: '商品总数',
    totalOrders: '订单总数',
    pendingOrders: '待处理订单',
    completedOrders: '已完成',
    totalRevenue: '总收入',
    yourPlan: '您的计划：',
    paidPlan: '付费',
    freePlan: '免费',
    monthlyCost: '15 美元/月',
    freeCost: '0 美元/月',
    activated: '✅ 已激活',
    pendingPayment: '⏳ 等待付款',
    inDevelopment: '🔄 开发中',
    noCustomersMessage: '暂无客户。',
    productInStock: '有库存',
    productOutOfStock: '缺货',
    logout: '退出',
    viewOrders: '查看订单',
    note: '注意：',
    refreshData: '刷新数据',
    noOrdersYet: '暂无订单',
    startSelling: '开始销售',
    newCustomer: '新客户',
    phone: '电话',
    totalSpent: '总支出',
    lastOrder: '最后订单',
    whatsapp: 'WhatsApp',
    email: '电子邮件',
    freeCouponMessage: '获取免费优惠券',
    noActiveCoupons: '没有激活的优惠券',
    discountPercentage: '折扣百分比',
    validUntil: '有效期至',
    maxUsage: '最大使用次数',
    uses: '使用次数',
    usageCount: '使用次数',
    active: '活跃',
    planType: '计划类型',
    aiDescription: 'AI 描述',
    pwaDescription: 'PWA 描述',
    domainDescription: '域名描述',
    whatsappInstagram: 'WhatsApp/Instagram',
    enabled: '已启用',
    disabled: '已禁用',
    googleAnalytics: 'Google Analytics',
    liveSupport: '实时支持',
    basicStore: '基础商店',
    subdomainFree: '子域名免费',
    limitedFeatures: '有限功能',
    emailSupport: '电子邮件支持',
    getAdvancedFeatures: '获取高级功能',
    monthlyPlan: '月度计划',
    sixMonthsPlan: '半年计划',
    yearlyPlan: '年度计划',
    subscriptionExpires: '订阅到期',
    subscriptionActive: '有效',
    subscriptionExpired: '已过期',
    daysRemaining: '剩余天数',
    subscriptionDetails: '订阅详情',
    planDuration: '持续时间',
    planPrice: '价格',
    planStatus: '状态',
  },
  ja: {
    dashboardTitle: 'Sellava ダッシュボード',
    testMode: 'テストモード：',
    testModeMsg: '実際のアップロードの代わりにダミー画像が使用されます。変更はブラウザにローカル保存されます。',
    welcomeTestUser: 'テストモードへようこそ！🎉',
    testUserMsg: '現在テストモードです。Firebase の設定なしですべての機能を試せます。注文と顧客情報は Firebase に保存され、ここに表示されます。',
    welcomeNewUser: 'Sellavaへようこそ！🎉',
    newUserMsg: 'Sellavaプラットフォームへようこそ！最初に「ショップを作成して表示」をクリックしてください。',
    finalStep: '最終ステップ！🚀',
    finalStepMsg: 'アカウントが正常に作成されました！有料プランを有効にして高度な機能にアクセスするには、下の「有料プランを有効にする」をクリックしてください。',
    products: '商品',
    addProduct: '商品を追加',
    noProductsMessage: '商品はまだありません。',
    delete: '削除',
    edit: '編集',
    orders: '注文',
    customers: '顧客',
    coupons: 'クーポン',
    addCoupon: 'クーポンを追加',
    settings: '設定',
    generalSettings: 'ストアの一般設定',
    deliverySettings: '配送と発送の設定',
    contactSettings: '顧客連絡先情報',
    aiSettings: 'AI 設定',
    currentPlanDetails: '現在のプランの詳細',
    premiumFeature: 'プレミアム機能',
    upgradePlan: '有料プランにアップグレード',
    totalProducts: '商品総数',
    totalOrders: '注文総数',
    pendingOrders: '保留中の注文',
    completedOrders: '完了',
    totalRevenue: '総収益',
    yourPlan: 'あなたのプラン：',
    paidPlan: '有料',
    freePlan: '無料',
    monthlyCost: '15 USD/月',
    freeCost: '0 USD/月',
    activated: '✅ 有効',
    pendingPayment: '⏳ 支払い待ち',
    inDevelopment: '🔄 開発中',
    noCustomersMessage: 'まだ顧客はいません。',
    productInStock: '在庫あり',
    productOutOfStock: '在庫なし',
    logout: 'ログアウト',
    viewOrders: '注文を表示',
    note: '注意：',
    refreshData: 'データを更新',
    noOrdersYet: 'まだ注文はありません',
    startSelling: '販売を開始',
    newCustomer: '新規顧客',
    phone: '電話番号',
    totalSpent: '総支出',
    lastOrder: '最終注文',
    whatsapp: 'WhatsApp',
    email: 'E-mail',
    freeCouponMessage: '無料クーポンを取得',
    noActiveCoupons: 'アクティブなクーポンはありません',
    discountPercentage: '割引率',
    validUntil: '有効期限',
    maxUsage: '最大使用回数',
    uses: '使用',
    usageCount: '使用回数',
    active: 'アクティブ',
    planType: 'プランタイプ',
    aiDescription: 'AI 説明',
    pwaDescription: 'PWA 説明',
    domainDescription: 'ドメイン説明',
    whatsappInstagram: 'WhatsApp/Instagram',
    enabled: '有効',
    disabled: '無効',
    googleAnalytics: 'Google Analytics',
    liveSupport: 'ライブサポート',
    basicStore: 'ベーシックストア',
    subdomainFree: 'サブドメイン無料',
    limitedFeatures: '制限機能',
    emailSupport: '電子メールサポート',
    getAdvancedFeatures: '高度な機能を取得',
    monthlyPlan: '月額プラン',
    sixMonthsPlan: '半年プラン',
    yearlyPlan: '年額プラン',
    subscriptionExpires: 'サブスクリプション期限',
    subscriptionActive: '有効',
    subscriptionExpired: '期限切れ',
    daysRemaining: '残り日数',
    subscriptionDetails: 'サブスクリプション詳細',
    planDuration: '期間',
    planPrice: '価格',
    planStatus: 'ステータス',
  },
  tr: {
    dashboardTitle: 'Sellava Paneli',
    testMode: 'Test modu:',
    testModeMsg: 'Gerçek yüklemeler yerine sahte görseller kullanılacaktır. Değişiklikler tarayıcıya yerel olarak kaydedilir.',
    welcomeTestUser: 'Test moduna hoş geldiniz! 🎉',
    testUserMsg: 'Şu anda test modundasınız. Firebase kurulumu olmadan tüm özellikleri keşfedin. Siparişler ve müşteriler Firebase\'e kaydedilir ve burada görünür.',
    welcomeNewUser: 'Sellava\'ya hoş geldiniz! 🎉',
    newUserMsg: 'Sellava platformuna hoş geldiniz! Mağazanızı başlatmak için yukarıdan "Mağazayı Oluştur ve Görüntüle"ye tıklayın.',
    finalStep: 'Son adım! 🚀',
    finalStepMsg: 'Hesabınız başarıyla oluşturuldu! Ücretli planı etkinleştirerek gelişmiş özelliklere erişmek için aşağıdaki "Ücretli Planı Etkinleştir" düğmesine tıklayın.',
    products: 'Ürünler',
    addProduct: 'Ürün Ekle',
    noProductsMessage: 'Henüz ürün yok.',
    delete: 'Sil',
    edit: 'Düzenle',
    orders: 'Siparişler',
    customers: 'Müşteriler',
    coupons: 'Kuponlar',
    addCoupon: 'Kupon Ekle',
    settings: 'Ayarlar',
    generalSettings: 'Genel Mağaza Ayarları',
    deliverySettings: 'Teslimat & Kargo Ayarları',
    contactSettings: 'Müşteri İletişim Bilgileri',
    aiSettings: 'Yapay Zeka Ayarları',
    currentPlanDetails: 'Mevcut Plan Detayları',
    premiumFeature: 'Premium Özellik',
    upgradePlan: 'Ücretli Plana Geç',
    totalProducts: 'Toplam Ürün',
    totalOrders: 'Toplam Sipariş',
    pendingOrders: 'Bekleyen Siparişler',
    completedOrders: 'Tamamlandı',
    totalRevenue: 'Toplam Gelir',
    yourPlan: 'Planınız:',
    paidPlan: 'Ücretli',
    freePlan: 'Ücretsiz',
    monthlyCost: '15 USD/ay',
    freeCost: '0 USD/ay',
    activated: '✅ Etkin',
    pendingPayment: '⏳ Ödeme Bekleniyor',
    inDevelopment: '🔄 Geliştiriliyor',
    noCustomersMessage: 'Henüz müşteri yok.',
    productInStock: 'Stokta Var',
    productOutOfStock: 'Stokta Yok',
    logout: 'Çıkış',
    viewOrders: 'Siparişleri Görüntüle',
    note: 'Not:',
    refreshData: 'Verileri Güncelle',
    noOrdersYet: 'Henüz sipariş yok',
    startSelling: 'Satışa Başla',
    newCustomer: 'Yeni Müşteri',
    phone: 'Telefon',
    totalSpent: 'Toplam Harcama',
    lastOrder: 'Son Sipariş',
    whatsapp: 'WhatsApp',
    email: 'E-mail',
    freeCouponMessage: 'Ücretsiz bir kupon al',
    noActiveCoupons: 'Aktif kupon yok',
    discountPercentage: 'İndirim Oranı',
    validUntil: 'Son kullanma tarihi',
    maxUsage: 'Maksimum Kullanım',
    uses: 'kullanıldı',
    usageCount: 'Kullanım Sayısı',
    active: 'Aktif',
    planType: 'Plan Tipi',
    aiDescription: 'Yapay Zeka Açıklaması',
    pwaDescription: 'PWA Açıklaması',
    domainDescription: 'Domain Açıklaması',
    whatsappInstagram: 'WhatsApp/Instagram',
    enabled: 'Etkin',
    disabled: 'Devre Dışı',
    googleAnalytics: 'Google Analytics',
    liveSupport: 'Canlı Destek',
    basicStore: 'Temel Mağaza',
    subdomainFree: 'Alt Alan Adı Ücretsiz',
    limitedFeatures: 'Sınırlı Özellikler',
    emailSupport: 'E-posta Desteği',
    getAdvancedFeatures: 'Gelişmiş Özellikleri Al',
    monthlyPlan: 'Aylık Plan',
    sixMonthsPlan: '6 Aylık Plan',
    yearlyPlan: 'Yıllık Plan',
    subscriptionExpires: 'Abonelik Süresi',
    subscriptionActive: 'Aktif',
    subscriptionExpired: 'Süresi Doldu',
    daysRemaining: 'Kalan Gün',
    subscriptionDetails: 'Abonelik Detayları',
    planDuration: 'Süre',
    planPrice: 'Fiyat',
    planStatus: 'Durum',
  },
  hi: {
    dashboardTitle: 'Sellava डैशबोर्ड',
    testMode: 'टेस्ट मोड:',
    testModeMsg: 'वास्तविक अपलोड के बजाय नकली चित्रों का उपयोग किया जाएगा। परिवर्तन ब्राउज़र में स्थानीय रूप से सहेजे जाते हैं।',
    welcomeTestUser: 'टेस्ट मोड में आपका स्वागत है! 🎉',
    testUserMsg: 'आप अब टेस्ट मोड में हैं। बिना Firebase सेटअप के सभी फीचर्स आज़माएं। ऑर्डर और ग्राहक Firebase में सेव होते हैं और यहां दिखेंगे।',
    welcomeNewUser: 'Sellava पर आपका स्वागत है! 🎉',
    newUserMsg: 'Sellava प्लेटफ़ॉर्म में आपका स्वागत है! अपने स्टोर को शुरू करने के लिए ऊपर "स्टोर बनाएँ और देखें" पर क्लिक करें।',
    finalStep: 'अंतिम चरण! 🚀',
    finalStepMsg: 'आपका अकाउंट सफलतापूर्वक बन गया है! भुगतान योजना को सक्रिय करने और सभी सुविधाओं का उपयोग करने के लिए नीचे "पेड प्लान को एक्टिव करें" पर क्लिक करें।',
    products: 'उत्पाद',
    addProduct: 'उत्पाद जोड़ें',
    noProductsMessage: 'अभी तक कोई उत्पाद नहीं।',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    orders: 'ऑर्डर',
    customers: 'ग्राहक',
    coupons: 'कूपन',
    addCoupon: 'कूपन जोड़ें',
    settings: 'सेटिंग्स',
    generalSettings: 'जनरल स्टोर सेटिंग्स',
    deliverySettings: 'डिलीवरी और शिपिंग सेटिंग्स',
    contactSettings: 'ग्राहक संपर्क जानकारी',
    aiSettings: 'एआई सेटिंग्स',
    currentPlanDetails: 'मौजूदा योजना विवरण',
    premiumFeature: 'प्रीमियम सुविधा',
    upgradePlan: 'पेड प्लान में जाएं',
    totalProducts: 'कुल उत्पाद',
    totalOrders: 'कुल ऑर्डर',
    pendingOrders: 'लंबित ऑर्डर',
    completedOrders: 'पूरा हुआ',
    totalRevenue: 'कुल आय',
    yourPlan: 'आपकी योजना:',
    paidPlan: 'पेड',
    freePlan: 'फ्री',
    monthlyCost: '15 USD/माह',
    freeCost: '0 USD/माह',
    activated: '✅ सक्रिय',
    pendingPayment: '⏳ भुगतान लंबित',
    inDevelopment: '🔄 विकास में',
    noCustomersMessage: 'अभी तक कोई ग्राहक नहीं।',
    productInStock: 'स्टॉक में',
    productOutOfStock: 'स्टॉक समाप्त',
    logout: 'लॉग आउट',
    viewOrders: 'ऑर्डर देखें',
    note: 'नोट:',
    refreshData: 'डेटा अपडेट करें',
    noOrdersYet: 'अभी तक कोई ऑर्डर नहीं',
    startSelling: 'बिक्री शुरू करें',
    newCustomer: 'नया ग्राहक',
    phone: 'फोन',
    totalSpent: 'कुल खर्च',
    lastOrder: 'आखिरी ऑर्डर',
    whatsapp: 'WhatsApp',
    email: 'ईमेल',
    freeCouponMessage: 'मुफ्त कूपन प्राप्त करें',
    noActiveCoupons: 'कोई एक्टिव कूपन नहीं',
    discountPercentage: 'छूट प्रतिशत',
    validUntil: 'से वैध',
    maxUsage: 'अधिकतम उपयोग',
    uses: 'उपयोग',
    usageCount: 'उपयोग की संख्या',
    active: 'एक्टिव',
    planType: 'योजना प्रकार',
    aiDescription: 'AI विवरण',
    pwaDescription: 'PWA विवरण',
    domainDescription: 'डोमेन विवरण',
    whatsappInstagram: 'WhatsApp/Instagram',
    enabled: 'सक्रिय',
    disabled: 'अक्रिय',
    googleAnalytics: 'Google Analytics',
    liveSupport: 'लाइव सपोर्ट',
    basicStore: 'बेसिक स्टोर',
    subdomainFree: 'सबडोमेन मुफ्त',
    limitedFeatures: 'सीमित सुविधाएं',
    emailSupport: 'ईमेल सपोर्ट',
    getAdvancedFeatures: 'उन्नत सुविधाओं का प्राप्त करें',
    monthlyPlan: 'मासिक योजना',
    sixMonthsPlan: '6 मासिक योजना',
    yearlyPlan: 'वार्षिक योजना',
    subscriptionExpires: 'सदस्यता समाप्त',
    subscriptionActive: 'सक्रिय',
    subscriptionExpired: 'समाप्त',
    daysRemaining: 'दिनों की संख्या',
    subscriptionDetails: 'सदस्यता विवरण',
    planDuration: 'अवधि',
    planPrice: 'मूल्य',
    planStatus: 'स्थिति',
  },
  id: {
    dashboardTitle: 'Dasbor Sellava',
    testMode: 'Mode uji:',
    testModeMsg: 'Gambar palsu akan digunakan sebagai pengganti unggahan asli. Perubahan disimpan secara lokal di browser.',
    welcomeTestUser: 'Selamat datang di mode uji! 🎉',
    testUserMsg: 'Anda sekarang dalam mode uji. Jelajahi semua fitur tanpa konfigurasi Firebase. Pesanan dan pelanggan disimpan di Firebase dan akan muncul di sini.',
    welcomeNewUser: 'Selamat datang di Sellava! 🎉',
    newUserMsg: 'Selamat datang di platform Sellava! Untuk memulai toko Anda, klik "Buat & Lihat Toko" di atas.',
    finalStep: 'Langkah terakhir! 🚀',
    finalStepMsg: 'Akun Anda telah berhasil dibuat! Untuk mengaktifkan paket berbayar dan mengakses fitur lanjutan, klik "Aktifkan Paket Berbayar" di bawah.',
    products: 'Produk',
    addProduct: 'Tambah Produk',
    noProductsMessage: 'Belum ada produk.',
    delete: 'Hapus',
    edit: 'Edit',
    orders: 'Pesanan',
    customers: 'Pelanggan',
    coupons: 'Kupon',
    addCoupon: 'Tambah Kupon',
    settings: 'Pengaturan',
    generalSettings: 'Pengaturan Umum Toko',
    deliverySettings: 'Pengaturan Pengiriman & Ekspedisi',
    contactSettings: 'Informasi Kontak Pelanggan',
    aiSettings: 'Pengaturan AI',
    currentPlanDetails: 'Detail Paket Saat Ini',
    premiumFeature: 'Fitur Premium',
    upgradePlan: 'Tingkatkan ke Paket Berbayar',
    totalProducts: 'Total Produk',
    totalOrders: 'Total Pesanan',
    pendingOrders: 'Pesanan Tertunda',
    completedOrders: 'Selesai',
    totalRevenue: 'Total Pendapatan',
    yourPlan: 'Paket Anda:',
    paidPlan: 'Berbayar',
    freePlan: 'Gratis',
    monthlyCost: '15 USD/bulan',
    freeCost: '0 USD/bulan',
    activated: '✅ Diaktifkan',
    pendingPayment: '⏳ Menunggu Pembayaran',
    inDevelopment: '🔄 Sedang Dikembangkan',
    noCustomersMessage: 'Belum ada pelanggan.',
    productInStock: 'Tersedia',
    productOutOfStock: 'Habis Stok',
    logout: 'Logout',
    viewOrders: 'Lihat Pesanan',
    note: 'Catatan:',
    refreshData: 'Perbarui Data',
    noOrdersYet: 'Belum ada pesanan',
    startSelling: 'Mulai Jual',
    newCustomer: 'Pelanggan Baru',
    phone: 'Telepon',
    totalSpent: 'Total Dikeluarkan',
    lastOrder: 'Pesanan Terakhir',
    whatsapp: 'WhatsApp',
    email: 'E-mail',
    freeCouponMessage: 'Dapatkan kupon gratis',
    noActiveCoupons: 'Tidak ada kupon aktif',
    discountPercentage: 'Persentase Diskon',
    validUntil: 'Berlaku hingga',
    maxUsage: 'Penggunaan Maksimal',
    uses: 'digunakan',
    usageCount: 'Jumlah Penggunaan',
    active: 'Aktif',
    planType: 'Jenis Paket',
    aiDescription: 'Deskripsi AI',
    pwaDescription: 'Deskripsi PWA',
    domainDescription: 'Deskripsi Domain',
    whatsappInstagram: 'WhatsApp/Instagram',
    enabled: 'Diaktifkan',
    disabled: 'Nonaktif',
    googleAnalytics: 'Google Analytics',
    liveSupport: 'Dukungan Langsung',
    basicStore: 'Toko Dasar',
    subdomainFree: 'Subdomain Gratis',
    limitedFeatures: 'Fitur Terbatas',
    emailSupport: 'Dukungan Email',
    getAdvancedFeatures: 'Akses Fitur Lanjutan',
    monthlyPlan: 'Paket Bulanan',
    sixMonthsPlan: 'Paket 6 Bulan',
    yearlyPlan: 'Paket Tahunan',
    subscriptionExpires: 'Kadaluarsa',
    subscriptionActive: 'Aktif',
    subscriptionExpired: 'Kadaluarsa',
    daysRemaining: 'Hari Tersisa',
    subscriptionDetails: 'Detail Langganan',
    planDuration: 'Durasi',
    planPrice: 'Harga',
    planStatus: 'Status',
  },
  ko: {
    dashboardTitle: 'Sellava 대시보드',
    testMode: '테스트 모드:',
    testModeMsg: '실제 업로드 대신 가짜 이미지가 사용됩니다. 변경 사항은 브라우저에 로컬로 저장됩니다.',
    welcomeTestUser: '테스트 모드에 오신 것을 환영합니다! 🎉',
    testUserMsg: '지금은 테스트 모드입니다. Firebase 설정 없이 모든 기능을 사용해보세요. 주문 및 고객 정보는 Firebase에 저장되며 여기에 표시됩니다.',
    welcomeNewUser: 'Sellava에 오신 것을 환영합니다! 🎉',
    newUserMsg: 'Sellava 플랫폼에 오신 것을 환영합니다! 상점을 시작하려면 위의 "상점 만들기 및 보기"를 클릭하세요.',
    finalStep: '마지막 단계! 🚀',
    finalStepMsg: '계정이 성공적으로 생성되었습니다! 유료 플랜을 활성화하고 고급 기능을 사용하려면 아래 "유료 플랜 활성화"를 클릭하세요.',
    products: '제품',
    addProduct: '제품 추가',
    noProductsMessage: '아직 제품이 없습니다.',
    delete: '삭제',
    edit: '편집',
    orders: '주문',
    customers: '고객',
    coupons: '쿠폰',
    addCoupon: '쿠폰 추가',
    settings: '설정',
    generalSettings: '일반 상점 설정',
    deliverySettings: '배송 및 발송 설정',
    contactSettings: '고객 연락처 정보',
    aiSettings: 'AI 설정',
    currentPlanDetails: '현재 플랜 세부정보',
    premiumFeature: '프리미엄 기능',
    upgradePlan: '유료 플랜으로 업그레이드',
    totalProducts: '총 제품',
    totalOrders: '총 주문',
    pendingOrders: '보류 중인 주문',
    completedOrders: '완료됨',
    totalRevenue: '총 수익',
    yourPlan: '내 플랜:',
    paidPlan: '유료',
    freePlan: '무료',
    monthlyCost: '월 15 USD',
    freeCost: '월 0 USD',
    activated: '✅ 활성화됨',
    pendingPayment: '⏳ 결제 대기 중',
    inDevelopment: '🔄 개발 중',
    noCustomersMessage: '아직 고객이 없습니다.',
    productInStock: '재고 있음',
    productOutOfStock: '품절',
    logout: '로그아웃',
    viewOrders: '주문 보기',
    note: '참고:',
    refreshData: '데이터 새로고침',
    noOrdersYet: '아직 주문이 없습니다',
    startSelling: '판매 시작',
    newCustomer: '신규 고객',
    phone: '전화번호',
    totalSpent: '총 지출',
    lastOrder: '마지막 주문',
    whatsapp: 'WhatsApp',
    email: '이메일',
    freeCouponMessage: '무료 쿠폰 받기',
    noActiveCoupons: '활성화된 쿠폰 없음',
    discountPercentage: '할인율',
    validUntil: '유효기간',
    maxUsage: '최대 사용',
    uses: '사용',
    usageCount: '사용 횟수',
    active: '활성화됨',
    planType: '플랜 유형',
    aiDescription: 'AI 설명',
    pwaDescription: 'PWA 설명',
    domainDescription: '도메인 설명',
    whatsappInstagram: 'WhatsApp/Instagram',
    enabled: '활성화됨',
    disabled: '비활성화됨',
    googleAnalytics: 'Google Analytics',
    liveSupport: '라이브 지원',
    basicStore: '기본 상점',
    subdomainFree: '서브도메인 무료',
    limitedFeatures: '제한된 기능',
    emailSupport: '이메일 지원',
    getAdvancedFeatures: '고급 기능 사용',
    monthlyPlan: '월간 플랜',
    sixMonthsPlan: '6개월 플랜',
    yearlyPlan: '연간 플랜',
    subscriptionExpires: '구독 만료',
    subscriptionActive: '활성',
    subscriptionExpired: '만료',
    daysRemaining: '남은 일수',
    subscriptionDetails: '구독 세부 정보',
    planDuration: '기간',
    planPrice: '가격',
    planStatus: '상태',
  },
  nl: {
    dashboardTitle: 'Sellava Dashboard',
    testMode: 'Testmodus:',
    testModeMsg: 'Nepafbeeldingen worden gebruikt in plaats van echte uploads. Wijzigingen worden lokaal in de browser opgeslagen.',
    welcomeTestUser: 'Welkom in de testmodus! 🎉',
    testUserMsg: 'Je bevindt je nu in de testmodus. Verken alle functies zonder Firebase-configuratie. Bestellingen en klanten worden opgeslagen in Firebase en verschijnen hier.',
    welcomeNewUser: 'Welkom bij Sellava! 🎉',
    newUserMsg: 'Welkom op het Sellava-platform! Klik bovenaan op "Winkel aanmaken en bekijken" om te beginnen.',
    finalStep: 'Laatste stap! 🚀',
    finalStepMsg: 'Je account is succesvol aangemaakt! Klik hieronder op "Betaald abonnement activeren" om toegang te krijgen tot geavanceerde functies.',
    products: 'Producten',
    addProduct: 'Product toevoegen',
    noProductsMessage: 'Nog geen producten.',
    delete: 'Verwijderen',
    edit: 'Bewerken',
    orders: 'Bestellingen',
    customers: 'Klanten',
    coupons: 'Kortingscodes',
    addCoupon: 'Kortingscode toevoegen',
    settings: 'Instellingen',
    generalSettings: 'Algemene winkelinstellingen',
    deliverySettings: 'Bezorg- & verzendinstellingen',
    contactSettings: 'Klantcontactgegevens',
    aiSettings: 'AI-instellingen',
    currentPlanDetails: 'Details van huidig abonnement',
    premiumFeature: 'Premiumfunctie',
    upgradePlan: 'Upgrade naar betaald plan',
    totalProducts: 'Totaal producten',
    totalOrders: 'Totaal bestellingen',
    pendingOrders: 'Openstaande bestellingen',
    completedOrders: 'Voltooid',
    totalRevenue: 'Totale omzet',
    yourPlan: 'Jouw plan:',
    paidPlan: 'Betaald',
    freePlan: 'Gratis',
    monthlyCost: '15 USD/maand',
    freeCost: '0 USD/maand',
    activated: '✅ Geactiveerd',
    pendingPayment: '⏳ Betaling in afwachting',
    inDevelopment: '🔄 In ontwikkeling',
    noCustomersMessage: 'Nog geen klanten.',
    productInStock: 'Op voorraad',
    productOutOfStock: 'Niet op voorraad',
    logout: 'Uitloggen',
    viewOrders: 'Bestellingen bekijken',
    note: 'Opmerking:',
    refreshData: 'Gegevens vernieuwen',
    noOrdersYet: 'Nog geen bestellingen',
    startSelling: 'Verkopen beginnen',
    newCustomer: 'Nieuwe klant',
    phone: 'Telefoon',
    totalSpent: 'Totaal uitgegeven',
    lastOrder: 'Laatste bestelling',
    whatsapp: 'WhatsApp',
    email: 'E-mail',
    freeCouponMessage: 'Een gratis coupon krijgen',
    noActiveCoupons: 'Geen actieve coupons',
    discountPercentage: 'Kortingspercentage',
    validUntil: 'Geldig tot',
    maxUsage: 'Maximale gebruik',
    uses: 'gebruikt',
    usageCount: 'Aantal gebruik',
    active: 'Actief',
    planType: 'Plan type',
    aiDescription: 'AI-beschrijving',
    pwaDescription: 'PWA-beschrijving',
    domainDescription: 'Domain-beschrijving',
    whatsappInstagram: 'WhatsApp/Instagram',
    enabled: 'Geschikt',
    disabled: 'Niet geschikt',
    googleAnalytics: 'Google Analytics',
    liveSupport: 'Live-ondersteuning',
    basicStore: 'Basiswinkel',
    subdomainFree: 'Subdomein gratis',
    limitedFeatures: 'Beperkte functies',
    emailSupport: 'E-mail-ondersteuning',
    getAdvancedFeatures: 'Geavanceerde functies gebruiken',
    monthlyPlan: 'Maandelijkse Plan',
    sixMonthsPlan: '6-Maands Plan',
    yearlyPlan: 'Jaarlijks Plan',
    subscriptionExpires: 'Abonnementsduur',
    subscriptionActive: 'Actief',
    subscriptionExpired: 'Afgelopen',
    daysRemaining: 'Dagen resterend',
    subscriptionDetails: 'Abonnementsdetails',
    planDuration: 'Duur',
    planPrice: 'Prijs',
    planStatus: 'Status',
  },
  pl: {
    dashboardTitle: 'Panel Sellava',
    testMode: 'Tryb testowy:',
    testModeMsg: 'Zamiast prawdziwych przesyłek będą używane fikcyjne obrazy. Zmiany są zapisywane lokalnie w przeglądarce.',
    welcomeTestUser: 'Witamy w trybie testowym! 🎉',
    testUserMsg: 'Jesteś teraz w trybie testowym. Przetestuj wszystkie funkcje bez konfiguracji Firebase. Zamówienia i klienci są zapisywani w Firebase i pojawią się tutaj.',
    welcomeNewUser: 'Witamy w Sellava! 🎉',
    newUserMsg: 'Witamy na platformie Sellava! Aby rozpocząć, kliknij "Utwórz i zobacz sklep" u góry.',
    finalStep: 'Ostatni krok! 🚀',
    finalStepMsg: 'Twoje konto zostało pomyślnie utworzone! Aby aktywować plan płatny i uzyskać dostęp do wszystkich funkcji, kliknij poniżej "Aktywuj plan płatny".',
    products: 'Produkty',
    addProduct: 'Dodaj produkt',
    noProductsMessage: 'Brak produktów.',
    delete: 'Usuń',
    edit: 'Edytuj',
    orders: 'Zamówienia',
    customers: 'Klienci',
    coupons: 'Kupony',
    addCoupon: 'Dodaj kupon',
    settings: 'Ustawienia',
    generalSettings: 'Ogólne ustawienia sklepu',
    deliverySettings: 'Ustawienia dostawy i wysyłki',
    contactSettings: 'Dane kontaktowe klienta',
    aiSettings: 'Ustawienia AI',
    currentPlanDetails: 'Szczegóły bieżącego planu',
    premiumFeature: 'Funkcja premium',
    upgradePlan: 'Przejdź na plan płatny',
    totalProducts: 'Łączna liczba produktów',
    totalOrders: 'Łączna liczba zamówień',
    pendingOrders: 'Oczekujące zamówienia',
    completedOrders: 'Zakończone',
    totalRevenue: 'Łączny przychód',
    yourPlan: 'Twój plan:',
    paidPlan: 'Płatny',
    freePlan: 'Darmowy',
    monthlyCost: '15 USD/mies.',
    freeCost: '0 USD/mies.',
    activated: '✅ Aktywny',
    pendingPayment: '⏳ Oczekuje na płatność',
    inDevelopment: '🔄 W trakcie rozwoju',
    noCustomersMessage: 'Brak klientów.',
    productInStock: 'W magazynie',
    productOutOfStock: 'Brak w magazynie',
    logout: 'Wyloguj',
    viewOrders: 'Pokaż zamówienia',
    note: 'Uwaga:',
    refreshData: 'Odśwież dane',
    noOrdersYet: 'Nie ma jeszcze zamówień',
    startSelling: 'Rozpocznij sprzedaż',
    newCustomer: 'Nowy klient',
    phone: 'Telefon',
    totalSpent: 'Całkowity koszt',
    lastOrder: 'Ostatnie zamówienie',
    whatsapp: 'WhatsApp',
    email: 'E-mail',
    freeCouponMessage: 'Dostań bezpłatny kupon',
    noActiveCoupons: 'Nie ma aktywnych kuponów',
    discountPercentage: 'Procent zniżki',
    validUntil: 'Ważny do',
    maxUsage: 'Maksymalne wykorzystanie',
    uses: 'użyto',
    usageCount: 'Liczba użyć',
    active: 'Aktywny',
    planType: 'Rodzaj planu',
    aiDescription: 'Opis AI',
    pwaDescription: 'Opis PWA',
    domainDescription: 'Opis domeny',
    whatsappInstagram: 'WhatsApp/Instagram',
    enabled: 'Włączony',
    disabled: 'Wyłączony',
    googleAnalytics: 'Google Analytics',
    liveSupport: 'Pomoc techniczna',
    basicStore: 'Sklep podstawowy',
    subdomainFree: 'Poddomena bezpłatna',
    limitedFeatures: 'Ograniczone funkcje',
    emailSupport: 'Pomoc e-mailowa',
    getAdvancedFeatures: 'Uzyskaj zaawansowane funkcje',
    monthlyPlan: 'Miesięczny plan',
    sixMonthsPlan: '6-miesięczny plan',
    yearlyPlan: 'Roczny plan',
    subscriptionExpires: 'Wygasa',
    subscriptionActive: 'Aktywny',
    subscriptionExpired: 'Wygasł',
    daysRemaining: 'Dni pozostałe',
    subscriptionDetails: 'Szczegóły subskrypcji',
    planDuration: 'Okres',
    planPrice: 'Cena',
    planStatus: 'Status',
  },
                         
};

// Helper for order status color
const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'confirmed': return 'bg-blue-100 text-blue-800';
    case 'shipped': return 'bg-purple-100 text-purple-800';
    case 'delivered': return 'bg-green-100 text-green-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Helper for order status text
const getStatusText = (status: Order['status']) => {
  switch (status) {
    case 'pending': return ' pending'
    case 'confirmed': return 'confirmed'
    case 'shipped': return ' shipped'
    case 'delivered': return ' delivered'
    case 'cancelled': return 'cancelled'
    default: return 'unknown';
  }
};



export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { language, setLanguage } = useLanguage();
  const t = (key: string) => translations[language]?.[key] || key;
  const router = useRouter();
  
  const [store, setStore] = useState<StoreType | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCoupons, setActiveCoupons] = useState<Coupon[]>([]);

  // Helper functions
  const getDaysRemaining = (expiryDate: Date): number => {
    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getPlanDisplayName = (planType: string): string => {
    switch (planType) {
      case 'monthly': return t('monthlyPlan');
      case 'sixmonths': return t('sixMonthsPlan');
      case 'yearly': return t('yearlyPlan');
      case 'free': return t('freePlan');
      default: return planType;
    }
  };

  const getPlanPrice = (planType: string): string => {
    switch (planType) {
      case 'monthly': return '15 USD/month';
      case 'sixmonths': return '75 USD/6 months';
      case 'yearly': return '150 USD/year';
      case 'free': return '0 USD/month';
      default: return '0 USD/month';
    }
  };

  // قائمة بأسماء اللغات للعرض
  const languageNames: Record<string, string> = {
    en: "English",
    ar: "العربية",
    es: "Español",
    de: "Deutsch",
    fr: "Français",
    it: "Italiano",
    pt: "Português",
    ru: "Русский",
    zh: "中文",
    ja: "日本語",
    tr: "Türkçe",
    hi: "हिन्दी",
    id: "Bahasa Indonesia",
    ko: "한국어",
    nl: "Nederlands",
    pl: "Polski",
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
      return;
    }

    if (user) {
      console.log('Loading dashboard data for user:', user.email, 'with plan:', user.planType);
      loadDashboardData();
    }
  }, [user, authLoading, router]);

  // إضافة معالج للاختبار
  useEffect(() => {
    // إذا كان المستخدم في وضع الاختبار، أنشئ بيانات افتراضية
    if (user?.email === 'test@example.com') {
      console.log('Test user detected, setting up default data...');
    }
  }, [user]);

  // مراقبة تغييرات نوع الخطة
  useEffect(() => {
    console.log('User plan changed to:', user?.planType);
    console.log('Full user object in dashboard:', user);
  }, [user?.planType, user]);

  // إضافة مستمع لتحديث البيانات عند تغيير localStorage للمستخدم التجريبي
  useEffect(() => {
    if (user?.email === 'test@example.com') {
      const handleStorageChange = (e: StorageEvent) => {
        // تحديث البيانات عند تغيير الطلبات أو المنتجات
        if (e.key === 'store_orders' || e.key === 'test_user_products') {
          loadDashboardData();
        }
      };
      
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [user]);

  useEffect(() => {
    if (user?.uid && user.planType !== 'free') {
      const couponsRaw = localStorage.getItem(`coupons_${user.uid}`);
      let coupons: any[] = [];
      if (couponsRaw) {
        try {
          coupons = JSON.parse(couponsRaw);
        } catch {}
      }
      setActiveCoupons(coupons.filter(c => c.isActive));
    }
  }, [user?.uid, user?.planType]);

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!user) return;
    
    if (!confirm(`هل أنت متأكد من حذف المنتج "${productName}"؟`)) {
      return;
    }
    
    try {
      // معالجة خاصة للمستخدم في وضع الاختبار
      if (user.email === 'test@example.com') {
        const savedProducts = localStorage.getItem('test_user_products');
        const existingProducts = savedProducts ? JSON.parse(savedProducts) : [];
        const updatedProducts = existingProducts.filter((p: Product) => p.id !== productId);
        localStorage.setItem('test_user_products', JSON.stringify(updatedProducts));
        setProducts(updatedProducts);
        toast.success(`تم حذف المنتج "${productName}" بنجاح`);
        return;
      }
      
      // للمستخدمين العاديين، احذف من Firebase
      await deleteProduct(user.uid, productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast.success(`تم حذف المنتج "${productName}" بنجاح`);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('حدث خطأ في حذف المنتج');
    }
  };

  const loadDashboardData = async () => {
    if (!user) return;
    
    console.log('Loading dashboard data for user:', user.email, 'plan:', user.planType);
    
    try {
      setLoading(true);
      
      // معالجة خاصة للمستخدم في وضع الاختبار
      if (user.email === 'test@example.com') {
        // بيانات وهمية للمستخدم في وضع الاختبار
        setStore({
          userId: user.uid,
          storeTitle: 'متجر الاختبار',
          storeBio: 'متجر تجريبي للاختبار',
          storeCountry: 'egypt',
          planType: 'free',
          enableAI: false,
          autoDescription: false,
          localDelivery: false,
          globalDelivery: false,
          deliveryCost: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        
        // تحميل المنتجات من localStorage للمستخدم التجريبي
        try {
          const savedProducts = localStorage.getItem('test_user_products');
          const parsedProducts = savedProducts ? JSON.parse(savedProducts) : [];
          setProducts(parsedProducts);
        } catch (error) {
          console.error('Error loading test products:', error);
          setProducts([]);
        }
        
        // تحميل الطلبات من Firebase للمستخدم التجريبي
        try {
          const ordersData = await getOrders(user.uid);
          setOrders(ordersData);
          
          // استخراج العملاء من الطلبات
          const customersMap = new Map();
          ordersData.forEach((order: any) => {
            const customerKey = order.customerEmail || order.customerName;
            if (!customersMap.has(customerKey)) {
              customersMap.set(customerKey, {
                id: customerKey,
                name: order.customerName,
                email: order.customerEmail,
                phone: order.customerPhone,
                totalOrders: 1,
                totalSpent: order.total,
                lastOrderDate: order.createdAt,
                createdAt: order.createdAt,
              });
            } else {
              const existingCustomer = customersMap.get(customerKey);
              existingCustomer.totalOrders += 1;
              existingCustomer.totalSpent += order.total;
              if (order.createdAt > existingCustomer.lastOrderDate) {
                existingCustomer.lastOrderDate = order.createdAt;
              }
            }
          });
          
          setCustomers(Array.from(customersMap.values()));
        } catch (error) {
          console.error('Error loading test orders and customers:', error);
          setOrders([]);
          setCustomers([]);
        }
        
        setLoading(false);
        
        console.log('Test user dashboard data loaded. Plan:', user.planType);
        return;
      }
      
      // تحميل البيانات مع معالجة الأخطاء
      const [storeData, productsData, ordersData, customersData] = await Promise.allSettled([
        getStore(user.uid),
        getProducts(user.uid),
        getOrders(user.uid),
        getCustomers(user.uid),
      ]);
      
      let finalStore = storeData.status === 'fulfilled' ? storeData.value : null;
      
      // إذا لم يكن هناك متجر، أنشئ واحد افتراضي
      if (!finalStore && user.email !== 'test@example.com') {
        try {
          const defaultStore = {
            userId: user.uid,
            storeTitle: (user as User).name || 'متجري الجديد',
            storeBio: 'مرحباً بكم في متجري',
            storeCountry: 'usa',
            planType: user.planType || 'free',
            enableAI: false,
            autoDescription: false,
            localDelivery: false,
            globalDelivery: false,
            deliveryCost: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          
          await createStore(defaultStore);
          finalStore = defaultStore;
        } catch (error) {
          console.error('Error creating default store:', error);
        }
      }
      
      setStore(finalStore);
      setProducts(productsData.status === 'fulfilled' ? productsData.value : []);
      setOrders(ordersData.status === 'fulfilled' ? ordersData.value : []);
      setCustomers(customersData.status === 'fulfilled' ? customersData.value : []);
      
      console.log('Dashboard data loaded successfully. User plan:', user.planType);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // في حالة الخطأ، اضبط القيم الافتراضية
      setStore(null);
      setProducts([]);
      setOrders([]);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">جاري التحميل...</h1>
          <p className="text-gray-600">يرجى الانتظار</p>
        </div>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const completedOrders = orders.filter(order => order.status === 'delivered').length;
  const totalOrders = orders.length;

  // بيانات افتراضية للمستخدم في وضع الاختبار
  const isTestUser = user?.email === 'test@example.com';

  // إضافة console.log للتأكد من نوع الخطة
  console.log('Dashboard - Current user plan:', user?.planType);
  console.log('Dashboard - Current user:', user);
  console.log('Dashboard - localStorage planType:', localStorage.getItem('planType'));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Store className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">{t('dashboardTitle')}</h1>
            </div>
            
            <div className="flex items-center gap-4">
              {isTestUser && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                  <p className="text-xs text-blue-700">
                    <strong>وضع الاختبار:</strong> المنتجات تُحفظ محلياً
                  </p>
                </div>
              )}
              <Link href={store ? `/public-store/${user.uid}` : '#'} target="_blank">
                <Button className="ml-2">
                  {store ? 'View Store' : 'View Store'}
                </Button>
              </Link>
              <Button 
                onClick={() => {
                  localStorage.removeItem('user');
                  window.location.href = '/auth/signin';
                }}
                variant="outline" 
                className="flex items-center text-red-600 border-red-200 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t('logout') || 'تسجيل الخروج'}
              </Button>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value as any)}
                className="border rounded px-2 py-1 ml-2"
              >
                {Object.keys(languageNames).map((code) => (
                  <option key={code} value={code}>{languageNames[code]}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* رسالة ترحيب للمستخدم في وضع الاختبار */}
        {isTestUser && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-blue-900 mb-2">{t('welcomeTestUser')}</h2>
                <p className="text-blue-700">
                  {t('testUserMsg')}
                  <br />
                  <strong>{t('note')}:</strong> {t('testUserMsg')}
                </p>
              </div>
              <Button 
                onClick={loadDashboardData} 
                variant="outline" 
                size="sm"
                className="text-blue-700 border-blue-300 hover:bg-blue-100"
              >
                🔄 {t('refreshData')}
              </Button>
            </div>
          </div>
        )}

        {/* رسالة ترحيب للمستخدمين الجدد */}
        {!isTestUser && !store && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-green-900 mb-2">{t('welcomeNewUser')}</h2>
                <p className="text-green-700">
                  {t('newUserMsg')}
                </p>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <Link href="/try-for-free">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold shadow hover:opacity-90 border-0 w-full mb-1">Try for Free</Button>
                </Link>
              <Button 
                onClick={loadDashboardData} 
                variant="outline" 
                size="sm"
                className="text-green-700 border-green-300 hover:bg-green-100"
              >
                  🔄 {t('refreshData')}
              </Button>
              </div>
            </div>
          </div>
        )}

        {/* رسالة للمستخدم الجديد الذي لم يدفع بعد */}
        {sessionStorage.getItem('pendingPaidPlan') && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-yellow-900 mb-2">{t('finalStep')}</h2>
                <p className="text-yellow-700">
                  {t('finalStepMsg')}
                </p>
              </div>
              <Button 
                onClick={() => router.push('/checkout')} 
                size="sm"
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
              >
                تفعيل الخطة المدفوعة
              </Button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover-lift shadow-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('products')}</CardTitle>
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Package className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gradient-primary">{products.length}</div>
              <p className="text-xs text-muted-foreground">
                {t('productInStock')}
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift shadow-glow-success">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('orders')}</CardTitle>
              <div className="w-8 h-8 bg-gradient-success rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gradient-primary">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                {pendingOrders} {t('pendingOrders')} • {completedOrders} {t('completedOrders')}
              </p>
              <Link href="/dashboard/orders">
                <Button className="mt-3 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold flex items-center justify-center gap-2 relative">
                  <ShoppingCart className="h-4 w-4" />
                  {t('viewOrders')}
                  <span className="ml-2 inline-flex items-center justify-center w-7 h-7 rounded-full bg-white text-indigo-700 font-bold text-base shadow border-2 border-indigo-200">
                    {totalOrders}
                  </span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover-lift shadow-glow-warning">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('customers')}</CardTitle>
              <div className="w-8 h-8 bg-gradient-warning rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gradient-primary">{customers.length}</div>
              <p className="text-xs text-muted-foreground">
                {t('customers')}
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift shadow-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('totalRevenue')}</CardTitle>
              <div className="w-8 h-8 bg-gradient-secondary rounded-lg flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gradient-primary">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                {t('totalRevenue')}
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift shadow-glow-warning">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('currentPlanDetails')}</CardTitle>
              <div className="w-8 h-8 bg-gradient-warning rounded-lg flex items-center justify-center">
                <Store className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gradient-primary">
                {user?.planType !== 'free' ? getPlanDisplayName(user.planType) : t('freePlan')}
              </div>
              <p className="text-xs text-muted-foreground">
                {user?.planType !== 'free' ? getPlanPrice(user.planType) : t('freeCost')}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {user?.planType !== 'free' ? t('activated') : 
                 sessionStorage.getItem('pendingPaidPlan') ? t('pendingPayment') : t('inDevelopment')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="products" className="flex items-center">
              <Package className="h-4 w-4 mr-2" />
              {t('products')}
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center">
              <ShoppingCart className="h-4 w-4 mr-2" />
              {t('orders')}
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              {t('customers')}
            </TabsTrigger>
            <TabsTrigger value="coupons" className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              {t('coupons')}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              {t('settings')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{t('products')}</h2>
              <Link href="/dashboard/products/add">
                <Button className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('addProduct')}
                </Button>
              </Link>
            </div>
            
            {products.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-4">{t('noProductsMessage')}</p>
                  <Link href="/dashboard/products/add">
                    <Button>{t('addProduct')}</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <Badge variant={product.inStock ? "default" : "secondary"}>
                          {product.inStock ? t('productInStock') : t('productOutOfStock')}
                        </Badge>
                      </div>
                      <CardDescription>${product.price}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex justify-end mt-4 space-x-2">
                        <Link href={`/dashboard/products/edit/${product.id}`}>
                          <Button variant="outline" size="sm" className="flex items-center">
                            <Edit className="h-3 w-3 mr-1" />
                            {t('edit')}
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleDeleteProduct(product.id, product.name)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          {t('delete')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{t('orders')}</h2>
              <Link href="/dashboard/orders">
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold flex items-center gap-2 relative">
                  <ShoppingCart className="h-4 w-4" />
                  {t('viewOrders')}
                  <span className="ml-2 inline-flex items-center justify-center w-7 h-7 rounded-full bg-white text-indigo-700 font-bold text-base shadow border-2 border-indigo-200">
                    {totalOrders}
                  </span>
                </Button>
              </Link>
            </div>
            
            {/* قائمة مختصرة لأحدث الطلبات */}
            {orders && orders.length > 0 ? (
              <div className="space-y-3">
                {orders.slice(0, 3).map(order => (
                  <Card key={order.id} className="border-l-4 border-indigo-500 bg-white/80">
                    <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 py-3">
                      <div>
                        <div className="font-bold text-indigo-700">طلب #{order.id.slice(-6)}</div>
                        <div className="text-sm text-gray-700">{order.customerName || t('noName')}</div>
                        <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString('ar-EG')}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs rounded-full px-3 py-1 font-bold ${getStatusColor(order.status)}`}>{getStatusText(order.status)}</span>
                        <Link href={`/dashboard/orders`}>
                          <Button size="sm" variant="outline" className="text-indigo-700 border-indigo-300">تفاصيل</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <div className="flex justify-center mt-4">
                  <Link href="/dashboard/orders">
                    <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold flex items-center gap-2 relative">
                      <ShoppingCart className="h-4 w-4" />
                      {t('viewOrders')}
                      <span className="ml-2 inline-flex items-center justify-center w-7 h-7 rounded-full bg-white text-indigo-700 font-bold text-base shadow border-2 border-indigo-200">
                        {totalOrders}
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('noOrdersYet')}</h2>
                <p className="text-gray-600 mb-4">{t('startSelling')}</p>
                <Link href="/dashboard/orders">
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    {t('viewOrders')}
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="customers" className="space-y-4">
            <h2 className="text-2xl font-bold">{t('customers')}</h2>
            {(() => {
              // بناء العملاء من الطلبات مباشرة
              const customersMap = new Map();
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
                  const existing = customersMap.get(key);
                  existing.totalOrders += 1;
                  existing.totalSpent += order.total;
                  if (!existing.lastOrderDate || order.createdAt > existing.lastOrderDate) {
                    existing.lastOrderDate = order.createdAt;
                  }
                }
              });
              const customersList = Array.from(customersMap.values());
              return customersList.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">{t('noCustomersMessage')}</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {customersList.map((customer) => (
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
                            <span className="font-medium text-gray-700">{t('phone')}:</span>
                            <span className="text-gray-900">{customer.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium text-gray-700">{t('orders')}:</span>
                            <span className="text-indigo-700 font-bold">{customer.totalOrders}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium text-gray-700">{t('totalSpent')}:</span>
                            <span className="text-green-700 font-bold">${customer.totalSpent.toFixed(2)}</span>
                          </div>
                          {customer.lastOrderDate && (
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-medium text-gray-700">{t('lastOrder')}:</span>
                              <span className="text-gray-600">{new Date(customer.lastOrderDate).toLocaleDateString('ar-EG')}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 mt-4">
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
              );
            })()}
          </TabsContent>

          <TabsContent value="coupons" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{t('coupons')}</h2>
              {user.planType !== 'free' && (
                <Link href="/dashboard/coupons">
                  <Button className="flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('addCoupon')}
                  </Button>
                </Link>
              )}
            </div>
            
            {user.planType === 'free' ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <TrendingUp className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-4">{t('freeCouponMessage')}</p>
                  <Button>{t('upgradePlan')}</Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-6">
                  {activeCoupons.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">{t('noActiveCoupons')}</div>
                  ) : (
                    <div className="space-y-4">
                      {activeCoupons.map(coupon => (
                        <div key={coupon.id} className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-3 gap-2">
                          <div>
                            <div className="font-bold text-lg">{coupon.code}</div>
                            <div className="text-sm text-gray-600">{t('discountPercentage')}: {coupon.discountPercentage}%</div>
                            <div className="text-sm text-gray-600">{t('validUntil')}: {coupon.validUntil instanceof Date ? coupon.validUntil.toLocaleDateString() : String(coupon.validUntil)}</div>
                            {coupon.maxUsage && <div className="text-sm text-gray-600">{t('maxUsage')}: {coupon.maxUsage} {t('uses')}</div>}
                            <div className="text-sm text-gray-600">{t('usageCount')}: {coupon.usageCount}</div>
                          </div>
                          <div className="flex items-center gap-2 mt-2 md:mt-0">
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{t('active')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <h2 className="text-2xl font-bold">{t('settings')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('generalSettings')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    {t('generalSettings')}
                  </p>
                  <Link href="/dashboard/settings/general">
                    <Button variant="outline">{t('edit')}</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('deliverySettings')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    {t('deliverySettings')}
                  </p>
                  <Link href="/dashboard/settings/delivery">
                    <Button variant="outline">{t('edit')}</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('contactSettings')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    {t('contactSettings')}
                  </p>
                  <Link href="/dashboard/settings/contact">
                    <Button variant="outline">{t('edit')}</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('aiSettings')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    {t('aiSettings')}
                  </p>
                  {user.planType !== 'free' ? (
                    <Link href="/dashboard/settings/ai">
                      <Button variant="outline">{t('edit')}</Button>
                    </Link>
                  ) : (
                    <Button variant="outline" disabled>
                      {t('premiumFeature')}
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    {t('paymentSettings')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    {t('paymentSettings')}
                  </p>
                  <Link href="/dashboard/settings/payment">
                    <Button variant="outline">{t('edit')}</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover-lift shadow-glow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Store className="h-5 w-5 mr-2" />
                    {t('currentPlanDetails')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gradient-primary mb-2">
                        {user?.planType !== 'free' ? getPlanDisplayName(user.planType) : t('freePlan')}
                      </div>
                      <div className="text-lg font-semibold mb-2">
                        {user?.planType !== 'free' ? getPlanPrice(user.planType) : t('freeCost')}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {t('planType')}: <span className="font-semibold text-blue-600">
                          {user?.planType !== 'free' ? getPlanDisplayName(user.planType) : t('freePlan')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {user?.planType !== 'free' ? (
                        <>
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            {t('aiDescription')}
                          </div>
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            {t('pwaDescription')}
                          </div>
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            {t('domainDescription')}
                          </div>
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            {t('whatsappInstagram')}
                            {store?.whatsapp || store?.instagram ? (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full mr-2">{t('enabled')}</span>
                            ) : (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full mr-2">{t('disabled')}</span>
                            )}
                          </div>
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            {t('googleAnalytics')}
                          </div>
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            {t('liveSupport')}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            {t('basicStore')}
                          </div>
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            {t('subdomainFree')}
                          </div>
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            {t('limitedFeatures')}
                          </div>
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            {t('emailSupport')}
                          </div>
                        </>
                      )}
                    </div>
                    
                    {user?.planType === 'free' && (
                      <div className="text-center pt-4">
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-blue-800 font-semibold mb-2">🎁 Try all paid features FREE for 1 month!</p>
                          <Link href="/try-for-free">
                            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 text-white w-full mb-2">Start your free month now</Button>
                          </Link>
                          <p className="text-xs text-blue-700">No charges during your first month.</p>
                        </div>
                        <Link href="/checkout">
                          <Button className="bg-gradient-primary hover:opacity-90 text-white w-full">{t('upgradePlan')}</Button>
                        </Link>
                        <p className="text-xs text-gray-500 mt-2">
                          {t('getAdvancedFeatures')}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 