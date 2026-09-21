const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://tdwqrqcyhrprzijguulo.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkd3FycWN5aHJwcnppamd1dWxvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Njk2OTg0NywiZXhwIjoyMTAyNTQ1ODQ3fQ.0SeqeIUpGmUnijXR5WBHKmGUH-PcQ--GRbOiLJvBaoA';

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function check() {
  const { data: profiles, error } = await supabaseAdmin.from('profiles').select('*');
  console.log('Profiles in DB:', profiles, 'Error:', error);

  const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
  console.log('Auth users:', usersData.users.map(u => ({ id: u.id, email: u.email, meta: u.user_metadata })));
}
check();
