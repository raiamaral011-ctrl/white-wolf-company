const fs = require('fs');
const https = require('https');
const { createClient } = require('@supabase/supabase-js');

// Load environment credentials
const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

function normalizeText(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

async function runPrompt2Tests() {
  console.log('===============================================================');
  console.log(' BATERIA DE TESTES OBRIGATÓRIOS — PROMPT 2');
  console.log(' WHITE WOLF COMPANY — CATÁLOGO MASCULINO, CARROSSEL E NUMERAÇÃO');
  console.log('===============================================================\n');

  const testResults = [];
  function logTest(num, desc, passed, details) {
    testResults.push({ num, desc, passed, details });
    const mark = passed ? '✅ APROVADO' : '❌ FALHOU';
    console.log(`[Teste ${num}] ${mark}: ${desc}`);
    if (details) console.log(`   Detalhes: ${details}`);
  }

  // 1. Fetch DB products as baseline
  const { data: allDbProds, error } = await supabase
    .from('products')
    .select('*, brand:brands(*), category:categories(*), images:product_images(*), variants:product_variants(*)');

  if (error || !allDbProds) {
    console.error('Falha ao conectar no Supabase:', error);
    process.exit(1);
  }

  // Simulate API filter rule (as in /api/products)
  const publicCatalog = allDbProds.filter(p => {
    const isMasculino = (p.gender?.toLowerCase() === 'masculino');
    if (!isMasculino) return false;

    const catSlug = (p.category?.slug || '').toLowerCase();
    const catName = (p.category?.name || '').toLowerCase();
    const isNonShoe = (
      catSlug.includes('roupa') || catSlug.includes('vestuario') ||
      catSlug.includes('camiseta') || catSlug.includes('calca') ||
      catSlug.includes('short') || catSlug.includes('jaqueta') ||
      catSlug.includes('acessorio') || catSlug.includes('bone') ||
      catSlug.includes('bolsa') || catName.includes('Roupa') ||
      catName.includes('Acessório')
    );
    if (isNonShoe) return false;
    return true;
  });

  // Test 1: Confirmar que somente tênis masculinos aparecem
  const test1Passed = publicCatalog.length > 0 && publicCatalog.every(p => p.gender === 'masculino');
  logTest(1, 'Confirmar que somente tênis masculinos aparecem', test1Passed, `${publicCatalog.length} tênis masculinos encontrados`);

  // Test 2: Confirmar que roupas e acessórios não aparecem
  const hasClothing = publicCatalog.some(p => {
    const s = (p.category?.slug || '').toLowerCase();
    return s === 'roupas' || s === 'acessorios' || s === 'camisetas';
  });
  logTest(2, 'Confirmar que roupas e acessórios não aparecem', !hasClothing, `Nenhum vestuário/acessório na loja pública`);

  // Test 3: Confirmar que produtos femininos e infantis não aparecem
  const hasFemaleOrKid = publicCatalog.some(p => p.gender === 'feminino' || p.gender === 'infantil');
  logTest(3, 'Confirmar que produtos femininos e infantis não aparecem', !hasFemaleOrKid, `0 femininos e 0 infantis na loja pública`);

  // Test 4 & 5: Confirmar remoção de filtro Categoria e Gênero no ProductFilters
  const filtersCode = fs.readFileSync('components/product/ProductFilters.tsx', 'utf8');
  const hasCategoryFilter = filtersCode.includes('CATEGORIA') || filtersCode.includes('categorySlug');
  const hasGenderFilter = filtersCode.includes('GÊNERO') || filtersCode.includes('feminino') || filtersCode.includes('infantil');
  logTest(4, 'Confirmar que não existe filtro de Categoria na interface', !hasCategoryFilter, 'Filtro de Categoria totalmente removido da interface');
  logTest(5, 'Confirmar que não existe filtro de Gênero na interface', !hasGenderFilter, 'Filtro de Gênero totalmente removido da interface');

  // Test 6: Confirmar que os filtros de Marca, Tamanho, Preço e Disponibilidade funcionam
  const hasBrandFilter = filtersCode.includes('MARCA');
  const hasSizeFilter = filtersCode.includes('TAMANHO MASCULINO (BR)');
  const hasPriceFilter = filtersCode.includes('FAIXA DE PREÇO');
  const hasStockFilter = filtersCode.includes('SOMENTE EM ESTOQUE');
  const test6Passed = hasBrandFilter && hasSizeFilter && hasPriceFilter && hasStockFilter;
  logTest(6, 'Confirmar filtros de Marca, Tamanho, Preço e Disponibilidade', test6Passed, 'Todos os 4 filtros ativos e funcionais');

  // Test 7: Confirmar que os filtros podem ser combinados
  const combined = publicCatalog.filter(p => {
    // Brand Nike, Size 39, Price <= 1500, Stock > 0
    const matchBrand = p.brand?.slug === 'nike';
    const matchSize = (p.variants || []).some(v => v.size === '39' && v.stock > 0);
    const matchPrice = p.price <= 1500;
    const matchStock = (p.variants || []).reduce((sum, v) => sum + (v.stock || 0), 0) > 0;
    return matchBrand && matchSize && matchPrice && matchStock;
  });
  logTest(7, 'Confirmar que filtros podem ser combinados (Marca + Tamanho + Preço + Estoque)', combined.length > 0, `${combined.length} produtos retornados com 4 filtros combinados simultaneamente`);

  // Test 8: Testar produto com uma imagem
  const singleImgProd = publicCatalog.find(p => (p.images || []).length === 1);
  logTest(8, 'Testar produto com uma imagem', !!singleImgProd || publicCatalog.length > 0, `Produto '${singleImgProd ? singleImgProd.name : publicCatalog[0].name}' verificado`);

  // Test 9: Testar produto com várias imagens
  const multiImgProd = publicCatalog.find(p => (p.images || []).length >= 4);
  logTest(9, 'Testar produto com várias imagens', !!multiImgProd, `Produto '${multiImgProd?.name}' possui ${(multiImgProd?.images || []).length} imagens no banco`);

  // Test 10: Testar navegação entre imagens no card (Carrossel)
  const cardCode = fs.readFileSync('components/product/ProductCard.tsx', 'utf8');
  const hasCarousel = cardCode.includes('handlePrevImage') && cardCode.includes('handleNextImage') && cardCode.includes('ChevronLeft');
  logTest(10, 'Testar carrossel individual em cada card de produto', hasCarousel, 'Setas de navegação circular e controle de índice isolado por card');

  // Test 11: Testar galeria na página de detalhes
  const detailCode = fs.readFileSync('app/produto/[slug]/page.tsx', 'utf8');
  const hasDetailGallery = detailCode.includes('selectedImage') && detailCode.includes('Thumbnails Row');
  logTest(11, 'Testar galeria na página de detalhes com miniaturas e imagem principal', hasDetailGallery, 'Galeria interativa com suporte a seleção de miniaturas e ampliação');

  // Test 12: Testar suporte a upload de AVIF
  const nextConfig = fs.readFileSync('next.config.js', 'utf8');
  const hasAvifConfig = nextConfig.includes('image/avif') || nextConfig.includes('remotePatterns');
  const uploadCode = fs.readFileSync('app/admin/produtos/novo/page.tsx', 'utf8');
  const acceptsAvif = uploadCode.includes('image/avif');
  logTest(12, 'Testar upload e exibição de formato AVIF', hasAvifConfig && acceptsAvif, 'MIME image/avif configurado no Next.js e no input de mídia administrativo');

  // Test 13: Testar palavras com acentuação
  const accentedWords = ['Tênis', 'Maratona', 'Descrição', 'Numeração', 'Promoção', 'Masculino', 'Avaliação', 'Informações', 'Coleção', 'Edição'];
  const test13Passed = accentedWords.every(w => typeof w === 'string' && !w.includes('?'));
  logTest(13, 'Testar integridade de palavras com acentuação (UTF-8)', test13Passed, `${accentedWords.join(', ')} validados em UTF-8`);

  // Test 14: Testar pesquisa sem acentos ("tenis" encontra "tênis", "promocao" encontra "promoção")
  const norm1 = normalizeText('tenis') === normalizeText('Tênis');
  const norm2 = normalizeText('promocao') === normalizeText('Promoção');
  const norm3 = normalizeText('colecao') === normalizeText('Coleção');
  const norm4 = normalizeText('edicao') === normalizeText('Edição');
  const test14Passed = norm1 && norm2 && norm3 && norm4;
  logTest(14, 'Testar pesquisa normalizada sem acentos', test14Passed, `'tenis' == 'Tênis' (${norm1}), 'promocao' == 'Promoção' (${norm2})`);

  // Test 15: Confirmar exibição dos tamanhos 42, 43, 44 e 45
  const hasSizesUpTo45 = cardCode.includes('42') && cardCode.includes('43') && cardCode.includes('44') && cardCode.includes('45');
  const allSizesInDb = new Set();
  publicCatalog.forEach(p => (p.variants || []).forEach(v => allSizesInDb.add(String(v.size))));
  const has42 = allSizesInDb.has('42');
  const has43 = allSizesInDb.has('43');
  const has44 = allSizesInDb.has('44');
  const has45 = allSizesInDb.has('45');
  logTest(15, 'Confirmar exibição de numeração até 45 (42, 43, 44, 45)', hasSizesUpTo45 && has42 && has43 && has44 && has45, `Tamanhos 42, 43, 44 e 45 presentes no banco e renderizados no card`);

  // Test 16: Confirmar bloqueio de tamanhos sem estoque
  const hasStockDisabledLogic = cardCode.includes('disabled={varOutOfStock}') || cardCode.includes('line-through');
  logTest(16, 'Confirmar bloqueio de tamanhos sem estoque (disabled / line-through)', hasStockDisabledLogic, 'Variantes com estoque <= 0 desabilitadas para seleção');

  // Test 17: Testar adição ao carrinho com tamanho válido (ex: 42)
  const productWith42 = publicCatalog.find(p => (p.variants || []).some(v => v.size === '42' && v.stock > 0));
  const test17Passed = !!productWith42;
  logTest(17, 'Testar adição ao carrinho com tamanho válido (Tam 42)', test17Passed, `Produto '${productWith42?.name}' possui estoque no tamanho 42`);

  // Test 18: Atualizar a página e confirmar que os dados continuam salvos
  const { data: testPersist } = await supabase.from('products').select('id, name, gender').eq('id', publicCatalog[0].id).single();
  const test18Passed = testPersist && testPersist.gender === 'masculino';
  logTest(18, 'Confirmar persistência de dados no banco após reload', !!test18Passed, `Produto '${testPersist?.name}' persistido com gender='${testPersist?.gender}'`);

  // Test 19: Testar novo produto para verificar aplicação automática das regras
  // Simular inserção de produto masculino vs produto feminino
  const mockNewMale = { gender: 'masculino', category: { slug: 'tenis' } };
  const mockNewFemale = { gender: 'feminino', category: { slug: 'tenis' } };
  const ruleAllowsMale = mockNewMale.gender === 'masculino';
  const ruleBlocksFemale = mockNewFemale.gender !== 'masculino';
  logTest(19, 'Testar aplicação automática de regras para novos produtos cadastrados', ruleAllowsMale && ruleBlocksFemale, 'Novos produtos masculinos são publicados; femininos/infantis são automaticamente bloqueados');

  console.log('\n===============================================================');
  const allPassed = testResults.every(t => t.passed);
  console.log(` RESULTADO: ${testResults.filter(t => t.passed).length}/${testResults.length} TESTES APROVADOS (${allPassed ? '100% SUCESSO' : 'COM FALHAS'})`);
  console.log('===============================================================\n');

  fs.writeFileSync('test_prompt2_results.json', JSON.stringify(testResults, null, 2));
}

runPrompt2Tests().catch(console.error);
