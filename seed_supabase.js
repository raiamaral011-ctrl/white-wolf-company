const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const url = 'https://tdwqrqcyhrprzijguulo.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkd3FycWN5aHJwcnppamd1dWxvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Njk2OTg0NywiZXhwIjoyMTAyNTQ1ODQ3fQ.0SeqeIUpGmUnijXR5WBHKmGUH-PcQ--GRbOiLJvBaoA';
const supabase = createClient(url, serviceKey);

function cleanSql(sql) {
  return sql
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n');
}

function parseTuples(sqlText) {
  const clean = cleanSql(sqlText);
  const valuesIndex = clean.indexOf('VALUES');
  if (valuesIndex === -1) return [];
  const body = clean.slice(valuesIndex + 6).trim();

  const tuples = [];
  let current = '';
  let inString = false;
  let inTuple = false;

  for (let i = 0; i < body.length; i++) {
    const char = body[i];
    if (char === "'" && body[i - 1] !== '\\') {
      inString = !inString;
      current += char;
    } else if (char === '(' && !inString) {
      inTuple = true;
      current = '';
    } else if (char === ')' && !inString && inTuple) {
      inTuple = false;
      tuples.push(current);
      current = '';
    } else if (inTuple) {
      current += char;
    }
  }
  return tuples;
}

function parseSqlVal(v) {
  if (v === undefined || v === null) return null;
  v = String(v).trim();
  if (v === 'NULL' || v === 'null') return null;
  if (v === 'true' || v === 'TRUE') return true;
  if (v === 'false' || v === 'FALSE') return false;
  if (v.startsWith("'") && v.endsWith("'")) {
    return v.slice(1, -1).replace(/''/g, "'");
  }
  const num = Number(v);
  return isNaN(num) ? v : num;
}

function splitTupleParts(t) {
  const parts = [];
  let cur = '';
  let str = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (c === "'" && t[i - 1] !== '\\') str = !str;
    if (c === ',' && !str) {
      parts.push(parseSqlVal(cur));
      cur = '';
    } else {
      cur += c;
    }
  }
  parts.push(parseSqlVal(cur));
  return parts;
}

async function runSeed() {
  const seedPath = path.join(process.cwd(), 'supabase', 'seed', 'seed.sql');
  const rawSql = fs.readFileSync(seedPath, 'utf8');

  // 1. PRODUCTS
  const prodMatch = rawSql.match(/INSERT INTO products \([^)]+\) VALUES([\s\S]+?);/);
  if (prodMatch) {
    const tuples = parseTuples(prodMatch[0]);
    const prodRows = tuples
      .map((t) => {
        const parts = splitTupleParts(t);
        return {
          id: parts[0],
          brand_id: parts[1],
          category_id: parts[2],
          name: parts[3],
          slug: parts[4],
          description: parts[5],
          sku: parts[6],
          price: parts[7],
          compare_at_price: parts[8],
          gender: parts[9],
          sport: parts[10],
          featured: parts[11],
          is_new: parts[12],
          is_sale: parts[13],
          rating: parts[14],
          review_count: parts[15],
        };
      })
      .filter((p) => typeof p.id === 'string' && p.id.includes('-'));

    console.log('Inserting', prodRows.length, 'clean product rows...');
    const { error: pErr } = await supabase.from('products').upsert(prodRows);
    if (pErr) console.error('Product insert error:', pErr);
    else console.log('✓ 50 Products seeded in Supabase successfully!');
  }

  // 2. IMAGES
  const imgMatch = rawSql.match(/INSERT INTO product_images \([^)]+\) VALUES([\s\S]+?);/);
  if (imgMatch) {
    const tuples = parseTuples(imgMatch[0]);
    const imgRows = tuples
      .map((t) => {
        const parts = splitTupleParts(t);
        return {
          product_id: parts[0],
          url: parts[1],
          alt: parts[2],
          sort_order: parts[3],
        };
      })
      .filter((i) => typeof i.product_id === 'string' && i.product_id.includes('-'));

    console.log('Inserting', imgRows.length, 'clean image rows...');
    const { error: iErr } = await supabase.from('product_images').insert(imgRows);
    if (iErr) console.error('Images insert error:', iErr);
    else console.log('✓ Product images seeded in Supabase successfully!');
  }

  // 3. VARIANTS
  const varMatch = rawSql.match(/INSERT INTO product_variants \([^)]+\) VALUES([\s\S]+?);/);
  if (varMatch) {
    const tuples = parseTuples(varMatch[0]);
    const varRows = tuples
      .map((t) => {
        const parts = splitTupleParts(t);
        return {
          product_id: parts[0],
          sku: parts[1],
          size: parts[2],
          color: parts[3],
          color_name: parts[4],
          stock: parts[5],
        };
      })
      .filter((v) => typeof v.product_id === 'string' && v.product_id.includes('-'));

    console.log('Inserting', varRows.length, 'clean variant rows...');
    const { error: vErr } = await supabase.from('product_variants').insert(varRows);
    if (vErr) console.error('Variants insert error:', vErr);
    else console.log('✓ Product variants seeded in Supabase successfully!');
  }
}

runSeed();
