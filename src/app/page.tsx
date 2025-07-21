'use client';

import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Store, Users, Package, Settings, Sparkles, Mail } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const translations: Record<string, Record<string, string>> = {
  en: {
    mainFeatures: 'Main Features',
    fastStoreCreation: 'Fast Store Creation',
    fastStoreCreationDesc: 'Create your online store in minutes without coding experience',
    artificialIntelligence: 'Artificial Intelligence',
    artificialIntelligenceDesc: 'Generate product descriptions, suggested names, and suitable prices automatically',
    integratedShoppingCart: 'Integrated Shopping Cart',
    integratedShoppingCartDesc: 'Advanced cart system with coupon and discount support',
    orderManagement: 'Order Management',
    orderManagementDesc: 'Comprehensive dashboard to manage products, orders, and customers',
    customerSupport: 'Customer Support',
    customerSupportDesc: 'Direct integration with WhatsApp and Instagram for customer communication',
    advancedSettings: 'Advanced Settings',
    advancedSettingsDesc: 'Full store customization with support for both English and Arabic',
    demoStoreExperience: 'Demo Store Experience',
    demoStoreExperienceDesc: 'You can try the public store with demo products. Each account has its own separate store.',
    sellavaDemoStore: 'Sellava Demo Store',
    sellavaDemoStoreDesc: 'A demo store showcasing fake products to try platform features',
    importantNote: 'Important Note:',
    dashboardProductsNote: 'Each account has its own store. Products you add in the dashboard appear only in your own store.',
    toCreateYourOwnStore: 'To create your own store:',
    signInOrCreateAccountNote: 'Sign in or create a new account, then add products from the dashboard.',
    visitDemoStore: 'Visit Demo Store',
    subscriptionPlans: 'Subscription Plans',
    free: 'Free',
    paid: 'Paid',
    perfectForGettingStarted: 'Perfect for getting started',
    basicStoreCreation: 'Basic store creation',
    productManagement: 'Product management',
    shoppingCart: 'Shopping cart',
    bilingualSupport: 'Bilingual support',
    allAdvancedFeatures: 'All advanced features',
    allFreePlanFeatures: 'All Free Plan features',
    couponSystem: 'Coupon system',
    advancedReports: 'Advanced reports',
    premiumSupport: 'Premium support',
    allRightsReserved: 'All rights reserved.',
    dashboard: 'Dashboard',
    viewStore: 'View Store',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    welcomeMessage: 'Welcome to Sellava',
    createStoreMessage: 'Create your online store in minutes',
  },
  ar: {
    mainFeatures: 'الميزات الرئيسية',
    fastStoreCreation: 'إنشاء متجر بسرعة',
    fastStoreCreationDesc: 'أنشئ متجرك الإلكتروني في دقائق بدون خبرة برمجية',
    artificialIntelligence: 'الذكاء الاصطناعي',
    artificialIntelligenceDesc: 'توليد أوصاف المنتجات، الأسماء المقترحة، والأسعار تلقائيًا',
    integratedShoppingCart: 'سلة تسوق متكاملة',
    integratedShoppingCartDesc: 'نظام سلة متقدم مع دعم الكوبونات والخصومات',
    orderManagement: 'إدارة الطلبات',
    orderManagementDesc: 'لوحة تحكم شاملة لإدارة المنتجات والطلبات والعملاء',
    customerSupport: 'دعم العملاء',
    customerSupportDesc: 'تكامل مباشر مع واتساب وإنستغرام للتواصل مع العملاء',
    advancedSettings: 'إعدادات متقدمة',
    advancedSettingsDesc: 'تخصيص كامل للمتجر مع دعم الإنجليزية والعربية',
    demoStoreExperience: 'تجربة المتجر التجريبي',
    demoStoreExperienceDesc: 'يمكنك تجربة المتجر العام مع منتجات تجريبية. كل حساب له متجر منفصل.',
    sellavaDemoStore: 'متجر Sellava التجريبي',
    sellavaDemoStoreDesc: 'متجر تجريبي يعرض منتجات وهمية لتجربة ميزات المنصة',
    importantNote: 'ملاحظة هامة:',
    dashboardProductsNote: 'كل حساب له متجر خاص. المنتجات التي تضيفها في لوحة التحكم تظهر فقط في متجرك.',
    toCreateYourOwnStore: 'لإنشاء متجرك الخاص:',
    signInOrCreateAccountNote: 'سجل الدخول أو أنشئ حساب جديد ثم أضف المنتجات من لوحة التحكم.',
    visitDemoStore: 'زيارة المتجر التجريبي',
    subscriptionPlans: 'خطط الاشتراك',
    free: 'مجاني',
    paid: 'مدفوع',
    perfectForGettingStarted: 'مثالي للبداية',
    basicStoreCreation: 'إنشاء متجر أساسي',
    productManagement: 'إدارة المنتجات',
    shoppingCart: 'سلة التسوق',
    bilingualSupport: 'دعم لغتين',
    allAdvancedFeatures: 'كل الميزات المتقدمة',
    allFreePlanFeatures: 'كل ميزات الخطة المجانية',
    couponSystem: 'نظام الكوبونات',
    advancedReports: 'تقارير متقدمة',
    premiumSupport: 'دعم مميز',
    allRightsReserved: 'جميع الحقوق محفوظة.',
    dashboard: 'لوحة التحكم',
    viewStore: 'عرض المتجر',
    signIn: 'تسجيل الدخول',
    signUp: 'إنشاء حساب',
    welcomeMessage: 'مرحبًا بك في Sellava',
    createStoreMessage: 'أنشئ متجرك الإلكتروني في دقائق',
  },
  es: {
    mainFeatures: 'Características principales',
    fastStoreCreation: 'Creación rápida de tienda',
    fastStoreCreationDesc: 'Crea tu tienda online en minutos sin experiencia en programación',
    artificialIntelligence: 'Inteligencia artificial',
    artificialIntelligenceDesc: 'Genera descripciones de productos, nombres sugeridos y precios automáticamente',
    integratedShoppingCart: 'Carrito de compras integrado',
    integratedShoppingCartDesc: 'Sistema de carrito avanzado con soporte de cupones y descuentos',
    orderManagement: 'Gestión de pedidos',
    orderManagementDesc: 'Panel completo para gestionar productos, pedidos y clientes',
    customerSupport: 'Atención al cliente',
    customerSupportDesc: 'Integración directa con WhatsApp e Instagram para la comunicación con clientes',
    advancedSettings: 'Configuraciones avanzadas',
    advancedSettingsDesc: 'Personalización total de la tienda con soporte para inglés y árabe',
    demoStoreExperience: 'Experiencia de tienda demo',
    demoStoreExperienceDesc: 'Puedes probar la tienda pública con productos de demostración. Cada cuenta tiene su propia tienda.',
    sellavaDemoStore: 'Tienda demo de Sellava',
    sellavaDemoStoreDesc: 'Una tienda demo que muestra productos ficticios para probar las funciones de la plataforma',
    importantNote: 'Nota importante:',
    dashboardProductsNote: 'Cada cuenta tiene su propia tienda. Los productos que agregas en el panel solo aparecen en tu tienda.',
    toCreateYourOwnStore: 'Para crear tu propia tienda:',
    signInOrCreateAccountNote: 'Inicia sesión o crea una cuenta nueva, luego agrega productos desde el panel.',
    visitDemoStore: 'Visitar tienda demo',
    subscriptionPlans: 'Planes de suscripción',
    free: 'Gratis',
    paid: 'De pago',
    perfectForGettingStarted: 'Perfecto para empezar',
    basicStoreCreation: 'Creación básica de tienda',
    productManagement: 'Gestión de productos',
    shoppingCart: 'Carrito de compras',
    bilingualSupport: 'Soporte bilingüe',
    allAdvancedFeatures: 'Todas las funciones avanzadas',
    allFreePlanFeatures: 'Todas las funciones del plan gratuito',
    couponSystem: 'Sistema de cupones',
    advancedReports: 'Informes avanzados',
    premiumSupport: 'Soporte premium',
    allRightsReserved: 'Todos los derechos reservados.',
    dashboard: 'Panel',
    viewStore: 'Ver tienda',
    signIn: 'Iniciar sesión',
    signUp: 'Registrarse',
    welcomeMessage: 'Bienvenido a Sellava',
    createStoreMessage: 'Crea tu tienda online en minutos',
  },
  de: {
    mainFeatures: 'Hauptfunktionen',
    fastStoreCreation: 'Schnelle Shoperstellung',
    fastStoreCreationDesc: 'Erstellen Sie Ihren Online-Shop in wenigen Minuten ohne Programmierkenntnisse',
    artificialIntelligence: 'Künstliche Intelligenz',
    artificialIntelligenceDesc: 'Automatische Generierung von Produktbeschreibungen, Namensvorschlägen und Preisen',
    integratedShoppingCart: 'Integrierter Warenkorb',
    integratedShoppingCartDesc: 'Erweitertes Warenkorbsystem mit Gutschein- und Rabattunterstützung',
    orderManagement: 'Bestellverwaltung',
    orderManagementDesc: 'Umfassendes Dashboard zur Verwaltung von Produkten, Bestellungen und Kunden',
    customerSupport: 'Kundensupport',
    customerSupportDesc: 'Direkte Integration mit WhatsApp und Instagram für die Kundenkommunikation',
    advancedSettings: 'Erweiterte Einstellungen',
    advancedSettingsDesc: 'Vollständige Shop-Anpassung mit Unterstützung für Englisch und Arabisch',
    demoStoreExperience: 'Demo-Shop-Erlebnis',
    demoStoreExperienceDesc: 'Sie können den öffentlichen Shop mit Demo-Produkten ausprobieren. Jeder Account hat seinen eigenen Shop.',
    sellavaDemoStore: 'Sellava Demo-Shop',
    sellavaDemoStoreDesc: 'Ein Demo-Shop mit fiktiven Produkten zur Erprobung der Plattformfunktionen',
    importantNote: 'Wichtiger Hinweis:',
    dashboardProductsNote: 'Jeder Account hat seinen eigenen Shop. Produkte, die Sie im Dashboard hinzufügen, erscheinen nur in Ihrem Shop.',
    toCreateYourOwnStore: 'So erstellen Sie Ihren eigenen Shop:',
    signInOrCreateAccountNote: 'Melden Sie sich an oder erstellen Sie ein neues Konto und fügen Sie dann Produkte über das Dashboard hinzu.',
    visitDemoStore: 'Demo-Shop besuchen',
    subscriptionPlans: 'Abonnementpläne',
    free: 'Kostenlos',
    paid: 'Kostenpflichtig',
    perfectForGettingStarted: 'Perfekt für den Einstieg',
    basicStoreCreation: 'Grundlegende Shoperstellung',
    productManagement: 'Produktverwaltung',
    shoppingCart: 'Warenkorb',
    bilingualSupport: 'Zweisprachige Unterstützung',
    allAdvancedFeatures: 'Alle erweiterten Funktionen',
    allFreePlanFeatures: 'Alle Funktionen des kostenlosen Plans',
    couponSystem: 'Gutscheinsystem',
    advancedReports: 'Erweiterte Berichte',
    premiumSupport: 'Premium-Support',
    allRightsReserved: 'Alle Rechte vorbehalten.',
    dashboard: 'Dashboard',
    viewStore: 'Shop anzeigen',
    signIn: 'Anmelden',
    signUp: 'Registrieren',
    welcomeMessage: 'Willkommen bei Sellava',
    createStoreMessage: 'Erstellen Sie Ihren Online-Shop in Minuten',
  },
  fr: {
    'mainFeatures': 'Fonctionnalités principales',
    'fastStoreCreation': 'Création de boutique rapide',
    'fastStoreCreationDesc': 'Créez votre boutique en ligne en quelques minutes sans expérience en codage',
    'artificialIntelligence': 'Intelligence artificielle',
    'artificialIntelligenceDesc': 'Générez automatiquement des descriptions de produits, des noms suggérés et des prix adaptés',
    'integratedShoppingCart': 'Panier d\'achat intégré',
    'integratedShoppingCartDesc': 'Système de panier avancé avec prise en charge des coupons et des remises',
    'orderManagement': 'Gestion des commandes',
    'orderManagementDesc': 'Tableau de bord complet pour gérer les produits, commandes et clients',
    'customerSupport': 'Support client',
    'customerSupportDesc': 'Intégration directe avec WhatsApp et Instagram pour la communication client',
    'advancedSettings': 'Paramètres avancés',
    'advancedSettingsDesc': 'Personnalisation complète de la boutique avec prise en charge de l\'anglais et de l\'arabe',
    'demoStoreExperience': 'Expérience de boutique démo',
    'demoStoreExperienceDesc': 'Vous pouvez essayer la boutique publique avec des produits de démonstration. Chaque compte a sa propre boutique.',
    'sellavaDemoStore': 'Boutique démo Sellava',
    'sellavaDemoStoreDesc': 'Une boutique démo présentant de faux produits pour essayer les fonctionnalités de la plateforme',
    'importantNote': 'Note importante :',
    'dashboardProductsNote': 'Chaque compte a sa propre boutique. Les produits que vous ajoutez dans le tableau de bord apparaissent uniquement dans votre boutique.',
    'toCreateYourOwnStore': 'Pour créer votre propre boutique :',
    'signInOrCreateAccountNote': 'Connectez-vous ou créez un nouveau compte, puis ajoutez des produits depuis le tableau de bord.',
    'visitDemoStore': 'Visiter la boutique démo',
    'subscriptionPlans': 'Plans d\'abonnement',
    'free': 'Gratuit',
    'paid': 'Payant',
    'perfectForGettingStarted': 'Parfait pour commencer',
    'basicStoreCreation': 'Création de boutique de base',
    'productManagement': 'Gestion des produits',
    'shoppingCart': 'Panier',
    'bilingualSupport': 'Support bilingue',
    'allAdvancedFeatures': 'Toutes les fonctionnalités avancées',
    'allFreePlanFeatures': 'Toutes les fonctionnalités du plan gratuit',
    'couponSystem': 'Système de coupons',
    'advancedReports': 'Rapports avancés',
    'premiumSupport': 'Support premium',
    'allRightsReserved': 'Tous droits réservés.',
    'dashboard': 'Tableau de bord',
    'viewStore': 'Voir la boutique',
    'signIn': 'Connexion',
    'signUp': 'Créer un compte',
    'welcomeMessage': 'Bienvenue sur Sellava',
    'createStoreMessage': 'Créez votre boutique en ligne en quelques minutes',
  },
  it: {
    'mainFeatures': 'Funzionalità principali',
    'fastStoreCreation': 'Creazione rapida del negozio',
    'fastStoreCreationDesc': 'Crea il tuo negozio online in pochi minuti senza esperienza di programmazione',
    'artificialIntelligence': 'Intelligenza artificiale',
    'artificialIntelligenceDesc': 'Genera automaticamente descrizioni dei prodotti, nomi suggeriti e prezzi',
    'integratedShoppingCart': 'Carrello integrato',
    'integratedShoppingCartDesc': 'Sistema di carrello avanzato con supporto per coupon e sconti',
    'orderManagement': 'Gestione ordini',
    'orderManagementDesc': 'Dashboard completa per gestire prodotti, ordini e clienti',
    'customerSupport': 'Assistenza clienti',
    'customerSupportDesc': 'Integrazione diretta con WhatsApp e Instagram per la comunicazione con i clienti',
    'advancedSettings': 'Impostazioni avanzate',
    'advancedSettingsDesc': 'Personalizzazione completa del negozio con supporto per inglese e arabo',
    'demoStoreExperience': 'Esperienza negozio demo',
    'demoStoreExperienceDesc': 'Puoi provare il negozio pubblico con prodotti demo. Ogni account ha il proprio negozio.',
    'sellavaDemoStore': 'Negozio demo Sellava',
    'sellavaDemoStoreDesc': 'Un negozio demo che mostra prodotti fittizi per provare le funzionalità della piattaforma',
    'importantNote': 'Nota importante:',
    'dashboardProductsNote': 'Ogni account ha il proprio negozio. I prodotti aggiunti nella dashboard appaiono solo nel tuo negozio.',
    'toCreateYourOwnStore': 'Per creare il tuo negozio:',
    'signInOrCreateAccountNote': 'Accedi o crea un nuovo account, quindi aggiungi prodotti dalla dashboard.',
    'visitDemoStore': 'Visita il negozio demo',
    'subscriptionPlans': 'Piani di abbonamento',
    'free': 'Gratis',
    'paid': 'A pagamento',
    'perfectForGettingStarted': 'Perfetto per iniziare',
    'basicStoreCreation': 'Creazione negozio di base',
    'productManagement': 'Gestione prodotti',
    'shoppingCart': 'Carrello',
    'bilingualSupport': 'Supporto bilingue',
    'allAdvancedFeatures': 'Tutte le funzionalità avanzate',
    'allFreePlanFeatures': 'Tutte le funzionalità del piano gratuito',
    'couponSystem': 'Sistema di coupon',
    'advancedReports': 'Report avanzati',
    'premiumSupport': 'Supporto premium',
    'allRightsReserved': 'Tutti i diritti riservati.',
    'dashboard': 'Dashboard',
    'viewStore': 'Vedi negozio',
    'signIn': 'Accedi',
    'signUp': 'Registrati',
    'welcomeMessage': 'Benvenuto su Sellava',
    'createStoreMessage': 'Crea il tuo negozio online in pochi minuti',
  },
  pt: {
    'mainFeatures': 'Principais recursos',
    'fastStoreCreation': 'Criação rápida de loja',
    'fastStoreCreationDesc': 'Crie sua loja online em minutos sem experiência em programação',
    'artificialIntelligence': 'Inteligência artificial',
    'artificialIntelligenceDesc': 'Gere descrições de produtos, nomes sugeridos e preços automaticamente',
    'integratedShoppingCart': 'Carrinho de compras integrado',
    'integratedShoppingCartDesc': 'Sistema de carrinho avançado com suporte a cupons e descontos',
    'orderManagement': 'Gestão de pedidos',
    'orderManagementDesc': 'Painel completo para gerenciar produtos, pedidos e clientes',
    'customerSupport': 'Atendimento ao cliente',
    'customerSupportDesc': 'Integração direta com WhatsApp e Instagram para comunicação com clientes',
    'advancedSettings': 'Configurações avançadas',
    'advancedSettingsDesc': 'Personalização total da loja com suporte para inglês e árabe',
    'demoStoreExperience': 'Experiência de loja demo',
    'demoStoreExperienceDesc': 'Você pode experimentar a loja pública com produtos de demonstração. Cada conta tem sua própria loja.',
    'sellavaDemoStore': 'Loja demo Sellava',
    'sellavaDemoStoreDesc': 'Uma loja demo exibindo produtos fictícios para testar os recursos da plataforma',
    'importantNote': 'Nota importante:',
    'dashboardProductsNote': 'Cada conta tem sua própria loja. Os produtos adicionados no painel aparecem apenas na sua loja.',
    'toCreateYourOwnStore': 'Para criar sua própria loja:',
    'signInOrCreateAccountNote': 'Faça login ou crie uma nova conta e adicione produtos pelo painel.',
    'visitDemoStore': 'Visitar loja demo',
    'subscriptionPlans': 'Planos de assinatura',
    'free': 'Grátis',
    'paid': 'Pago',
    'perfectForGettingStarted': 'Perfeito para começar',
    'basicStoreCreation': 'Criação de loja básica',
    'productManagement': 'Gestão de produtos',
    'shoppingCart': 'Carrinho',
    'bilingualSupport': 'Suporte bilíngue',
    'allAdvancedFeatures': 'Todos os recursos avançados',
    'allFreePlanFeatures': 'Todos os recursos do plano gratuito',
    'couponSystem': 'Sistema de cupons',
    'advancedReports': 'Relatórios avançados',
    'premiumSupport': 'Suporte premium',
    'allRightsReserved': 'Todos os direitos reservados.',
    'dashboard': 'Painel',
    'viewStore': 'Ver loja',
    'signIn': 'Entrar',
    'signUp': 'Registrar',
    'welcomeMessage': 'Bem-vindo ao Sellava',
    'createStoreMessage': 'Crie sua loja online em minutos',
  },
  ru: {
    'mainFeatures': 'Основные функции',
    'fastStoreCreation': 'Быстрое создание магазина',
    'fastStoreCreationDesc': 'Создайте свой интернет-магазин за считанные минуты без опыта программирования',
    'artificialIntelligence': 'Искусственный интеллект',
    'artificialIntelligenceDesc': 'Автоматически генерируйте описания товаров, предлагаемые имена и цены',
    'integratedShoppingCart': 'Интегрированная корзина',
    'integratedShoppingCartDesc': 'Продвинутая система корзины с поддержкой купонов и скидок',
    'orderManagement': 'Управление заказами',
    'orderManagementDesc': 'Полная панель управления для управления товарами, заказами и клиентами',
    'customerSupport': 'Поддержка клиентов',
    'customerSupportDesc': 'Прямая интеграция с WhatsApp и Instagram для общения с клиентами',
    'advancedSettings': 'Расширенные настройки',
    'advancedSettingsDesc': 'Полная настройка магазина с поддержкой английского и арабского языков',
    'demoStoreExperience': 'Демо-магазин',
    'demoStoreExperienceDesc': 'Вы можете попробовать публичный магазин с демонстрационными товарами. У каждой учетной записи свой магазин.',
    'sellavaDemoStore': 'Демо-магазин Sellava',
    'sellavaDemoStoreDesc': 'Демо-магазин с фиктивными товарами для тестирования функций платформы',
    'importantNote': 'Важное примечание:',
    'dashboardProductsNote': 'У каждой учетной записи свой магазин. Товары, добавленные на панели, отображаются только в вашем магазине.',
    'toCreateYourOwnStore': 'Чтобы создать свой магазин:',
    'signInOrCreateAccountNote': 'Войдите или создайте новую учетную запись, затем добавьте товары через панель.',
    'visitDemoStore': 'Посетить демо-магазин',
    'subscriptionPlans': 'Тарифные планы',
    'free': 'Бесплатно',
    'paid': 'Платно',
    'perfectForGettingStarted': 'Идеально для начала',
    'basicStoreCreation': 'Базовое создание магазина',
    'productManagement': 'Управление товарами',
    'shoppingCart': 'Корзина',
    'bilingualSupport': 'Двуязычная поддержка',
    'allAdvancedFeatures': 'Все расширенные функции',
    'allFreePlanFeatures': 'Все функции бесплатного плана',
    'couponSystem': 'Система купонов',
    'advancedReports': 'Расширенные отчеты',
    'premiumSupport': 'Премиум-поддержка',
    'allRightsReserved': 'Все права защищены.',
    'dashboard': 'Панель',
    'viewStore': 'Посмотреть магазин',
    'signIn': 'Войти',
    'signUp': 'Зарегистрироваться',
    'welcomeMessage': 'Добро пожаловать в Sellava',
    'createStoreMessage': 'Создайте свой интернет-магазин за считанные минуты',
  },
  zh: {
    'mainFeatures': '主要功能',
    'fastStoreCreation': '快速创建商店',
    'fastStoreCreationDesc': '几分钟内创建您的在线商店，无需编程经验',
    'artificialIntelligence': '人工智能',
    'artificialIntelligenceDesc': '自动生成产品描述、建议名称和价格',
    'integratedShoppingCart': '集成购物车',
    'integratedShoppingCartDesc': '高级购物车系统，支持优惠券和折扣',
    'orderManagement': '订单管理',
    'orderManagementDesc': '全面的仪表板，用于管理产品、订单和客户',
    'customerSupport': '客户支持',
    'customerSupportDesc': '与WhatsApp和Instagram直接集成，方便客户沟通',
    'advancedSettings': '高级设置',
    'advancedSettingsDesc': '支持英语和阿拉伯语的完整商店自定义',
    'demoStoreExperience': '演示商店体验',
    'demoStoreExperienceDesc': '您可以使用演示产品试用公共商店。每个账户都有自己的商店。',
    'sellavaDemoStore': 'Sellava演示商店',
    'sellavaDemoStoreDesc': '一个展示虚拟产品以试用平台功能的演示商店',
    'importantNote': '重要提示：',
    'dashboardProductsNote': '每个账户都有自己的商店。在仪表板中添加的产品只会出现在您的商店中。',
    'toCreateYourOwnStore': '要创建您自己的商店：',
    'signInOrCreateAccountNote': '登录或创建新账户，然后从仪表板添加产品。',
    'visitDemoStore': '访问演示商店',
    'subscriptionPlans': '订阅计划',
    'free': '免费',
    'paid': '付费',
    'perfectForGettingStarted': '非常适合入门',
    'basicStoreCreation': '基本商店创建',
    'productManagement': '产品管理',
    'shoppingCart': '购物车',
    'bilingualSupport': '双语支持',
    'allAdvancedFeatures': '所有高级功能',
    'allFreePlanFeatures': '所有免费计划功能',
    'couponSystem': '优惠券系统',
    'advancedReports': '高级报告',
    'premiumSupport': '高级支持',
    'allRightsReserved': '版权所有。',
    'dashboard': '仪表板',
    'viewStore': '查看商店',
    'signIn': '登录',
    'signUp': '注册',
    'welcomeMessage': '欢迎来到Sellava',
    'createStoreMessage': '几分钟内创建您的在线商店',
  },
  ja: {
    'mainFeatures': '主な機能',
    'fastStoreCreation': 'ストアの迅速な作成',
    'fastStoreCreationDesc': 'プログラミング経験なしで数分でオンラインストアを作成',
    'artificialIntelligence': '人工知能',
    'artificialIntelligenceDesc': '商品説明、提案名、価格を自動生成',
    'integratedShoppingCart': '統合ショッピングカート',
    'integratedShoppingCartDesc': 'クーポンや割引に対応した高度なカートシステム',
    'orderManagement': '注文管理',
    'orderManagementDesc': '商品、注文、顧客を管理する包括的なダッシュボード',
    'customerSupport': 'カスタマーサポート',
    'customerSupportDesc': 'WhatsAppやInstagramと直接連携して顧客とコミュニケーション',
    'advancedSettings': '高度な設定',
    'advancedSettingsDesc': '英語とアラビア語に対応したストアの完全なカスタマイズ',
    'demoStoreExperience': 'デモストア体験',
    'demoStoreExperienceDesc': 'デモ商品でパブリックストアを試せます。各アカウントには独自のストアがあります。',
    'sellavaDemoStore': 'Sellavaデモストア',
    'sellavaDemoStoreDesc': 'プラットフォーム機能を試すための架空の商品を展示するデモストア',
    'importantNote': '重要な注意：',
    'dashboardProductsNote': '各アカウントには独自のストアがあります。ダッシュボードに追加した商品は自分のストアにのみ表示されます。',
    'toCreateYourOwnStore': '自分のストアを作成するには：',
    'signInOrCreateAccountNote': 'ログインして新しいアカウントを作成し、ダッシュボードから商品を追加してください。',
    'visitDemoStore': 'デモストアを訪問',
    'subscriptionPlans': 'サブスクリプションプラン',
    'free': '無料',
    'paid': '有料',
    'perfectForGettingStarted': 'はじめに最適',
    'basicStoreCreation': '基本的なストア作成',
    'productManagement': '商品管理',
    'shoppingCart': 'ショッピングカート',
    'bilingualSupport': 'バイリンガルサポート',
    'allAdvancedFeatures': 'すべての高度な機能',
    'allFreePlanFeatures': 'すべての無料プラン機能',
    'couponSystem': 'クーポンシステム',
    'advancedReports': '高度なレポート',
    'premiumSupport': 'プレミアムサポート',
    'allRightsReserved': '全著作権所有。',
    'dashboard': 'ダッシュボード',
    'viewStore': 'ストアを見る',
    'signIn': 'サインイン',
    'signUp': 'サインアップ',
    'welcomeMessage': 'Sellavaへようこそ',
    'createStoreMessage': '数分でオンラインストアを作成',
  },
  tr: {
    'mainFeatures': 'Ana Özellikler',
    'fastStoreCreation': 'Hızlı Mağaza Oluşturma',
    'fastStoreCreationDesc': 'Kodlama deneyimi olmadan dakikalar içinde çevrimiçi mağazanızı oluşturun',
    'artificialIntelligence': 'Yapay Zeka',
    'artificialIntelligenceDesc': 'Ürün açıklamaları, önerilen isimler ve uygun fiyatları otomatik olarak oluşturun',
    'integratedShoppingCart': 'Entegre Alışveriş Sepeti',
    'integratedShoppingCartDesc': 'Kupon ve indirim desteğiyle gelişmiş sepet sistemi',
    'orderManagement': 'Sipariş Yönetimi',
    'orderManagementDesc': 'Ürünleri, siparişleri ve müşterileri yönetmek için kapsamlı kontrol paneli',
    'customerSupport': 'Müşteri Desteği',
    'customerSupportDesc': 'Müşteri iletişimi için WhatsApp ve Instagram ile doğrudan entegrasyon',
    'advancedSettings': 'Gelişmiş Ayarlar',
    'advancedSettingsDesc': 'Hem İngilizce hem de Arapça desteğiyle tam mağaza özelleştirmesi',
    'demoStoreExperience': 'Demo Mağaza Deneyimi',
    'demoStoreExperienceDesc': 'Demo ürünlerle genel mağazayı deneyebilirsiniz. Her hesabın kendi mağazası vardır.',
    'sellavaDemoStore': 'Sellava Demo Mağazası',
    'sellavaDemoStoreDesc': 'Platform özelliklerini denemek için sahte ürünler sergileyen bir demo mağaza',
    'importantNote': 'Önemli Not:',
    'dashboardProductsNote': 'Her hesabın kendi mağazası vardır. Kontrol paneline eklediğiniz ürünler yalnızca kendi mağazanızda görünür.',
    'toCreateYourOwnStore': 'Kendi mağazanızı oluşturmak için:',
    'signInOrCreateAccountNote': 'Giriş yapın veya yeni bir hesap oluşturun, ardından kontrol panelinden ürün ekleyin.',
    'visitDemoStore': 'Demo Mağazayı Ziyaret Et',
    'subscriptionPlans': 'Abonelik Planları',
    'free': 'Ücretsiz',
    'paid': 'Ücretli',
    'perfectForGettingStarted': 'Başlamak için mükemmel',
    'basicStoreCreation': 'Temel mağaza oluşturma',
    'productManagement': 'Ürün yönetimi',
    'shoppingCart': 'Alışveriş sepeti',
    'bilingualSupport': 'Çift dilli destek',
    'allAdvancedFeatures': 'Tüm gelişmiş özellikler',
    'allFreePlanFeatures': 'Tüm ücretsiz plan özellikleri',
    'couponSystem': 'Kupon sistemi',
    'advancedReports': 'Gelişmiş raporlar',
    'premiumSupport': 'Premium destek',
    'allRightsReserved': 'Tüm hakları saklıdır.',
    'dashboard': 'Kontrol Paneli',
    'viewStore': 'Mağazayı Görüntüle',
    'signIn': 'Giriş Yap',
    'signUp': 'Kayıt Ol',
    'welcomeMessage': 'Sellava\'ya Hoşgeldiniz',
    'createStoreMessage': 'Dakikalar içinde çevrimiçi mağazanızı oluşturun',
  },
  hi: {
    'mainFeatures': 'मुख्य विशेषताएं',
    'fastStoreCreation': 'तेजी से स्टोर बनाएं',
    'fastStoreCreationDesc': 'कोडिंग अनुभव के बिना कुछ ही मिनटों में अपना ऑनलाइन स्टोर बनाएं',
    'artificialIntelligence': 'कृत्रिम बुद्धिमत्ता',
    'artificialIntelligenceDesc': 'स्वचालित रूप से उत्पाद विवरण, सुझाए गए नाम और उपयुक्त मूल्य उत्पन्न करें',
    'integratedShoppingCart': 'एकीकृत शॉपिंग कार्ट',
    'integratedShoppingCartDesc': 'कूपन और छूट समर्थन के साथ उन्नत कार्ट सिस्टम',
    'orderManagement': 'आदेश प्रबंधन',
    'orderManagementDesc': 'उत्पादों, आदेशों और ग्राहकों का प्रबंधन करने के लिए व्यापक डैशबोर्ड',
    'customerSupport': 'ग्राहक सहायता',
    'customerSupportDesc': 'ग्राहक संचार के लिए WhatsApp और Instagram के साथ प्रत्यक्ष एकीकरण',
    'advancedSettings': 'उन्नत सेटिंग्स',
    'advancedSettingsDesc': 'अंग्रेजी और अरबी दोनों के समर्थन के साथ पूर्ण स्टोर अनुकूलन',
    'demoStoreExperience': 'डेमो स्टोर अनुभव',
    'demoStoreExperienceDesc': 'आप डेमो उत्पादों के साथ सार्वजनिक स्टोर आज़मा सकते हैं। प्रत्येक खाते का अपना स्टोर होता है।',
    'sellavaDemoStore': 'Sellava डेमो स्टोर',
    'sellavaDemoStoreDesc': 'प्लेटफ़ॉर्म सुविधाओं को आज़माने के लिए नकली उत्पादों को प्रदर्शित करने वाला डेमो स्टोर',
    'importantNote': 'महत्वपूर्ण नोट:',
    'dashboardProductsNote': 'प्रत्येक खाते का अपना स्टोर होता है। डैशबोर्ड में जो उत्पाद आप जोड़ते हैं वे केवल आपके स्टोर में दिखाई देंगे।',
    'toCreateYourOwnStore': 'अपना स्टोर बनाने के लिए:',
    'signInOrCreateAccountNote': 'लॉगिन करें या नया खाता बनाएं, फिर डैशबोर्ड से उत्पाद जोड़ें।',
    'visitDemoStore': 'डेमो स्टोर देखें',
    'subscriptionPlans': 'सदस्यता योजनाएं',
    'free': 'मुफ्त',
    'paid': 'पेड',
    'perfectForGettingStarted': 'शुरू करने के लिए उत्तम',
    'basicStoreCreation': 'मूल स्टोर निर्माण',
    'productManagement': 'उत्पाद प्रबंधन',
    'shoppingCart': 'शॉपिंग कार्ट',
    'bilingualSupport': 'द्विभाषी समर्थन',
    'allAdvancedFeatures': 'सभी उन्नत सुविधाएँ',
    'allFreePlanFeatures': 'सभी मुफ्त योजना सुविधाएँ',
    'couponSystem': 'कूपन सिस्टम',
    'advancedReports': 'उन्नत रिपोर्ट',
    'premiumSupport': 'प्रीमियम समर्थन',
    'allRightsReserved': 'सर्वाधिकार सुरक्षित।',
    'dashboard': 'डैशबोर्ड',
    'viewStore': 'स्टोर देखें',
    'signIn': 'लॉगिन',
    'signUp': 'साइन अप',
    'welcomeMessage': 'Sellava में आपका स्वागत है',
    'createStoreMessage': 'कुछ ही मिनटों में अपना ऑनलाइन स्टोर बनाएं',
  },
  id: {
    'mainFeatures': 'Fitur utama',
    'fastStoreCreation': 'Pembuatan toko cepat',
    'fastStoreCreationDesc': 'Buat toko online Anda dalam hitungan menit tanpa pengalaman pemrograman',
    'artificialIntelligence': 'Kecerdasan buatan',
    'artificialIntelligenceDesc': 'Secara otomatis menghasilkan deskripsi produk, nama yang disarankan, dan harga',
    'integratedShoppingCart': 'Keranjang belanja terintegrasi',
    'integratedShoppingCartDesc': 'Sistem keranjang canggih dengan dukungan kupon dan diskon',
    'orderManagement': 'Manajemen pesanan',
    'orderManagementDesc': 'Dasbor lengkap untuk mengelola produk, pesanan, dan pelanggan',
    'customerSupport': 'Dukungan pelanggan',
    'customerSupportDesc': 'Integrasi langsung dengan WhatsApp dan Instagram untuk komunikasi pelanggan',
    'advancedSettings': 'Pengaturan lanjutan',
    'advancedSettingsDesc': 'Kustomisasi toko penuh dengan dukungan bahasa Inggris dan Arab',
    'demoStoreExperience': 'Pengalaman toko demo',
    'demoStoreExperienceDesc': 'Anda dapat mencoba toko publik dengan produk demo. Setiap akun memiliki tokonya sendiri.',
    'sellavaDemoStore': 'Toko demo Sellava',
    'sellavaDemoStoreDesc': 'Toko demo yang menampilkan produk palsu untuk mencoba fitur platform',
    'importantNote': 'Catatan penting:',
    'dashboardProductsNote': 'Setiap akun memiliki tokonya sendiri. Produk yang Anda tambahkan di dasbor hanya muncul di toko Anda.',
    'toCreateYourOwnStore': 'Untuk membuat toko Anda sendiri:',
    'signInOrCreateAccountNote': 'Masuk atau buat akun baru, lalu tambahkan produk dari dasbor.',
    'visitDemoStore': 'Kunjungi toko demo',
    'subscriptionPlans': 'Paket langganan',
    'free': 'Gratis',
    'paid': 'Berbayar',
    'perfectForGettingStarted': 'Sempurna untuk memulai',
    'basicStoreCreation': 'Pembuatan toko dasar',
    'productManagement': 'Manajemen produk',
    'shoppingCart': 'Keranjang belanja',
    'bilingualSupport': 'Dukungan bilingual',
    'allAdvancedFeatures': 'Semua fitur lanjutan',
    'allFreePlanFeatures': 'Semua fitur paket gratis',
    'couponSystem': 'Sistem kupon',
    'advancedReports': 'Laporan lanjutan',
    'premiumSupport': 'Dukungan premium',
    'allRightsReserved': 'Hak cipta dilindungi undang-undang.',
    'dashboard': 'Dasbor',
    'viewStore': 'Lihat toko',
    'signIn': 'Masuk',
    'signUp': 'Daftar',
    'welcomeMessage': 'Selamat datang di Sellava',
    'createStoreMessage': 'Buat toko online Anda dalam hitungan menit',
  },
  ko: {
    'mainFeatures': '주요 기능',
    'fastStoreCreation': '빠른 스토어 생성',
    'fastStoreCreationDesc': '프로그래밍 경험 없이 몇 분 만에 온라인 스토어를 만드세요',
    'artificialIntelligence': '인공지능',
    'artificialIntelligenceDesc': '제품 설명, 제안된 이름, 적절한 가격을 자동으로 생성',
    'integratedShoppingCart': '통합 쇼핑카트',
    'integratedShoppingCartDesc': '쿠폰 및 할인 지원이 포함된 고급 카트 시스템',
    'orderManagement': '주문 관리',
    'orderManagementDesc': '제품, 주문 및 고객을 관리하는 종합 대시보드',
    'customerSupport': '고객 지원',
    'customerSupportDesc': 'WhatsApp 및 Instagram과 직접 통합하여 고객과 소통',
    'advancedSettings': '고급 설정',
    'advancedSettingsDesc': '영어와 아랍어 지원이 포함된 전체 스토어 맞춤화',
    'demoStoreExperience': '데모 스토어 체험',
    'demoStoreExperienceDesc': '데모 제품으로 공개 스토어를 체험할 수 있습니다. 각 계정에는 고유한 스토어가 있습니다.',
    'sellavaDemoStore': 'Sellava 데모 스토어',
    'sellavaDemoStoreDesc': '플랫폼 기능을 체험할 수 있도록 가상 제품을 전시하는 데모 스토어',
    'importantNote': '중요 참고:',
    'dashboardProductsNote': '각 계정에는 고유한 스토어가 있습니다. 대시보드에 추가한 제품은 내 스토어에만 표시됩니다.',
    'toCreateYourOwnStore': '내 스토어를 만들려면:',
    'signInOrCreateAccountNote': '로그인하거나 새 계정을 만든 후 대시보드에서 제품을 추가하세요.',
    'visitDemoStore': '데모 스토어 방문',
    'subscriptionPlans': '구독 플랜',
    'free': '무료',
    'paid': '유료',
    'perfectForGettingStarted': '시작하기에 완벽',
    'basicStoreCreation': '기본 스토어 생성',
    'productManagement': '제품 관리',
    'shoppingCart': '쇼핑카트',
    'bilingualSupport': '이중 언어 지원',
    'allAdvancedFeatures': '모든 고급 기능',
    'allFreePlanFeatures': '모든 무료 플랜 기능',
    'couponSystem': '쿠폰 시스템',
    'advancedReports': '고급 보고서',
    'premiumSupport': '프리미엄 지원',
    'allRightsReserved': '모든 권리 보유.',
    'dashboard': '대시보드',
    'viewStore': '스토어 보기',
    'signIn': '로그인',
    'signUp': '가입하기',
    'welcomeMessage': 'Sellava에 오신 것을 환영합니다',
    'createStoreMessage': '몇 분 만에 온라인 스토어를 만드세요',
  },
  nl: {
    'mainFeatures': 'Belangrijkste functies',
    'fastStoreCreation': 'Snelle winkelcreatie',
    'fastStoreCreationDesc': 'Maak uw online winkel in enkele minuten zonder programmeerervaring',
    'artificialIntelligence': 'Kunstmatige intelligentie',
    'artificialIntelligenceDesc': 'Genereer automatisch productbeschrijvingen, voorgestelde namen en prijzen',
    'integratedShoppingCart': 'Geïntegreerde winkelwagen',
    'integratedShoppingCartDesc': 'Geavanceerd winkelwagensysteem met ondersteuning voor coupons en kortingen',
    'orderManagement': 'Bestelbeheer',
    'orderManagementDesc': 'Uitgebreid dashboard voor het beheren van producten, bestellingen en klanten',
    'customerSupport': 'Klantenservice',
    'customerSupportDesc': 'Directe integratie met WhatsApp en Instagram voor klantcommunicatie',
    'advancedSettings': 'Geavanceerde instellingen',
    'advancedSettingsDesc': 'Volledige winkelpersonalisatie met ondersteuning voor Engels en Arabisch',
    'demoStoreExperience': 'Demo winkelervaring',
    'demoStoreExperienceDesc': 'U kunt de openbare winkel met demo-producten proberen. Elk account heeft zijn eigen winkel.',
    'sellavaDemoStore': 'Sellava demo winkel',
    'sellavaDemoStoreDesc': 'Een demo winkel met fictieve producten om de platformfuncties te proberen',
    'importantNote': 'Belangrijke opmerking:',
    'dashboardProductsNote': 'Elk account heeft zijn eigen winkel. Producten die u toevoegt in het dashboard verschijnen alleen in uw winkel.',
    'toCreateYourOwnStore': 'Uw eigen winkel maken:',
    'signInOrCreateAccountNote': 'Log in of maak een nieuw account aan en voeg vervolgens producten toe via het dashboard.',
    'visitDemoStore': 'Bezoek demo winkel',
    'subscriptionPlans': 'Abonnementsplannen',
    'free': 'Gratis',
    'paid': 'Betaald',
    'perfectForGettingStarted': 'Perfect om te beginnen',
    'basicStoreCreation': 'Basis winkelcreatie',
    'productManagement': 'Productbeheer',
    'shoppingCart': 'Winkelwagen',
    'bilingualSupport': 'Tweetalige ondersteuning',
    'allAdvancedFeatures': 'Alle geavanceerde functies',
    'allFreePlanFeatures': 'Alle functies van het gratis plan',
    'couponSystem': 'Couponsysteem',
    'advancedReports': 'Geavanceerde rapporten',
    'premiumSupport': 'Premium ondersteuning',
    'allRightsReserved': 'Alle rechten voorbehouden.',
    'dashboard': 'Dashboard',
    'viewStore': 'Winkel bekijken',
    'signIn': 'Inloggen',
    'signUp': 'Registreren',
    'welcomeMessage': 'Welkom bij Sellava',
    'createStoreMessage': 'Maak uw online winkel in enkele minuten',
  },
  pl: {
    'mainFeatures': 'Główne funkcje',
    'fastStoreCreation': 'Szybkie tworzenie sklepu',
    'fastStoreCreationDesc': 'Stwórz swój sklep internetowy w kilka minut bez doświadczenia w programowaniu',
    'artificialIntelligence': 'Sztuczna inteligencja',
    'artificialIntelligenceDesc': 'Automatycznie generuj opisy produktów, sugerowane nazwy i ceny',
    'integratedShoppingCart': 'Zintegrowany koszyk',
    'integratedShoppingCartDesc': 'Zaawansowany system koszyka z obsługą kuponów i rabatów',
    'orderManagement': 'Zarządzanie zamówieniami',
    'orderManagementDesc': 'Kompletny panel do zarządzania produktami, zamówieniami i klientami',
    'customerSupport': 'Obsługa klienta',
    'customerSupportDesc': 'Bezpośrednia integracja z WhatsApp i Instagramem do komunikacji z klientami',
    'advancedSettings': 'Zaawansowane ustawienia',
    'advancedSettingsDesc': 'Pełna personalizacja sklepu z obsługą języka angielskiego i arabskiego',
    'demoStoreExperience': 'Doświadczenie sklepu demo',
    'demoStoreExperienceDesc': 'Możesz wypróbować sklep publiczny z produktami demo. Każde konto ma swój własny sklep.',
    'sellavaDemoStore': 'Sklep demo Sellava',
    'sellavaDemoStoreDesc': 'Sklep demo prezentujący fikcyjne produkty do wypróbowania funkcji platformy',
    'importantNote': 'Ważna uwaga:',
    'dashboardProductsNote': 'Każde konto ma swój własny sklep. Produkty dodane w panelu pojawiają się tylko w Twoim sklepie.',
    'toCreateYourOwnStore': 'Aby utworzyć własny sklep:',
    'signInOrCreateAccountNote': 'Zaloguj się lub utwórz nowe konto, a następnie dodaj produkty z panelu.',
    'visitDemoStore': 'Odwiedź sklep demo',
    'subscriptionPlans': 'Plany subskrypcji',
    'free': 'Darmowy',
    'paid': 'Płatny',
    'perfectForGettingStarted': 'Idealny na początek',
    'basicStoreCreation': 'Podstawowe tworzenie sklepu',
    'productManagement': 'Zarządzanie produktami',
    'shoppingCart': 'Koszyk',
    'bilingualSupport': 'Wsparcie dwujęzyczne',
    'allAdvancedFeatures': 'Wszystkie zaawansowane funkcje',
    'allFreePlanFeatures': 'Wszystkie funkcje darmowego planu',
    'couponSystem': 'System kuponów',
    'advancedReports': 'Zaawansowane raporty',
    'premiumSupport': 'Wsparcie premium',
    'allRightsReserved': 'Wszelkie prawa zastrzeżone.',
    'dashboard': 'Panel',
    'viewStore': 'Zobacz sklep',
    'signIn': 'Zaloguj się',
    'signUp': 'Zarejestruj się',
    'welcomeMessage': 'Witamy w Sellava',
    'createStoreMessage': 'Stwórz swój sklep internetowy w kilka minut',
  },
};

export default function HomePage() {
  const { user, loading } = useAuth();
  const [lang, setLang] = useState('en');
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);
  const t = (key: string) => translations[lang][key] || translations['en'][key] || key;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Store className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Sellava</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as 'ar' | 'en')}
                className="border rounded-md px-3 py-2"
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
              <a href="mailto:storebuldier@gmail.com" target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Customer Support
                </Button>
              </a>
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link href="/dashboard">
                    <Button>{t('dashboard')}</Button>
                  </Link>
                  <Link href={user.email === 'test@example.com' ? '/public-store/wNgsY8iZE7M52xMIhvjDKndYqMh1' : `/public-store/${user.uid}`}>
                    <Button variant="outline">{t('viewStore')}</Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href="/auth/signin">
                    <Button variant="outline">{t('signIn')}</Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button>{t('signUp')}</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl font-bold mb-6 animate-bounce-slow">
            {t('welcomeMessage')}
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            {t('createStoreMessage')}
          </p>
          
          {!user && (
            <div className="flex justify-center space-x-4">
              <Link href="/auth/signup">
                <Button size="lg" className="text-lg px-8 py-4 bg-white text-primary hover:bg-gray-100 shadow-glow hover-lift">
                  {t('signUp')}
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary">
                  {t('signIn')}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('mainFeatures')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover-lift shadow-glow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <Store className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">{t('fastStoreCreation')}</CardTitle>
                <CardDescription>{t('fastStoreCreationDesc')}</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-lift shadow-glow-success">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-success rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">{t('artificialIntelligence')}</CardTitle>
                <CardDescription>{t('artificialIntelligenceDesc')}</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-lift shadow-glow-warning">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-warning rounded-lg flex items-center justify-center mb-4">
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">{t('integratedShoppingCart')}</CardTitle>
                <CardDescription>{t('integratedShoppingCartDesc')}</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-lift shadow-glow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center mb-4">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">{t('orderManagement')}</CardTitle>
                <CardDescription>{t('orderManagementDesc')}</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-lift shadow-glow-success">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-dark rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">{t('customerSupport')}</CardTitle>
                <CardDescription>{t('customerSupportDesc')}</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-lift shadow-glow-warning">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">{t('advancedSettings')}</CardTitle>
                <CardDescription>{t('advancedSettingsDesc')}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Store Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('demoStoreExperience')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('demoStoreExperienceDesc')}
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
            <div className="text-center">
              <Store className="h-16 w-16 text-purple-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('sellavaDemoStore')}</h3>
              <p className="text-gray-600 mb-6">
                {t('sellavaDemoStoreDesc')}
              </p>
              
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-700">
                    <strong>{t('importantNote')}</strong> {t('dashboardProductsNote')}
                  </p>
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                    <p className="text-sm text-green-700">
                      <strong>{t('toCreateYourOwnStore')}</strong> {t('signInOrCreateAccountNote')}
                    </p>
                  </div>
                </div>
                
                <Link href="/public-store/wNgsY8iZE7M52xMIhvjDKndYqMh1">
                  <Button size="lg" className="bg-gradient-primary hover:opacity-90 text-white px-8">
                    <Store className="h-5 w-5 mr-2" />
                    {t('visitDemoStore')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t('subscriptionPlans')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {t('freePlan')}
                  <Badge variant="secondary">{t('free')}</Badge>
                </CardTitle>
                <CardDescription>
                  {t('perfectForGettingStarted')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {t('basicStoreCreation')}
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {t('productManagement')}
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {t('shoppingCart')}
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {t('bilingualSupport')}
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {t('paidPlan')}
                  <Badge variant="default">{t('paid')}</Badge>
                </CardTitle>
                <CardDescription>
                  {t('allAdvancedFeatures')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {t('allFreePlanFeatures')}
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {t('artificialIntelligence')}
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {t('couponSystem')}
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {t('advancedReports')}
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {t('premiumSupport')}
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Sellava. {t('allRightsReserved')}</p>
        </div>
      </footer>
    </div>
  );
}
