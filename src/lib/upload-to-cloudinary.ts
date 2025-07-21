// Make sure to install cloudinary: npm install cloudinary
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function uploadImageToCloudinary(base64Image: string) {
  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: 'uploads', // Folder name inside Cloudinary
    });
    return result.secure_url;
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
} 