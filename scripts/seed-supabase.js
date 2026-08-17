const https = require('https');
const fs = require('fs');
const path = require('path');

const token = 'sbp_058701faa437bdf4e52109979b1d180e5058b28d';
const projectRef = 'tdwqrqcyhrprzijguulo';

function runSql(query) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query });
    const req = https.request({
      hostname: 'api.supabase.com',
      path: '/v1/projects/' + projectRef + '/database/query',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let chunks = '';
      res.on('data', chunk => chunks += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(chunks) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: chunks });
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  const seedPath = path.join(__dirname, '..', 'supabase', 'seed', 'seed.sql');
  let seedContent = fs.readFileSync(seedPath, 'utf-8');

  // Fix product 14 ID
  seedContent = seedContent.replace(
    `('a1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002', 'Camiseta Dri-FIT Legend Pro'`,
    `('a1000000-0000-0000-0000-000000000014', 'b1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002', 'Camiseta Dri-FIT Legend Pro'`
  );

  fs.writeFileSync(seedPath, seedContent, 'utf-8');

  console.log('Sending seed.sql to Supabase database...');
  const res = await runSql(seedContent);
  console.log('Seed response status:', res.status, JSON.stringify(res.data || res.raw));

  console.log('Fetching database stats...');
  const check = await runSql(`
    SELECT 
      (SELECT count(*) FROM brands) as brands_count,
      (SELECT count(*) FROM categories) as categories_count,
      (SELECT count(*) FROM products) as products_count,
      (SELECT count(*) FROM product_images) as images_count,
      (SELECT count(*) FROM product_variants) as variants_count;
  `);
  console.log('Database Stats:', JSON.stringify(check.data || check.raw));
}

main().catch(console.error);
