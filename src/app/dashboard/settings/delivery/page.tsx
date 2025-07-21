'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

interface Area {
  name: string;
  price: string;
}
interface Country {
  name: string;
  areas: Area[];
}

export default function DeliverySettingsPage() {
  const { user } = useAuth();
  const planType = user?.planType || 'free';

  // الحالة: قائمة الدول والمحافظات
  const [countries, setCountries] = useState<Country[]>([
    { name: '', areas: [{ name: '', price: '' }] }
  ]);
  const [globalDelivery, setGlobalDelivery] = useState(false);
  const [saving, setSaving] = useState(false);

  // إضافة دولة جديدة (للمدفوع فقط)
  const addCountry = () => {
    setCountries([...countries, { name: '', areas: [{ name: '', price: '' }] }]);
  };
  // حذف دولة
  const removeCountry = (idx: number) => {
    setCountries(countries.filter((_, i) => i !== idx));
  };
  // تعديل اسم دولة
  const handleCountryName = (idx: number, value: string) => {
    setCountries(countries.map((c, i) => i === idx ? { ...c, name: value } : c));
  };
  // إضافة محافظة لدولة
  const addArea = (countryIdx: number) => {
    setCountries(countries.map((c, i) => i === countryIdx ? { ...c, areas: [...c.areas, { name: '', price: '' }] } : c));
  };
  // حذف محافظة
  const removeArea = (countryIdx: number, areaIdx: number) => {
    setCountries(countries.map((c, i) => i === countryIdx ? { ...c, areas: c.areas.filter((_, j) => j !== areaIdx) } : c));
  };
  // تعديل اسم أو سعر محافظة
  const handleAreaChange = (countryIdx: number, areaIdx: number, field: 'name' | 'price', value: string) => {
    setCountries(countries.map((c, i) =>
      i === countryIdx
        ? { ...c, areas: c.areas.map((a, j) => j === areaIdx ? { ...a, [field]: value } : a) }
        : c
    ));
  };

  // حفظ الإعدادات في localStorage
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // تحويل البيانات إلى deliveryOptions
    const deliveryOptions: Record<string, Record<string, number>> = {};
    countries.forEach(country => {
      if (country.name) {
        deliveryOptions[country.name] = {};
        country.areas.forEach(area => {
          if (area.name && area.price) {
            deliveryOptions[country.name][area.name] = Number(area.price);
          }
        });
      }
    });
    // حفظ في localStorage باسم delivery_options_{user.uid}
    if (user?.uid) {
      localStorage.setItem(`delivery_options_${user.uid}`, JSON.stringify(deliveryOptions));
      setTimeout(() => {
        setSaving(false);
        alert('Delivery settings saved successfully!');
      }, 500);
    } else {
      setSaving(false);
      alert('You must be logged in first');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow space-y-8">
      <h1 className="text-2xl font-bold mb-2 text-center">Delivery & Shipping Settings</h1>
      <p className="text-gray-600 text-center mb-6">Set countries, areas, and delivery prices according to your plan.</p>

      {/* الشحن الدولي (مدفوع فقط) */}
      {planType !== 'free' && (
        <div className="p-4 border rounded-lg mb-4 bg-gray-50 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-lg flex items-center gap-2">
              International Shipping
              <Badge className="bg-green-500 text-white">Paid</Badge>
            </h2>
            <p className="text-sm text-gray-500">Enable international shipping for your customers outside your country.</p>
          </div>
          <Switch id="globalDelivery" checked={globalDelivery} onCheckedChange={setGlobalDelivery} />
        </div>
      )}

      {/* الدول والمحافظات */}
      <form onSubmit={handleSave} className="space-y-8">
        {countries.map((country, cIdx) => (
          <div key={cIdx} className="p-4 border rounded-lg mb-4 bg-blue-50">
            <div className="flex items-center gap-2 mb-2">
              <Input
                type="text"
                placeholder="Country name"
                value={country.name}
                onChange={e => handleCountryName(cIdx, e.target.value)}
                className="w-64"
                required
                disabled={planType === 'free' && cIdx > 0}
              />
              {planType !== 'free' && countries.length > 1 && (
                <Button type="button" size="sm" variant="outline" onClick={() => removeCountry(cIdx)}>
                  Remove Country
                </Button>
              )}
            </div>
            <div className="space-y-3">
              {country.areas.map((area, aIdx) => (
                <div key={aIdx} className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Area/Region name"
                    value={area.name}
                    onChange={e => handleAreaChange(cIdx, aIdx, 'name', e.target.value)}
                    className="w-56"
                    required
                  />
                  <Input
                    type="number"
                    min="0"
                    placeholder="Delivery price ($)"
                    value={area.price}
                    onChange={e => handleAreaChange(cIdx, aIdx, 'price', e.target.value)}
                    className="w-32"
                    required
                  />
                  {country.areas.length > 1 && (
                    <Button type="button" size="sm" variant="outline" onClick={() => removeArea(cIdx, aIdx)}>
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" size="sm" variant="secondary" onClick={() => addArea(cIdx)}>
                Add Area/Region
              </Button>
            </div>
          </div>
        ))}
        {/* زر إضافة دولة (مدفوع فقط) */}
        {planType !== 'free' && (
          <Button type="button" variant="outline" onClick={addCountry} className="mb-4">
            + Add Another Country
          </Button>
        )}
        <Button type="submit" className="w-full" disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </form>
    </div>
  );
} 