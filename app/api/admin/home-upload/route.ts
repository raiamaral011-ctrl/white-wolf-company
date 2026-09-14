import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const existingUrl = formData.get('url') as string | null;

    if (existingUrl && existingUrl.trim()) {
      return NextResponse.json({
        success: true,
        url: existingUrl.trim(),
      });
    }

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'Nenhum arquivo enviado.' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Ensure bucket 'home-banners' exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const hasBucket = buckets?.some((b) => b.name === 'home-banners');
    if (!hasBucket) {
      await supabase.storage.createBucket('home-banners', { public: true });
    }

    // Prepare filename
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `home-banner-${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('home-banners')
      .upload(fileName, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert: true,
      });

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError);
      // Fallback: convert file to Data URL
      const base64 = buffer.toString('base64');
      const dataUrl = `data:${file.type || 'image/jpeg'};base64,${base64}`;
      return NextResponse.json({
        success: true,
        url: dataUrl,
        warning: 'Fallback data URL used',
      });
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('home-banners')
      .getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
    });
  } catch (err: any) {
    console.error('Error in /api/admin/home-upload:', err);
    return NextResponse.json(
      { success: false, message: 'Erro ao fazer upload da imagem: ' + err.message },
      { status: 500 }
    );
  }
}
