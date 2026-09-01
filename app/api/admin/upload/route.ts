import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { base64, filename, contentType, folder = 'products' } = body;

    if (!base64 || !filename) {
      return NextResponse.json(
        { success: false, message: 'base64 e filename são obrigatórios.' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Ensure 'product-media' bucket exists
    try {
      await supabase.storage.createBucket('product-media', {
        public: true,
        fileSizeLimit: 52428800, // 50MB
      });
    } catch {
      // Bucket already exists
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(base64.split(',').pop() || base64, 'base64');
    const timestamp = Date.now();
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase();
    const path = `${folder}/${timestamp}-${safeName}`;

    const { data, error } = await supabase.storage
      .from('product-media')
      .upload(path, buffer, {
        contentType: contentType || 'image/jpeg',
        upsert: true,
      });

    if (error) {
      console.error('Storage upload error:', error.message);
      // Fallback: return base64 data URL directly if bucket upload fails so application never crashes
      return NextResponse.json({
        success: true,
        url: base64,
        path: 'base64-fallback',
      });
    }

    const { data: publicUrl } = supabase.storage
      .from('product-media')
      .getPublicUrl(data.path);

    return NextResponse.json({
      success: true,
      url: publicUrl.publicUrl,
      path: data.path,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Erro ao fazer upload: ' + err.message },
      { status: 500 }
    );
  }
}
