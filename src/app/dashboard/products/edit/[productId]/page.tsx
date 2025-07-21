'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Store, Upload, X, Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getProduct, updateProduct, uploadImage } from '@/lib/firebase-services';
import { toast } from 'sonner';
import type { Product } from '@/types';

// --- الترجمة ---
const translations = {
  en: {
    editProduct: "Edit Product",
    update: "Update Product",
    updating: "Updating product...",
    notFound: "Product not found",
    backToDashboard: "Back to Dashboard",
    editInfo: "Edit product information",
    basicInfo: "Basic Information",
    enterName: "Enter product name",
    priceExample: "e.g. 100.00",
    category: "Category (optional)",
    categoryExample: "e.g. Electronics, Clothing, Accessories",
    tags: "Tags (optional)",
    tagsExample: "e.g. New, Featured, Sale",
    inStock: "In Stock",
    sizes: "Sizes (optional)",
    selectSize: "Select size",
    addManual: "Add manually",
    pickFromList: "Pick from list",
    sizeExample: "e.g. S or 40 or Large",
    specialPrice: "Special price (optional)",
    add: "Add",
    colors: "Colors (optional)",
    selectColor: "Select color",
    colorExample: "e.g. Red or Blue",
    currentImages: "Current Images",
    addNewImages: "Add New Images",
    upTo5: "You can upload up to 5 images (PNG, JPG, JPEG) - optional",
    optional: "Optional",
    remove: "Remove",
    requiredFields: "Please fill all required fields",
    validPrice: "Please enter a valid price",
    max5Images: "You can upload up to 5 images only",
    updateSuccess: "Product updated successfully",
    updateError: "Error updating product",
    cloudinaryError: "Error updating product. Please check your Cloudinary setup.",
    loadingProduct: "Loading product...",
    aiAvailable: "AI Available",
    stock: "In Stock",
    choose: "Choose",
    current: "Current",
    addNew: "Add New",
    example: "Example",
    placeholder: "Placeholder",
    productName: "Product Name",
    productPrice: "Product Price",
    oldPrice: "Old Price (optional)",
    productDescription: "Product Description",
    productImages: "Product Images",
    uploadImages: "Upload Images",
    generateDescription: "Generate Description",
    generateName: "Generate",
    cancel: "Cancel",
    save: "Save",
    loading: "Loading...",
  },
};

const defaultLang = 'en';

type LangKey = keyof typeof translations;

export default function EditProductPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const productId = params?.productId as string;
  const [lang, setLang] = useState<LangKey>(defaultLang);
  useEffect(() => {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'en';
  }, []);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    tags: '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [inStock, setInStock] = useState(true);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [oldPrice, setOldPrice] = useState(product?.oldPrice ? product.oldPrice.toString() : '');
  const [error, setError] = useState('');
  const [sizes, setSizes] = useState<{ value: string; price?: string }[]>(product?.sizes || []);
  const [colors, setColors] = useState<{ value: string; price?: string }[]>(product?.colors || []);
  const [sizeInput, setSizeInput] = useState('');
  const [colorInput, setColorInput] = useState('');
  const [sizePriceInput, setSizePriceInput] = useState('');
  const [colorPriceInput, setColorPriceInput] = useState('');
  const [showManualSize, setShowManualSize] = useState(false);
  const [showManualColor, setShowManualColor] = useState(false);

  const defaultSizes = ['S', 'M', 'L', 'XL', 'XXL', '3XL'];
  const defaultColors = [
    'Red', 'Blue', 'Black', 'Green', 'Yellow', 'White', 'Gray', 'Pink', 'Purple',
    'Orange', 'Brown', 'Cyan', 'Gold', 'Silver', 'Navy', 'Teal', 'Maroon', 'Olive',
    'Lime', 'Aqua', 'Fuchsia'
  ];

  useEffect(() => {
    if (productId && user) {
      loadProduct();
    }
  }, [productId, user]);

  const loadProduct = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // معالجة خاصة للمستخدم في وضع الاختبار
      if (user.email === 'test@example.com') {
        const savedProducts = localStorage.getItem('test_user_products');
        const existingProducts = savedProducts ? JSON.parse(savedProducts) : [];
        const foundProduct = existingProducts.find((p: Product) => p.id === productId);
        
        if (foundProduct) {
          setProduct(foundProduct);
          setFormData({
            name: foundProduct.name,
            description: foundProduct.description,
            price: foundProduct.price.toString(),
            category: foundProduct.category || '',
            tags: foundProduct.tags || '',
          });
          setInStock(foundProduct.inStock);
          setExistingImages(foundProduct.images || []);
          setOldPrice(foundProduct.oldPrice ? foundProduct.oldPrice.toString() : '');
          setSizes(foundProduct.sizes || []);
          setColors(foundProduct.colors || []);
        } else {
          toast.error('المنتج غير موجود');
          router.push('/dashboard');
        }
        setLoading(false);
        return;
      }
      
      // للمستخدمين العاديين، احمل من Firebase
      const productData = await getProduct(user.uid, productId);
      if (productData) {
        setProduct(productData);
        setFormData({
          name: productData.name,
          description: productData.description,
          price: productData.price.toString(),
          category: productData.category || '',
          tags: productData.tags || '',
        });
        setInStock(productData.inStock);
        setExistingImages(productData.images || []);
        setOldPrice(productData.oldPrice ? productData.oldPrice.toString() : '');
        setSizes(productData.sizes || []);
        setColors(productData.colors || []);
      } else {
        toast.error('المنتج غير موجود');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('حدث خطأ في تحميل المنتج');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
    );
    
    if (validFiles.length + images.length > 5) {
      toast.error('يمكن رفع 5 صور كحد أقصى');
      return;
    }
    
    setImages(prev => [...prev, ...validFiles]);
    
    // إنشاء روابط مؤقتة للعرض
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrls(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const generateName = async () => {
    if (!user || (user.planType !== 'free' && user.email !== 'test@example.com')) {
      toast.error('هذه الميزة متاحة فقط للمشتركين في الخطة المدفوعة');
      return;
    }
    
    try {
      // محاكاة توليد اسم باستخدام AI
      const generatedName = `منتج جديد ${Date.now()}`;
      setFormData(prev => ({ ...prev, name: generatedName }));
      toast.success('تم توليد اسم المنتج بنجاح');
    } catch (error) {
      console.error('Error generating name:', error);
      toast.error('حدث خطأ في توليد اسم المنتج');
    }
  };

  const generateDescription = async () => {
    if (!user || (user.planType !== 'free' && user.email !== 'test@example.com')) {
      toast.error('هذه الميزة متاحة فقط للمشتركين في الخطة المدفوعة');
      return;
    }
    
    try {
      // محاكاة توليد وصف باستخدام AI
      const generatedDescription = `وصف تفصيلي للمنتج ${formData.name} مع مميزاته وفوائده`;
      setFormData(prev => ({ ...prev, description: generatedDescription }));
      toast.success('تم توليد وصف المنتج بنجاح');
    } catch (error) {
      console.error('Error generating description:', error);
      toast.error('حدث خطأ في توليد وصف المنتج');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!user || !product) return;
    if (!formData.name.trim() || !formData.description.trim() || !formData.price.trim()) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      toast.error('يرجى إدخال سعر صحيح');
      return;
    }
    let productData: any = {
      name: formData.name,
      description: formData.description,
      price: price,
      images: [...existingImages],
      inStock,
    };
    const parsedOldPrice = oldPrice ? parseFloat(oldPrice) : undefined;
    if (parsedOldPrice && parsedOldPrice > price) {
      productData.oldPrice = parsedOldPrice;
    }
    if (formData.category) productData.category = formData.category;
    if (formData.tags) productData.tags = formData.tags;
    if (sizes.length > 0) productData.sizes = sizes;
    if (colors.length > 0) productData.colors = colors;
    // تنظيف الحقول الفارغة يدويًا
    for (const key in productData) {
      if (
        productData[key] === undefined ||
        productData[key] === null ||
        (typeof productData[key] === 'string' && productData[key].trim() === '')
      ) {
        delete productData[key];
    }
    }
    try {
      setLoading(true);
      setUploadingImages(true);
      
      let uploadedImageUrls: string[] = [];
      
      // معالجة خاصة للمستخدم في وضع الاختبار
      if (user.email === 'test@example.com') {
        if (images.length > 0) {
          uploadedImageUrls = images.map((_, index) => 
            `https://via.placeholder.com/400x400/007bff/ffffff?text=صورة+جديدة+${index + 1}`
          );
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        // تحديث المنتج في localStorage للمستخدم التجريبي
        const updatedProduct = {
          ...product,
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          oldPrice: oldPrice ? parseFloat(oldPrice) : undefined,
          images: [...existingImages, ...uploadedImageUrls],
          category: formData.category || undefined,
          tags: formData.tags || undefined,
          inStock,
          updatedAt: new Date(),
        };
        
        try {
          const savedProducts = localStorage.getItem('test_user_products');
          const existingProducts = savedProducts ? JSON.parse(savedProducts) : [];
          const updatedProducts = existingProducts.map((p: Product) => 
            p.id === productId ? updatedProduct : p
          );
          localStorage.setItem('test_user_products', JSON.stringify(updatedProducts));
          
          toast.success(`تم تحديث المنتج "${formData.name}" بنجاح (وضع الاختبار)`);
          
          // إيقاف اللودنغ فوراً
          setLoading(false);
          setUploadingImages(false);
          
          // تأخير قصير قبل التوجيه
          setTimeout(() => {
            router.push('/dashboard');
          }, 1000);
          return;
        } catch (error) {
          console.error('Error updating test product:', error);
          toast.error('حدث خطأ في تحديث المنتج');
          setLoading(false);
          setUploadingImages(false);
          return;
        }
      }

      // للمستخدمين العاديين فقط، ارفع الصور الجديدة إلى Cloudinary إذا كانت هناك صور
      if (user.email !== 'test@example.com') {
        try {
          if (images.length > 0) {
            // ارفع كل صورة إلى Cloudinary عبر API
            uploadedImageUrls = await Promise.all(
              images.map(async (file) => {
                const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onload = () => resolve(reader.result as string);
                  reader.onerror = reject;
                  reader.readAsDataURL(file);
                });
                const base64 = await toBase64(file);
                const res = await fetch('/api/upload', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ image: base64 }),
                });
                if (!res.ok) throw new Error('فشل رفع الصورة');
                const data = await res.json();
                return data.imageUrl;
              })
            );
          }
          // دمج الصور القديمة والجديدة
          let allImages = [...existingImages, ...uploadedImageUrls];
          productData.images = allImages;
          await updateProduct(user.uid, productId, productData);
          toast.success('تم تحديث المنتج بنجاح');
          router.push('/dashboard');
        } catch (error) {
          console.error('Error updating product for regular user:', error);
          toast.error('حدث خطأ في تحديث المنتج. تأكد من إعداد Cloudinary بشكل صحيح.');
          setLoading(false);
          setUploadingImages(false);
        }
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('حدث خطأ في تحديث المنتج');
    } finally {
      setLoading(false);
      setUploadingImages(false);
    }
  };

  const addSize = () => {
    if (!sizeInput.trim()) return;
    setSizes(prev => [...prev, { value: sizeInput.trim(), price: sizePriceInput || undefined }]);
    setSizeInput('');
    setSizePriceInput('');
  };

  const removeSize = (idx: number) => setSizes(prev => prev.filter((_, i) => i !== idx));

  const addColor = () => {
    if (!colorInput.trim()) return;
    setColors(prev => [...prev, { value: colorInput.trim(), price: colorPriceInput || undefined }]);
    setColorInput('');
    setColorPriceInput('');
  };

  const removeColor = (idx: number) => setColors(prev => prev.filter((_, i) => i !== idx));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل المنتج...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">المنتج غير موجود</p>
          <Link href="/dashboard">
            <Button>العودة للوحة التحكم</Button>
          </Link>
        </div>
      </div>
    );
  }

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
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-primary text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                <Store className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mr-6">{translations[lang]?.editProduct}</h1>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" className="text-white border-white/30 hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {translations[lang]?.backToDashboard}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {translations[lang]?.editProduct}
              {(user?.planType !== 'free' || user?.email === 'test@example.com') && (
                <Badge variant="secondary" className="ml-2">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI متاح
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {translations[lang]?.editInfo}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{translations[lang]?.basicInfo}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{translations[lang]?.productName}</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder={translations[lang]?.enterName}
                        required
                      />
                      {(user?.planType !== 'free' || user?.email === 'test@example.com') && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={generateName}
                          className="whitespace-nowrap"
                        >
                          <Sparkles className="h-4 w-4 mr-1" />
                          {translations[lang]?.generateName}
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">{translations[lang]?.productPrice}</Label>
                    <div className="mb-4 flex gap-4 items-end">
                      <div className="flex-1">
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.price}
                          onChange={(e) => handleInputChange('price', e.target.value)}
                          placeholder={translations[lang]?.priceExample}
                          required
                        />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="oldPrice" className="block mb-1 font-medium">{translations[lang]?.oldPrice}</Label>
                        <Input
                          id="oldPrice"
                          type="number"
                          value={oldPrice}
                          onChange={(e) => setOldPrice(e.target.value)}
                          className="input"
                          min={0}
                          step="0.01"
                          placeholder={translations[lang]?.priceExample}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">{translations[lang]?.category}</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      placeholder={translations[lang]?.categoryExample}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tags">{translations[lang]?.tags}</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => handleInputChange('tags', e.target.value)}
                      placeholder={translations[lang]?.tagsExample}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">{translations[lang]?.productDescription}</Label>
                  <div className="space-y-2">
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder={translations[lang]?.placeholder}
                      rows={4}
                      required
                    />
                    {(user?.planType !== 'free' || user?.email === 'test@example.com') && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={generateDescription}
                      >
                        <Sparkles className="h-4 w-4 mr-1" />
                        {translations[lang]?.generateDescription}
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="inStock"
                    checked={inStock}
                    onCheckedChange={setInStock}
                  />
                  <Label htmlFor="inStock">{translations[lang]?.inStock}</Label>
                </div>
              </div>

              {/* Sizes */}
              <div className="space-y-2">
                <Label>{translations[lang]?.sizes}</Label>
                <div className="flex gap-2 mb-2 items-center">
                  {!showManualSize ? (
                    <>
                      <select
                        value={sizeInput}
                        onChange={e => setSizeInput(e.target.value)}
                        className="border rounded px-2 py-1"
                      >
                        <option value="">{translations[lang]?.selectSize}</option>
                        {defaultSizes.map((sz) => (
                          <option key={sz} value={sz}>{sz}</option>
                        ))}
                      </select>
                      <Button type="button" variant="outline" size="sm" onClick={() => setShowManualSize(true)}>
                        {translations[lang]?.addManual}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Input value={sizeInput} onChange={e => setSizeInput(e.target.value)} placeholder={translations[lang]?.sizeExample} />
                      <Button type="button" variant="outline" size="sm" onClick={() => setShowManualSize(false)}>
                        {translations[lang]?.pickFromList}
                      </Button>
                    </>
                  )}
                  <Input value={sizePriceInput} onChange={e => setSizePriceInput(e.target.value)} placeholder={translations[lang]?.specialPrice} type="number" min="0" className="w-32" />
                  <Button type="button" onClick={addSize}>{translations[lang]?.add}</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s, idx) => (
                    <span key={idx} className="bg-gray-200 rounded px-2 py-1 flex items-center">
                      {s.value}{s.price ? ` (${s.price} USD)` : ''}
                      <button type="button" onClick={() => removeSize(idx)} className="ml-1 text-red-500">{translations[lang]?.remove}</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="space-y-2">
                <Label>{translations[lang]?.colors}</Label>
                <div className="flex gap-2 mb-2 items-center">
                  {!showManualColor ? (
                    <>
                      <select
                        value={colorInput}
                        onChange={e => setColorInput(e.target.value)}
                        className="border rounded px-2 py-1"
                      >
                        <option value="">{translations[lang]?.selectColor}</option>
                        {defaultColors.map((cl) => (
                          <option key={cl} value={cl}>{cl}</option>
                        ))}
                      </select>
                      <Button type="button" variant="outline" size="sm" onClick={() => setShowManualColor(true)}>
                        {translations[lang]?.addManual}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Input value={colorInput} onChange={e => setColorInput(e.target.value)} placeholder={translations[lang]?.colorExample} />
                      <Button type="button" variant="outline" size="sm" onClick={() => setShowManualColor(false)}>
                        {translations[lang]?.pickFromList}
                      </Button>
                    </>
                  )}
                  <Input value={colorPriceInput} onChange={e => setColorPriceInput(e.target.value)} placeholder={translations[lang]?.specialPrice} type="number" min="0" className="w-32" />
                  <Button type="button" onClick={addColor}>{translations[lang]?.add}</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c, idx) => (
                    <span key={idx} className="bg-gray-200 rounded px-2 py-1 flex items-center">
                      {c.value}{c.price ? ` (${c.price} USD)` : ''}
                      <button type="button" onClick={() => removeColor(idx)} className="ml-1 text-red-500">{translations[lang]?.remove}</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{translations[lang]?.productImages}</h3>
                  <Badge variant="secondary" className="text-xs">{translations[lang]?.optional}</Badge>
                </div>
                
                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-700">{translations[lang]?.currentImages}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {existingImages.map((url, index) => (
                        <div key={`existing-${index}`} className="relative">
                          <img
                            src={url}
                            alt={`Existing ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Upload New Images */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-700">{translations[lang]?.addNewImages}</h4>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <Label htmlFor="images" className="cursor-pointer">
                          <Button variant="outline" asChild>
                            <span>{translations[lang]?.uploadImages}</span>
                          </Button>
                        </Label>
                        <input
                          id="images"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        {translations[lang]?.upTo5}
                      </p>
                    </div>
                  </div>
                  
                  {/* New Images Preview */}
                  {imageUrls.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {imageUrls.map((url, index) => (
                        <div key={`new-${index}`} className="relative">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end space-x-4">
                <Link href="/dashboard">
                  <Button type="button" variant="outline">
                    {translations[lang]?.cancel}
                  </Button>
                </Link>
                <Button type="submit" disabled={loading || uploadingImages}>
                  {loading ? translations[lang]?.loading : translations[lang]?.update}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 