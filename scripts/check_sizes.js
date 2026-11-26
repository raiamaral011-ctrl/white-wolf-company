const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function run() {
  const { data: products, error: pErr } = await supabase.from('products').select('id, name, slug');
  if (pErr) {
    console.error('Error fetching products:', pErr);
    return;
  }
  console.log(`Total products in DB: ${products.length}`);

  const { data: variants, error: vErr } = await supabase.from('product_variants').select('product_id, size, stock');
  if (vErr) {
    console.error('Error fetching variants:', vErr);
    return;
  }

  const counts = {};
  const perProduct = {};
  variants.forEach(v => {
    counts[v.size] = (counts[v.size] || 0) + 1;
    if (!perProduct[v.product_id]) perProduct[v.product_id] = new Set();
    perProduct[v.product_id].add(v.size);
  });

  console.log('Variants count by size:', counts);

  const missing37 = products.filter(p => !perProduct[p.id] || !perProduct[p.id].has('37'));
  console.log(`Products missing size 37: ${missing37.length}`);
  if (missing37.length > 0) {
    console.log('Sample missing 37:', missing37.slice(0, 5));
  }
}

run();
