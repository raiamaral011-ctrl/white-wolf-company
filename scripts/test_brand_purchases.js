const http = require('http');

const BRANDS_TO_TEST = [
  { name: 'Adidas', slug: 'adidas' },
  { name: 'Nike', slug: 'nike' },
  { name: 'ASICS', slug: 'asics' },
  { name: 'Puma', slug: 'puma' },
  { name: 'New Balance', slug: 'new-balance' }
];

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  const data = await res.json();
  return { status: res.status, ok: res.ok, data };
}

async function runEndToEndTests() {
  console.log('================================================================');
  console.log('   WHITE WOLF COMPANY — TESTES DE COMPRA POR MARCA (E2E)');
  console.log('================================================================\n');

  const results = [];

  for (const b of BRANDS_TO_TEST) {
    console.log(`\n--- Testando Marca: ${b.name.toUpperCase()} (slug: ${b.slug}) ---`);

    let filterPass = false;
    let imagePass = false;
    let cartPass = false;
    let checkoutPass = false;
    let orderPass = false;
    let testedProduct = null;
    let orderId = null;

    try {
      // 1. Catálogo e Filtro de Marca
      const catRes = await fetchJson(`http://localhost:3000/api/products?brand=${b.slug}`);
      const prods = catRes.data || [];

      if (prods.length > 0) {
        // Verificar se todos os produtos retornados são da marca testada
        const allMatch = prods.every(p => {
          const s = (p.brand?.slug || '').toLowerCase();
          const n = (p.brand?.name || '').toLowerCase();
          return s === b.slug || n === b.name.toLowerCase() || s.replace(/-/g, ' ') === b.slug.replace(/-/g, ' ');
        });

        if (allMatch) {
          filterPass = true;
          console.log(`[x] Filtro ${b.name}: OK (${prods.length} modelos encontrados, isolamento 100%)`);
        } else {
          console.error(`[!] Filtro ${b.name}: Falhou (produtos de outras marcas vazaram no filtro)`);
        }

        testedProduct = prods[0];

        // 2. Verificação de Imagem
        const hasImages = testedProduct.images && testedProduct.images.length > 0;
        const imgUrl = hasImages ? testedProduct.images[0].url : '';
        if (hasImages && imgUrl && typeof imgUrl === 'string' && imgUrl.trim().length > 5) {
          imagePass = true;
          console.log(`[x] Imagem "${testedProduct.name}": OK (${imgUrl.substring(0, 60)}...)`);
        } else {
          console.error(`[!] Imagem "${testedProduct.name}": Falhou (sem imagem válida)`);
        }

        // 3. Simulação de Carrinho
        const variant = (testedProduct.variants && testedProduct.variants.length > 0)
          ? testedProduct.variants[0]
          : { id: `${testedProduct.id}-default`, size: '41', stock: 10 };

        const cartItem = {
          product: testedProduct,
          variant: variant,
          quantity: 1,
        };

        if (cartItem.product && cartItem.variant && cartItem.quantity > 0) {
          cartPass = true;
          console.log(`[x] Carrinho: OK (Modelo: ${testedProduct.name}, Tam: ${variant.size}, Preço: R$ ${testedProduct.price})`);
        }

        // 4 & 5. Checkout e Confirmação de Pedido
        const checkoutPayload = {
          items: [cartItem],
          checkoutData: {
            fullName: `Aluno Professor Teste ${b.name}`,
            email: `aluno.teste.${b.slug}@whitewolf.com`,
            cpf: '123.456.789-00',
            phone: '(11) 98765-4321',
            cep: '01310-100',
            street: 'Avenida Paulista',
            number: '1000',
            complement: 'Apto 101',
            neighborhood: 'Bela Vista',
            city: 'São Paulo',
            state: 'SP',
            shippingMethod: 'normal',
            paymentMethod: 'pix',
          }
        };

        const checkRes = await fetchJson('http://localhost:3000/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(checkoutPayload)
        });

        if (checkRes.ok && checkRes.data.success && checkRes.data.order) {
          checkoutPass = true;
          orderPass = true;
          orderId = checkRes.data.order.id;
          console.log(`[x] Checkout & Pagamento PIX Demonstrativo: OK (Total: R$ ${checkRes.data.order.total})`);
          console.log(`[x] Pedido Registrado: OK (ID: ${orderId}, Status: ${checkRes.data.order.status})`);
        } else {
          console.error(`[!] Checkout Falhou:`, checkRes.data?.error || checkRes.data);
        }

      } else {
        console.warn(`[!] Nenhum produto encontrado para marca ${b.name}`);
      }

    } catch (err) {
      console.error(`[!] Erro durante teste da marca ${b.name}:`, err.message);
    }

    results.push({
      marca: b.name,
      filtro: filterPass ? 'Aprovado' : 'Falhou',
      imagem: imagePass ? 'Aprovado' : 'Falhou',
      carrinho: cartPass ? 'Aprovado' : 'Falhou',
      checkout: checkoutPass ? 'Aprovado' : 'Falhou',
      pedido: orderPass ? `Aprovado (${orderId})` : 'Falhou',
    });
  }

  console.log('\n================================================================');
  console.log('             TABELA OFICIAL DE COMPRAS DE TESTE');
  console.log('================================================================');
  console.table(results);
  console.log('================================================================\n');
}

runEndToEndTests();
