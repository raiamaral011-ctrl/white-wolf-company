import { put } from '@vercel/blob';

export async function uploadImageToBlob(file: File, pathFolder: 'products' | 'banners' | 'categories' = 'products') {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!token || token.includes('example')) {
    // Return placeholder simulation URL if Vercel Blob token is not configured
    const timestamp = Date.now();
    return {
      url: `https://placehold.co/800x800/0f172a/ffffff?text=${encodeURIComponent(file.name)}`,
      pathname: `${pathFolder}/${timestamp}-${file.name}`,
    };
  }

  try {
    const filename = `${pathFolder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
    const blob = await put(filename, file, {
      access: 'public',
      token,
    });

    return {
      url: blob.url,
      pathname: blob.pathname,
    };
  } catch (error) {
    console.error('Vercel Blob Upload Error:', error);
    throw new Error('Falha ao realizar upload da imagem no Vercel Blob.');
  }
}
