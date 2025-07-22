"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface Coupon {
  id: string;
  code: string;
  discountPercentage: number;
  validUntil: string; // ISO date
  isActive: boolean;
  usageCount: number;
  maxUsage?: number;
}

// ترجمة النصوص بجميع اللغات مع الإنجليزية كلغة أصلية
const translations = {
  en: {
    manageCoupons: "Coupon Management",
    featureAvailableOnly: "This feature is only available for paid plan users.",
    upgradePlan: "Upgrade to Paid Plan",
    addCoupon: "Add New Coupon",
    addCouponTitle: "Add New Coupon",
    couponCode: "Coupon Code *",
    discountPercent: "Discount Percentage (%) *",
    validUntil: "Valid Until *",
    maxUsage: "Max Usage",
    active: "Active",
    deactivate: "Inactive",
    delete: "Delete",
    currentCoupons: "Current Coupons",
    noCoupons: "No coupons available yet",
    discountDetails: "Discount: {percent}%",
    expiryDate: "Expiry Date: {date}",
    usageCount: "Usage Count: {count}",
  },
  ar: {
    manageCoupons: "إدارة الكوبونات",
    featureAvailableOnly: "هذه الميزة متاحة فقط لأصحاب الخطة المدفوعة.",
    upgradePlan: "ترقية للخطة المدفوعة",
    addCoupon: "إضافة كوبون جديد",
    addCouponTitle: "إضافة كوبون جديد",
    couponCode: "كود الكوبون *",
    discountPercent: "نسبة الخصم (%) *",
    validUntil: "تاريخ الانتهاء *",
    maxUsage: "الحد الأقصى للاستخدام",
    active: "مفعل",
    deactivate: "غير مفعل",
    delete: "حذف",
    currentCoupons: "الكوبونات الحالية",
    noCoupons: "لا توجد كوبونات بعد",
    discountDetails: "خصم: {percent}%",
    expiryDate: "تاريخ الانتهاء: {date}",
    usageCount: "عدد مرات الاستخدام: {count}",
  },
  de: {
    manageCoupons: "Gutscheinverwaltung",
    featureAvailableOnly: "Diese Funktion ist nur für zahlende Nutzer verfügbar.",
    upgradePlan: "Zum bezahlten Plan upgraden",
    addCoupon: "Neuen Gutschein hinzufügen",
    addCouponTitle: "Neuen Gutschein hinzufügen",
    couponCode: "Gutscheincode *",
    discountPercent: "Rabattprozentsatz (%) *",
    validUntil: "Gültig bis *",
    maxUsage: "Maximale Nutzung",
    active: "Aktiv",
    deactivate: "Inaktiv",
    delete: "Löschen",
    currentCoupons: "Aktuelle Gutscheine",
    noCoupons: "Noch keine Gutscheine",
    discountDetails: "Rabatt: {percent}%",
    expiryDate: "Ablaufdatum: {date}",
    usageCount: "Verwendungsanzahl: {count}",
  },
  es: {
    manageCoupons: "Gestión de Cupones",
    featureAvailableOnly: "Esta función solo está disponible para usuarios del plan de pago.",
    upgradePlan: "Actualizar a Plan Pago",
    addCoupon: "Agregar Nuevo Cupón",
    addCouponTitle: "Agregar Nuevo Cupón",
    couponCode: "Código del Cupón *",
    discountPercent: "Porcentaje de Descuento (%) *",
    validUntil: "Válido Hasta *",
    maxUsage: "Uso Máximo",
    active: "Activo",
    deactivate: "Inactivo",
    delete: "Eliminar",
    currentCoupons: "Cupones Actuales",
    noCoupons: "No hay cupones disponibles",
    discountDetails: "Descuento: {percent}%",
    expiryDate: "Fecha de Expiración: {date}",
    usageCount: "Número de Usos: {count}",
  },
  fr: {
    manageCoupons: "Gestion des Coupons",
    featureAvailableOnly: "Cette fonctionnalité est réservée aux utilisateurs du plan payant.",
    upgradePlan: "Passer au plan payant",
    addCoupon: "Ajouter un nouveau coupon",
    addCouponTitle: "Ajouter un nouveau coupon",
    couponCode: "Code du coupon *",
    discountPercent: "Pourcentage de réduction (%) *",
    validUntil: "Valide jusqu'à *",
    maxUsage: "Utilisation maximale",
    active: "Actif",
    deactivate: "Inactif",
    delete: "Supprimer",
    currentCoupons: "Coupons actuels",
    noCoupons: "Aucun coupon disponible",
    discountDetails: "Réduction : {percent}%",
    expiryDate: "Date d'expiration : {date}",
    usageCount: "Nombre d'utilisations : {count}",
  },
  it: {
    manageCoupons: "Gestione Coupon",
    featureAvailableOnly: "Questa funzione è disponibile solo per utenti con piano a pagamento.",
    upgradePlan: "Aggiorna al piano a pagamento",
    addCoupon: "Aggiungi Nuovo Coupon",
    addCouponTitle: "Aggiungi Nuovo Coupon",
    couponCode: "Codice Coupon *",
    discountPercent: "Percentuale di Sconto (%) *",
    validUntil: "Valido fino a *",
    maxUsage: "Utilizzo massimo",
    active: "Attivo",
    deactivate: "Inattivo",
    delete: "Elimina",
    currentCoupons: "Coupon Attuali",
    noCoupons: "Nessun coupon disponibile",
    discountDetails: "Sconto: {percent}%",
    expiryDate: "Data di scadenza: {date}",
    usageCount: "Numero di utilizzi: {count}",
  },
  pt: {
    manageCoupons: "Gerenciamento de Cupons",
    featureAvailableOnly: "Este recurso está disponível apenas para usuários do plano pago.",
    upgradePlan: "Atualizar para Plano Pago",
    addCoupon: "Adicionar Novo Cupom",
    addCouponTitle: "Adicionar Novo Cupom",
    couponCode: "Código do Cupom *",
    discountPercent: "Percentual de Desconto (%) *",
    validUntil: "Válido até *",
    maxUsage: "Uso Máximo",
    active: "Ativo",
    deactivate: "Inativo",
    delete: "Excluir",
    currentCoupons: "Cupons Atuais",
    noCoupons: "Nenhum cupom disponível",
    discountDetails: "Desconto: {percent}%",
    expiryDate: "Data de Expiração: {date}",
    usageCount: "Número de Utilizações: {count}",
  },
  ru: {
    manageCoupons: "Управление Купонами",
    featureAvailableOnly: "Эта функция доступна только для платных пользователей.",
    upgradePlan: "Обновить до платного плана",
    addCoupon: "Добавить Новый Купон",
    addCouponTitle: "Добавить Новый Купон",
    couponCode: "Код Купона *",
    discountPercent: "Процент Скидки (%) *",
    validUntil: "Действительно до *",
    maxUsage: "Максимальное использование",
    active: "Активно",
    deactivate: "Неактивно",
    delete: "Удалить",
    currentCoupons: "Текущие Купоны",
    noCoupons: "Пока нет купонов",
    discountDetails: "Скидка: {percent}%",
    expiryDate: "Дата истечения: {date}",
    usageCount: "Количество использований: {count}",
  },
  zh: {
    manageCoupons: "优惠券管理",
    featureAvailableOnly: "此功能仅对付费用户开放。",
    upgradePlan: "升级到付费计划",
    addCoupon: "添加新优惠券",
    addCouponTitle: "添加新优惠券",
    couponCode: "优惠码 *",
    discountPercent: "折扣百分比 (%) *",
    validUntil: "有效期至 *",
    maxUsage: "最大使用次数",
    active: "激活",
    deactivate: "未激活",
    delete: "删除",
    currentCoupons: "当前优惠券",
    noCoupons: "暂无优惠券",
    discountDetails: "折扣：{percent}%",
    expiryDate: "到期日期：{date}",
    usageCount: "使用次数：{count}",
  },
  ja: {
    manageCoupons: "クーポン管理",
    featureAvailableOnly: "この機能は有料プランのユーザーのみ利用可能です。",
    upgradePlan: "有料プランにアップグレード",
    addCoupon: "新しいクーポンを追加",
    addCouponTitle: "新しいクーポンを追加",
    couponCode: "クーポンコード *",
    discountPercent: "割引率 (%) *",
    validUntil: "有効期限 *",
    maxUsage: "最大使用回数",
    active: "有効",
    deactivate: "無効",
    delete: "削除",
    currentCoupons: "現在のクーポン",
    noCoupons: "利用可能なクーポンはありません",
    discountDetails: "割引：{percent}%",
    expiryDate: "有効期限：{date}",
    usageCount: "使用回数：{count}",
  },
  tr: {
    manageCoupons: "Kupon Yönetimi",
    featureAvailableOnly: "Bu özellik sadece ücretli plan kullanıcıları içindir.",
    upgradePlan: "Ücretli plana Yükselt",
    addCoupon: "Yeni Kupon Ekle",
    addCouponTitle: "Yeni Kupon Ekle",
    couponCode: "Kupon Kodu *",
    discountPercent: "İndirim Yüzdesi (%) *",
    validUntil: "Geçerli Tarih *",
    maxUsage: "Maksimum Kullanım",
    active: "Aktif",
    deactivate: "Pasif",
    delete: "Sil",
    currentCoupons: "Mevcut Kuponlar",
    noCoupons: "Henüz kupon yok",
    discountDetails: "İndirim: {percent}%",
    expiryDate: "Son Kullanma Tarihi: {date}",
    usageCount: "Kullanım Sayısı: {count}",
  },
  hi: {
    manageCoupons: "कूपन प्रबंधन",
    featureAvailableOnly: "यह सुविधा केवल भुगतान योजना उपयोगकर्ताओं के लिए उपलब्ध है।",
    upgradePlan: "भुगतान योजना में अपग्रेड करें",
    addCoupon: "नया कूपन जोड़ें",
    addCouponTitle: "नया कूपन जोड़ें",
    couponCode: "कूपन कोड *",
    discountPercent: "डिस्काउंट प्रतिशत (%) *",
    validUntil: "तक मान्य *",
    maxUsage: "अधिकतम उपयोग",
    active: "सक्रिय",
    deactivate: "निष्क्रिय",
    delete: "हटाएँ",
    currentCoupons: "वर्तमान कूपन",
    noCoupons: "कोई कूपन उपलब्ध नहीं",
    discountDetails: "छूट: {percent}%",
    expiryDate: "समाप्ति तिथि: {date}",
    usageCount: "उपयोग की संख्या: {count}",
  },
  id: {
    manageCoupons: "Pengelolaan Kupon",
    featureAvailableOnly: "Fitur ini hanya tersedia untuk pengguna paket berbayar.",
    upgradePlan: "Tingkatkan ke Paket Berbayar",
    addCoupon: "Tambah Kupon Baru",
    addCouponTitle: "Tambah Kupon Baru",
    couponCode: "Kode Kupon *",
    discountPercent: "Persentase Diskon (%) *",
    validUntil: "Berlaku Hingga *",
    maxUsage: "Penggunaan Maksimum",
    active: "Aktif",
    deactivate: "Nonaktif",
    delete: "Hapus",
    currentCoupons: "Kupon Saat Ini",
    noCoupons: "Belum ada kupon",
    discountDetails: "Diskon: {percent}%",
    expiryDate: "Tanggal Kedaluwarsa: {date}",
    usageCount: "Jumlah Penggunaan: {count}",
  },
  ko: {
    manageCoupons: "쿠폰 관리",
    featureAvailableOnly: "이 기능은 유료 플랜 사용자만 사용할 수 있습니다.",
    upgradePlan: "유료 플랜으로 업그레이드",
    addCoupon: "새 쿠폰 추가",
    addCouponTitle: "새 쿠폰 추가",
    couponCode: "쿠폰 코드 *",
    discountPercent: "할인율 (%) *",
    validUntil: "유효 기간 *",
    maxUsage: "최대 사용 횟수",
    active: "활성",
    deactivate: "비활성",
    delete: "삭제",
    currentCoupons: "현재 쿠폰",
    noCoupons: "쿠폰이 없습니다",
    discountDetails: "할인: {percent}%",
    expiryDate: "만료일: {date}",
    usageCount: "사용 횟수: {count}",
  },
  nl: {
    manageCoupons: "Couponbeheer",
    featureAvailableOnly: "Deze functie is alleen beschikbaar voor betaalde plangebruikers.",
    upgradePlan: "Upgrade naar Betaald Plan",
    addCoupon: "Nieuwe Coupon Toevoegen",
    addCouponTitle: "Nieuwe Coupon Toevoegen",
    couponCode: "Couponcode *",
    discountPercent: "Kortingspercentage (%) *",
    validUntil: "Geldig tot *",
    maxUsage: "Maximaal gebruik",
    active: "Actief",
    deactivate: "Inactief",
    delete: "Verwijderen",
    currentCoupons: "Huidige Coupons",
    noCoupons: "Nog geen coupons",
    discountDetails: "Kortings: {percent}%",
    expiryDate: "Vervaldatum: {date}",
    usageCount: "Aantal keren gebruikt: {count}",
  },
  pl: {
    manageCoupons: "Zarządzanie Kuponami",
    featureAvailableOnly: "Ta funkcja jest dostępna tylko dla użytkowników płatnego planu.",
    upgradePlan: "Ulepsz do płatnego planu",
    addCoupon: "Dodaj Nowy Kupon",
    addCouponTitle: "Dodaj Nowy Kupon",
    couponCode: "Kod Kuponu *",
    discountPercent: "Procent Zniżki (%) *",
    validUntil: "Ważne do *",
    maxUsage: "Maksymalna liczba użyć",
    active: "Aktywny",
    deactivate: "Nieaktywny",
    delete: "Usuń",
    currentCoupons: "Obecne Kupony",
    noCoupons: "Brak dostępnych kuponów",
    discountDetails: "Zniżka: {percent}%",
    expiryDate: "Data wygaśnięcia: {date}",
    usageCount: "Liczba użyć: {count}",
  },
};

export default function CouponsSettingsPage() {
  const { user } = useAuth();
  const planType = user?.planType || "free";

  // ustawienie języka, domyślnie angielski
  const [lang, setLang] = useState<keyof typeof translations>("en");
  const t = translations[lang] || translations.en;

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [form, setForm] = useState({
    code: "",
    discountPercentage: 10,
    validUntil: "",
    maxUsage: "",
    isActive: true,
  });

  // Load coupons from localStorage
  useEffect(() => {
    if (user?.uid) {
      const saved = localStorage.getItem(`coupons_${user.uid}`);
      if (saved) setCoupons(JSON.parse(saved));
    }
  }, [user?.uid]);

  // Save coupons to localStorage
  const saveCoupons = (newCoupons: Coupon[]) => {
    if (user?.uid) {
      localStorage.setItem(`coupons_${user.uid}` , JSON.stringify(newCoupons));
      setCoupons(newCoupons);
    }
  };

  // Add new coupon
  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim()) {
      toast.error("يرجى إدخال كود الكوبون");
      return;
    }
    if (coupons.some(c => c.code.toLowerCase() === form.code.trim().toLowerCase())) {
      toast.error("كود الكوبون مستخدم بالفعل");
      return;
    }
    if (!form.validUntil) {
      toast.error("يرجى تحديد تاريخ الانتهاء");
      return;
    }
    const newCoupon: Coupon = {
      id: Date.now().toString(),
      code: form.code.trim(),
      discountPercentage: Number(form.discountPercentage),
      validUntil: form.validUntil,
      isActive: form.isActive,
      usageCount: 0,
      maxUsage: form.maxUsage ? Number(form.maxUsage) : undefined,
    };
    const updated = [newCoupon, ...coupons];
    saveCoupons(updated);
    setForm({ code: "", discountPercentage: 10, validUntil: "", maxUsage: "", isActive: true });
    toast.success("تم إضافة الكوبون بنجاح");
  };

  // Delete coupon
  const handleDelete = (id: string) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الكوبون؟")) return;
    const updated = coupons.filter(c => c.id !== id);
    saveCoupons(updated);
    toast.success("تم حذف الكوبون");
  };

  // Toggle active
  const handleToggleActive = (id: string) => {
    const updated = coupons.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c);
    saveCoupons(updated);
  };

  if (planType === "free") {
    return (
      <div className="max-w-xl mx-auto p-8 mt-12 bg-white rounded-xl shadow text-center">
        <h1 className="text-2xl font-bold mb-4">{t.manageCoupons}</h1>
        <p className="text-gray-600 mb-6">{t.featureAvailableOnly}</p>
        <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold">{t.upgradePlan}</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 mt-12 bg-white rounded-xl shadow">
      {/* Language Selector */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-center">{t.manageCoupons}</h1>
        <select
          value={lang}
          onChange={e => setLang(e.target.value as keyof typeof translations)}
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
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t.addCoupon}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddCoupon} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">{t.couponCode}</label>
              <Input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} required />
            </div>
            <div>
              <label className="block mb-1 font-medium">{t.discountPercent}</label>
              <Input type="number" min={1} max={100} value={form.discountPercentage} onChange={e => setForm(f => ({ ...f, discountPercentage: Number(e.target.value) }))} required />
            </div>
            <div>
              <label className="block mb-1 font-medium">{t.validUntil}</label>
              <Input type="date" value={form.validUntil} onChange={e => setForm(f => ({ ...f, validUntil: e.target.value }))} required />
            </div>
            <div>
              <label className="block mb-1 font-medium">{t.maxUsage}</label>
              <Input type="number" min={1} value={form.maxUsage} onChange={e => setForm(f => ({ ...f, maxUsage: e.target.value }))} placeholder="غير محدد" />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Switch checked={form.isActive} onCheckedChange={v => setForm(f => ({ ...f, isActive: v }))} />
              <span>{t.active}</span>
            </div>
            <div className="flex items-center mt-2">
              <Button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold">{t.addCoupon}</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.currentCoupons}</CardTitle>
        </CardHeader>
        <CardContent>
          {coupons.length === 0 ? (
            <div className="text-center text-gray-500 py-8">{t.noCoupons}</div>
          ) : (
            <div className="space-y-4">
              {coupons.map(coupon => (
                <div key={coupon.id} className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-3 gap-2">
                  <div>
                    <div className="font-bold text-lg">{coupon.code}</div>
                    <div className="text-sm text-gray-600">{t.discountDetails.replace('{percent}', coupon.discountPercentage.toString())}</div>
                    <div className="text-sm text-gray-600">{t.expiryDate.replace('{date}', coupon.validUntil)}</div>
                    {coupon.maxUsage && <div className="text-sm text-gray-600">{t.maxUsage}: {coupon.maxUsage}</div>}
                    <div className="text-sm text-gray-600">{t.usageCount.replace('{count}', coupon.usageCount.toString())}</div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 md:mt-0">
                    <Switch checked={coupon.isActive} onCheckedChange={() => handleToggleActive(coupon.id)} />
                    <span className="text-xs">{coupon.isActive ? t.active : t.deactivate}</span>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(coupon.id)} className="text-red-600 border-red-300">{t.delete}</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}