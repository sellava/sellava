'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Package, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  User,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { getOrders, updateOrderStatus as updateOrderStatusInFirebase, deleteOrder } from '@/lib/firebase-services';
import type { Order as FirebaseOrder } from '@/types';
import Image from 'next/image';

interface Order extends FirebaseOrder {
  customerInfo?: {
    customerName: string;
    email: string;
    phone: string;
    address?: string;
    notes?: string;
  };
  subtotal?: number;
  discount?: number;
  appliedCoupon?: string;
}

// ترجمة النصوص بجميع اللغات مع الإنجليزية كلغة أصلية
const translations = {
  en: {
    manageOrders: "Order Management",
    totalOrders: "Total Orders",
    pendingOrders: "Pending Orders",
    completedOrders: "Completed Orders",
    totalSales: "Total Sales",
    searchPlaceholder: "Search orders...",
    filterStatus: "Filter by status",
    all: "All",
    pending: "Pending",
    confirmed: "Confirmed",
    shipped: "Shipped",
    delivered: "Delivered",
    canceled: "Canceled",
    noOrders: "No orders found",
    orderDetails: "Order Details",
    customerInfo: "Customer Info",
    name: "Name",
    email: "Email",
    phone: "Phone",
    address: "Address",
    notes: "Notes",
    orderItems: "Order Items",
    productName: "Product Name",
    quantity: "Quantity",
    price: "Price",
    actions: "Actions",
    updateStatus: "Update Status",
    sendEmail: "Send Email",
    contactWhatsApp: "Contact WhatsApp",
    deleteOrder: "Delete Order",
    orderId: "Order ID",
    orderDate: "Order Date",
    status: "Status",
    active: "Active",
    inactive: "Inactive",
  },
  ar: {
    manageOrders: "إدارة الطلبات",
    totalOrders: "إجمالي الطلبات",
    pendingOrders: "طلبات قيد الانتظار",
    completedOrders: "الطلبات المكتملة",
    totalSales: "إجمالي المبيعات",
    searchPlaceholder: "ابحث في الطلبات...",
    filterStatus: "تصنيف حسب الحالة",
    all: "الجميع",
    pending: "قيد الانتظار",
    confirmed: "مؤكد",
    shipped: "تم الشحن",
    delivered: "تم التوصيل",
    canceled: "ملغي",
    noOrders: "لم يتم العثور على طلبات",
    orderDetails: "تفاصيل الطلب",
    customerInfo: "معلومات العميل",
    name: "الاسم",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    address: "العنوان",
    notes: "ملاحظات",
    orderItems: "منتجات الطلب",
    productName: "اسم المنتج",
    quantity: "الكمية",
    price: "السعر",
    actions: "إجراءات",
    updateStatus: "تحديث الحالة",
    sendEmail: "إرسال إيميل",
    contactWhatsApp: "واتساب",
    deleteOrder: "حذف الطلب",
    orderId: "رقم الطلب",
    orderDate: "تاريخ الطلب",
    status: "الحالة",
    active: "مفعل",
    inactive: "غير مفعل",
  },
  es: {
    manageOrders: "Gestión de Pedidos",
    totalOrders: "Pedidos Totales",
    pendingOrders: "Pedidos Pendientes",
    completedOrders: "Pedidos Completados",
    totalSales: "Ventas Totales",
    searchPlaceholder: "Buscar pedidos...",
    filterStatus: "Filtrar por estado",
    all: "Todos",
    pending: "Pendiente",
    confirmed: "Confirmado",
    shipped: "Enviado",
    delivered: "Entregado",
    canceled: "Cancelado",
    noOrders: "No se encontraron pedidos",
    orderDetails: "Detalles del Pedido",
    customerInfo: "Información del Cliente",
    name: "Nombre",
    email: "Correo Electrónico",
    phone: "Teléfono",
    address: "Dirección",
    notes: "Notas",
    orderItems: "Artículos del Pedido",
    productName: "Nombre del Producto",
    quantity: "Cantidad",
    price: "Precio",
    actions: "Acciones",
    updateStatus: "Actualizar Estado",
    sendEmail: "Enviar Correo",
    contactWhatsApp: "Contactar WhatsApp",
    deleteOrder: "Eliminar Pedido",
    orderId: "ID de Pedido",
    orderDate: "Fecha de Pedido",
    status: "Estado",
    active: "Activo",
    inactive: "Inactivo",
  },
  fr: {
    manageOrders: "Gestion des commandes",
    totalOrders: "Commandes Totales",
    pendingOrders: "Commandes en attente",
    completedOrders: "Commandes terminées",
    totalSales: "Ventes Totales",
    searchPlaceholder: "Rechercher des commandes...",
    filterStatus: "Filtrer par statut",
    all: "Tous",
    pending: "En attente",
    confirmed: "Confirmé",
    shipped: "Expédié",
    delivered: "Livré",
    canceled: "Annulé",
    noOrders: "Aucune commande trouvée",
    orderDetails: "Détails de la commande",
    customerInfo: "Informations client",
    name: "Nom",
    email: "Email",
    phone: "Téléphone",
    address: "Adresse",
    notes: "Notes",
    orderItems: "Articles de la commande",
    productName: "Nom du produit",
    quantity: "Quantité",
    price: "Prix",
    actions: "Actions",
    updateStatus: "Mettre à jour le statut",
    sendEmail: "Envoyer un email",
    contactWhatsApp: "Contacter WhatsApp",
    deleteOrder: "Supprimer la commande",
    orderId: "ID de commande",
    orderDate: "Date de commande",
    status: "Statut",
    active: "Actif",
    inactive: "Inactif",
  },
  de: {
    manageOrders: "Auftragsverwaltung",
    totalOrders: "Gesamtbestellungen",
    pendingOrders: "Ausstehende Bestellungen",
    completedOrders: "Abgeschlossene Bestellungen",
    totalSales: "Gesamtumsatz",
    searchPlaceholder: "Bestellungen suchen...",
    filterStatus: "Nach Status filtern",
    all: "Alle",
    pending: "Ausstehend",
    confirmed: "Bestätigt",
    shipped: "Versendet",
    delivered: "Geliefert",
    canceled: "Storniert",
    noOrders: "Keine Bestellungen gefunden",
    orderDetails: "Bestelldetails",
    customerInfo: "Kundeninfo",
    name: "Name",
    email: "E-Mail",
    phone: "Telefon",
    address: "Adresse",
    notes: "Notizen",
    orderItems: "Bestellartikel",
    productName: "Produktname",
    quantity: "Menge",
    price: "Preis",
    actions: "Aktionen",
    updateStatus: "Status aktualisieren",
    sendEmail: "E-Mail senden",
    contactWhatsApp: "WhatsApp Kontakt",
    deleteOrder: "Bestellung löschen",
    orderId: "Bestell-ID",
    orderDate: "Bestelldatum",
    status: "Status",
    active: "Aktiv",
    inactive: "Inaktiv",
  },
  it: {
    manageOrders: "Gestione degli Ordini",
    totalOrders: "Ordini Totali",
    pendingOrders: "Ordini in Attesa",
    completedOrders: "Ordini Completati",
    totalSales: "Vendite Totali",
    searchPlaceholder: "Cerca ordini...",
    filterStatus: "Filtra per stato",
    all: "Tutti",
    pending: "In attesa",
    confirmed: "Confermato",
    shipped: "Spedito",
    delivered: "Consegnato",
    canceled: "Annullato",
    noOrders: "Nessun ordine trovato",
    orderDetails: "Dettagli dell'ordine",
    customerInfo: "Info cliente",
    name: "Nome",
    email: "Email",
    phone: "Telefono",
    address: "Indirizzo",
    notes: "Note",
    orderItems: "Articoli dell'ordine",
    productName: "Nome prodotto",
    quantity: "Quantità",
    price: "Prezzo",
    actions: "Azioni",
    updateStatus: "Aggiorna stato",
    sendEmail: "Invia email",
    contactWhatsApp: "Contatta WhatsApp",
    deleteOrder: "Elimina ordine",
    orderId: "ID ordine",
    orderDate: "Data ordine",
    status: "Stato",
    active: "Attivo",
    inactive: "Inattivo",
  },
  pt: {
    manageOrders: "Gerenciamento de Pedidos",
    totalOrders: "Pedidos Totais",
    pendingOrders: "Pedidos Pendentes",
    completedOrders: "Pedidos Concluídos",
    totalSales: "Vendas Totais",
    searchPlaceholder: "Pesquisar pedidos...",
    filterStatus: "Filtrar por status",
    all: "Todos",
    pending: "Pendente",
    confirmed: "Confirmado",
    shipped: "Enviado",
    delivered: "Entregue",
    canceled: "Cancelado",
    noOrders: "Nenhum pedido encontrado",
    orderDetails: "Detalhes do Pedido",
    customerInfo: "Informações do Cliente",
    name: "Nome",
    email: "Email",
    phone: "Telefone",
    address: "Endereço",
    notes: "Notas",
    orderItems: "Itens do Pedido",
    productName: "Nome do Produto",
    quantity: "Quantidade",
    price: "Preço",
    actions: "Ações",
    updateStatus: "Atualizar Status",
    sendEmail: "Enviar Email",
    contactWhatsApp: "Contato WhatsApp",
    deleteOrder: "Excluir Pedido",
    orderId: "ID do Pedido",
    orderDate: "Data do Pedido",
    status: "Status",
    active: "Ativo",
    inactive: "Inativo",
  },
  ru: {
    manageOrders: "Управление заказами",
    totalOrders: "Всего заказов",
    pendingOrders: "Ожидающие заказы",
    completedOrders: "Завершённые заказы",
    totalSales: "Общий доход",
    searchPlaceholder: "Поиск заказов...",
    filterStatus: "Фильтр по статусу",
    all: "Все",
    pending: "В ожидании",
    confirmed: "Подтверждено",
    shipped: "Отправлено",
    delivered: "Доставлено",
    canceled: "Отменено",
    noOrders: "Заказы не найдены",
    orderDetails: "Детали заказа",
    customerInfo: "Информация о клиенте",
    name: "Имя",
    email: "Эл. почта",
    phone: "Телефон",
    address: "Адрес",
    notes: "Заметки",
    orderItems: "Товары заказа",
    productName: "Название товара",
    quantity: "Количество",
    price: "Цена",
    actions: "Действия",
    updateStatus: "Обновить статус",
    sendEmail: "Отправить письмо",
    contactWhatsApp: "Контакт через WhatsApp",
    deleteOrder: "Удалить заказ",
    orderId: "ID заказа",
    orderDate: "Дата заказа",
    status: "Статус",
    active: "Активный",
    inactive: "Неактивный",
  },
  zh: {
    manageOrders: "订单管理",
    totalOrders: "总订单",
    pendingOrders: "待处理订单",
    completedOrders: "已完成订单",
    totalSales: "总销售额",
    searchPlaceholder: "搜索订单...",
    filterStatus: "按状态筛选",
    all: "全部",
    pending: "待处理",
    confirmed: "已确认",
    shipped: "已发货",
    delivered: "已送达",
    canceled: "已取消",
    noOrders: "未找到订单",
    orderDetails: "订单详情",
    customerInfo: "客户信息",
    name: "姓名",
    email: "邮箱",
    phone: "电话",
    address: "地址",
    notes: "备注",
    orderItems: "订单商品",
    productName: "商品名称",
    quantity: "数量",
    price: "价格",
    actions: "操作",
    updateStatus: "更新状态",
    sendEmail: "发送邮件",
    contactWhatsApp: "联系WhatsApp",
    deleteOrder: "删除订单",
    orderId: "订单编号",
    orderDate: "订单日期",
    status: "状态",
    active: "激活",
    inactive: "未激活",
  },
  ja: {
    manageOrders: "注文管理",
    totalOrders: "合計注文数",
    pendingOrders: "保留中の注文",
    completedOrders: "完了した注文",
    totalSales: "総売上",
    searchPlaceholder: "注文を検索...",
    filterStatus: "ステータスでフィルター",
    all: "すべて",
    pending: "保留中",
    confirmed: "確認済み",
    shipped: "発送済み",
    delivered: "配達済み",
    canceled: "キャンセル済み",
    noOrders: "注文が見つかりません",
    orderDetails: "注文詳細",
    customerInfo: "顧客情報",
    name: "名前",
    email: "メール",
    phone: "電話",
    address: "住所",
    notes: "メモ",
    orderItems: "注文アイテム",
    productName: "商品名",
    quantity: "数量",
    price: "価格",
    actions: "操作",
    updateStatus: "ステータスを更新",
    sendEmail: "メールを送信",
    contactWhatsApp: "WhatsAppで連絡",
    deleteOrder: "注文を削除",
    orderId: "注文ID",
    orderDate: "注文日",
    status: "状態",
    active: "アクティブ",
    inactive: "非アクティブ",
  },
  tr: {
    manageOrders: "Sipariş Yönetimi",
    totalOrders: "Toplam Siparişler",
    pendingOrders: "Bekleyen Siparişler",
    completedOrders: "Tamamlanan Siparişler",
    totalSales: "Toplam Satışlar",
    searchPlaceholder: "Siparişleri ara...",
    filterStatus: "Duruma Göre Filtrele",
    all: "Tümü",
    pending: "Bekliyor",
    confirmed: "Onaylandı",
    shipped: "Gönderildi",
    delivered: "Teslim Edildi",
    canceled: "İptal Edildi",
    noOrders: "Sipariş bulunamadı",
    orderDetails: "Sipariş Detayları",
    customerInfo: "Müşteri Bilgisi",
    name: "İsim",
    email: "E-posta",
    phone: "Telefon",
    address: "Adres",
    notes: "Notlar",
    orderItems: "Sipariş Ürünleri",
    productName: "Ürün Adı",
    quantity: "Miktar",
    price: "Fiyat",
    actions: "İşlemler",
    updateStatus: "Durumu Güncelle",
    sendEmail: "E-posta Gönder",
    contactWhatsApp: "WhatsApp ile İletişim",
    deleteOrder: "Siparişi Sil",
    orderId: "Sipariş ID",
    orderDate: "Sipariş Tarihi",
    status: "Durum",
    active: "Aktif",
    inactive: "Aktif Değil",
  },
  hi: {
    manageOrders: "ऑर्डर प्रबंधन",
    totalOrders: "कुल ऑर्डर",
    pendingOrders: "लंबित ऑर्डर",
    completedOrders: "पूर्ण ऑर्डर",
    totalSales: "कुल बिक्री",
    searchPlaceholder: "ऑर्डर खोजें...",
    filterStatus: "स्थिति के अनुसार फ़िल्टर करें",
    all: "सभी",
    pending: "लंबित",
    confirmed: "पुष्टि की गई",
    shipped: "शिप किया गया",
    delivered: "डिलीवर",
    canceled: "रद्द",
    noOrders: "कोई ऑर्डर नहीं मिला",
    orderDetails: "ऑर्डर विवरण",
    customerInfo: "ग्राहक जानकारी",
    name: "नाम",
    email: "ईमेल",
    phone: "फ़ोन",
    address: "पता",
    notes: "टिप्पणियां",
    orderItems: "आइटम",
    productName: "उत्पाद का नाम",
    quantity: "मात्रा",
    price: "मूल्य",
    actions: "क्रियाएँ",
    updateStatus: "स्थिति अपडेट करें",
    sendEmail: "ईमेल भेजें",
    contactWhatsApp: "WhatsApp संपर्क करें",
    deleteOrder: "ऑर्डर हटाएं",
    orderId: "ऑर्डर आईडी",
    orderDate: "ऑर्डर तिथि",
    status: "स्थिति",
    active: "सक्रिय",
    inactive: "सक्रिय नहीं",
  },
  id: {
    manageOrders: "Pengelolaan Pesanan",
    totalOrders: "Jumlah Pesanan",
    pendingOrders: "Pesanan Tertunda",
    completedOrders: "Pesanan Selesai",
    totalSales: "Total Penjualan",
    searchPlaceholder: "Cari pesanan...",
    filterStatus: "Filter berdasarkan status",
    all: "Semua",
    pending: "Tertunda",
    confirmed: "Dikonfirmasi",
    shipped: "Dikirim",
    delivered: "Dikirim",
    canceled: "Dibatalkan",
    noOrders: "Tidak ditemukan pesanan",
    orderDetails: "Detail Pesanan",
    customerInfo: "Info Pelanggan",
    name: "Nama",
    email: "Email",
    phone: "Telepon",
    address: "Alamat",
    notes: "Catatan",
    orderItems: "Item Pesanan",
    productName: "Nama Produk",
    quantity: "Jumlah",
    price: "Harga",
    actions: "Tindakan",
    updateStatus: "Perbarui Status",
    sendEmail: "Kirim Email",
    contactWhatsApp: "Kontak WhatsApp",
    deleteOrder: "Hapus Pesanan",
    orderId: "ID Pesanan",
    orderDate: "Tanggal Pesanan",
    status: "Status",
    active: "Aktif",
    inactive: "Tidak Aktif",
  },
  ko: {
    manageOrders: "주문 관리",
    totalOrders: "전체 주문 수",
    pendingOrders: "보류 중인 주문",
    completedOrders: "완료된 주문",
    totalSales: "총 판매액",
    searchPlaceholder: "주문 검색...",
    filterStatus: "상태별 필터",
    all: "전체",
    pending: "보류",
    confirmed: "확인됨",
    shipped: "배송됨",
    delivered: "배송 완료",
    canceled: "취소됨",
    noOrders: "주문이 없습니다",
    orderDetails: "주문 세부 정보",
    customerInfo: "고객 정보",
    name: "이름",
    email: "이메일",
    phone: "전화번호",
    address: "주소",
    notes: "메모",
    orderItems: "주문 상품",
    productName: "상품명",
    quantity: "수량",
    price: "가격",
    actions: "작업",
    updateStatus: "상태 업데이트",
    sendEmail: "이메일 보내기",
    contactWhatsApp: "WhatsApp 연락",
    deleteOrder: "주문 삭제",
    orderId: "주문 ID",
    orderDate: "주문 날짜",
    status: "상태",
    active: "활성",
    inactive: "비활성",
  },
  nl: {
    manageOrders: "Bestellingen beheren",
    totalOrders: "Totaal bestellingen",
    pendingOrders: "Wachtende bestellingen",
    completedOrders: "Voltooide bestellingen",
    totalSales: "Totale omzet",
    searchPlaceholder: "Bestellingen zoeken...",
    filterStatus: "Filter op status",
    all: "Alle",
    pending: "In afwachting",
    confirmed: "Bevestigd",
    shipped: "Verzonden",
    delivered: "Afgeleverd",
    canceled: "Geannuleerd",
    noOrders: "Geen bestellingen gevonden",
    orderDetails: "Ordergegevens",
    customerInfo: "Klantinformatie",
    name: "Naam",
    email: "E-mail",
    phone: "Telefoon",
    address: "Adres",
    notes: "Notities",
    orderItems: "Bestelling Items",
    productName: "Productnaam",
    quantity: "Hoeveelheid",
    price: "Prijs",
    actions: "Acties",
    updateStatus: "Status bijwerken",
    sendEmail: "E-mail verzenden",
    contactWhatsApp: "Contact via WhatsApp",
    deleteOrder: "Bestelling verwijderen",
    orderId: "Bestelling ID",
    orderDate: "Orderdatum",
    status: "Status",
    active: "Actief",
    inactive: "Inactief",
  },
  pl: {
    manageOrders: "Zarządzanie Zamówieniami",
    totalOrders: "Razem Zamówień",
    pendingOrders: "Zamówienia w toku",
    completedOrders: "Zamówienia Zrealizowane",
    totalSales: "Łączna Sprzedaż",
    searchPlaceholder: "Szukaj zamówień...",
    filterStatus: "Filtruj według statusu",
    all: "Wszystkie",
    pending: "Oczekujące",
    confirmed: "Potwierdzone",
    shipped: "Wysłane",
    delivered: "Dostarczone",
    canceled: "Anulowane",
    noOrders: "Nie znaleziono zamówień",
    orderDetails: "Szczegóły zamówienia",
    customerInfo: "Informacje o kliencie",
    name: "Imię",
    email: "Email",
    phone: "Telefon",
    address: "Adres",
    notes: "Uwagi",
    orderItems: "Pozycje zamówienia",
    productName: "Nazwa produktu",
    quantity: "Ilość",
    price: "Cena",
    actions: "Akcje",
    updateStatus: "Aktualizuj status",
    sendEmail: "Wyślij email",
    contactWhatsApp: "Kontakt przez WhatsApp",
    deleteOrder: "Usuń zamówienie",
    orderId: "ID zamówienia",
    orderDate: "Data zamówienia",
    status: "Status",
    active: "Aktywny",
    inactive: "Nieaktywny",
  },
};

export default function OrdersPage() {
  const { user } = useAuth();
  const [lang, setLang] = useState<keyof typeof translations>('en');
  const t = translations[lang] || translations.en;
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      
      if (!user) {
        setOrders([]);
        return;
      }
      
      // Load orders from Firebase
      const ordersData = await getOrders(user.uid);
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('حدث خطأ في تحميل الطلبات');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order =>
        (order.customerInfo?.customerName || order.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.customerInfo?.email || order.customerEmail || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.customerInfo?.phone || order.customerPhone || '').includes(searchTerm) ||
        order.id.includes(searchTerm)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      if (!user) {
        toast.error('لا يوجد مستخدم مسجل');
        return;
      }
      
      // Update in Firebase
      await updateOrderStatusInFirebase(user.uid, orderId, newStatus);
      
      // Update local state
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
      
      toast.success('تم تحديث حالة الطلب بنجاح');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('حدث خطأ في تحديث حالة الطلب');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!user) {
      toast.error('لا يوجد مستخدم مسجل');
      return;
    }

    const confirmed = window.confirm('هل أنت متأكد من حذف هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء.');
    if (!confirmed) {
      return;
    }

    try {
      // Delete from Firebase
      await deleteOrder(user.uid, orderId);
      
      // Update local state
      const updatedOrders = orders.filter(order => order.id !== orderId);
      setOrders(updatedOrders);
      
      toast.success('تم حذف الطلب بنجاح');
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('حدث خطأ في حذف الطلب');
    }
  };

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

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'shipped': return <Package className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'قيد الانتظار';
      case 'confirmed': return 'مؤكد';
      case 'shipped': return 'تم الشحن';
      case 'delivered': return 'تم التوصيل';
      case 'cancelled': return 'ملغي';
      default: return 'غير محدد';
    }
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
                <Package className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">{t.manageOrders}</h1>
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
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t.totalOrders}</p>
                  <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t.pendingOrders}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {orders.filter(o => o.status === 'pending').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t.completedOrders}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {orders.filter(o => o.status === 'delivered').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t.totalSales}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="md:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">{t.all}</option>
                  <option value="pending">{t.pending}</option>
                  <option value="confirmed">{t.confirmed}</option>
                  <option value="shipped">{t.shipped}</option>
                  <option value="delivered">{t.delivered}</option>
                  <option value="cancelled">{t.canceled}</option>
                </select>
              </div>
              
              <Button onClick={loadOrders} variant="outline">
                تحديث
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-16 w-16 text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.noOrders}</h2>
              <p className="text-gray-600">لم يتم العثور على طلبات تطابق معايير البحث</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Info */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {t.orderId} #{order.id.slice(-8)}
                        </h3>
                        <Badge className={getStatusColor(order.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(order.status)}
                            <span>{getStatusText(order.status)}</span>
                          </div>
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(order.createdAt).toLocaleDateString('ar-SA')}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4" />
                          <span>{t.totalSales}: ${order.total.toFixed(2)}</span>
                        </div>
                        {order.appliedCoupon && (
                          <div className="flex items-center space-x-2">
                            <span className="text-green-600">كوبون: {order.appliedCoupon}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800">{t.customerInfo}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span>{order.customerInfo?.customerName || order.customerName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{order.customerInfo?.email || order.customerEmail}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{order.customerInfo?.phone || order.customerPhone}</span>
                        </div>
                        {(order.customerInfo?.address || order.customerAddress) && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{order.customerInfo?.address || order.customerAddress}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800">{t.actions}</h4>
                      <div className="space-y-2">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="pending">{t.pending}</option>
                          <option value="confirmed">{t.confirmed}</option>
                          <option value="shipped">{t.shipped}</option>
                          <option value="delivered">{t.delivered}</option>
                          <option value="cancelled">{t.canceled}</option>
                        </select>
                        
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(`mailto:${order.customerInfo?.email || order.customerEmail}`)}
                          >
                            <Mail className="h-4 w-4 mr-1" />
                            {t.sendEmail}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(`https://wa.me/${order.customerInfo?.phone || order.customerPhone}`)}
                          >
                            <Phone className="h-4 w-4 mr-1" />
                            {t.contactWhatsApp}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleDeleteOrder(order.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            {t.deleteOrder}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-semibold text-gray-800 mb-3">{t.orderItems}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          {item.productImage && (
                            <Image 
                              src={item.productImage} 
                              alt={item.productName}
                              className="w-10 h-10 object-cover rounded-lg"
                              width={40}
                              height={40}
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-gray-800 text-sm">{item.productName}</p>
                            <p className="text-gray-600 text-xs">{t.quantity}: {item.quantity}</p>
                          </div>
                          <p className="font-semibold text-indigo-600 text-sm">${item.price}</p>
                        </div>
                      ))}
                    </div>
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