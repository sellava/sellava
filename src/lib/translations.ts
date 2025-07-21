export type Language =
  | 'ar'
  | 'en'
  | 'es'
  | 'fr'
  | 'de'
  | 'it'
  | 'pt'
  | 'ru'
  | 'zh'
  | 'ja'
  | 'tr'
  | 'hi'
  | 'id'
  | 'ko'
  | 'nl'
  | 'pl';

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    products: 'Products',
    orders: 'Orders',
    customers: 'Customers',
    coupons: 'Coupons',
    settings: 'Settings',
    store: 'Store',
    cart: 'Cart',
    
    // Auth
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    email: 'Email',
    password: 'Password',
    name: 'Name',
    phone: 'Phone',
    country: 'Country',
    confirmPassword: 'Confirm Password',
    
    // Plans
    freePlan: 'Free Plan',
    paidPlan: 'Paid Plan',
    choosePlan: 'Choose Plan',
    
    // Products
    addProduct: 'Add Product',
    editProduct: 'Edit Product',
    deleteProduct: 'Delete Product',
    productName: 'Product Name',
    productDescription: 'Product Description',
    productPrice: 'Product Price',
    productImages: 'Product Images',
    uploadImages: 'Upload Images',
    generateDescription: 'Generate Description',
    generateName: 'Generate Name',
    suggestPrice: 'Suggest Price',
    
    // Cart
    yourCart: 'Your Cart',
    addToCart: 'Add to Cart',
    removeFromCart: 'Remove from Cart',
    total: 'Total',
    checkout: 'Checkout',
    emptyCart: 'Your cart is empty',
    
    // Store
    storeTitle: 'Store Title',
    storeBio: 'Store Bio',
    storeCountry: 'Store Country',
    publicStore: 'Public Store',
    viewStore: 'View Store',
    
    // Settings
    generalSettings: 'General Settings',
    deliverySettings: 'Delivery Settings',
    contactSettings: 'Contact Settings',
    aiSettings: 'AI Settings',
    whatsapp: 'WhatsApp',
    instagram: 'Instagram',
    enableAI: 'Enable AI',
    autoDescription: 'Auto Description',
    
    // Common
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    close: 'Close',
    yes: 'Yes',
    no: 'No',
    
    // Orders
    orderStatus: 'Order Status',
    pending: 'Pending',
    confirmed: 'Confirmed',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    
    // Coupons
    addCoupon: 'Add Coupon',
    couponCode: 'Coupon Code',
    discountPercentage: 'Discount Percentage',
    validUntil: 'Valid Until',
    
    // AI Features
    aiFeatures: 'AI Features',
    aiDescription: 'AI-powered product description generation',
    aiName: 'AI-powered product name suggestions',
    aiPricing: 'AI-powered pricing suggestions',
    premiumFeature: 'Premium Feature',
    
    // Messages
    welcomeMessage: 'Welcome to Sellava',
    createStoreMessage: 'Create your online store in minutes',
    noProductsMessage: 'No products available',
    noOrdersMessage: 'No orders yet',
    noCustomersMessage: 'No customers yet',
    noCouponsMessage: 'No coupons yet',
    
    // Home Page
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
    startShopping: 'Start Shopping',
    yourCartIsEmpty: 'Your shopping cart is empty',
  },
  ar: {
    // Navigation
    dashboard: 'Dashboard',
    products: 'Products',
    orders: 'Orders',
    customers: 'Customers',
    coupons: 'Coupons',
    settings: 'Settings',
    store: 'Store',
    cart: 'Cart',
    
    // Auth
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    email: 'Email',
    password: 'Password',
    name: 'Name',
    phone: 'Phone',
    country: 'Country',
    confirmPassword: 'Confirm Password',
    
    // Plans
    freePlan: 'Free Plan',
    paidPlan: 'Paid Plan',
    choosePlan: 'Choose Plan',
    
    // Products
    addProduct: 'Add Product',
    editProduct: 'Edit Product',
    deleteProduct: 'Delete Product',
    productName: 'Product Name',
    productDescription: 'Product Description',
    productPrice: 'Product Price',
    productImages: 'Product Images',
    uploadImages: 'Upload Images',
    generateDescription: 'Generate Description',
    generateName: 'Generate Name',
    suggestPrice: 'Suggest Price',
    
    // Cart
    yourCart: 'Your Cart',
    addToCart: 'Add to Cart',
    removeFromCart: 'Remove from Cart',
    total: 'Total',
    checkout: 'Checkout',
    emptyCart: 'Your cart is empty',
    
    // Store
    storeTitle: 'Store Title',
    storeBio: 'Store Bio',
    storeCountry: 'Store Country',
    publicStore: 'Public Store',
    viewStore: 'View Store',
    
    // Settings
    generalSettings: 'General Settings',
    deliverySettings: 'Delivery Settings',
    contactSettings: 'Contact Settings',
    aiSettings: 'AI Settings',
    whatsapp: 'WhatsApp',
    instagram: 'Instagram',
    enableAI: 'Enable AI',
    autoDescription: 'Auto Description',
    
    // Common
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    close: 'Close',
    yes: 'Yes',
    no: 'No',
    
    // Orders
    orderStatus: 'Order Status',
    pending: 'Pending',
    confirmed: 'Confirmed',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    
    // Coupons
    addCoupon: 'Add Coupon',
    couponCode: 'Coupon Code',
    discountPercentage: 'Discount Percentage',
    validUntil: 'Valid Until',
    
    // AI Features
    aiFeatures: 'AI Features',
    aiDescription: 'AI-powered product description generation',
    aiName: 'AI-powered product name suggestions',
    aiPricing: 'AI-powered pricing suggestions',
    premiumFeature: 'Premium Feature',
    
    // Messages
    welcomeMessage: 'Welcome to Sellava',
    createStoreMessage: 'Create your online store in minutes',
    noProductsMessage: 'No products available',
    noOrdersMessage: 'No orders yet',
    noCustomersMessage: 'No customers yet',
    noCouponsMessage: 'No coupons yet',
    
    // Home Page
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
  },
  es: {}, fr: {}, de: {}, it: {}, pt: {}, ru: {}, zh: {}, ja: {}, tr: {}, hi: {}, id: {}, ko: {}, nl: {}, pl: {}
};

// نسخ القيم الإنجليزية للغات الجديدة مؤقتًا
(['es','fr','de','it','pt','ru','zh','ja','tr','hi','id','ko','nl','pl'] as Language[]).forEach(lang => {
  translations[lang] = { ...translations.en };
});

export const getTranslation = (key: string, lang: Language): string => {
  return translations[lang][key as keyof typeof translations[typeof lang]] || key;
};

export const t = (key: string, lang: Language): string => {
  return getTranslation(key, lang);
}; 