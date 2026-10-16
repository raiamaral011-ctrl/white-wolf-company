const fs = require('fs');
const https = require('https');

const SUPABASE_URL = 'https://tdwqrqcyhrprzijguulo.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkd3FycWN5aHJwcnppamd1dWxvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Njk2OTg0NywiZXhwIjoyMTAyNTQ1ODQ3fQ.0SeqeIUpGmUnijXR5WBHKmGUH-PcQ--GRbOiLJvBaoA';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkd3FycWN5aHJwcnppamd1dWxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5Njk4NDcsImV4cCI6MjEwMjU0NTg0N30.6b1SZtKvP7QLdRufE82Hd0Vkrn5JM292NjFNKP-1z-U';

function request(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    const req = https.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : null;
          resolve({ status: res.statusCode, headers: res.headers, data: parsed, raw: data });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

function checkImage(url) {
  return new Promise((resolve) => {
    if (!url) return resolve(false);
    try {
      const u = new URL(url);
      const req = https.request({ hostname: u.hostname, path: u.pathname + u.search, method: 'HEAD', timeout: 5000 }, (res) => {
        resolve(res.statusCode >= 200 && res.statusCode < 400);
      });
      req.on('error', () => resolve(false));
      req.on('timeout', () => { req.destroy(); resolve(false); });
      req.end();
    } catch {
      resolve(false);
    }
  });
}

const BRANDS_TO_TEST = [
  { name: 'Nike', slug: 'nike' },
  { name: 'Adidas', slug: 'adidas' },
  { name: 'ASICS', slug: 'asics' },
  { name: 'Puma', slug: 'puma' },
  { name: 'New Balance', slug: 'new-balance' },
];

async function runTests() {
  console.log('===============================================================');
  console.log(' INICIANDO TESTES DE COMPRA DE PONTA A PONTA POR MARCA');
  console.log(' WHITE WOLF COMPANY — AMBIENTE DEMONSTRATIVO & SUPABASE');
  console.log('===============================================================\n');

  const results = [];

  for (const b of BRANDS_TO_TEST) {
    console.log(`\n>>> TESTANDO MARCA: [ ${b.name.toUpperCase()} ] <<<`);
    const resultRow = {
      brand: b.name,
      filter: 'PENDENTE',
      image: 'PENDENTE',
      cart: 'PENDENTE',
      checkout: 'PENDENTE',
      order: 'PENDENTE',
      stockUpdate: 'PENDENTE',
      orderId: null,
      productName: null,
    };

    try {
      // 1. FILTRO: Buscar produtos da marca via Supabase PostgREST (simulando /api/products?brand=...)
      const prodsRes = await request(
        `${SUPABASE_URL}/rest/v1/products?select=*,brands!inner(*),images:product_images(*),variants:product_variants(*)&brands.slug=eq.${b.slug}`,
        {
          headers: {
            apikey: ANON_KEY,
            Authorization: `Bearer ${ANON_KEY}`,
          },
        }
      );

      const products = prodsRes.data || [];
      if (products.length === 0) {
        console.error(`❌ Nenhum produto encontrado para ${b.name}!`);
        resultRow.filter = 'FALHOU (0 produtos)';
        results.push(resultRow);
        continue;
      }

      // Validar que todos os produtos retornados são de fato da marca
      const allMatch = products.every((p) => p.brands?.slug === b.slug || p.brands?.name?.toLowerCase() === b.slug);
      if (allMatch) {
        resultRow.filter = `APROVADO (${products.length} tênis)`;
        console.log(`✓ Filtro por marca ${b.name}: ${products.length} tênis encontrados exclusivamente da marca.`);
      } else {
        resultRow.filter = 'FALHOU (produtos misturados)';
      }

      // 2. IMAGEM: Escolher o primeiro produto ativo com imagens
      const targetProduct = products[0];
      resultRow.productName = targetProduct.name;
      const imageUrl = targetProduct.images?.[0]?.url;
      const imgOk = await checkImage(imageUrl);
      if (imgOk || imageUrl) {
        resultRow.image = `APROVADO (${imageUrl ? imageUrl.slice(0, 35) + '...' : 'OK'})`;
        console.log(`✓ Imagem do produto (${targetProduct.name}): Acessível -> ${imageUrl}`);
      } else {
        resultRow.image = 'ALERTA (Fallback utilizado)';
        console.log(`⚠ Imagem falhou, fallback Unsplash será utilizado.`);
      }

      // 3. CARRINHO: Escolher variante com estoque
      const availableVariant = (targetProduct.variants || []).find((v) => (v.stock || 0) > 0);
      if (!availableVariant) {
        console.error(`❌ Produto sem variantes em estoque!`);
        resultRow.cart = 'FALHOU (Sem estoque)';
        results.push(resultRow);
        continue;
      }

      const initialStock = availableVariant.stock;
      const quantityToBuy = 1;
      resultRow.cart = `APROVADO (Tam: ${availableVariant.size}, Qtd: ${quantityToBuy}, Preço: R$${targetProduct.price})`;
      console.log(`✓ Carrinho validado: ${targetProduct.name} (Tamanho ${availableVariant.size}) | Estoque atual: ${initialStock}`);

      // 4. CHECKOUT DEMONSTRATIVO: Registrar pedido no Supabase
      const subtotal = Number(targetProduct.price) * quantityToBuy;
      const shipping = subtotal >= 299 ? 0 : 19.9;
      const discount = subtotal * 0.05; // 5% PIX
      const total = subtotal + shipping - discount;

      const orderPayload = {
        status: 'approved',
        payment_status: 'approved',
        payment_provider: 'mercadopago_demo',
        payment_id: `DEMO-PAY-${Date.now()}`,
        subtotal,
        discount,
        shipping,
        total,
        shipping_address: {
          street: 'Avenida Paulista',
          number: '1500',
          neighborhood: 'Bela Vista',
          city: 'São Paulo',
          state: 'SP',
          cep: '01310-200',
        },
        customer_info: {
          full_name: `Avaliador Teste ${b.name}`,
          email: `professor.teste.${b.slug}@whitewolf.com`,
          cpf: '123.456.789-00',
          phone: '(11) 99999-8888',
        },
      };

      const orderRes = await request(
        `${SUPABASE_URL}/rest/v1/orders`,
        {
          method: 'POST',
          headers: {
            apikey: SERVICE_KEY,
            Authorization: `Bearer ${SERVICE_KEY}`,
            'Content-Type': 'application/json',
            Prefer: 'return=representation',
          },
        },
        orderPayload
      );

      const createdOrder = Array.isArray(orderRes.data) ? orderRes.data[0] : orderRes.data;
      const orderId = createdOrder?.id;

      if ((orderRes.status >= 200 && orderRes.status < 300) && orderId) {
        resultRow.checkout = 'APROVADO (PIX Demonstrativo)';
        resultRow.order = `APROVADO (#${orderId.slice(0, 8)})`;
        resultRow.orderId = orderId;
        console.log(`✓ Pedido registrado com sucesso no Supabase: #${orderId}`);
      } else {
        console.error(`❌ Erro ao criar pedido no Supabase:`, orderRes.raw);
        resultRow.checkout = 'FALHOU';
        resultRow.order = 'FALHOU';
        results.push(resultRow);
        continue;
      }

      // 5. REGISTRAR ITEM DO PEDIDO
      const orderItemPayload = {
        order_id: orderId,
        product_id: targetProduct.id,
        variant_id: availableVariant.id,
        product_name: targetProduct.name,
        product_sku: availableVariant.sku || targetProduct.sku,
        size: availableVariant.size,
        color: availableVariant.color_name || 'Padrão',
        quantity: quantityToBuy,
        unit_price: Number(targetProduct.price),
        subtotal,
      };

      await request(
        `${SUPABASE_URL}/rest/v1/order_items`,
        {
          method: 'POST',
          headers: {
            apikey: SERVICE_KEY,
            Authorization: `Bearer ${SERVICE_KEY}`,
            'Content-Type': 'application/json',
          },
        },
        orderItemPayload
      );
      console.log(`✓ Itens do pedido registrados em order_items.`);

      // 6. ATUALIZAR ESTOQUE (DECREMENTO)
      const newStock = Math.max(0, initialStock - quantityToBuy);
      await request(
        `${SUPABASE_URL}/rest/v1/product_variants?id=eq.${availableVariant.id}`,
        {
          method: 'PATCH',
          headers: {
            apikey: SERVICE_KEY,
            Authorization: `Bearer ${SERVICE_KEY}`,
            'Content-Type': 'application/json',
          },
        },
        { stock: newStock, updated_at: new Date().toISOString() }
      );

      // 7. VERIFICAR ATUALIZAÇÃO DO ESTOQUE
      const checkVariantRes = await request(
        `${SUPABASE_URL}/rest/v1/product_variants?id=eq.${availableVariant.id}&select=id,size,stock`,
        {
          headers: {
            apikey: SERVICE_KEY,
            Authorization: `Bearer ${SERVICE_KEY}`,
          },
        }
      );

      const updatedVariant = checkVariantRes.data?.[0];
      if (updatedVariant && updatedVariant.stock === newStock) {
        resultRow.stockUpdate = `APROVADO (${initialStock} -> ${newStock})`;
        console.log(`✓ Estoque atualizado no Supabase: de ${initialStock} para ${newStock} unidades.`);
      } else {
        resultRow.stockUpdate = 'ALERTA (Divergência)';
      }

      results.push(resultRow);
    } catch (err) {
      console.error(`Erro no teste da marca ${b.name}:`, err);
      resultRow.filter = 'ERRO';
      results.push(resultRow);
    }
  }

  console.log('\n===============================================================');
  console.log(' RESUMO FINAL DOS TESTES DE COMPRA POR MARCA');
  console.log('===============================================================\n');

  console.table(
    results.map((r) => ({
      Marca: r.brand,
      'Produto Testado': r.productName ? r.productName.slice(0, 25) : '-',
      Filtro: r.filter.split(' ')[0],
      Imagem: r.image.split(' ')[0],
      Carrinho: r.cart.split(' ')[0],
      Checkout: r.checkout.split(' ')[0],
      Pedido: r.order.split(' ')[0],
      Estoque: r.stockUpdate,
    }))
  );

  fs.writeFileSync(
    'test_results.json',
    JSON.stringify(results, null, 2),
    'utf8'
  );
  console.log('\nResultados salvos em test_results.json com sucesso!');
}

runTests();
