import { Product, Brand, Category, FilterOptions } from '@/types';

export const BRANDS: Brand[] = [
  { id: 'b1000000-0000-0000-0000-000000000001', name: 'Adidas', slug: 'adidas', description: 'Tecnologia Boost e cultura street-performance.', product_count: 10, created_at: new Date().toISOString() },
  { id: 'b1000000-0000-0000-0000-000000000002', name: 'Nike', slug: 'nike', description: 'Inovação Air Max, Dri-FIT e alta performance.', product_count: 10, created_at: new Date().toISOString() },
  { id: 'b1000000-0000-0000-0000-000000000003', name: 'ASICS', slug: 'asics', description: 'Tecnologia em GEL para estabilidade e maratonas.', product_count: 10, created_at: new Date().toISOString() },
  { id: 'b1000000-0000-0000-0000-000000000004', name: 'Puma', slug: 'puma', description: 'Design arrojado, velocidade e cultura urbana.', product_count: 10, created_at: new Date().toISOString() },
  { id: 'b1000000-0000-0000-0000-000000000005', name: 'New Balance', slug: 'new-balance', description: 'Conforto supremo e estilo retrô-futurista.', product_count: 10, created_at: new Date().toISOString() },
];

export const CATEGORIES: Category[] = [
  { id: 'c1000000-0000-0000-0000-000000000001', name: 'Tênis', slug: 'tenis', description: 'Performance e lifestyle.', image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80', created_at: new Date().toISOString() },
  { id: 'c1000000-0000-0000-0000-000000000002', name: 'Camisetas', slug: 'camisetas', description: 'Tecnologia respirável antissuor.', image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80', created_at: new Date().toISOString() },
  { id: 'c1000000-0000-0000-0000-000000000003', name: 'Shorts', slug: 'shorts', description: 'Liberdade de movimento.', image_url: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&auto=format&fit=crop&q=80', created_at: new Date().toISOString() },
  { id: 'c1000000-0000-0000-0000-000000000004', name: 'Calças', slug: 'calcas', description: 'Joggers e agasalhos de treino.', image_url: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&auto=format&fit=crop&q=80', created_at: new Date().toISOString() },
  { id: 'c1000000-0000-0000-0000-000000000005', name: 'Jaquetas', slug: 'jaquetas', description: 'Corta-ventos e proteção térmica.', image_url: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80', created_at: new Date().toISOString() },
  { id: 'c1000000-0000-0000-0000-000000000006', name: 'Acessórios', slug: 'acessorios', description: 'Mochilas, bonés e meias técnicas.', image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', created_at: new Date().toISOString() },
];

export const MOCK_PRODUCTS: Product[] = [
  // ADIDAS
  {
    id: 'p1000000-0000-0000-0000-000000000001',
    brand_id: BRANDS[0].id,
    category_id: CATEGORIES[0].id,
    brand: BRANDS[0],
    category: CATEGORIES[0],
    name: 'Tênis Ultraboost Light Tech',
    slug: 'tenis-ultraboost-light-tech',
    description: 'O Ultraboost Light é nosso tênis mais leve de todos os tempos, fabricado com o revolucionário material Light BOOST para um retorno de energia supremo a cada passada.',
    sku: 'ADI-UB-01',
    price: 1199.90,
    compare_at_price: 1399.90,
    gender: 'masculino',
    sport: 'corrida',
    featured: true,
    is_new: true,
    is_sale: true,
    rating: 4.9,
    review_count: 128,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      { id: 'img-1', product_id: 'p1000000-0000-0000-0000-000000000001', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80', alt: 'Tênis Ultraboost Light', sort_order: 1, created_at: '' },
      { id: 'img-2', product_id: 'p1000000-0000-0000-0000-000000000001', url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80', alt: 'Solado Ultraboost', sort_order: 2, created_at: '' }
    ],
    variants: [
      { id: 'v1-38', product_id: 'p1000000-0000-0000-0000-000000000001', sku: 'ADI-UB-01-38', size: '38', color: '#0f172a', color_name: 'Preto/Vermelho Neon', stock: 12, created_at: '', updated_at: '' },
      { id: 'v1-39', product_id: 'p1000000-0000-0000-0000-000000000001', sku: 'ADI-UB-01-39', size: '39', color: '#0f172a', color_name: 'Preto/Vermelho Neon', stock: 15, created_at: '', updated_at: '' },
      { id: 'v1-40', product_id: 'p1000000-0000-0000-0000-000000000001', sku: 'ADI-UB-01-40', size: '40', color: '#0f172a', color_name: 'Preto/Vermelho Neon', stock: 20, created_at: '', updated_at: '' },
      { id: 'v1-41', product_id: 'p1000000-0000-0000-0000-000000000001', sku: 'ADI-UB-01-41', size: '41', color: '#0f172a', color_name: 'Preto/Vermelho Neon', stock: 18, created_at: '', updated_at: '' },
      { id: 'v1-42', product_id: 'p1000000-0000-0000-0000-000000000001', sku: 'ADI-UB-01-42', size: '42', color: '#0f172a', color_name: 'Preto/Vermelho Neon', stock: 8, created_at: '', updated_at: '' },
      { id: 'v1-43', product_id: 'p1000000-0000-0000-0000-000000000001', sku: 'ADI-UB-01-43', size: '43', color: '#0f172a', color_name: 'Preto/Vermelho Neon', stock: 5, created_at: '', updated_at: '' }
    ]
  },
  {
    id: 'p1000000-0000-0000-0000-000000000002',
    brand_id: BRANDS[0].id,
    category_id: CATEGORIES[0].id,
    brand: BRANDS[0],
    category: CATEGORIES[0],
    name: 'Tênis Adizero Boston 12 Pro',
    slug: 'tenis-adizero-boston-12-pro',
    description: 'Construído para corridas de média e longa distância com hastes de carbono ENERGYRODS 2.0 que reduzem a perda de energia.',
    sku: 'ADI-AZ-02',
    price: 1299.90,
    gender: 'unisex',
    sport: 'corrida',
    featured: true,
    is_new: true,
    is_sale: false,
    rating: 4.85,
    review_count: 94,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [{ id: 'img-3', product_id: 'p1000000-0000-0000-0000-000000000002', url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop&q=80', alt: 'Adizero Boston 12', sort_order: 1, created_at: '' }],
    variants: [
      { id: 'v2-40', product_id: 'p1000000-0000-0000-0000-000000000002', sku: 'ADI-AZ-02-40', size: '40', color: '#22c55e', color_name: 'Verde Volt', stock: 10, created_at: '', updated_at: '' },
      { id: 'v2-41', product_id: 'p1000000-0000-0000-0000-000000000002', sku: 'ADI-AZ-02-41', size: '41', color: '#22c55e', color_name: 'Verde Volt', stock: 14, created_at: '', updated_at: '' }
    ]
  },
  // NIKE
  {
    id: 'p1000000-0000-0000-0000-000000000011',
    brand_id: BRANDS[1].id,
    category_id: CATEGORIES[0].id,
    brand: BRANDS[1],
    category: CATEGORIES[0],
    name: 'Tênis Air Zoom Alphafly NEXT% 3',
    slug: 'tenis-air-zoom-alphafly-next3',
    description: 'O tênis de maratona mais rápido da Nike com duas cápsulas Air Zoom e placa de fibra de carbono Flyplate para impulsão sem limites.',
    sku: 'NIK-AF-11',
    price: 1999.90,
    compare_at_price: 2199.90,
    gender: 'masculino',
    sport: 'corrida',
    featured: true,
    is_new: true,
    is_sale: true,
    rating: 4.95,
    review_count: 340,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [{ id: 'img-11', product_id: 'p1000000-0000-0000-0000-000000000011', url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80', alt: 'Air Zoom Alphafly', sort_order: 1, created_at: '' }],
    variants: [
      { id: 'v11-39', product_id: 'p1000000-0000-0000-0000-000000000011', sku: 'NIK-AF-11-39', size: '39', color: '#e11d48', color_name: 'Laranja Elétrico', stock: 8, created_at: '', updated_at: '' },
      { id: 'v11-40', product_id: 'p1000000-0000-0000-0000-000000000011', sku: 'NIK-AF-11-40', size: '40', color: '#e11d48', color_name: 'Laranja Elétrico', stock: 15, created_at: '', updated_at: '' },
      { id: 'v11-41', product_id: 'p1000000-0000-0000-0000-000000000011', sku: 'NIK-AF-11-41', size: '41', color: '#e11d48', color_name: 'Laranja Elétrico', stock: 12, created_at: '', updated_at: '' }
    ]
  },
  {
    id: 'p1000000-0000-0000-0000-000000000012',
    brand_id: BRANDS[1].id,
    category_id: CATEGORIES[0].id,
    brand: BRANDS[1],
    category: CATEGORIES[0],
    name: 'Tênis Pegasus 40 React',
    slug: 'tenis-pegasus-40-react',
    description: 'O cavalinho de batalha para seus treinos diários. Duas unidades Zoom Air garantem impulso elástico e resposta contínua.',
    sku: 'NIK-PG-12',
    price: 799.90,
    compare_at_price: 899.90,
    gender: 'feminino',
    sport: 'corrida',
    featured: true,
    is_new: false,
    is_sale: true,
    rating: 4.86,
    review_count: 450,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [{ id: 'img-12', product_id: 'p1000000-0000-0000-0000-000000000012', url: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80', alt: 'Pegasus 40', sort_order: 1, created_at: '' }],
    variants: [
      { id: 'v12-36', product_id: 'p1000000-0000-0000-0000-000000000012', sku: 'NIK-PG-12-36', size: '36', color: '#38bdf8', color_name: 'Azul Celeste', stock: 10, created_at: '', updated_at: '' },
      { id: 'v12-37', product_id: 'p1000000-0000-0000-0000-000000000012', sku: 'NIK-PG-12-37', size: '37', color: '#38bdf8', color_name: 'Azul Celeste', stock: 14, created_at: '', updated_at: '' }
    ]
  },
  // ASICS
  {
    id: 'p1000000-0000-0000-0000-000000000021',
    brand_id: BRANDS[2].id,
    category_id: CATEGORIES[0].id,
    brand: BRANDS[2],
    category: CATEGORIES[0],
    name: 'Tênis GEL-Nimbus 26 Max',
    slug: 'tenis-gel-nimbus-26-max',
    description: 'A experiência máxima em suavidade com tecnologia PureGEL e espuma FF BLAST PLUS ECO para amortecimento nas nuvens.',
    sku: 'ASC-NM-21',
    price: 1199.90,
    compare_at_price: 1299.90,
    gender: 'masculino',
    sport: 'corrida',
    featured: true,
    is_new: true,
    is_sale: true,
    rating: 4.93,
    review_count: 230,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [{ id: 'img-21', product_id: 'p1000000-0000-0000-0000-000000000021', url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&auto=format&fit=crop&q=80', alt: 'GEL-Nimbus 26', sort_order: 1, created_at: '' }],
    variants: [
      { id: 'v21-40', product_id: 'p1000000-0000-0000-0000-000000000021', sku: 'ASC-NM-21-40', size: '40', color: '#6366f1', color_name: 'Índigo Tech', stock: 15, created_at: '', updated_at: '' },
      { id: 'v21-41', product_id: 'p1000000-0000-0000-0000-000000000021', sku: 'ASC-NM-21-41', size: '41', color: '#6366f1', color_name: 'Índigo Tech', stock: 20, created_at: '', updated_at: '' }
    ]
  },
  // PUMA
  {
    id: 'p1000000-0000-0000-0000-000000000031',
    brand_id: BRANDS[3].id,
    category_id: CATEGORIES[0].id,
    brand: BRANDS[3],
    category: CATEGORIES[0],
    name: 'Tênis Deviate Nitro Elite 2',
    slug: 'tenis-deviate-nitro-elite-2',
    description: 'Super tênis de competição com espuma com infusão de nitrogênio NITROFOAM Elite e placa PWRPLATE em fibra de carbono.',
    sku: 'PUM-DN-31',
    price: 1499.90,
    compare_at_price: 1699.90,
    gender: 'masculino',
    sport: 'corrida',
    featured: true,
    is_new: true,
    is_sale: true,
    rating: 4.92,
    review_count: 110,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [{ id: 'img-31', product_id: 'p1000000-0000-0000-0000-000000000031', url: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&auto=format&fit=crop&q=80', alt: 'Deviate Nitro Elite', sort_order: 1, created_at: '' }],
    variants: [
      { id: 'v31-41', product_id: 'p1000000-0000-0000-0000-000000000031', sku: 'PUM-DN-31-41', size: '41', color: '#f97316', color_name: 'Laranja Solar', stock: 12, created_at: '', updated_at: '' }
    ]
  },
  // NEW BALANCE
  {
    id: 'p1000000-0000-0000-0000-000000000041',
    brand_id: BRANDS[4].id,
    category_id: CATEGORIES[0].id,
    brand: BRANDS[4],
    category: CATEGORIES[0],
    name: 'Tênis New Balance Fresh Foam X More v4',
    slug: 'tenis-nb-fresh-foam-x-more-v4',
    description: 'A maior quantidade de espuma Fresh Foam X já colocada em um tênis para proporcionar transição suave e conforto inigualável.',
    sku: 'NB-FF-41',
    price: 1099.90,
    compare_at_price: 1299.90,
    gender: 'masculino',
    sport: 'corrida',
    featured: true,
    is_new: true,
    is_sale: true,
    rating: 4.95,
    review_count: 175,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [{ id: 'img-41', product_id: 'p1000000-0000-0000-0000-000000000041', url: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&auto=format&fit=crop&q=80', alt: 'Fresh Foam X More', sort_order: 1, created_at: '' }],
    variants: [
      { id: 'v41-40', product_id: 'p1000000-0000-0000-0000-000000000041', sku: 'NB-FF-41-40', size: '40', color: '#0284c7', color_name: 'Cinza/Azul Marinho', stock: 14, created_at: '', updated_at: '' }
    ]
  },
  {
    id: 'p1000000-0000-0000-0000-000000000042',
    brand_id: BRANDS[4].id,
    category_id: CATEGORIES[0].id,
    brand: BRANDS[4],
    category: CATEGORIES[0],
    name: 'Tênis New Balance 550 Vintage White',
    slug: 'tenis-nb-550-vintage-white',
    description: 'Homenagem aos jogadores de basquete dos anos 90 com silhueta limpa, couro premium resistente e detalhes retrô icônicos.',
    sku: 'NB-550-42',
    price: 899.90,
    gender: 'unisex',
    sport: 'lifestyle',
    featured: true,
    is_new: true,
    is_sale: false,
    rating: 4.97,
    review_count: 410,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [{ id: 'img-42', product_id: 'p1000000-0000-0000-0000-000000000042', url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&auto=format&fit=crop&q=80', alt: 'NB 550 Vintage White', sort_order: 1, created_at: '' }],
    variants: [
      { id: 'v42-41', product_id: 'p1000000-0000-0000-0000-000000000042', sku: 'NB-550-42-41', size: '41', color: '#ffffff', color_name: 'Branco Vintage', stock: 25, created_at: '', updated_at: '' }
    ]
  },
  // APPAREL & ACCESSORIES
  {
    id: 'p1000000-0000-0000-0000-000000000004',
    brand_id: BRANDS[0].id,
    category_id: CATEGORIES[1].id,
    brand: BRANDS[0],
    category: CATEGORIES[1],
    name: 'Camiseta Own The Run Tech',
    slug: 'camiseta-own-the-run-tech',
    description: 'Camiseta de corrida leve em tecido AEROREADY antissuor com elementos refletivos 360 graus para treinos noturnos.',
    sku: 'ADI-TS-04',
    price: 199.90,
    gender: 'masculino',
    sport: 'corrida',
    featured: false,
    is_new: true,
    is_sale: false,
    rating: 4.6,
    review_count: 45,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [{ id: 'img-4', product_id: 'p1000000-0000-0000-0000-000000000004', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80', alt: 'Camiseta Own The Run', sort_order: 1, created_at: '' }],
    variants: [
      { id: 'v4-M', product_id: 'p1000000-0000-0000-0000-000000000004', sku: 'ADI-TS-04-M', size: 'M', color: '#0f172a', color_name: 'Preto', stock: 15, created_at: '', updated_at: '' },
      { id: 'v4-G', product_id: 'p1000000-0000-0000-0000-000000000004', sku: 'ADI-TS-04-G', size: 'G', color: '#0f172a', color_name: 'Preto', stock: 20, created_at: '', updated_at: '' }
    ]
  },
  {
    id: 'p1000000-0000-0000-0000-000000000007',
    brand_id: BRANDS[0].id,
    category_id: CATEGORIES[4].id,
    brand: BRANDS[0],
    category: CATEGORIES[4],
    name: 'Jaqueta Corta-Vento Marathon Jacket',
    slug: 'jaqueta-corta-vento-marathon',
    description: 'Jaqueta ultra leve com repelência à água e capuz ajustável contra ventos fortes.',
    sku: 'ADI-JK-07',
    price: 499.90,
    compare_at_price: 599.90,
    gender: 'feminino',
    sport: 'corrida',
    featured: true,
    is_new: false,
    is_sale: true,
    rating: 4.88,
    review_count: 77,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [{ id: 'img-7', product_id: 'p1000000-0000-0000-0000-000000000007', url: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80', alt: 'Jaqueta Corta-Vento', sort_order: 1, created_at: '' }],
    variants: [
      { id: 'v7-P', product_id: 'p1000000-0000-0000-0000-000000000007', sku: 'ADI-JK-07-P', size: 'P', color: '#0f172a', color_name: 'Preto', stock: 8, created_at: '', updated_at: '' }
    ]
  },
  {
    id: 'p1000000-0000-0000-0000-000000000008',
    brand_id: BRANDS[0].id,
    category_id: CATEGORIES[5].id,
    brand: BRANDS[0],
    category: CATEGORIES[5],
    name: 'Mochila Training Pro 30L',
    slug: 'mochila-training-pro-30l',
    description: 'Mochila esportiva reforçada com compartimento para notebook de até 16" e base à prova de água.',
    sku: 'ADI-BP-08',
    price: 329.90,
    gender: 'unisex',
    sport: 'academia',
    featured: false,
    is_new: true,
    is_sale: false,
    rating: 4.65,
    review_count: 39,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [{ id: 'img-8', product_id: 'p1000000-0000-0000-0000-000000000008', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', alt: 'Mochila Training Pro', sort_order: 1, created_at: '' }],
    variants: [
      { id: 'v8-U', product_id: 'p1000000-0000-0000-0000-000000000008', sku: 'ADI-BP-08-U', size: 'Único', color: '#0f172a', color_name: 'Preto Grafite', stock: 30, created_at: '', updated_at: '' }
    ]
  }
];

export async function getProducts(options: FilterOptions = {}): Promise<Product[]> {
  let products = [...MOCK_PRODUCTS];

  if (options.brandSlug) {
    products = products.filter((p) => p.brand?.slug === options.brandSlug);
  }

  if (options.categorySlug) {
    products = products.filter((p) => p.category?.slug === options.categorySlug);
  }

  if (options.gender) {
    products = products.filter((p) => p.gender === options.gender || p.gender === 'unisex');
  }

  if (options.minPrice !== undefined) {
    products = products.filter((p) => p.price >= options.minPrice!);
  }

  if (options.maxPrice !== undefined) {
    products = products.filter((p) => p.price <= options.maxPrice!);
  }

  if (options.searchQuery) {
    const q = options.searchQuery.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand?.name.toLowerCase().includes(q) ||
        p.category?.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
    );
  }

  // Sorting
  if (options.sort === 'price_asc') {
    products.sort((a, b) => a.price - b.price);
  } else if (options.sort === 'price_desc') {
    products.sort((a, b) => b.price - a.price);
  } else if (options.sort === 'newest') {
    products.sort((a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0));
  } else if (options.sort === 'rating') {
    products.sort((a, b) => b.rating - a.rating);
  }

  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const found = MOCK_PRODUCTS.find((p) => p.slug === slug);
  return found || null;
}

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  const found = BRANDS.find((b) => b.slug === slug);
  return found || null;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const found = CATEGORIES.find((c) => c.slug === slug);
  return found || null;
}
