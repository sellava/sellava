export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { image } = body;

    if (!image) {
      return new Response(JSON.stringify({ error: 'لم يتم إرسال صورة' }), { status: 400 });
    }

    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', 'unsigned_preset1'); // اسم preset الذي أنشأته في Cloudinary
    formData.append('cloud_name', 'drbgubohu'); // اسم حساب Cloudinary

    const response = await fetch('https://api.cloudinary.com/v1_1/drbgubohu/image/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!data.secure_url) {
      return new Response(JSON.stringify({ error: 'فشل رفع الصورة' }), { status: 500 });
    }

    return new Response(JSON.stringify({ imageUrl: data.secure_url }), { status: 200 });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return new Response(JSON.stringify({ error: 'حدث خطأ في الخادم' }), { status: 500 });
  }
} 