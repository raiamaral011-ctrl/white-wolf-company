const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://tdwqrqcyhrprzijguulo.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkd3FycWN5aHJwcnppamd1dWxvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Njk2OTg0NywiZXhwIjoyMTAyNTQ1ODQ3fQ.0SeqeIUpGmUnijXR5WBHKmGUH-PcQ--GRbOiLJvBaoA';
const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function addRai() {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: 'raiamaral@whitewolf.com',
    password: 'R41@m4r@1',
    email_confirm: true,
    user_metadata: {
      username: 'raiamaral',
      role: 'admin',
      full_name: 'Rai Amaral Master Admin'
    }
  });
  console.log('Rai result:', data, error);
}
addRai();
