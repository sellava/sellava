'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Store, Upload, X, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { createProduct, uploadImage } from '@/lib/firebase-services';
import { toast } from 'sonner';

// ترجمة النصوص بجميع اللغات
const translations = {
  en: {
    addProduct: "Add New Product",
    productName: "Product Name",
    productPrice: "Product Price",
    productDescription: "Product Description",
    productImages: "Product Images",
    uploadImages: "Upload Images",
    generateDescription: "Generate Description",
    cancel: "Cancel",
    save: "Save",
    loading: "Loading...",
  },
  ar: {
    addProduct: "إضافة منتج جديد",
    productName: "اسم المنتج",
    productPrice: "سعر المنتج",
    productDescription: "وصف المنتج",
    productImages: "صور المنتج",
    uploadImages: "رفع الصور",
    generateDescription: "إنشاء وصف",
    cancel: "إلغاء",
    save: "حفظ",
    loading: "جاري التحميل...",
  },
  es: {
    addProduct: "Agregar Nuevo Producto",
    productName: "Nombre del Producto",
    productPrice: "Precio del Producto",
    productDescription: "Descripción del Producto",
    productImages: "Imágenes del Producto",
    uploadImages: "Subir Imágenes",
    generateDescription: "Generar Descripción",
    cancel: "Cancelar",
    save: "Guardar",
    loading: "Cargando...",
  },
  de: {
    addProduct: "Neues Produkt hinzufügen",
    productName: "Produktname",
    productPrice: "Produktpreis",
    productDescription: "Produktbeschreibung",
    productImages: "Produktbilder",
    uploadImages: "Bilder hochladen",
    generateDescription: "Beschreibung generieren",
    cancel: "Abbrechen",
    save: "Speichern",
    loading: "Laden...",
  },
  fr: {
    addProduct: "Ajouter un nouveau produit",
    productName: "Nom du produit",
    productPrice: "Prix du produit",
    productDescription: "Description du produit",
    productImages: "Images du produit",
    uploadImages: "Télécharger des images",
    generateDescription: "Générer la description",
    cancel: "Annuler",
    save: "Enregistrer",
    loading: "Chargement...",
  },
  it: {
    addProduct: "Aggiungi Nuovo Prodotto",
    productName: "Nome Prodotto",
    productPrice: "Prezzo Prodotto",
    productDescription: "Descrizione Prodotto",
    productImages: "Immagini Prodotto",
    uploadImages: "Carica Immagini",
    generateDescription: "Genera Descrizione",
    cancel: "Annulla",
    save: "Salva",
    loading: "Caricamento...",
  },
  pt: {
    addProduct: "Adicionar Novo Produto",
    productName: "Nome do Produto",
    productPrice: "Preço do Produto",
    productDescription: "Descrição do Produto",
    productImages: "Imagens do Produto",
    uploadImages: "Enviar Imagens",
    generateDescription: "Gerar Descrição",
    cancel: "Cancelar",
    save: "Salvar",
    loading: "Carregando...",
  },
  ru: {
    addProduct: "Добавить новый продукт",
    productName: "Название продукта",
    productPrice: "Цена продукта",
    productDescription: "Описание продукта",
    productImages: "Изображения продукта",
    uploadImages: "Загрузить изображения",
    generateDescription: "Создать описание",
    cancel: "Отмена",
    save: "Сохранить",
    loading: "Загрузка...",
  },
  zh: {
    addProduct: "添加新产品",
    productName: "产品名称",
    productPrice: "产品价格",
    productDescription: "产品描述",
    productImages: "产品图片",
    uploadImages: "上传图片",
    generateDescription: "生成描述",
    cancel: "取消",
    save: "保存",
    loading: "加载中...",
  },
  ja: {
    addProduct: "新しい商品を追加",
    productName: "商品名",
    productPrice: "商品価格",
    productDescription: "商品説明",
    productImages: "商品画像",
    uploadImages: "画像をアップロード",
    generateDescription: "説明を生成",
    cancel: "キャンセル",
    save: "保存",
    loading: "読み込み中...",
  },
  tr: {
    addProduct: "Yeni Ürün Ekle",
    productName: "Ürün Adı",
    productPrice: "Ürün Fiyatı",
    productDescription: "Ürün Açıklaması",
    productImages: "Ürün Görselleri",
    uploadImages: "Görsel Yükle",
    generateDescription: "Açıklama Oluştur",
    cancel: "İptal",
    save: "Kaydet",
    loading: "Yükleniyor...",
  },
  hi: {
    addProduct: "नया उत्पाद जोड़ें",
    productName: "उत्पाद का नाम",
    productPrice: "उत्पाद की कीमत",
    productDescription: "उत्पाद का विवरण",
    productImages: "उत्पाद की छवियां",
    uploadImages: "छवियां अपलोड करें",
    generateDescription: "विवरण उत्पन्न करें",
    cancel: "रद्द करें",
    save: "सहेजें",
    loading: "लोड हो रहा है...",
  },
  id: {
    addProduct: "Tambah Produk Baru",
    productName: "Nama Produk",
    productPrice: "Harga Produk",
    productDescription: "Deskripsi Produk",
    productImages: "Gambar Produk",
    uploadImages: "Unggah Gambar",
    generateDescription: "Buat Deskripsi",
    cancel: "Batal",
    save: "Simpan",
    loading: "Memuat...",
  },
  ko: {
    addProduct: "새 제품 추가",
    productName: "제품명",
    productPrice: "제품 가격",
    productDescription: "제품 설명",
    productImages: "제품 이미지",
    uploadImages: "이미지 업로드",
    generateDescription: "설명 생성",
    cancel: "취소",
    save: "저장",
    loading: "로드 중...",
  },
  nl: {
    addProduct: "Nieuw Product Toevoegen",
    productName: "Productnaam",
    productPrice: "Productprijs",
    productDescription: "Productbeschrijving",
    productImages: "Productafbeeldingen",
    uploadImages: "Afbeeldingen Uploaden",
    generateDescription: "Beschrijving Genereren",
    cancel: "Annuleren",
    save: "Opslaan",
    loading: "Laden...",
  },
  pl: {
    addProduct: "Dodaj Nowy Produkt",
    productName: "Nazwa Produktu",
    productPrice: "Cena Produktu",
    productDescription: "Opis Produktu",
    productImages: "Zdjęcia Produktu",
    uploadImages: "Prześlij Zdjęcia",
    generateDescription: "Wygeneruj Opis",
    cancel: "Anuluj",
    save: "Zapisz",
    loading: "Ładowanie...",
  },
};

export default function AddProductPage() {
  const { user } = useAuth();
  const [lang, setLang] = useState<keyof typeof translations>('en');
  const router = useRouter();
  
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: string) => translations[lang]?.[key as keyof typeof translations[typeof lang]] || translations.en[key as keyof typeof translations.en] || key;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    tags: '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [inStock, setInStock] = useState(true);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [oldPrice, setOldPrice] = useState('');
  const [sizes, setSizes] = useState<{ value: string; price?: string }[]>([]);
  const [colors, setColors] = useState<{ value: string; price?: string }[]>([]);
  const [sizeInput, setSizeInput] = useState('');
  const [colorInput, setColorInput] = useState('');
  const [sizePriceInput, setSizePriceInput] = useState('');
  const [colorPriceInput, setColorPriceInput] = useState('');
  const [showManualSize, setShowManualSize] = useState(false);
  const [showManualColor, setShowManualColor] = useState(false);
  // Default values for sizes and colors
  const defaultSizes = ['S', 'M', 'L', 'XL', 'XXL', '3XL'];
  const defaultColors = [
    'Red', 'Blue', 'Black', 'Green', 'Yellow', 'White', 'Gray', 'Pink', 'Purple',
    'Orange', 'Brown', 'Cyan', 'Gold', 'Silver', 'Navy', 'Teal', 'Maroon', 'Olive',
    'Lime', 'Aqua', 'Fuchsia'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length + images.length > 5) {
      toast.error('You can upload up to 5 images only');
      return;
    }

    setImages(prev => [...prev, ...files]);
    
    // Create preview URLs
    files.forEach(file => {
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

  const generateDescription = async () => {
    if (!user || (user.planType !== 'free' && user.email !== 'test@example.com')) {
      toast.error('This feature is available for paid plan users only');
      return;
    }

    if (!formData.name) {
      toast.error('Please enter the product name first');
      return;
    }

    try {
      setLoading(true);
      
      // Load AI settings
      const aiSettings = localStorage.getItem('ai_settings');
      const settings = aiSettings ? JSON.parse(aiSettings) : {
        enableAI: true,
        aiModel: 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 500,
        customPrompt: ''
      };

      if (!settings.enableAI) {
        toast.error('Please enable AI from settings first');
        return;
      }

      console.log('Generating description with AI settings:', settings);

      // Simulate AI description generation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate smart description based on product name
      const descriptions = {
        'Phone': 'A modern smartphone with a high-resolution display and professional camera. Perfect for photography and daily use with long battery life and fast performance.',
        'Laptop': 'A powerful and advanced laptop, ideal for work and study. Features a high-quality screen, fast processor, and elegant design.',
        'Headphones': 'High-quality headphones with clear and pure sound. Comfortable for long use and compatible with all devices.',
        'Watch': 'A stylish smart watch with advanced features. Tracks physical activity and provides smart notifications with a modern design.',
        'Bag': 'A stylish and practical bag made from high-quality materials. Suitable for daily use with large storage space.',
      };

      // Search for a keyword in the product name
      let generatedDescription = '';
      for (const [keyword, description] of Object.entries(descriptions)) {
        if (formData.name.toLowerCase().includes(keyword)) {
          generatedDescription = description;
          break;
        }
      }

      // If no keyword was found, use a generic description
      if (!generatedDescription) {
        generatedDescription = `High-quality product with elegant design and excellent performance. Perfect for daily use and provides a great user experience.`;
      }

      // Add additional details based on AI settings
      if (settings.customPrompt) {
        generatedDescription += ` ${settings.customPrompt}`;
      }

      setFormData(prev => ({
        ...prev,
        description: generatedDescription
      }));

      toast.success('Description generated successfully!');
      console.log('Description generated:', generatedDescription);
    } catch (error) {
      console.error('Error generating description:', error);
      toast.error('Error generating description');
    } finally {
      setLoading(false);
    }
  };

  const generateName = async () => {
    if (!user || (user.planType !== 'free' && user.email !== 'test@example.com')) {
      toast.error('This feature is available for paid plan users only');
      return;
    }

    try {
      setLoading(true);
      
      // Load AI settings
      const aiSettings = localStorage.getItem('ai_settings');
      const settings = aiSettings ? JSON.parse(aiSettings) : {
        enableAI: true,
        aiModel: 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 500,
        customPrompt: ''
      };

      if (!settings.enableAI) {
        toast.error('Please enable AI from settings first');
        return;
      }

      console.log('Generating name with AI settings:', settings);

      // Simulate AI name generation
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate smart names based on category
      const names = {
        'Electronics': ['Advanced Smart Device', 'Modern Tech Solution', 'Advanced Solution'],
        'Clothing': ['Stylish Piece', 'Modern Design', 'Modern Fashion'],
        'Furniture': ['Elegant Furniture', 'Modern Interior Design', 'High-quality Furniture'],
        'Sports': ['Professional Sports Equipment', 'Advanced Sports Tools', 'Fitness Equipment'],
        'Beauty': ['High-quality Beauty Product', 'Advanced Beauty Solution', 'Skin Care Product'],
      };

      // Generate random name from the list
      const categories = Object.keys(names);
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const categoryNames = names[randomCategory as keyof typeof names];
      const generatedName = categoryNames[Math.floor(Math.random() * categoryNames.length)];

      setFormData(prev => ({
        ...prev,
        name: generatedName,
        category: randomCategory
      }));

      toast.success('Name generated successfully!');
      console.log('Name generated:', generatedName);
    } catch (error) {
      console.error('Error generating name:', error);
      toast.error('Error generating name');
    } finally {
      setLoading(false);
    }
  };

  const suggestPrice = async () => {
    if (!user || (user.planType !== 'free' && user.email !== 'test@example.com')) {
      toast.error('This feature is available for paid plan users only');
      return;
    }

    try {
      setLoading(true);
      
      // Load AI settings
      const aiSettings = localStorage.getItem('ai_settings');
      const settings = aiSettings ? JSON.parse(aiSettings) : {
        enableAI: true,
        aiModel: 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 500,
        customPrompt: ''
      };

      if (!settings.enableAI) {
        toast.error('Please enable AI from settings first');
        return;
      }

      console.log('Suggesting price with AI settings:', settings);

      // Simulate AI price suggestion
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Suggest smart prices based on product type
      const priceRanges = {
        'Phone': { min: 200, max: 800 },
        'Laptop': { min: 500, max: 2000 },
        'Headphones': { min: 20, max: 150 },
        'Watch': { min: 30, max: 300 },
        'Bag': { min: 20, max: 100 },
        'Electronics': { min: 50, max: 500 },
        'Clothing': { min: 10, max: 80 },
        'Furniture': { min: 50, max: 400 },
        'Sports': { min: 15, max: 120 },
        'Beauty': { min: 10, max: 60 }
      };

      // Search for product category
      let suggestedPrice = 500; // Default price
      for (const [category, range] of Object.entries(priceRanges)) {
        if (formData.name.toLowerCase().includes(category) || 
            formData.category.toLowerCase().includes(category)) {
          suggestedPrice = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
          break;
        }
      }

      // If no category was found, use a reasonable random price
      if (suggestedPrice === 500) {
        suggestedPrice = Math.floor(Math.random() * 1000) + 100;
      }

      setFormData(prev => ({
        ...prev,
        price: suggestedPrice.toString()
      }));

      toast.success(`Suggested price: ${suggestedPrice} USD`);
      console.log('Price suggested:', suggestedPrice);
    } catch (error) {
      console.error('Error suggesting price:', error);
      toast.error('Error suggesting price');
    } finally {
      setLoading(false);
    }
  };

  const generateTags = async () => {
    if (!user || (user.planType !== 'free' && user.email !== 'test@example.com')) {
      toast.error('This feature is available for paid plan users only');
      return;
    }

    try {
      setLoading(true);
      
      // Load AI settings
      const aiSettings = localStorage.getItem('ai_settings');
      const settings = aiSettings ? JSON.parse(aiSettings) : {
        enableAI: true,
        aiModel: 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 500,
        customPrompt: ''
      };

      if (!settings.enableAI) {
        toast.error('Please enable AI from settings first');
        return;
      }

      console.log('Generating tags with AI settings:', settings);

      // Simulate AI tag generation
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Generate smart tags based on product type
      const tagSets = {
        'Phone': ['Phone', 'Smart', 'Camera', 'Battery', 'Technology', 'Connection'],
        'Laptop': ['Laptop', 'Mobile', 'Work', 'Study', 'Technology', 'Performance'],
        'Headphones': ['Headphones', 'Sound', 'Music', 'Quality', 'Comfort', 'Wireless'],
        'Watch': ['Watch', 'Smart', 'Sports', 'Tracking', 'Notifications', 'Design'],
        'Bag': ['Bag', 'Stylish', 'Practical', 'Storage', 'Design', 'Quality'],
        'Electronics': ['Technology', 'Modern', 'Quality', 'Performance', 'Development'],
        'Clothing': ['Fashion', 'Stylish', 'Modern', 'Comfort', 'Quality', 'Design'],
        'Furniture': ['Furniture', 'Home', 'Design', 'Comfort', 'Quality', 'Elegant'],
        'Sports': ['Sports', 'Fitness', 'Health', 'Performance', 'Comfort', 'Quality'],
        'Beauty': ['Beauty', 'Care', 'Skin', 'Beauty', 'Health', 'Care']
      };

      // Search for product category
      let generatedTags = '';
      for (const [category, tags] of Object.entries(tagSets)) {
        if (formData.name.toLowerCase().includes(category) || 
            formData.category.toLowerCase().includes(category)) {
          generatedTags = tags.join(', ');
          break;
        }
      }

      // If no category was found, use generic tags
      if (!generatedTags) {
        generatedTags = 'Quality, Stylish, Modern, Unique, High-quality';
      }

      setFormData(prev => ({
        ...prev,
        tags: generatedTags
      }));

      toast.success('Tags generated successfully!');
      console.log('Tags generated:', generatedTags);
    } catch (error) {
      console.error('Error generating tags:', error);
      toast.error('Error generating tags');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    if (!formData.name || !formData.description || !formData.price) {
      toast.error('Please fill all required fields');
      return;
    }

    // Images are optional - no error message if no images are uploaded

    setLoading(true);
    setUploadingImages(true);

    try {
      let uploadedImageUrls: string[] = [];

              // Special handling for test user
        if (user.email === 'test@example.com') {
          // For test user, use fake image URLs if there are images
          if (images.length > 0) {
            uploadedImageUrls = images.map((_, index) => 
              `https://via.placeholder.com/400x400/007bff/ffffff?text=Image+${index + 1}`
            );
            // Simulate image upload delay
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
          // Save product to localStorage for test user
          const newProduct = {
            id: `product_${Date.now()}`,
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            images: uploadedImageUrls,
            category: formData.category || undefined,
            tags: formData.tags || undefined,
            inStock,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          try {
            const savedProducts = localStorage.getItem('test_user_products');
            const existingProducts = savedProducts ? JSON.parse(savedProducts) : [];
            const updatedProducts = [...existingProducts, newProduct];
            localStorage.setItem('test_user_products', JSON.stringify(updatedProducts));
            toast.success(`Product "${formData.name}" added successfully (Test Mode)`);
            setLoading(false);
            setUploadingImages(false);
            setTimeout(() => {
              router.push('/dashboard');
            }, 1000);
            return;
          } catch (error) {
            console.error('Error saving test product:', error);
            toast.error('Error saving test product');
            setLoading(false);
            setUploadingImages(false);
            return;
          }
        }

      // For regular users only, upload images to Cloudinary if there are images
      if (user.email !== 'test@example.com') {
        try {
          if (images.length > 0) {
            // Upload each image to Cloudinary via API
            uploadedImageUrls = await Promise.all(
              images.map(async (file) => {
                // Convert image to base64
                const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onload = () => resolve(reader.result as string);
                  reader.onerror = reject;
                  reader.readAsDataURL(file);
                });
                const base64 = await toBase64(file);
                // Send it to API
                const res = await fetch('/api/upload', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ image: base64 }),
                });
                if (!res.ok) throw new Error('Image upload failed');
                const data = await res.json();
                return data.imageUrl;
              })
            );
          }

          // Create product
          let productData: any = {
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            images: uploadedImageUrls,
            inStock,
          };

          const parsedOldPrice = oldPrice ? parseFloat(oldPrice) : undefined;
          const parsedPrice = parseFloat(formData.price);

          if (parsedOldPrice && parsedOldPrice > parsedPrice) {
            productData.oldPrice = parsedOldPrice;
          }
          if (formData.category) productData.category = formData.category;
          if (formData.tags) productData.tags = formData.tags;
          if (sizes.length > 0) productData.sizes = sizes;
          if (colors.length > 0) productData.colors = colors;

          // Remove empty fields manually
          for (const key in productData) {
            if (
              productData[key] === undefined ||
              productData[key] === null ||
              (typeof productData[key] === 'string' && productData[key].trim() === '')
            ) {
              delete productData[key];
            }
          }

          await createProduct(user.uid, productData);

          toast.success('Product added successfully');
          router.push('/dashboard');
        } catch (error) {
          console.error('Error creating product for regular user:', error);
          toast.error('Error adding product. Please check your Cloudinary setup.');
          setLoading(false);
          setUploadingImages(false);
        }
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Error adding product');
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
              <h1 className="text-3xl font-bold text-white">{t('addProduct')}</h1>
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
            
            <Link href="/dashboard">
                <Button variant="outline" className="text-white border-white/30 hover:bg-white/10">{t('cancel')}</Button>
            </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {t('addProduct')}
              {(user?.planType !== 'free' || user?.email === 'test@example.com') && (
                <Badge variant="secondary" className="ml-2">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI Available
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {t('addProduct')}
            </CardDescription>
            
            {/* Message for test user */}
            {user?.email === 'test@example.com' && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Test Mode:</strong> Fake images will be used instead of uploading real images. 
                  Products will be saved locally in the browser and will appear in the test store.
                </p>
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-xs text-yellow-700">
                    <strong>Note:</strong> Each account has its own store. Products added here will appear only in your store.
                  </p>
                </div>
              </div>
            )}
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('productName')}</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter product name"
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
                          Generate
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">{t('productPrice')}</Label>
                    <div className="mb-4 flex gap-4 items-end">
                      <div className="flex-1">
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.price}
                          onChange={e => handleInputChange('price', e.target.value)}
                          placeholder="0.00"
                          required
                        />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="oldPrice" className="block mb-1 font-medium">Old Price (optional)</Label>
                        <Input
                          id="oldPrice"
                          type="number"
                          value={oldPrice}
                          onChange={e => setOldPrice(e.target.value)}
                          className="input"
                          min={0}
                          step="0.01"
                          placeholder="Example: 100.00"
                        />
                      </div>
                    </div>
                    {oldPrice && Number(oldPrice) <= Number(formData.price) && (
                      <p className="text-xs text-red-600 mt-1">Old price must be greater than price</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category (optional)</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    placeholder="Example: Electronics, Clothing, Furniture"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (optional)</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => handleInputChange('tags', e.target.value)}
                      placeholder="Example: Technology, Stylish, High-quality"
                    />
                    {(user?.planType !== 'free' || user?.email === 'test@example.com') && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={generateTags}
                        className="whitespace-nowrap"
                      >
                        <Sparkles className="h-4 w-4 mr-1" />
                        Generate
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">{t('productDescription')}</Label>
                  <div className="space-y-2">
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Product description..."
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
                        {t('generateDescription')}
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
                  <Label htmlFor="inStock">In Stock</Label>
                </div>
              </div>

              {/* Images */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{t('productImages')}</h3>
                  <Badge variant="secondary" className="text-xs">Optional</Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <Label htmlFor="images" className="cursor-pointer">
                          <Button variant="outline" asChild>
                            <span>{t('uploadImages')}</span>
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
                        You can upload up to 5 images (PNG, JPG, JPEG) - <strong>Optional</strong>
                      </p>
                    </div>
                  </div>
                  
                  {imageUrls.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {imageUrls.map((url, index) => (
                        <div key={index} className="relative">
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

              {/* Sizes */}
              <div className="space-y-2">
                <Label>Sizes (optional)</Label>
                <div className="flex gap-2 mb-2 items-center">
                  {!showManualSize ? (
                    <>
                      <select
                        value={sizeInput}
                        onChange={e => setSizeInput(e.target.value)}
                        className="border rounded px-2 py-1"
                      >
                        <option value="">Select size</option>
                        {defaultSizes.map((sz) => (
                          <option key={sz} value={sz}>{sz}</option>
                        ))}
                      </select>
                      <Button type="button" variant="outline" size="sm" onClick={() => setShowManualSize(true)}>
                        Add manually
                      </Button>
                    </>
                  ) : (
                    <>
                      <Input value={sizeInput} onChange={e => setSizeInput(e.target.value)} placeholder="Example: S or 40 or Large" />
                      <Button type="button" variant="outline" size="sm" onClick={() => setShowManualSize(false)}>
                        Select from list
                      </Button>
                    </>
                  )}
                  <Input value={sizePriceInput} onChange={e => setSizePriceInput(e.target.value)} placeholder="Special price (optional)" type="number" min="0" className="w-32" />
                  <Button type="button" onClick={addSize}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s, idx) => (
                    <span key={idx} className="bg-gray-200 rounded px-2 py-1 flex items-center">
                      {s.value}{s.price ? ` (${s.price} USD)` : ''}
                      <button type="button" onClick={() => removeSize(idx)} className="ml-1 text-red-500">×</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="space-y-2">
                <Label>Colors (optional)</Label>
                <div className="flex gap-2 mb-2 items-center">
                  {!showManualColor ? (
                    <>
                      <select
                        value={colorInput}
                        onChange={e => setColorInput(e.target.value)}
                        className="border rounded px-2 py-1"
                      >
                        <option value="">Select color</option>
                        {defaultColors.map((cl) => (
                          <option key={cl} value={cl}>{cl}</option>
                        ))}
                      </select>
                      <Button type="button" variant="outline" size="sm" onClick={() => setShowManualColor(true)}>
                        Add manually
                      </Button>
                    </>
                  ) : (
                    <>
                      <Input value={colorInput} onChange={e => setColorInput(e.target.value)} placeholder="Example: Red or Blue" />
                      <Button type="button" variant="outline" size="sm" onClick={() => setShowManualColor(false)}>
                        Select from list
                      </Button>
                    </>
                  )}
                  <Input value={colorPriceInput} onChange={e => setColorPriceInput(e.target.value)} placeholder="Special price (optional)" type="number" min="0" className="w-32" />
                  <Button type="button" onClick={addColor}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c, idx) => (
                    <span key={idx} className="bg-gray-200 rounded px-2 py-1 flex items-center">
                      {c.value}{c.price ? ` (${c.price} USD)` : ''}
                      <button type="button" onClick={() => removeColor(idx)} className="ml-1 text-red-500">×</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end space-x-4">
                <Link href="/dashboard">
                  <Button type="button" variant="outline">
                    {t('cancel')}
                  </Button>
                </Link>
                <Button type="submit" disabled={loading || uploadingImages}>
                  {loading ? t('loading') : t('save')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 