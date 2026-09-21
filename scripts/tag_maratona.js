const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://tdwqrqcyhrprzijguulo.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkd3FycWN5aHJwcnppamd1dWxvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Njk2OTg0NywiZXhwIjoyMTAyNTQ1ODQ3fQ.0SeqeIUpGmUnijXR5WBHKmGUH-PcQ--GRbOiLJvBaoA';
const adminClient = createClient(SUPABASE_URL, SERVICE_KEY);

async function tagMaratona() {
  const { data: prods } = await adminClient.from('products').select('*');
  console.log('Products:', prods.map(p => ({ id: p.id, name: p.name, slug: p.slug })));
  
  if (prods && prods.length > 0) {
    // Set the first running sneaker to is_maratona = true
    const target = prods[0];
    await adminClient.from('products').update({ is_maratona: true }).eq('id', target.id);
    console.log(`Tagged ${target.name} as is_maratona = true`);
  }
}
tagMaratona();
