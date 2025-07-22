'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Store, Search, Phone, Mail, Instagram, Package, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { getStore, getProducts } from '@/lib/firebase-services';
import { getCartItemCount, clearCart } from '@/lib/cart-service';
import type { Store as StoreType, Product } from '@/types';
import { toast } from 'sonner';

// سلايدر صور بسيط للمنتج
function ProductImageSlider({ images }: { images?: string[] }) {
  const [current, setCurrent] = useState(0);
  if (!images || images.length === 0) return (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
      <span className="text-gray-400 text-sm">No image</span>
    </div>
  );
  const next = () => setCurrent((prev) => (prev + 1) % images.length);
  const prev = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <img
        src={images[current]}
        alt={`Product image ${current + 1}`}
        width={400}
        height={400}
        className="w-full h-full object-cover rounded-lg"
      />
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow"
            aria-label="Previous"
          >
            <span className="text-lg">&#8592;</span>
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow"
            aria-label="Next"
          >
            <span className="text-lg">&#8594;</span>
          </button>
        </>
      )}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {images.map((_, idx) => (
            <span
              key={idx}
              className={`inline-block w-2 h-2 rounded-full ${idx === current ? 'bg-primary' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function PublicStorePage() {
  const params = useParams();
  const userId = params?.userId as string;
  
  const [store, setStore] = useState<StoreType | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [selectedColors, setSelectedColors] = useState<{ [productId: string]: string }>({});
  const [selectedSizes, setSelectedSizes] = useState<{ [productId: string]: string }>({});
  const [displayPrices, setDisplayPrices] = useState<{ [productId: string]: number }>({});
  const [logoToShow, setLogoToShow] = useState(store?.logo || '');

  useEffect(() => {
    if (userId) {
      try {
        // تحديث معرف المتجر الحالي في localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('current_store_id', userId);
        }
        loadStoreData();
      } catch (error) {
        console.error('Error in useEffect:', error);
        setLoading(false);
        toast.error('حدث خطأ في تحميل المتجر');
      }
    }
  }, [userId]);

  useEffect(() => {
    try {
      // Update cart count
      setCartCount(getCartItemCount());
      
      // Listen for cart changes
      const handleStorageChange = () => {
        // تحديث عدد العناصر في السلة عند تغيير localStorage
        const newCount = getCartItemCount();
        setCartCount(newCount);
        console.log('Cart count updated:', newCount);
      };
      
      // تفريغ السلة عند الانتقال بين المتاجر
      const clearCartOnStoreChange = () => {
        const currentStoreId = localStorage.getItem('current_store_id');
        if (currentStoreId && currentStoreId !== userId) {
          console.log('Store changed, clearing cart. Old store:', currentStoreId, 'New store:', userId);
          clearCart();
          localStorage.setItem('current_store_id', userId);
          setCartCount(0);
        }
      };
      
      clearCartOnStoreChange();
      
      // تحديث عدد العناصر في السلة عند التحميل
      setCartCount(getCartItemCount());
      
      // الاستماع لتغييرات localStorage
      window.addEventListener('storage', handleStorageChange);
      
      // الاستماع لتغييرات localStorage في نفس النافذة
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = function(key: string, value: string) {
        originalSetItem.call(this, key, value);
        if (key === `sellava_cart_${userId}`) {
          handleStorageChange();
        }
      };
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        localStorage.setItem = originalSetItem;
      };
    } catch (error) {
      console.error('Error in cart useEffect:', error);
    }
  }, [userId]);

  useEffect(() => {
    try {
      // Filter products based on search term
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredProducts(filtered);
    } catch (error) {
      console.error('Error filtering products:', error);
      setFilteredProducts(products);
    }
  }, [products, searchTerm]);

  // تحديث السعر عند تغيير اللون أو الحجم لأي منتج
  useEffect(() => {
    const newPrices: { [productId: string]: number } = {};
    filteredProducts.forEach((product) => {
      const basePrice = product.price;
      let colorPrice = basePrice;
      let sizePrice = basePrice;
      if (product.colors && selectedColors[product.id]) {
        const colorObj = product.colors.find((c: any) => c.value === selectedColors[product.id]);
        if (colorObj && colorObj.price) colorPrice = parseFloat(colorObj.price);
      }
      if (product.sizes && selectedSizes[product.id]) {
        const sizeObj = product.sizes.find((s: any) => s.value === selectedSizes[product.id]);
        if (sizeObj && sizeObj.price) sizePrice = parseFloat(sizeObj.price);
      }
      const finalPrice = Math.max(basePrice, colorPrice, sizePrice);
      newPrices[product.id] = finalPrice;
    });
    setDisplayPrices(newPrices);
  }, [filteredProducts, selectedColors, selectedSizes]);

  useEffect(() => {
    if (typeof window !== 'undefined' && store) {
      const localLogo = localStorage.getItem(`store_logo_${userId}`);
      if (localLogo) setLogoToShow(localLogo);
      else setLogoToShow(store.logo || '');
    }
  }, [userId, store]);

  const loadStoreData = async () => {
    try {
      setLoading(true);
      
      // معالجة خاصة للمستخدم في وضع الاختبار
      if (userId === 'wNgsY8iZE7M52xMIhvjDKndYqMh1') {
        const testStore: StoreType = {
          userId: 'wNgsY8iZE7M52xMIhvjDKndYqMh1',
          storeTitle: 'متجر Sellava التجريبي',
          storeBio: 'متجر تجريبي لعرض ميزات منصة Sellava',
          storeCountry: 'مصر',
          planType: 'free',
          enableAI: false,
          autoDescription: false,
          localDelivery: false,
          globalDelivery: false,
          deliveryCost: 0,
          whatsapp: '+966501234567',
          instagram: 'sellava_store',
          email: 'info@sellava.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        // تحميل المنتجات من localStorage للمستخدم التجريبي
        let testProducts: Product[] = [];
        try {
          const savedProducts = localStorage.getItem('test_user_products');
          testProducts = savedProducts ? JSON.parse(savedProducts) : [];
          
          // إذا لم تكن هناك منتجات، أنشئ منتجات افتراضية
          if (testProducts.length === 0) {
            testProducts = [
              {
                id: '1',
                name: 'هاتف ذكي جديد',
                description: 'هاتف ذكي بمواصفات عالية وكاميرا ممتازة',
                price: 299.99,
                category: 'إلكترونيات',
                images: ['https://via.placeholder.com/300x300/3B82F6/FFFFFF?text=هاتف+ذكي'],
                inStock: true,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              {
                id: '2',
                name: 'لابتوب للألعاب',
                description: 'لابتوب قوي للألعاب والتصميم',
                price: 899.99,
                category: 'إلكترونيات',
                images: ['https://via.placeholder.com/300x300/10B981/FFFFFF?text=لابتوب+ألعاب'],
                inStock: true,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              {
                id: '3',
                name: 'سماعات لاسلكية',
                description: 'سماعات بلوتوث عالية الجودة',
                price: 79.99,
                category: 'إكسسوارات',
                images: ['https://via.placeholder.com/300x300/F59E0B/FFFFFF?text=سماعات+لاسلكية'],
                inStock: true,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              {
                id: '4',
                name: 'ساعة ذكية',
                description: 'ساعة ذكية مع تتبع اللياقة البدنية',
                price: 199.99,
                category: 'إكسسوارات',
                images: ['https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=ساعة+ذكية'],
                inStock: true,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              {
                id: '5',
                name: 'كاميرا رقمية',
                description: 'كاميرا احترافية للتصوير',
                price: 599.99,
                category: 'إلكترونيات',
                images: ['https://via.placeholder.com/300x300/EF4444/FFFFFF?text=كاميرا+رقمية'],
                inStock: true,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              {
                id: '6',
                name: 'طابعة ليزر',
                description: 'طابعة ليزر سريعة واقتصادية',
                price: 149.99,
                category: 'مكتبية',
                images: ['https://via.placeholder.com/300x300/6B7280/FFFFFF?text=طابعة+ليزر'],
                inStock: true,
                createdAt: new Date(),
                updatedAt: new Date(),
              }
            ];
            
            // حفظ المنتجات الافتراضية
            localStorage.setItem('test_user_products', JSON.stringify(testProducts));
          }
        } catch (error) {
          console.error('Error loading test products:', error);
          testProducts = [];
        }
        
        setStore(testStore);
        setProducts(testProducts);
        setFilteredProducts(testProducts);
        setLoading(false);
        return;
      }
      
      // للمستخدمين الآخرين، جرب تحميل البيانات من Firebase
      try {
        console.log('Loading store data for user:', userId);
        
        // التأكد من أن Firebase متاح
        if (typeof window === 'undefined') {
          console.log('Running on server side, skipping Firebase calls');
          setStore(null);
          setProducts([]);
          setFilteredProducts([]);
          setLoading(false);
          return;
        }
        
        const [storeData, productsData] = await Promise.all([
          getStore(userId),
          getProducts(userId),
        ]);
        
        console.log('Store data loaded:', storeData);
        console.log('Products data loaded:', productsData);
        
        if (storeData) {
          setStore(storeData);
          setProducts(productsData || []);
          setFilteredProducts(productsData || []);
        } else {
          // إذا لم يتم العثور على المتجر، اعرض متجر افتراضي
          const defaultStore: StoreType = {
            userId: userId,
            storeTitle: 'New Store',
            storeBio: 'Welcome to our new store',
            storeCountry: 'USA',
            planType: 'free',
            enableAI: false,
            autoDescription: false,
            localDelivery: false,
            globalDelivery: false,
            deliveryCost: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          
          setStore(defaultStore);
          setProducts([]);
          setFilteredProducts([]);
        }
      } catch (error) {
        console.error('Error loading store data from Firebase:', error);
        
        // في حالة الخطأ، اعرض متجر افتراضي
        const defaultStore: StoreType = {
          userId: userId,
          storeTitle: 'New Store',
          storeBio: 'Welcome to our new store',
          storeCountry: 'USA',
          planType: 'free',
          enableAI: false,
          autoDescription: false,
          localDelivery: false,
          globalDelivery: false,
          deliveryCost: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        setStore(defaultStore);
        setProducts([]);
        setFilteredProducts([]);
        
        // عرض رسالة خطأ للمستخدم
        toast.error('حدث خطأ في تحميل المتجر. يتم عرض متجر افتراضي.');
      }
    } catch (error) {
      console.error('Error loading store data:', error);
      toast.error('حدث خطأ في تحميل المتجر');
      setStore(null);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (cartItem: any) => {
  try {
      const cartKey = `sellava_cart_${userId}`;
    const currentCart = JSON.parse(localStorage.getItem(cartKey) || '[]');
      const existingItemIndex = currentCart.findIndex((item: any) => item.productId === cartItem.productId && item.selectedColor === cartItem.selectedColor && item.selectedSize === cartItem.selectedSize);
    if (existingItemIndex > -1) {
      currentCart[existingItemIndex].quantity += 1;
    } else {
        currentCart.push(cartItem);
    }
    localStorage.setItem(cartKey, JSON.stringify(currentCart));
    setCartCount(getCartItemCount());
      toast.success('Product added to cart');
  } catch (error) {
    console.error('Error adding to cart:', error);
      toast.error('Failed to add product to cart');
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading store...</h2>
          <p className="text-gray-600">Please wait</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Store not found</h1>
          <p className="text-gray-600 mb-4">Sorry, this store is not available or has been deleted.</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Retry
          </Button>
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
              {logoToShow && (
                <img
                  src={logoToShow}
                  alt="Store Logo"
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-white"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold text-white">{store?.storeTitle || 'متجر'}</h1>
                {store?.storeBio && (
                  <p className="text-white/90 text-sm mt-1">{store.storeBio}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/cart">
                <Button variant="outline" className="relative text-white border-white/30 hover:bg-white/10">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-red-500 text-white">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Contact Info */}
      {(store?.whatsapp || store?.instagram || store?.email) ? (
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Contact Us</h3>
              <p className="text-sm text-gray-600">We are here to help you with any inquiry</p>
            </div>
            <div className="flex flex-wrap items-center justify-center space-x-8 text-sm">
              {store?.whatsapp && (
                <a
                  href={`https://wa.me/${store.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors shadow-md hover:shadow-lg"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  WhatsApp
                </a>
              )}
              
              {store?.instagram && (
                <a
                  href={`https://instagram.com/${store.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-colors shadow-md hover:shadow-lg"
                >
                  <Instagram className="h-4 w-4 mr-1" />
                  Instagram
                </a>
              )}
              
              {store?.email && (
                <a
                  href={`mailto:${store.email}`}
                  className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  {store.email}
                </a>
              )}
            </div>
          </div>
        </div>
      ) : (
        // English notification for free plan users with no contact links
        store?.planType === 'free' && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <MessageCircle className="h-6 w-6 text-yellow-600" />
                  <h3 className="text-xl font-semibold text-yellow-800">Connect with your customers</h3>
                </div>
                <p className="text-sm text-yellow-700 mb-4 max-w-md mx-auto">
                  Add WhatsApp and Instagram links for direct communication with your customers and boost your sales.
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex items-center text-yellow-700">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">WhatsApp</span>
                  </div>
                  <div className="flex items-center text-yellow-700">
                    <Instagram className="h-4 w-4 mr-1" />
                    <span className="text-sm">Instagram</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* رسالة ترحيب للمتجر الجديد */}
        {products.length === 0 && !searchTerm && (
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
            <div className="text-center">
              <Store className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-blue-900 mb-2">Welcome to our new store! 🎉</h2>
              <p className="text-blue-700 mb-4">
                This is a new store. Products will be added soon.
              </p>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Products */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No search results' : 'No products yet'}
            </h2>
            {searchTerm ? (
              <p className="text-gray-600">
                Try searching with different keywords
              </p>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600">
                  This is a new store. Products will be added soon.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const selectedColor = selectedColors[product.id] || '';
              const selectedSize = selectedSizes[product.id] || '';
              const displayPrice = displayPrices[product.id] ?? product.price;

              const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
                setSelectedColors((prev) => ({ ...prev, [product.id]: e.target.value }));
              };
              const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
                setSelectedSizes((prev) => ({ ...prev, [product.id]: e.target.value }));
              };

              // منطق الإضافة للسلة مع الخصائص
              const handleAddToCartWithOptions = () => {
                if ((product.colors && !selectedColor) || (product.sizes && !selectedSize)) {
                  toast.error('Please select all required options');
                  return;
                }
                const selectedColorObj = product.colors?.find((c: any) => c.value === selectedColor);
                const selectedSizeObj = product.sizes?.find((s: any) => s.value === selectedSize);
                const finalPrice = Math.max(
                  product.price,
                  selectedColorObj?.price ? parseFloat(selectedColorObj.price) : product.price,
                  selectedSizeObj?.price ? parseFloat(selectedSizeObj.price) : product.price
                );
                const cartProduct = {
                  productId: product.id,
                  name: product.name,
                  price: finalPrice,
                  image: product.images?.[0] || '',
                  quantity: 1,
                  selectedColor: selectedColor || undefined,
                  selectedSize: selectedSize || undefined,
                };
                handleAddToCart(cartProduct);
              };

              return (
              <Card key={product.id} className="overflow-hidden hover-lift shadow-glow">
                <div className="aspect-square relative">
                    {/* سلايدر الصور */}
                    <ProductImageSlider images={product.images} />
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <Badge variant="secondary" className="text-white bg-red-500">
                        Not Available
                      </Badge>
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg line-clamp-2 text-gradient-primary">{product.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                    {/* خيارات الحجم واللون */}
                    {product.sizes && product.sizes.length > 0 && (
                      <div className="mb-2">
                        <label className="block text-sm font-medium mb-1">Size:</label>
                        <select
                          className="w-full border rounded px-2 py-1"
                          value={selectedSize}
                          onChange={handleSizeChange}
                        >
                          <option value="">Select size</option>
                          {product.sizes.map((s: any, idx: number) => (
                            <option key={idx} value={s.value}>
                              {s.value}{s.price ? ` (${s.price} USD)` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    {product.colors && product.colors.length > 0 && (
                      <div className="mb-2">
                        <label className="block text-sm font-medium mb-1">Color:</label>
                        <select
                          className="w-full border rounded px-2 py-1"
                          value={selectedColor}
                          onChange={handleColorChange}
                        >
                          <option value="">Select color</option>
                          {product.colors.map((c: any, idx: number) => (
                            <option key={idx} value={c.value}>
                              {c.value}{c.price ? ` (${c.price} USD)` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        {product.oldPrice && product.oldPrice > displayPrice && (
                        <span className="text-sm text-red-600 line-through mr-1">${product.oldPrice.toFixed(2)}</span>
                      )}
                        <span
                          className={
                            product.oldPrice && product.oldPrice > displayPrice
                              ? 'text-2xl font-bold text-green-600'
                              : 'text-2xl font-bold text-gray-900'
                          }
                        >
                          ${displayPrice.toFixed(2)}
                        </span>
                    </div>
                    <Button
                        onClick={handleAddToCartWithOptions}
                        disabled={!product.inStock || (product.sizes && !selectedSize) || (product.colors && !selectedColor)}
                        size={product.oldPrice && product.oldPrice > displayPrice ? 'sm' : 'default'}
                        className={
                          'bg-gradient-primary hover:opacity-90 text-white' +
                          (product.oldPrice && product.oldPrice > displayPrice ? ' px-2 py-1 text-xs rounded' : '')
                        }
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 {store?.storeTitle || 'Store'}. All rights reserved.</p>
          <p className="text-sm text-gray-400 mt-2">
            Powered by Sellava
          </p>
        </div>
      </footer>
    </div>
  );
} 