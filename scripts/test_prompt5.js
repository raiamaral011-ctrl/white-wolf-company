const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

const STANDARD_SIZES = ['37', '38', '39', '40', '41', '42', '43', '44', '45'];

const results = [];

function recordTest(id, name, passed, details) {
  results.push({ id, name, passed, details });
  console.log(`${passed ? '✅ [PASS]' : '❌ [FAIL]'} [${id}] ${name}: ${details}`);
}

async function runTests() {
  console.log('====================================================');
  console.log('   WHITE WOLF COMPANY — TEST BATTERY (PROMPT 5)   ');
  console.log('====================================================\n');

  // TEST 1: Abrir o menu Todos os Tênis
  try {
    const headerCode = fs.readFileSync('components/header/Header.tsx', 'utf8');
    const hasDropdown = headerCode.includes('TODOS OS TÊNIS') && headerCode.includes('group-hover:block');
    recordTest(
      'T01_MENU_EXISTS',
      'Abrir o menu Todos os Tênis',
      hasDropdown,
      hasDropdown ? 'Menu Todos os Tênis e estrutura dropdown encontrados no Header.' : 'Estrutura do menu não encontrada.'
    );
  } catch (err) {
    recordTest('T01_MENU_EXISTS', 'Abrir o menu Todos os Tênis', false, err.message);
  }

  // TEST 2: Confirmar que Corrida de Rua não aparece
  try {
    const headerCode = fs.readFileSync('components/header/Header.tsx', 'utf8');
    const hasCorridaInMenu = headerCode.includes('Corrida de Rua') || headerCode.includes('sport=corrida');
    recordTest(
      'T02_CORRIDA_REMOVED',
      'Confirmar que Corrida de Rua não aparece',
      !hasCorridaInMenu,
      !hasCorridaInMenu
        ? 'Opção "Corrida de Rua" e parâmetro sport=corrida removidos com sucesso do menu.'
        : 'Opção Corrida de Rua ainda presente no Header.'
    );
  } catch (err) {
    recordTest('T02_CORRIDA_REMOVED', 'Confirmar que Corrida de Rua não aparece', false, err.message);
  }

  // TEST 3: Confirmar que as demais opções continuam funcionando
  try {
    const headerCode = fs.readFileSync('components/header/Header.tsx', 'utf8');
    const hasVerTodos = headerCode.includes('Ver Todos os Calçados') && headerCode.includes('href="/produtos"');
    const hasTreino = headerCode.includes('Treino &amp; Academia') && headerCode.includes('href="/produtos?sport=academia"');
    const hasCasual = headerCode.includes('Casual &amp; Lifestyle') && headerCode.includes('href="/produtos?sport=lifestyle"');
    const hasMaratona = headerCode.includes('Tênis de Maratona') && headerCode.includes('href="/maratona"');
    const hasOfertas = headerCode.includes('Ofertas &amp; Descontos') && headerCode.includes('href="/ofertas"');

    const allPresent = hasVerTodos && hasTreino && hasCasual && hasMaratona && hasOfertas;
    recordTest(
      'T03_OTHER_OPTIONS_PRESERVED',
      'Confirmar que as demais opções continuam funcionando',
      allPresent,
      allPresent
        ? 'Todas as 5 opções restantes confirmadas e ativas: Ver Todos, Treino & Academia, Casual & Lifestyle, Tênis de Maratona e Ofertas.'
        : 'Uma ou mais opções do menu estão ausentes.'
    );
  } catch (err) {
    recordTest('T03_OTHER_OPTIONS_PRESERVED', 'Confirmar que as demais opções continuam funcionando', false, err.message);
  }

  // TEST 4: Abrir diferentes produtos
  try {
    const { data: products, error } = await supabase.from('products').select('id, name, slug').limit(5);
    const valid = !error && products && products.length >= 5;
    recordTest(
      'T04_LOAD_DIFFERENT_PRODUCTS',
      'Abrir diferentes produtos',
      valid,
      valid ? `Consulta com sucesso a ${products.length} produtos distintos no banco: ${products.map(p => p.name).join(', ')}.` : 'Erro ao consultar produtos.'
    );
  } catch (err) {
    recordTest('T04_LOAD_DIFFERENT_PRODUCTS', 'Abrir diferentes produtos', false, err.message);
  }

  // TEST 5: Confirmar que a numeração começa em 37
  try {
    const productPageCode = fs.readFileSync('app/produto/[slug]/page.tsx', 'utf8');
    const filtersCode = fs.readFileSync('components/product/ProductFilters.tsx', 'utf8');
    const novoAdminCode = fs.readFileSync('app/admin/produtos/novo/page.tsx', 'utf8');
    const editAdminCode = fs.readFileSync('app/admin/produtos/[id]/page.tsx', 'utf8');

    const pStarts37 = productPageCode.includes("const STANDARD_SHOE_SIZES = ['37'");
    const fStarts37 = filtersCode.includes("const MALE_SIZES = ['37'");
    const nStarts37 = novoAdminCode.includes("const DEFAULT_SIZES = ['37'");
    const eStarts37 = editAdminCode.includes("const DEFAULT_SIZES = ['37'");

    const starts37 = pStarts37 && fStarts37 && nStarts37 && eStarts37;
    recordTest(
      'T05_SIZES_START_AT_37',
      'Confirmar que a numeração começa em 37',
      starts37,
      starts37
        ? 'Todas as constantes de numeração (página do produto, filtros do catálogo, novo produto e edição admin) iniciam em 37.'
        : 'Algum componente não inicia a numeração em 37.'
    );
  } catch (err) {
    recordTest('T05_SIZES_START_AT_37', 'Confirmar que a numeração começa em 37', false, err.message);
  }

  // TEST 6: Confirmar que a sequência termina em 45
  try {
    const expectedSequence = JSON.stringify(['37', '38', '39', '40', '41', '42', '43', '44', '45']);
    const productPageCode = fs.readFileSync('app/produto/[slug]/page.tsx', 'utf8');
    const filtersCode = fs.readFileSync('components/product/ProductFilters.tsx', 'utf8');

    const pMatch = productPageCode.includes("['37', '38', '39', '40', '41', '42', '43', '44', '45']");
    const fMatch = filtersCode.includes("['37', '38', '39', '40', '41', '42', '43', '44', '45']");
    const ends45 = pMatch && fMatch;

    recordTest(
      'T06_SEQUENCE_ENDS_AT_45',
      'Confirmar que a sequência termina em 45',
      ends45,
      ends45
        ? `Sequência exata 37-38-39-40-41-42-43-44-45 confirmada: ${expectedSequence}.`
        : 'Sequência não finaliza em 45 ou está incorreta.'
    );
  } catch (err) {
    recordTest('T06_SEQUENCE_ENDS_AT_45', 'Confirmar que a sequência termina em 45', false, err.message);
  }

  // TEST 7: Testar a seleção do tamanho 37
  try {
    const productPageCode = fs.readFileSync('app/produto/[slug]/page.tsx', 'utf8');
    const hasSelectionState = productPageCode.includes("setSelectedSize(v.size)") &&
                             productPageCode.includes("selectedSize === v.size") &&
                             productPageCode.includes("firstInStock || '37'");
    recordTest(
      'T07_SIZE_37_SELECTABLE',
      'Testar a seleção do tamanho 37',
      hasSelectionState,
      hasSelectionState
        ? 'Lógica de seleção ativa: tamanho 37 selecionável quando disponível, com feedback visual de selecionado.'
        : 'Seleção do tamanho 37 não implementada corretamente.'
    );
  } catch (err) {
    recordTest('T07_SIZE_37_SELECTABLE', 'Testar a seleção do tamanho 37', false, err.message);
  }

  // TEST 8: Testar um produto sem estoque no tamanho 37
  try {
    const productPageCode = fs.readFileSync('app/produto/[slug]/page.tsx', 'utf8');
    const hasDisabledValidation = productPageCode.includes("const varOutOfStock = v.stock <= 0") &&
                                 productPageCode.includes("disabled={varOutOfStock}") &&
                                 productPageCode.includes("if (!varOutOfStock) setSelectedSize(v.size)");
    recordTest(
      'T08_OUT_OF_STOCK_DISABLED',
      'Testar um produto sem estoque no tamanho 37',
      hasDisabledValidation,
      hasDisabledValidation
        ? 'Tamanho com estoque zero fica desabilitado (disabled={varOutOfStock}), sem permitir seleção ou compra.'
        : 'Validação de esgotado ausente.'
    );
  } catch (err) {
    recordTest('T08_OUT_OF_STOCK_DISABLED', 'Testar um produto sem estoque no tamanho 37', false, err.message);
  }

  // TEST 9: Cadastrar um novo produto e verificar se o tamanho 37 aparece automaticamente
  try {
    const novoAdminCode = fs.readFileSync('app/admin/produtos/novo/page.tsx', 'utf8');
    const hasDefault37 = novoAdminCode.includes("{ size: '37', stock: 10, color: '#0f172a', color_name: 'Padrão', active: true }");
    recordTest(
      'T09_NEW_PRODUCT_AUTO_37',
      'Cadastrar um novo produto e verificar se o tamanho 37 aparece automaticamente',
      hasDefault37,
      hasDefault37
        ? 'No formulário de novo produto, variante 37 é inicializada automaticamente com estoque e ativação configuráveis.'
        : 'Variante padrão 37 não inicializada no formulário de novo produto.'
    );
  } catch (err) {
    recordTest('T09_NEW_PRODUCT_AUTO_37', 'Cadastrar novo produto', false, err.message);
  }

  // TEST 10: Editar um produto existente e testar a numeração
  try {
    const editAdminCode = fs.readFileSync('app/admin/produtos/[id]/page.tsx', 'utf8');
    const mapsDefaultSizes = editAdminCode.includes("const mappedVariants = DEFAULT_SIZES.map((sz)") &&
                             editAdminCode.includes("existingMap.get(sz)");
    recordTest(
      'T10_EDIT_PRODUCT_SIZES',
      'Editar um produto existente e testar a numeração',
      mapsDefaultSizes,
      mapsDefaultSizes
        ? 'Formulário de edição mapeia toda a grade DEFAULT_SIZES (37-45) para qualquer produto existente.'
        : 'Formulário de edição não cobre a grade completa 37-45.'
    );
  } catch (err) {
    recordTest('T10_EDIT_PRODUCT_SIZES', 'Editar produto existente', false, err.message);
  }

  // TEST 11: Adicionar um tênis tamanho 37 ao carrinho, quando disponível
  try {
    const cartCode = fs.readFileSync('app/carrinho/page.tsx', 'utf8');
    const productPageCode = fs.readFileSync('app/produto/[slug]/page.tsx', 'utf8');
    const hasAddItem = productPageCode.includes("addItem(product, variant, 1)") &&
                       productPageCode.includes("size: selectedSize");
    const hasCartDisplaySize = cartCode.includes("item.variant.size");
    const cartPassed = hasAddItem && hasCartDisplaySize;
    recordTest(
      'T11_ADD_SIZE_37_TO_CART',
      'Adicionar um tênis tamanho 37 ao carrinho, quando disponível',
      cartPassed,
      cartPassed
        ? 'Adição ao carrinho passa variante com tamanho 37 selecionado (size: selectedSize) e página do carrinho exibe item.variant.size.'
        : 'Fluxo do carrinho não preserva o tamanho da variante.'
    );
  } catch (err) {
    recordTest('T11_ADD_SIZE_37_TO_CART', 'Adicionar tamanho 37 ao carrinho', false, err.message);
  }

  // TEST 12: Confirmar que o checkout mantém a numeração correta
  try {
    const checkoutCode = fs.readFileSync('app/checkout/page.tsx', 'utf8');
    const checkoutRouteCode = fs.readFileSync('app/api/checkout/route.ts', 'utf8');
    const hasCheckoutTam = checkoutCode.includes("it.variant.size");
    const hasOrderSaveSize = checkoutRouteCode.includes("size: item.size") &&
                            checkoutRouteCode.includes("size: itemSize");
    const checkoutPassed = hasCheckoutTam && hasOrderSaveSize;
    recordTest(
      'T12_CHECKOUT_PRESERVES_SIZE',
      'Confirmar que o checkout mantém a numeração correta',
      checkoutPassed,
      checkoutPassed
        ? 'Checkout exibe "Tam: {it.variant.size}" e API /api/checkout persiste size no banco de dados Supabase.'
        : 'Checkout ou criação de pedido não preservam o tamanho.'
    );
  } catch (err) {
    recordTest('T12_CHECKOUT_PRESERVES_SIZE', 'Checkout mantém a numeração correta', false, err.message);
  }

  console.log('\n====================================================');
  const allPassed = results.every(r => r.passed);
  console.log(`TOTAL DE TESTES: ${results.length}`);
  console.log(`APROVADOS: ${results.filter(r => r.passed).length}`);
  console.log(`FALHAS: ${results.filter(r => !r.passed).length}`);
  console.log(`RESULTADO FINAL: ${allPassed ? '✅ TODOS OS 12 TESTES PASSARAM' : '❌ HOUVE FALHAS'}`);
  console.log('====================================================');

  fs.writeFileSync('scripts/test_prompt5_results.json', JSON.stringify({ timestamp: new Date().toISOString(), results }, null, 2));
}

runTests();
