# Environment Setup Guide

## Quick Fix for Stripe Error

The error you're seeing is because the `STRIPE_SECRET_KEY` environment variable is not set. Here's how to fix it:

### 1. Create Environment File

Create a file named `.env.local` in your project root (same level as `package.json`):

```bash
# Windows PowerShell
New-Item -Path ".env.local" -ItemType File

# Or manually create the file in your editor
```

### 2. Add Your Stripe Keys

Add the following to your `.env.local` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_actual_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_stripe_publishable_key_here
```

### 3. Get Your Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copy your **Secret key** (starts with `sk_test_` for test mode)
3. Copy your **Publishable key** (starts with `pk_test_` for test mode)

### 4. Restart Your Development Server

```bash
npm run dev
```

## Additional Environment Variables

If you're using other services, you might also need:

```env
# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Firebase (if using Firebase)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
```

## Important Notes

- The `.env.local` file is automatically ignored by Git (it's in `.gitignore`)
- Never commit your actual API keys to version control
- Use test keys for development, production keys for production
- Restart your development server after adding environment variables 