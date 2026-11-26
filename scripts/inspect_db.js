const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function check() {
  const { data: products, error: pErr } = await supabase.from('products').select('id, name, slug');
  const { data: variants, error: vErr } = await supabase.from('product_variants').select('id, product_id, size, stock, sku');
  
  if (pErr) console.error('Error fetching products:', pErr);
  if (vErr) console.error('Error fetching variants:', vErr);

  console.log('Total products:', products ? products.length : 0);
  console.log('Total variants:', variants ? variants.length : 0);

  const byProd = {};
  variants?.forEach(v => {
    byProd[v.product_id] = byProd[v.product_id] || [];
    byProd[v.product_id].push(v);
  });

  products?.forEach(p => {
    const vars = byProd[p.id] || [];
    vars.sort((a,b) => Number(a.size) - Number(b.size));
    console.log(`${p.name} (${p.slug}):`);
    console.log('  Tamanhos:', vars.map(v => `${v.size}: estoque ${v.stock}`).join(' | '));
  });
}

check();
