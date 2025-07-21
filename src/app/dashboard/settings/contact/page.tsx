"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { getStore, updateStore } from '@/lib/firebase-services';
import { Phone, Instagram, Mail, MessageCircle, Twitter, Facebook, Globe } from 'lucide-react';

export default function ContactSettingsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [twitter, setTwitter] = useState('');
  const [snapchat, setSnapchat] = useState('');
  const [facebook, setFacebook] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      try {
        const store = await getStore(user.uid);
        setWhatsapp(store?.whatsapp || '');
        setInstagram(store?.instagram || '');
        setTiktok(store?.tiktok || '');
        setTwitter(store?.twitter || '');
        setSnapchat(store?.snapchat || '');
        setFacebook(store?.facebook || '');
        setEmail(store?.email || '');
      } catch {
        toast.error('Failed to load store data');
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>403 - Not Authorized</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">You must log in to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isPaid = user.planType !== 'free';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateStore(user.uid, {
        whatsapp: isPaid ? whatsapp : undefined,
        instagram: isPaid ? instagram : undefined,
        tiktok: isPaid ? tiktok : undefined,
        twitter: isPaid ? twitter : undefined,
        snapchat: isPaid ? snapchat : undefined,
        facebook: isPaid ? facebook : undefined,
        email,
      });
      toast.success('Saved contact information successfully');
    } catch {
      toast.error('Failed to save data');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <Card className="shadow-xl border-2 border-indigo-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gradient-primary mb-2 flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-indigo-500" /> Contact Settings
          </CardTitle>
          <p className="text-gray-500 text-sm">You can customize the contact methods that appear in your store</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="mb-2">
              <h3 className="font-semibold text-indigo-700 mb-1 flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-500" /> Email (Available to Everyone)
              </h3>
              <div className="flex items-center bg-blue-50 rounded-lg px-3 py-2">
                <Mail className="h-5 w-5 text-blue-400 mr-2" />
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Example: info@store.com"
                  className="bg-transparent border-0 focus:ring-0 focus:border-blue-300"
                />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-green-700 mb-1 flex items-center gap-2">
                <Phone className="h-4 w-4 text-green-500" /> WhatsApp
              </h3>
              <div className="flex items-center bg-green-50 rounded-lg px-3 py-2">
                <Phone className="h-5 w-5 text-green-400 mr-2" />
                <Input
                  type="text"
                  value={whatsapp}
                  onChange={e => setWhatsapp(e.target.value)}
                  placeholder="Example: +9665xxxxxxx"
                  className={`bg-transparent border-0 focus:ring-0 focus:border-green-300 ${!isPaid ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!isPaid}
                />
              </div>
              {!isPaid && <p className="text-xs text-gray-500 mt-1">Available only for paid subscribers</p>}
            </div>
            <div>
              <h3 className="font-semibold text-pink-700 mb-1 flex items-center gap-2">
                <Instagram className="h-4 w-4 text-pink-500" /> Instagram
              </h3>
              <div className="flex items-center bg-pink-50 rounded-lg px-3 py-2">
                <Instagram className="h-5 w-5 text-pink-400 mr-2" />
                <Input
                  type="text"
                  value={instagram}
                  onChange={e => setInstagram(e.target.value)}
                  placeholder="Example: store_account"
                  className={`bg-transparent border-0 focus:ring-0 focus:border-pink-300 ${!isPaid ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!isPaid}
                />
              </div>
              {!isPaid && <p className="text-xs text-gray-500 mt-1">Available only for paid subscribers</p>}
            </div>
            <div>
              <h3 className="font-semibold text-black mb-1 flex items-center gap-2">
                <Globe className="h-4 w-4 text-black" /> TikTok
              </h3>
              <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                <Globe className="h-5 w-5 text-black mr-2" />
                <Input
                  type="text"
                  value={tiktok}
                  onChange={e => setTiktok(e.target.value)}
                  placeholder="Example: tiktok_account"
                  className={`bg-transparent border-0 focus:ring-0 focus:border-gray-400 ${!isPaid ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!isPaid}
                />
              </div>
              {!isPaid && <p className="text-xs text-gray-500 mt-1">Available only for paid subscribers</p>}
            </div>
            <div>
              <h3 className="font-semibold text-blue-700 mb-1 flex items-center gap-2">
                <Twitter className="h-4 w-4 text-blue-400" /> Twitter
              </h3>
              <div className="flex items-center bg-blue-50 rounded-lg px-3 py-2">
                <Twitter className="h-5 w-5 text-blue-400 mr-2" />
                <Input
                  type="text"
                  value={twitter}
                  onChange={e => setTwitter(e.target.value)}
                  placeholder="Example: twitter_account"
                  className={`bg-transparent border-0 focus:ring-0 focus:border-blue-300 ${!isPaid ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!isPaid}
                />
              </div>
              {!isPaid && <p className="text-xs text-gray-500 mt-1">Available only for paid subscribers</p>}
            </div>
            <div>
              <h3 className="font-semibold text-yellow-700 mb-1 flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-yellow-400" /> Snapchat
              </h3>
              <div className="flex items-center bg-yellow-50 rounded-lg px-3 py-2">
                <MessageCircle className="h-5 w-5 text-yellow-400 mr-2" />
                <Input
                  type="text"
                  value={snapchat}
                  onChange={e => setSnapchat(e.target.value)}
                  placeholder="Example: snapchat_account"
                  className={`bg-transparent border-0 focus:ring-0 focus:border-yellow-300 ${!isPaid ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!isPaid}
                />
              </div>
              {!isPaid && <p className="text-xs text-gray-500 mt-1">Available only for paid subscribers</p>}
            </div>
            <div>
              <h3 className="font-semibold text-blue-800 mb-1 flex items-center gap-2">
                <Facebook className="h-4 w-4 text-blue-700" /> Facebook
              </h3>
              <div className="flex items-center bg-blue-100 rounded-lg px-3 py-2">
                <Facebook className="h-5 w-5 text-blue-700 mr-2" />
                <Input
                  type="text"
                  value={facebook}
                  onChange={e => setFacebook(e.target.value)}
                  placeholder="Example: facebook_account"
                  className={`bg-transparent border-0 focus:ring-0 focus:border-blue-400 ${!isPaid ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!isPaid}
                />
              </div>
              {!isPaid && <p className="text-xs text-gray-500 mt-1">Available only for paid subscribers</p>}
            </div>
            {!isPaid && (
              <div className="flex justify-center mt-6">
                <a href="/checkout" target="_blank">
                  <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold px-8 py-3 text-lg shadow-lg hover:opacity-90">Upgrade to Paid Plan</Button>
                </a>
              </div>
            )}
            <Button type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 text-lg shadow-lg hover:opacity-90 mt-4" disabled={saving || loading}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 