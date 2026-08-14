import { MetadataRoute } from 'next';
import { MOCK_PRODUCTS, BRANDS } from '@/lib/data/products';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://whitewolfco.com.br';

  const routes = [
    '',
    '/tenis',
    '/tenis/masculino',
    '/tenis/feminino',
    '/tenis/infantil',
    '/roupas',
    '/roupas/masculino',
    '/roupas/feminino',
    '/roupas/camisetas',
    '/roupas/shorts',
    '/roupas/calcas',
    '/roupas/jaquetas',
    '/acessorios',
    '/ofertas',
    '/marcas',
    '/carrinho',
    '/checkout',
    '/login',
    '/cadastro',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const brandRoutes = BRANDS.map((brand) => ({
    url: `${baseUrl}/marca/${brand.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const productRoutes = MOCK_PRODUCTS.map((product) => ({
    url: `${baseUrl}/produto/${product.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...routes, ...brandRoutes, ...productRoutes];
}
