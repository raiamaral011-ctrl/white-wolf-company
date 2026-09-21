const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://tdwqrqcyhrprzijguulo.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkd3FycWN5aHJwcnppamd1dWxvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Njk2OTg0NywiZXhwIjoyMTAyNTQ1ODQ3fQ.0SeqeIUpGmUnijXR5WBHKmGUH-PcQ--GRbOiLJvBaoA';

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const admins = [
  {
    username: 'guillermo',
    email: 'guillermo@whitewolf.com',
    password: 'guizinho77',
    role: 'admin',
    fullName: 'Guillermo Admin'
  },
  {
    username: 'guillhermo',
    email: 'guillhermo@whitewolf.com',
    password: 'guizinho77',
    role: 'admin',
    fullName: 'Guillermo Admin'
  },
  {
    username: 'rianhenrique',
    email: 'rianhenrique@whitewolf.com',
    password: 'rianroludo',
    role: 'admin',
    fullName: 'Rian Henrique Admin'
  },
  {
    username: 'raiamaral',
    email: 'raiamaral@whitewolf.com',
    password: 'R41@m4r@1',
    role: 'master_admin',
    fullName: 'Rai Amaral Master Admin'
  }
];

async function setup() {
  console.log('Listing existing auth users...');
  const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
  if (listError) {
    console.error('List users error:', listError);
    return;
  }

  console.log(`Found ${users.length} existing users.`);

  for (const admin of admins) {
    let existingUser = users.find(u => u.email === admin.email);

    if (existingUser) {
      console.log(`Updating existing user ${admin.email} (${existingUser.id})...`);
      const { data, error } = await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
        password: admin.password,
        email_confirm: true,
        user_metadata: {
          username: admin.username,
          role: admin.role,
          full_name: admin.fullName
        }
      });
      if (error) {
        console.error(`Error updating ${admin.email}:`, error);
      } else {
        console.log(`Successfully updated ${admin.email}`);
      }

      // Upsert profile
      const { error: profErr } = await supabaseAdmin
        .from('profiles')
        .upsert({
          user_id: existingUser.id,
          role: admin.role,
          full_name: admin.fullName,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });
      
      if (profErr) console.error(`Profile error for ${admin.email}:`, profErr);
      else console.log(`Profile synced for ${admin.email}`);

    } else {
      console.log(`Creating user ${admin.email}...`);
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: admin.email,
        password: admin.password,
        email_confirm: true,
        user_metadata: {
          username: admin.username,
          role: admin.role,
          full_name: admin.fullName
        }
      });
      if (error) {
        console.error(`Error creating ${admin.email}:`, error);
      } else {
        console.log(`Successfully created ${admin.email} (${data.user.id})`);
        // Upsert profile
        const { error: profErr } = await supabaseAdmin
          .from('profiles')
          .upsert({
            user_id: data.user.id,
            role: admin.role,
            full_name: admin.fullName,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' });
        if (profErr) console.error(`Profile error for ${admin.email}:`, profErr);
        else console.log(`Profile synced for ${admin.email}`);
      }
    }
  }

  // Also create a test customer user to test customer blocking
  const customerEmail = 'cliente.teste@whitewolf.com';
  let custUser = users.find(u => u.email === customerEmail);
  if (!custUser) {
    const { data: custData, error: custErr } = await supabaseAdmin.auth.admin.createUser({
      email: customerEmail,
      password: 'clienteteste123',
      email_confirm: true,
      user_metadata: {
        username: 'clienteteste',
        role: 'customer',
        full_name: 'Cliente Teste'
      }
    });
    if (custErr) console.error('Error creating customer test:', custErr);
    else {
      console.log('Created test customer user.');
      await supabaseAdmin.from('profiles').upsert({
        user_id: custData.user.id,
        role: 'customer',
        full_name: 'Cliente Teste'
      }, { onConflict: 'user_id' });
    }
  } else {
    await supabaseAdmin.from('profiles').upsert({
      user_id: custUser.id,
      role: 'customer',
      full_name: 'Cliente Teste'
    }, { onConflict: 'user_id' });
    console.log('Test customer user profile confirmed.');
  }

  console.log('Setup finished.');
}

setup();
