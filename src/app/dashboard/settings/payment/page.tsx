'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Banknote, Settings, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { toast } from 'sonner';
import { getStore, updateStore } from '@/lib/firebase-services';
import type { Store } from '@/types';

// ترجمة النصوص بجميع اللغات
const translations = {
  en: {
    paymentSettings: "Payment Settings",
    paymentMethods: "Payment Methods",
    cashOnDelivery: "Cash on Delivery",
    electronicPayment: "Electronic Payment",
    stripeIntegration: "Stripe Integration",
    enableStripe: "Enable Stripe",
    stripePublicKey: "Stripe Public Key",
    stripeSecretKey: "Stripe Secret Key",
    saveSettings: "Save Settings",
    settingsSaved: "Settings saved successfully!",
    settingsError: "Error saving settings",
    loadingSettings: "Loading settings...",
    paymentOptions: "Payment Options",
    selectPaymentMethods: "Select payment methods for your customers:",
    bothMethods: "Both methods (customer chooses)",
    electronicOnly: "Electronic payment only",
    cashOnly: "Cash on delivery only",
    stripeSetup: "Stripe Setup",
    stripeSetupDescription: "Configure your Stripe account to accept electronic payments",
    stripeKeysDescription: "Get your API keys from your Stripe dashboard",
    testMode: "Test Mode",
    liveMode: "Live Mode",
    modeDescription: "Use test keys for development, live keys for production",
    paymentFlow: "Payment Flow",
    paymentFlowDescription: "How customers will pay for orders",
    automaticRedirect: "Automatic redirect based on settings",
    customerChoice: "Customer chooses payment method",
    settings: "Settings",
    generalSettings: "General Settings",
    deliverySettings: "Delivery Settings",
    contactSettings: "Contact Settings",
    aiSettings: "AI Settings",
    paymentSettingsTitle: "Payment Settings",
    premiumFeature: "Premium Feature",
    upgradePlan: "Upgrade to paid plan",
    freePlanMessage: "Electronic payment is available for paid plans only",
  },
  ar: {
    paymentSettings: "إعدادات الدفع",
    paymentMethods: "طرق الدفع",
    cashOnDelivery: "الدفع عند الاستلام",
    electronicPayment: "الدفع الإلكتروني",
    stripeIntegration: "تكامل سترايب",
    enableStripe: "تفعيل سترايب",
    stripePublicKey: "مفتاح سترايب العام",
    stripeSecretKey: "مفتاح سترايب السري",
    saveSettings: "حفظ الإعدادات",
    settingsSaved: "تم حفظ الإعدادات بنجاح!",
    settingsError: "خطأ في حفظ الإعدادات",
    loadingSettings: "جاري تحميل الإعدادات...",
    paymentOptions: "خيارات الدفع",
    selectPaymentMethods: "اختر طرق الدفع لعملائك:",
    bothMethods: "الطريقتان (العميل يختار)",
    electronicOnly: "الدفع الإلكتروني فقط",
    cashOnly: "الدفع عند الاستلام فقط",
    stripeSetup: "إعداد سترايب",
    stripeSetupDescription: "قم بتكوين حساب سترايب لقبول المدفوعات الإلكترونية",
    stripeKeysDescription: "احصل على مفاتيح API من لوحة تحكم سترايب",
    testMode: "وضع الاختبار",
    liveMode: "وضع الإنتاج",
    modeDescription: "استخدم مفاتيح الاختبار للتطوير، مفاتيح الإنتاج للإنتاج",
    paymentFlow: "تدفق الدفع",
    paymentFlowDescription: "كيف سيدفع العملاء للطلبات",
    automaticRedirect: "إعادة توجيه تلقائية بناءً على الإعدادات",
    customerChoice: "العميل يختار طريقة الدفع",
    settings: "الإعدادات",
    generalSettings: "الإعدادات العامة",
    deliverySettings: "إعدادات التوصيل",
    contactSettings: "معلومات الاتصال",
    aiSettings: "إعدادات الذكاء الاصطناعي",
    paymentSettingsTitle: "إعدادات الدفع",
    premiumFeature: "ميزة مدفوعة",
    upgradePlan: "ترقية إلى الخطة المدفوعة",
    freePlanMessage: "الدفع الإلكتروني متاح للخطط المدفوعة فقط",
  },
  es: {
    paymentSettings: "Configuraciones de Pago",
    paymentMethods: "Métodos de Pago",
    cashOnDelivery: "Pago Contra Entrega",
    electronicPayment: "Pago Electrónico",
    stripeIntegration: "Integración Stripe",
    enableStripe: "Habilitar Stripe",
    stripePublicKey: "Clave Pública Stripe",
    stripeSecretKey: "Clave Secreta Stripe",
    saveSettings: "Guardar Configuraciones",
    settingsSaved: "¡Configuraciones guardadas exitosamente!",
    settingsError: "Error al guardar configuraciones",
    loadingSettings: "Cargando configuraciones...",
    paymentOptions: "Opciones de Pago",
    selectPaymentMethods: "Selecciona métodos de pago para tus clientes:",
    bothMethods: "Ambos métodos (cliente elige)",
    electronicOnly: "Solo pago electrónico",
    cashOnly: "Solo pago contra entrega",
    stripeSetup: "Configuración Stripe",
    stripeSetupDescription: "Configura tu cuenta Stripe para aceptar pagos electrónicos",
    stripeKeysDescription: "Obtén tus claves API desde tu panel de Stripe",
    testMode: "Modo Prueba",
    liveMode: "Modo Producción",
    modeDescription: "Usa claves de prueba para desarrollo, claves de producción para produccion",
    paymentFlow: "Flujo de Pago",
    paymentFlowDescription: "Cómo pagarán los clientes los pedidos",
    automaticRedirect: "Redirección automática basada en configuraciones",
    customerChoice: "Cliente elige método de pago",
    settings: "Configuraciones",
    generalSettings: "Configuraciones Generales",
    deliverySettings: "Configuraciones de Entrega",
    contactSettings: "Configuraciones de Contacto",
    aiSettings: "Configuraciones de IA",
    paymentSettingsTitle: "Configuraciones de Pago",
    premiumFeature: "Función Premium",
    upgradePlan: "Actualizar a plan de pago",
    freePlanMessage: "El pago electrónico está disponible solo para planes de pago",
  },
  de: {
    paymentSettings: "Zahlungseinstellungen",
    paymentMethods: "Zahlungsmethoden",
    cashOnDelivery: "Nachnahme",
    electronicPayment: "Elektronische Zahlung",
    stripeIntegration: "Stripe-Integration",
    enableStripe: "Stripe aktivieren",
    stripePublicKey: "Stripe öffentlicher Schlüssel",
    stripeSecretKey: "Stripe geheimer Schlüssel",
    saveSettings: "Einstellungen speichern",
    settingsSaved: "Einstellungen erfolgreich gespeichert!",
    settingsError: "Fehler beim Speichern der Einstellungen",
    loadingSettings: "Einstellungen werden geladen...",
    paymentOptions: "Zahlungsoptionen",
    selectPaymentMethods: "Wählen Sie Zahlungsmethoden für Ihre Kunden:",
    bothMethods: "Beide Methoden (Kunde wählt)",
    electronicOnly: "Nur elektronische Zahlung",
    cashOnly: "Nur Nachnahme",
    stripeSetup: "Stripe-Einrichtung",
    stripeSetupDescription: "Konfigurieren Sie Ihr Stripe-Konto für elektronische Zahlungen",
    stripeKeysDescription: "Holen Sie sich Ihre API-Schlüssel aus Ihrem Stripe-Dashboard",
    testMode: "Testmodus",
    liveMode: "Live-Modus",
    modeDescription: "Verwenden Sie Test-Schlüssel für Entwicklung, Live-Schlüssel für Produktion",
    paymentFlow: "Zahlungsablauf",
    paymentFlowDescription: "Wie Kunden für Bestellungen bezahlen",
    automaticRedirect: "Automatische Weiterleitung basierend auf Einstellungen",
    customerChoice: "Kunde wählt Zahlungsmethode",
    settings: "Einstellungen",
    generalSettings: "Allgemeine Einstellungen",
    deliverySettings: "Lieferungseinstellungen",
    contactSettings: "Kontakteinstellungen",
    aiSettings: "KI-Einstellungen",
    paymentSettingsTitle: "Zahlungseinstellungen",
    premiumFeature: "Premium-Funktion",
    upgradePlan: "Auf bezahlten Plan upgraden",
    freePlanMessage: "Elektronische Zahlung ist nur für bezahlte Pläne verfügbar",
  },
  fr: {
    paymentSettings: "Paramètres de Paiement",
    paymentMethods: "Méthodes de Paiement",
    cashOnDelivery: "Paiement à la Livraison",
    electronicPayment: "Paiement Électronique",
    stripeIntegration: "Intégration Stripe",
    enableStripe: "Activer Stripe",
    stripePublicKey: "Clé Publique Stripe",
    stripeSecretKey: "Clé Secrète Stripe",
    saveSettings: "Enregistrer les Paramètres",
    settingsSaved: "Paramètres enregistrés avec succès!",
    settingsError: "Erreur lors de l'enregistrement des paramètres",
    loadingSettings: "Chargement des paramètres...",
    paymentOptions: "Options de Paiement",
    selectPaymentMethods: "Sélectionnez les méthodes de paiement pour vos clients:",
    bothMethods: "Les deux méthodes (client choisit)",
    electronicOnly: "Paiement électronique uniquement",
    cashOnly: "Paiement à la livraison uniquement",
    stripeSetup: "Configuration Stripe",
    stripeSetupDescription: "Configurez votre compte Stripe pour accepter les paiements électroniques",
    stripeKeysDescription: "Obtenez vos clés API depuis votre tableau de bord Stripe",
    testMode: "Mode Test",
    liveMode: "Mode Production",
    modeDescription: "Utilisez les clés de test pour le développement, les clés de production pour la production",
    paymentFlow: "Flux de Paiement",
    paymentFlowDescription: "Comment les clients paieront les commandes",
    automaticRedirect: "Redirection automatique basée sur les paramètres",
    customerChoice: "Le client choisit la méthode de paiement",
    settings: "Paramètres",
    generalSettings: "Paramètres Généraux",
    deliverySettings: "Paramètres de Livraison",
    contactSettings: "Paramètres de Contact",
    aiSettings: "Paramètres IA",
    paymentSettingsTitle: "Paramètres de Paiement",
    premiumFeature: "Fonction Premium",
    upgradePlan: "Passer au plan payant",
    freePlanMessage: "Le paiement électronique est disponible uniquement pour les plans payants",
  },
  it: {
    paymentSettings: "Impostazioni di Pagamento",
    paymentMethods: "Metodi di Pagamento",
    cashOnDelivery: "Pagamento alla Consegna",
    electronicPayment: "Pagamento Elettronico",
    stripeIntegration: "Integrazione Stripe",
    enableStripe: "Abilita Stripe",
    stripePublicKey: "Chiave Pubblica Stripe",
    stripeSecretKey: "Chiave Segreta Stripe",
    saveSettings: "Salva Impostazioni",
    settingsSaved: "Impostazioni salvate con successo!",
    settingsError: "Errore nel salvare le impostazioni",
    loadingSettings: "Caricamento impostazioni...",
    paymentOptions: "Opzioni di Pagamento",
    selectPaymentMethods: "Seleziona i metodi di pagamento per i tuoi clienti:",
    bothMethods: "Entrambi i metodi (cliente sceglie)",
    electronicOnly: "Solo pagamento elettronico",
    cashOnly: "Solo pagamento alla consegna",
    stripeSetup: "Configurazione Stripe",
    stripeSetupDescription: "Configura il tuo account Stripe per accettare pagamenti elettronici",
    stripeKeysDescription: "Ottieni le tue chiavi API dal dashboard Stripe",
    testMode: "Modalità Test",
    liveMode: "Modalità Produzione",
    modeDescription: "Usa chiavi di test per sviluppo, chiavi di produzione per produzione",
    paymentFlow: "Flusso di Pagamento",
    paymentFlowDescription: "Come i clienti pagheranno gli ordini",
    automaticRedirect: "Reindirizzamento automatico basato sulle impostazioni",
    customerChoice: "Il cliente sceglie il metodo di pagamento",
    settings: "Impostazioni",
    generalSettings: "Impostazioni Generali",
    deliverySettings: "Impostazioni di Consegna",
    contactSettings: "Impostazioni di Contatto",
    aiSettings: "Impostazioni IA",
    paymentSettingsTitle: "Impostazioni di Pagamento",
    premiumFeature: "Funzione Premium",
    upgradePlan: "Passa al piano a pagamento",
    freePlanMessage: "Il pagamento elettronico è disponibile solo per i piani a pagamento",
  },
  pt: {
    paymentSettings: "Configurações de Pagamento",
    paymentMethods: "Métodos de Pagamento",
    cashOnDelivery: "Pagamento na Entrega",
    electronicPayment: "Pagamento Eletrônico",
    stripeIntegration: "Integração Stripe",
    enableStripe: "Ativar Stripe",
    stripePublicKey: "Chave Pública Stripe",
    stripeSecretKey: "Chave Secreta Stripe",
    saveSettings: "Salvar Configurações",
    settingsSaved: "Configurações salvas com sucesso!",
    settingsError: "Erro ao salvar configurações",
    loadingSettings: "Carregando configurações...",
    paymentOptions: "Opções de Pagamento",
    selectPaymentMethods: "Selecione métodos de pagamento para seus clientes:",
    bothMethods: "Ambos os métodos (cliente escolhe)",
    electronicOnly: "Apenas pagamento eletrônico",
    cashOnly: "Apenas pagamento na entrega",
    stripeSetup: "Configuração Stripe",
    stripeSetupDescription: "Configure sua conta Stripe para aceitar pagamentos eletrônicos",
    stripeKeysDescription: "Obtenha suas chaves API do painel Stripe",
    testMode: "Modo Teste",
    liveMode: "Modo Produção",
    modeDescription: "Use chaves de teste para desenvolvimento, chaves de produção para produção",
    paymentFlow: "Fluxo de Pagamento",
    paymentFlowDescription: "Como os clientes pagarão os pedidos",
    automaticRedirect: "Redirecionamento automático baseado nas configurações",
    customerChoice: "Cliente escolhe método de pagamento",
    settings: "Configurações",
    generalSettings: "Configurações Gerais",
    deliverySettings: "Configurações de Entrega",
    contactSettings: "Configurações de Contato",
    aiSettings: "Configurações de IA",
    paymentSettingsTitle: "Configurações de Pagamento",
    premiumFeature: "Recurso Premium",
    upgradePlan: "Atualizar para plano pago",
    freePlanMessage: "Pagamento eletrônico está disponível apenas para planos pagos",
  },
  ru: {
    paymentSettings: "Настройки Платежей",
    paymentMethods: "Способы Оплаты",
    cashOnDelivery: "Оплата при Доставке",
    electronicPayment: "Электронная Оплата",
    stripeIntegration: "Интеграция Stripe",
    enableStripe: "Включить Stripe",
    stripePublicKey: "Публичный Ключ Stripe",
    stripeSecretKey: "Секретный Ключ Stripe",
    saveSettings: "Сохранить Настройки",
    settingsSaved: "Настройки успешно сохранены!",
    settingsError: "Ошибка сохранения настроек",
    loadingSettings: "Загрузка настроек...",
    paymentOptions: "Варианты Оплаты",
    selectPaymentMethods: "Выберите способы оплаты для ваших клиентов:",
    bothMethods: "Оба способа (клиент выбирает)",
    electronicOnly: "Только электронная оплата",
    cashOnly: "Только оплата при доставке",
    stripeSetup: "Настройка Stripe",
    stripeSetupDescription: "Настройте свой аккаунт Stripe для приема электронных платежей",
    stripeKeysDescription: "Получите ваши API ключи из панели Stripe",
    testMode: "Тестовый Режим",
    liveMode: "Боевой Режим",
    modeDescription: "Используйте тестовые ключи для разработки, боевые ключи для продакшена",
    paymentFlow: "Поток Платежей",
    paymentFlowDescription: "Как клиенты будут оплачивать заказы",
    automaticRedirect: "Автоматическое перенаправление на основе настроек",
    customerChoice: "Клиент выбирает способ оплаты",
    settings: "Настройки",
    generalSettings: "Общие Настройки",
    deliverySettings: "Настройки Доставки",
    contactSettings: "Настройки Контактов",
    aiSettings: "Настройки ИИ",
    paymentSettingsTitle: "Настройки Платежей",
    premiumFeature: "Премиум Функция",
    upgradePlan: "Перейти на платный план",
    freePlanMessage: "Электронная оплата доступна только для платных планов",
  },
  zh: {
    paymentSettings: "支付设置",
    paymentMethods: "支付方式",
    cashOnDelivery: "货到付款",
    electronicPayment: "电子支付",
    stripeIntegration: "Stripe集成",
    enableStripe: "启用Stripe",
    stripePublicKey: "Stripe公钥",
    stripeSecretKey: "Stripe密钥",
    saveSettings: "保存设置",
    settingsSaved: "设置保存成功！",
    settingsError: "保存设置时出错",
    loadingSettings: "正在加载设置...",
    paymentOptions: "支付选项",
    selectPaymentMethods: "为您的客户选择支付方式：",
    bothMethods: "两种方式（客户选择）",
    electronicOnly: "仅电子支付",
    cashOnly: "仅货到付款",
    stripeSetup: "Stripe设置",
    stripeSetupDescription: "配置您的Stripe账户以接受电子支付",
    stripeKeysDescription: "从您的Stripe仪表板获取API密钥",
    testMode: "测试模式",
    liveMode: "生产模式",
    modeDescription: "开发使用测试密钥，生产使用生产密钥",
    paymentFlow: "支付流程",
    paymentFlowDescription: "客户如何支付订单",
    automaticRedirect: "基于设置的自动重定向",
    customerChoice: "客户选择支付方式",
    settings: "设置",
    generalSettings: "常规设置",
    deliverySettings: "配送设置",
    contactSettings: "联系设置",
    aiSettings: "AI设置",
    paymentSettingsTitle: "支付设置",
    premiumFeature: "高级功能",
    upgradePlan: "升级到付费计划",
    freePlanMessage: "电子支付仅适用于付费计划",
  },
  ja: {
    paymentSettings: "支払い設定",
    paymentMethods: "支払い方法",
    cashOnDelivery: "代金引換",
    electronicPayment: "電子決済",
    stripeIntegration: "Stripe統合",
    enableStripe: "Stripeを有効化",
    stripePublicKey: "Stripe公開キー",
    stripeSecretKey: "Stripe秘密キー",
    saveSettings: "設定を保存",
    settingsSaved: "設定が正常に保存されました！",
    settingsError: "設定の保存中にエラーが発生しました",
    loadingSettings: "設定を読み込み中...",
    paymentOptions: "支払いオプション",
    selectPaymentMethods: "お客様の支払い方法を選択してください：",
    bothMethods: "両方の方法（お客様が選択）",
    electronicOnly: "電子決済のみ",
    cashOnly: "代金引換のみ",
    stripeSetup: "Stripe設定",
    stripeSetupDescription: "電子決済を受け入れるためにStripeアカウントを設定",
    stripeKeysDescription: "StripeダッシュボードからAPIキーを取得",
    testMode: "テストモード",
    liveMode: "本番モード",
    modeDescription: "開発にはテストキー、本番には本番キーを使用",
    paymentFlow: "支払いフロー",
    paymentFlowDescription: "お客様が注文を支払う方法",
    automaticRedirect: "設定に基づく自動リダイレクト",
    customerChoice: "お客様が支払い方法を選択",
    settings: "設定",
    generalSettings: "一般設定",
    deliverySettings: "配送設定",
    contactSettings: "連絡設定",
    aiSettings: "AI設定",
    paymentSettingsTitle: "支払い設定",
    premiumFeature: "プレミアム機能",
    upgradePlan: "有料プランにアップグレード",
    freePlanMessage: "電子決済は有料プランにのみ利用可能",
  },
  tr: {
    paymentSettings: "Ödeme Ayarları",
    paymentMethods: "Ödeme Yöntemleri",
    cashOnDelivery: "Kapıda Ödeme",
    electronicPayment: "Elektronik Ödeme",
    stripeIntegration: "Stripe Entegrasyonu",
    enableStripe: "Stripe'ı Etkinleştir",
    stripePublicKey: "Stripe Genel Anahtarı",
    stripeSecretKey: "Stripe Gizli Anahtarı",
    saveSettings: "Ayarları Kaydet",
    settingsSaved: "Ayarlar başarıyla kaydedildi!",
    settingsError: "Ayarları kaydetme hatası",
    loadingSettings: "Ayarlar yükleniyor...",
    paymentOptions: "Ödeme Seçenekleri",
    selectPaymentMethods: "Müşterileriniz için ödeme yöntemlerini seçin:",
    bothMethods: "Her iki yöntem (müşteri seçer)",
    electronicOnly: "Sadece elektronik ödeme",
    cashOnly: "Sadece kapıda ödeme",
    stripeSetup: "Stripe Kurulumu",
    stripeSetupDescription: "Elektronik ödemeleri kabul etmek için Stripe hesabınızı yapılandırın",
    stripeKeysDescription: "API anahtarlarınızı Stripe kontrol panelinizden alın",
    testMode: "Test Modu",
    liveMode: "Canlı Mod",
    modeDescription: "Geliştirme için test anahtarları, üretim için canlı anahtarlar kullanın",
    paymentFlow: "Ödeme Akışı",
    paymentFlowDescription: "Müşterilerin siparişleri nasıl ödeyeceği",
    automaticRedirect: "Ayarlara göre otomatik yönlendirme",
    customerChoice: "Müşteri ödeme yöntemini seçer",
    settings: "Ayarlar",
    generalSettings: "Genel Ayarlar",
    deliverySettings: "Teslimat Ayarları",
    contactSettings: "İletişim Ayarları",
    aiSettings: "AI Ayarları",
    paymentSettingsTitle: "Ödeme Ayarları",
    premiumFeature: "Premium Özellik",
    upgradePlan: "Ücretli plana yükselt",
    freePlanMessage: "Elektronik ödeme sadece ücretli planlar için mevcuttur",
  },
  hi: {
    paymentSettings: "भुगतान सेटिंग्स",
    paymentMethods: "भुगतान विधियां",
    cashOnDelivery: "डिलीवरी पर नकद",
    electronicPayment: "इलेक्ट्रॉनिक भुगतान",
    stripeIntegration: "स्ट्राइप एकीकरण",
    enableStripe: "स्ट्राइप सक्षम करें",
    stripePublicKey: "स्ट्राइप सार्वजनिक कुंजी",
    stripeSecretKey: "स्ट्राइप गुप्त कुंजी",
    saveSettings: "सेटिंग्स सहेजें",
    settingsSaved: "सेटिंग्स सफलतापूर्वक सहेजी गईं!",
    settingsError: "सेटिंग्स सहेजने में त्रुटि",
    loadingSettings: "सेटिंग्स लोड हो रही हैं...",
    paymentOptions: "भुगतान विकल्प",
    selectPaymentMethods: "अपने ग्राहकों के लिए भुगतान विधियां चुनें:",
    bothMethods: "दोनों विधियां (ग्राहक चुनता है)",
    electronicOnly: "केवल इलेक्ट्रॉनिक भुगतान",
    cashOnly: "केवल डिलीवरी पर नकद",
    stripeSetup: "स्ट्राइप सेटअप",
    stripeSetupDescription: "इलेक्ट्रॉनिक भुगतान स्वीकार करने के लिए अपना स्ट्राइप खाता कॉन्फ़िगर करें",
    stripeKeysDescription: "अपनी API कुंजियां स्ट्राइप डैशबोर्ड से प्राप्त करें",
    testMode: "टेस्ट मोड",
    liveMode: "लाइव मोड",
    modeDescription: "विकास के लिए टेस्ट कुंजियां, उत्पादन के लिए लाइव कुंजियां उपयोग करें",
    paymentFlow: "भुगतान प्रवाह",
    paymentFlowDescription: "ग्राहक आदेशों का भुगतान कैसे करेंगे",
    automaticRedirect: "सेटिंग्स के आधार पर स्वचालित पुनर्निर्देशन",
    customerChoice: "ग्राहक भुगतान विधि चुनता है",
    settings: "सेटिंग्स",
    generalSettings: "सामान्य सेटिंग्स",
    deliverySettings: "डिलीवरी सेटिंग्स",
    contactSettings: "संपर्क सेटिंग्स",
    aiSettings: "AI सेटिंग्स",
    paymentSettingsTitle: "भुगतान सेटिंग्स",
    premiumFeature: "प्रीमियम सुविधा",
    upgradePlan: "भुगतान योजना में अपग्रेड करें",
    freePlanMessage: "इलेक्ट्रॉनिक भुगतान केवल भुगतान योजनाओं के लिए उपलब्ध है",
  },
  id: {
    paymentSettings: "Pengaturan Pembayaran",
    paymentMethods: "Metode Pembayaran",
    cashOnDelivery: "Bayar di Tempat",
    electronicPayment: "Pembayaran Elektronik",
    stripeIntegration: "Integrasi Stripe",
    enableStripe: "Aktifkan Stripe",
    stripePublicKey: "Kunci Publik Stripe",
    stripeSecretKey: "Kunci Rahasia Stripe",
    saveSettings: "Simpan Pengaturan",
    settingsSaved: "Pengaturan berhasil disimpan!",
    settingsError: "Error menyimpan pengaturan",
    loadingSettings: "Memuat pengaturan...",
    paymentOptions: "Opsi Pembayaran",
    selectPaymentMethods: "Pilih metode pembayaran untuk pelanggan Anda:",
    bothMethods: "Kedua metode (pelanggan memilih)",
    electronicOnly: "Hanya pembayaran elektronik",
    cashOnly: "Hanya bayar di tempat",
    stripeSetup: "Pengaturan Stripe",
    stripeSetupDescription: "Konfigurasi akun Stripe Anda untuk menerima pembayaran elektronic",
    stripeKeysDescription: "Dapatkan kunci API dari dashboard Stripe Anda",
    testMode: "Mode Test",
    liveMode: "Mode Produksi",
    modeDescription: "Gunakan kunci test untuk pengembangan, kunci produksi untuk produksi",
    paymentFlow: "Alur Pembayaran",
    paymentFlowDescription: "Bagaimana pelanggan akan membayar pesanan",
    automaticRedirect: "Pengalihan otomatis berdasarkan pengaturan",
    customerChoice: "Pelanggan memilih metode pembayaran",
    settings: "Pengaturan",
    generalSettings: "Pengaturan Umum",
    deliverySettings: "Pengaturan Pengiriman",
    contactSettings: "Pengaturan Kontak",
    aiSettings: "Pengaturan AI",
    paymentSettingsTitle: "Pengaturan Pembayaran",
    premiumFeature: "Fitur Premium",
    upgradePlan: "Upgrade ke paket berbayar",
    freePlanMessage: "Pembayaran elektronik hanya tersedia untuk paket berbayar",
  },
  ko: {
    paymentSettings: "결제 설정",
    paymentMethods: "결제 방법",
    cashOnDelivery: "착불 결제",
    electronicPayment: "전자 결제",
    stripeIntegration: "Stripe 통합",
    enableStripe: "Stripe 활성화",
    stripePublicKey: "Stripe 공개 키",
    stripeSecretKey: "Stripe 비밀 키",
    saveSettings: "설정 저장",
    settingsSaved: "설정이 성공적으로 저장되었습니다!",
    settingsError: "설정 저장 중 오류 발생",
    loadingSettings: "설정 로딩 중...",
    paymentOptions: "결제 옵션",
    selectPaymentMethods: "고객을 위한 결제 방법을 선택하세요:",
    bothMethods: "두 방법 모두 (고객이 선택)",
    electronicOnly: "전자 결제만",
    cashOnly: "착불 결제만",
    stripeSetup: "Stripe 설정",
    stripeSetupDescription: "전자 결제를 받기 위해 Stripe 계정을 구성하세요",
    stripeKeysDescription: "Stripe 대시보드에서 API 키를 가져오세요",
    testMode: "테스트 모드",
    liveMode: "라이브 모드",
    modeDescription: "개발에는 테스트 키, 프로덕션에는 라이브 키 사용",
    paymentFlow: "결제 흐름",
    paymentFlowDescription: "고객이 주문을 결제하는 방법",
    automaticRedirect: "설정에 따른 자동 리디렉션",
    customerChoice: "고객이 결제 방법 선택",
    settings: "설정",
    generalSettings: "일반 설정",
    deliverySettings: "배송 설정",
    contactSettings: "연락처 설정",
    aiSettings: "AI 설정",
    paymentSettingsTitle: "결제 설정",
    premiumFeature: "프리미엄 기능",
    upgradePlan: "유료 플랜으로 업그레이드",
    freePlanMessage: "전자 결제는 유료 플랜에서만 사용 가능",
  },
  nl: {
    paymentSettings: "Betalingsinstellingen",
    paymentMethods: "Betaalmethoden",
    cashOnDelivery: "Rembours",
    electronicPayment: "Elektronische Betaling",
    stripeIntegration: "Stripe Integratie",
    enableStripe: "Stripe Inschakelen",
    stripePublicKey: "Stripe Publieke Sleutel",
    stripeSecretKey: "Stripe Geheime Sleutel",
    saveSettings: "Instellingen Opslaan",
    settingsSaved: "Instellingen succesvol opgeslagen!",
    settingsError: "Fout bij opslaan instellingen",
    loadingSettings: "Instellingen laden...",
    paymentOptions: "Betaalopties",
    selectPaymentMethods: "Selecteer betaalmethoden voor uw klanten:",
    bothMethods: "Beide methoden (klant kiest)",
    electronicOnly: "Alleen elektronische betaling",
    cashOnly: "Alleen rembours",
    stripeSetup: "Stripe Setup",
    stripeSetupDescription: "Configureer uw Stripe account voor elektronische betalingen",
    stripeKeysDescription: "Haal uw API-sleutels op uit uw Stripe dashboard",
    testMode: "Testmodus",
    liveMode: "Live modus",
    modeDescription: "Gebruik testsleutels voor ontwikkeling, livesleutels voor productie",
    paymentFlow: "Betaalstroom",
    paymentFlowDescription: "Hoe klanten bestellingen betalen",
    automaticRedirect: "Automatische doorverwijzing op basis van instellingen",
    customerChoice: "Klant kiest betaalmethode",
    settings: "Instellingen",
    generalSettings: "Algemene Instellingen",
    deliverySettings: "Leveringsinstellingen",
    contactSettings: "Contactinstellingen",
    aiSettings: "AI Instellingen",
    paymentSettingsTitle: "Betalingsinstellingen",
    premiumFeature: "Premium Functie",
    upgradePlan: "Upgraden naar betaald plan",
    freePlanMessage: "Elektronische betaling is alleen beschikbaar voor betaalde plannen",
  },
  pl: {
    paymentSettings: "Ustawienia Płatności",
    paymentMethods: "Metody Płatności",
    cashOnDelivery: "Płatność przy Odbiorze",
    electronicPayment: "Płatność Elektroniczna",
    stripeIntegration: "Integracja Stripe",
    enableStripe: "Włącz Stripe",
    stripePublicKey: "Klucz Publiczny Stripe",
    stripeSecretKey: "Klucz Prywatny Stripe",
    saveSettings: "Zapisz Ustawienia",
    settingsSaved: "Ustawienia zostały pomyślnie zapisane!",
    settingsError: "Błąd podczas zapisywania ustawień",
    loadingSettings: "Ładowanie ustawień...",
    paymentOptions: "Opcje Płatności",
    selectPaymentMethods: "Wybierz metody płatności dla swoich klientów:",
    bothMethods: "Obie metody (klient wybiera)",
    electronicOnly: "Tylko płatność elektroniczna",
    cashOnly: "Tylko płatność przy odbiorze",
    stripeSetup: "Konfiguracja Stripe",
    stripeSetupDescription: "Skonfiguruj swoje konto Stripe do przyjmowania płatności elektronicznych",
    stripeKeysDescription: "Pobierz klucze API z panelu Stripe",
    testMode: "Tryb Testowy",
    liveMode: "Tryb Produkcyjny",
    modeDescription: "Użyj kluczy testowych do rozwoju, kluczy produkcyjnych do produkcji",
    paymentFlow: "Przepływ Płatności",
    paymentFlowDescription: "Jak klienci będą płacić za zamówienia",
    automaticRedirect: "Automatyczne przekierowanie na podstawie ustawień",
    customerChoice: "Klient wybiera metodę płatności",
    settings: "Ustawienia",
    generalSettings: "Ustawienia Ogólne",
    deliverySettings: "Ustawienia Dostawy",
    contactSettings: "Ustawienia Kontaktu",
    aiSettings: "Ustawienia AI",
    paymentSettingsTitle: "Ustawienia Płatności",
    premiumFeature: "Funkcja Premium",
    upgradePlan: "Przejdź na płatny plan",
    freePlanMessage: "Płatność elektroniczna jest dostępna tylko dla płatnych planów",
  },
};

export default function PaymentSettingsPage() {
  const { user } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [store, setStore] = useState<Store | null>(null);

  const t = (key: keyof typeof translations['en']) => translations[language]?.[key] ?? key;

  // Payment settings state
  const [paymentSettings, setPaymentSettings] = useState<{
    enableCashOnDelivery: boolean;
    enableElectronicPayment: boolean;
    paymentMethod: 'both' | 'electronic' | 'cash';
    stripeEnabled: boolean;
    stripeTestMode: boolean;
    stripePublicKey: string;
    stripeSecretKey: string;
  }>({
    enableCashOnDelivery: true,
    enableElectronicPayment: false,
    paymentMethod: 'both',
    stripeEnabled: false,
    stripeTestMode: true,
    stripePublicKey: '',
    stripeSecretKey: '',
  });

  useEffect(() => {
    if (!user) return;
    loadPaymentSettings();
  }, [user]);

  const loadPaymentSettings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const storeData = await getStore(user.uid);
      
      if (storeData) {
        setStore(storeData);
        
        // Load payment settings from store
        setPaymentSettings({
          enableCashOnDelivery: storeData.enableCashOnDelivery ?? true,
          enableElectronicPayment: storeData.enableElectronicPayment ?? false,
          paymentMethod: (storeData.paymentMethod ?? 'both') as 'both' | 'electronic' | 'cash',
          stripeEnabled: storeData.stripeEnabled ?? false,
          stripeTestMode: storeData.stripeTestMode ?? true,
          stripePublicKey: storeData.stripePublicKey ?? '',
          stripeSecretKey: storeData.stripeSecretKey ?? '',
        });
      }
    } catch (error) {
      console.error('Error loading payment settings:', error);
      toast.error(t('settingsError'));
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!user || !store) return;

    try {
      setSaving(true);

      // Validate Stripe settings if electronic payment is enabled
      if (paymentSettings.enableElectronicPayment && paymentSettings.stripeEnabled) {
        if (!paymentSettings.stripePublicKey.trim() || !paymentSettings.stripeSecretKey.trim()) {
          toast.error('Please enter both Stripe public and secret keys');
          return;
        }
      }

      // Update store with payment settings
      await updateStore(user.uid, {
        ...store,
        enableCashOnDelivery: paymentSettings.enableCashOnDelivery,
        enableElectronicPayment: paymentSettings.enableElectronicPayment,
        paymentMethod: paymentSettings.paymentMethod as 'both' | 'electronic' | 'cash',
        stripeEnabled: paymentSettings.stripeEnabled,
        stripeTestMode: paymentSettings.stripeTestMode,
        stripePublicKey: paymentSettings.stripePublicKey,
        stripeSecretKey: paymentSettings.stripeSecretKey,
      });

      toast.success(t('settingsSaved'));
    } catch (error) {
      console.error('Error saving payment settings:', error);
      toast.error(t('settingsError'));
    } finally {
      setSaving(false);
    }
  };

  const handlePaymentMethodChange = (method: 'both' | 'electronic' | 'cash') => {
    setPaymentSettings(prev => ({
      ...prev,
      paymentMethod: method,
      enableCashOnDelivery: method === 'both' || method === 'cash',
      enableElectronicPayment: method === 'both' || method === 'electronic',
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loadingSettings')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">Please log in to access payment settings</p>
        </div>
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
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">{t('paymentSettings')}</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={language}
                onChange={e => setLanguage(e.target.value as keyof typeof translations)}
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Payment Options */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              {t('paymentOptions')}
            </CardTitle>
            <CardDescription>
              {t('selectPaymentMethods')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  paymentSettings.paymentMethod === 'both'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handlePaymentMethodChange('both' as const)}
              >
                <div className="flex items-center mb-2">
                  <Banknote className="h-5 w-5 mr-2 text-green-600" />
                  <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                  <span className="font-semibold">{t('bothMethods')}</span>
                </div>
                <p className="text-sm text-gray-600">
                  العملاء يختارون بين الدفع الإلكتروني أو عند الاستلام
                </p>
              </div>

              <div
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  paymentSettings.paymentMethod === 'electronic'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handlePaymentMethodChange('electronic' as const)}
              >
                <div className="flex items-center mb-2">
                  <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                  <span className="font-semibold">{t('electronicOnly')}</span>
                </div>
                <p className="text-sm text-gray-600">
                  الدفع الإلكتروني فقط عبر سترايب
                </p>
              </div>

              <div
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  paymentSettings.paymentMethod === 'cash'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handlePaymentMethodChange('cash' as const)}
              >
                <div className="flex items-center mb-2">
                  <Banknote className="h-5 w-5 mr-2 text-green-600" />
                  <span className="font-semibold">{t('cashOnly')}</span>
                </div>
                <p className="text-sm text-gray-600">
                  الدفع عند الاستلام فقط
                </p>
              </div>
            </div>

            {/* Payment Flow Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">{t('paymentFlow')}</h4>
                  <p className="text-sm text-blue-800">
                    {paymentSettings.paymentMethod === 'both' 
                      ? t('customerChoice')
                      : t('automaticRedirect')
                    }
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stripe Integration */}
        {(paymentSettings.paymentMethod === 'both' || paymentSettings.paymentMethod === 'electronic') && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                {t('stripeSetup')}
              </CardTitle>
              <CardDescription>
                {t('stripeSetupDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="stripeEnabled" className="text-base font-medium">
                    {t('enableStripe')}
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    {t('stripeKeysDescription')}
                  </p>
                </div>
                <Switch
                  id="stripeEnabled"
                  checked={paymentSettings.stripeEnabled}
                  onCheckedChange={(checked) => 
                    setPaymentSettings(prev => ({ ...prev, stripeEnabled: checked }))
                  }
                />
              </div>

              {paymentSettings.stripeEnabled && (
                <>
                  {/* Stripe Mode */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Stripe Mode</Label>
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="stripeMode"
                          value="test"
                          checked={paymentSettings.stripeTestMode}
                          onChange={() => setPaymentSettings(prev => ({ ...prev, stripeTestMode: true }))}
                          className="text-blue-600"
                        />
                        <span className="text-sm">{t('testMode')}</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="stripeMode"
                          value="live"
                          checked={!paymentSettings.stripeTestMode}
                          onChange={() => setPaymentSettings(prev => ({ ...prev, stripeTestMode: false }))}
                          className="text-blue-600"
                        />
                        <span className="text-sm">{t('liveMode')}</span>
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">{t('modeDescription')}</p>
                  </div>

                  {/* Stripe Keys */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stripePublicKey">
                        {t('stripePublicKey')} {paymentSettings.stripeTestMode ? '(Test)' : '(Live)'}
                      </Label>
                      <Input
                        id="stripePublicKey"
                        type="text"
                        value={paymentSettings.stripePublicKey}
                        onChange={(e) => setPaymentSettings(prev => ({ 
                          ...prev, 
                          stripePublicKey: e.target.value 
                        }))}
                        placeholder="pk_test_..."
                        className="font-mono text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stripeSecretKey">
                        {t('stripeSecretKey')} {paymentSettings.stripeTestMode ? '(Test)' : '(Live)'}
                      </Label>
                      <Input
                        id="stripeSecretKey"
                        type="password"
                        value={paymentSettings.stripeSecretKey}
                        onChange={(e) => setPaymentSettings(prev => ({ 
                          ...prev, 
                          stripeSecretKey: e.target.value 
                        }))}
                        placeholder="sk_test_..."
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>

                  {/* Stripe Status */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-yellow-900 mb-1">Important</h4>
                        <p className="text-sm text-yellow-800">
                          Keep your Stripe secret key secure and never expose it in client-side code. 
                          The secret key should only be used in your backend API.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Activation Soon Notice */}
        <div className="mt-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
            <span className="text-yellow-800 font-medium">Payment features will be activated soon.</span>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSaveSettings}
            disabled={saving}
            className="bg-gradient-primary hover:opacity-90 text-white px-8 py-3"
          >
            {saving ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {t('saveSettings')}
              </div>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                {t('saveSettings')}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
} 