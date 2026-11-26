const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

const STANDARD_SIZES = ['37', '38', '39', '40', '41', '42', '43', '44', '45'];

async function standardizeAllProducts() {
  console.log('--- Standardizing Database Product Variants to 37-45 ---');
  const { data: products, error: pErr } = await supabase.from('products').select('id, name, sku, slug');
  if (pErr) {
    console.error('Error fetching products:', pErr);
    return;
  }

  const { data: variants, error: vErr } = await supabase.from('product_variants').select('*');
  if (vErr) {
    console.error('Error fetching variants:', vErr);
    return;
  }

  console.log(`Analyzing ${products.length} products and ${variants.length} existing variants...`);

  const byProd = {};
  variants.forEach(v => {
    byProd[v.product_id] = byProd[v.product_id] || [];
    byProd[v.product_id].push(v);
  });

  const missingToInsert = [];
  let updatedProductsCount = 0;

  for (const product of products) {
    const existingVariants = byProd[product.id] || [];
    const existingSizes = new Set(existingVariants.map(v => String(v.size)));
    const baseSku = product.sku || `WW-${product.id.substring(0, 6).toUpperCase()}`;

    let addedForThisProduct = 0;
    for (const size of STANDARD_SIZES) {
      if (!existingSizes.has(size)) {
        missingToInsert.push({
          product_id: product.id,
          sku: `${baseSku}-SZ${size}`,
          size: size,
          color: '#0f172a',
          color_name: 'Padrão',
          stock: 0, // Zero fictitious stock, preserved real availability
        });
        addedForThisProduct++;
      }
    }

    if (addedForThisProduct > 0) {
      updatedProductsCount++;
    }
  }

  console.log(`Found ${missingToInsert.length} missing size variants across ${updatedProductsCount} products.`);

  if (missingToInsert.length > 0) {
    // Insert in batches of 50
    for (let i = 0; i < missingToInsert.length; i += 50) {
      const batch = missingToInsert.slice(i, i + 50);
      const { error: insErr } = await supabase.from('product_variants').insert(batch);
      if (insErr) {
        console.error('Error inserting batch:', insErr);
      } else {
        console.log(`Inserted batch ${i / 50 + 1} (${batch.length} variants)`);
      }
    }
  }

  console.log('--- Database standardization finished successfully! ---');
}

standardizeAllProducts();
