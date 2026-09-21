const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://tdwqrqcyhrprzijguulo.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkd3FycWN5aHJwcnppamd1dWxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5Njk4NDcsImV4cCI6MjEwMjU0NTg0N30.6b1SZtKvP7QLdRufE82Hd0Vkrn5JM292NjFNKP-1z-U';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkd3FycWN5aHJwcnppamd1dWxvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Njk2OTg0NywiZXhwIjoyMTAyNTQ1ODQ3fQ.0SeqeIUpGmUnijXR5WBHKmGUH-PcQ--GRbOiLJvBaoA';

const client = createClient(SUPABASE_URL, ANON_KEY);
const adminClient = createClient(SUPABASE_URL, SERVICE_KEY);

async function runTests() {
  console.log('=== TEST 1: Admin 1 (guillermo / guizinho77) Supabase Auth Login ===');
  const { data: a1, error: e1 } = await client.auth.signInWithPassword({
    email: 'guillermo@whitewolf.com',
    password: 'guizinho77'
  });
  if (e1) {
    console.error('FAIL guillermo login:', e1.message);
  } else {
    console.log('SUCCESS guillermo login! User ID:', a1.user.id);
    const { data: prof } = await client.from('profiles').select('*').eq('user_id', a1.user.id).single();
    console.log('Profile role:', prof?.role);
  }

  console.log('\n=== TEST 2: Admin 2 (rianhenrique / rianroludo) Supabase Auth Login ===');
  const { data: a2, error: e2 } = await client.auth.signInWithPassword({
    email: 'rianhenrique@whitewolf.com',
    password: 'rianroludo'
  });
  if (e2) {
    console.error('FAIL rianhenrique login:', e2.message);
  } else {
    console.log('SUCCESS rianhenrique login! User ID:', a2.user.id);
    const { data: prof } = await client.from('profiles').select('*').eq('user_id', a2.user.id).single();
    console.log('Profile role:', prof?.role);
  }

  console.log('\n=== TEST 3: Common User (cliente.teste / clienteteste123) Login & Role Check ===');
  const { data: c1, error: ec1 } = await client.auth.signInWithPassword({
    email: 'cliente.teste@whitewolf.com',
    password: 'clienteteste123'
  });
  if (ec1) {
    console.error('FAIL customer login:', ec1.message);
  } else {
    console.log('SUCCESS customer login! User ID:', c1.user.id);
    const { data: prof } = await client.from('profiles').select('*').eq('user_id', c1.user.id).single();
    console.log('Profile role:', prof?.role, '(Expected: customer)');
  }

  console.log('\n=== TEST 4: Verifying Maratona and Sneakers Products in DB ===');
  const { data: prods, count } = await adminClient
    .from('products')
    .select('id, name, slug, price, is_maratona', { count: 'exact' });
  console.log(`Total Products: ${prods?.length}`);
  const maratonaProds = prods?.filter(p => p.is_maratona);
  console.log(`Maratona Products (${maratonaProds?.length}):`, maratonaProds?.map(p => p.name));

  console.log('\n=== TEST 5: Verifying Home Sections in DB ===');
  const { data: sections } = await adminClient
    .from('home_sections')
    .select('id, type, title, subtitle, is_active, display_order')
    .order('display_order', { ascending: true });
  console.log(`Active Home Sections (${sections?.length}):`);
  sections?.forEach(s => console.log(` - [${s.display_order}] ${s.type}: "${s.title}" (Active: ${s.is_active})`));
}

runTests();
