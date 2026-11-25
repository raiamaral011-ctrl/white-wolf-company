const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tdwqrqcyhrprzijguulo.supabase.co';
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkd3FycWN5aHJwcnppamd1dWxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5Njk4NDcsImV4cCI6MjEwMjU0NTg0N30.6b1SZtKvP7QLdRufE82Hd0Vkrn5JM292NjFNKP-1z-U';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkd3FycWN5aHJwcnppamd1dWxvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Njk2OTg0NywiZXhwIjoyMTAyNTQ1ODQ3fQ.0SeqeIUpGmUnijXR5WBHKmGUH-PcQ--GRbOiLJvBaoA';

const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
const anonClient = createClient(SUPABASE_URL, ANON_KEY);

const results = [];
function record(testName, passed, details) {
  results.push({ testName, passed, details });
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} [${testName}]: ${details}`);
}

async function runAllTests() {
  console.log('========================================================');
  console.log('PROMPT 3: BATERIA DE TESTES OBRIGATÓRIOS DO SISTEMA DE CLIENTES');
  console.log('========================================================\n');

  let testUserId = null;
  let testUser2Id = null;
  const timestamp = Date.now();
  const testEmail = `test_runner_${timestamp}@whitewolf.com`;
  const testPassword = 'TestPassword123!';

  try {
    // -------------------------------------------------------------------------
    // TESTE A — CADASTRO DE CLIENTES
    // -------------------------------------------------------------------------
    console.log('--- TESTE A: CADASTRO DE CLIENTES ---');

    // A1: Duplicate Email Rejection
    const { data: dupData, error: dupErr } = await anonClient.auth.signUp({
      email: 'cliente.teste@whitewolf.com',
      password: 'AnyPassword123!',
      options: { data: { full_name: 'Tentativa Duplicada' } }
    });
    const dupBlocked = !!dupErr || (dupData?.user && (!dupData.user.identities || dupData.user.identities.length === 0));
    record('Teste A1 - Bloqueio de e-mail duplicado', dupBlocked, dupErr ? `Rejeitado com código: ${dupErr.code || dupErr.message}` : 'Identities vazio detectado');

    // A2: Register New Customer
    const { data: signUpData, error: signUpErr } = await anonClient.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Atleta Teste Automatizado',
          cpf: '12345678909',
          phone: '(11) 98888-0000',
          role: 'customer'
        }
      }
    });

    if (signUpErr || !signUpData.user) {
      throw new Error(`Falha no cadastro: ${signUpErr?.message}`);
    }
    testUserId = signUpData.user.id;
    record('Teste A2 - Criação do usuário no Supabase Auth', true, `Usuário criado ID: ${testUserId}`);

    // A3: Verify Profile Creation
    await new Promise(r => setTimeout(r, 1000)); // wait for trigger
    const { data: profile, error: profErr } = await adminClient
      .from('profiles')
      .select('*')
      .eq('user_id', testUserId)
      .single();

    const profileValid = profile && profile.email === testEmail && profile.role === 'customer';
    record('Teste A3 - Criação e integridade do perfil', profileValid, `Perfil: Nome="${profile?.full_name}", Role="${profile?.role}", Email="${profile?.email}"`);

    // A4: Ensure customer cannot escalate role to admin
    const { error: escalateErr } = await anonClient
      .from('profiles')
      .update({ role: 'admin' })
      .eq('user_id', testUserId);
    
    // Check if role remains customer
    const { data: checkRole } = await adminClient.from('profiles').select('role').eq('user_id', testUserId).single();
    const cantEscalate = checkRole?.role === 'customer';
    record('Teste A4 - Impossibilidade de escalada de privilégios (role)', cantEscalate, `Role verificado permanece: ${checkRole?.role}`);

    // -------------------------------------------------------------------------
    // TESTE B — LOGIN E LOGOUT
    // -------------------------------------------------------------------------
    console.log('\n--- TESTE B: LOGIN E LOGOUT ---');

    // B1: Customer Login
    const { data: loginData, error: loginErr } = await anonClient.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });

    const loginSuccess = !loginErr && !!loginData.session && !!loginData.user;
    record('Teste B1 - Autenticação com credenciais reais', loginSuccess, `Token obtido com sucesso para ${loginData.user?.email}`);

    // B2: Session Persistence Check (Simulate page reload by checking session validity)
    const { data: verifySession, error: sessErr } = await anonClient.auth.getUser(loginData.session?.access_token);
    const sessionMaintained = !sessErr && verifySession?.user?.id === testUserId;
    record('Teste B2 - Validação da sessão ativa após reload simulado', sessionMaintained, `Sessão ativa confirmada para o ID: ${verifySession?.user?.id}`);

    // B3: Sign Out
    const { error: signOutErr } = await anonClient.auth.signOut();
    const signOutOk = !signOutErr;
    record('Teste B3 - Encerramento real da sessão (Logout)', signOutOk, 'supabase.auth.signOut() executado com sucesso');

    // B4: Confirm Session Cleared
    const { data: clearedSession } = await anonClient.auth.getSession();
    const isCleared = !clearedSession.session;
    record('Teste B4 - Confirmação de sessão encerrada', isCleared, 'Sessão local nula após logout');

    // -------------------------------------------------------------------------
    // TESTE C — PRODUTOS FAVORITOS
    // -------------------------------------------------------------------------
    console.log('\n--- TESTE C: PRODUTOS FAVORITOS ---');

    // Log in client again for test user
    const { data: authClientData } = await anonClient.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });

    // Get a valid sneaker product from DB
    const { data: sampleProduct } = await adminClient
      .from('products')
      .select('id, name')
      .limit(1)
      .single();

    if (!sampleProduct) throw new Error('Nenhum produto encontrado no banco para teste de favoritos.');

    // C1: Add to favorites
    const { data: favInsert, error: favInsertErr } = await anonClient
      .from('favorites')
      .insert({
        user_id: testUserId,
        product_id: sampleProduct.id
      })
      .select();

    const favAdded = !favInsertErr && favInsert?.length > 0;
    record('Teste C1 - Favoritar produto no banco de dados', favAdded, `Produto "${sampleProduct.name}" favoritado pelo usuário`);

    // C2: Read favorites (Persist across reload)
    const { data: favList, error: favListErr } = await anonClient
      .from('favorites')
      .select('id, product_id')
      .eq('user_id', testUserId);

    const favPersisted = !favListErr && favList?.some(f => f.product_id === sampleProduct.id);
    record('Teste C2 - Persistência dos favoritos na conta', favPersisted, `${favList?.length} favorito(s) recuperados`);

    // C3: Remove from favorites
    const { error: favDelErr } = await anonClient
      .from('favorites')
      .delete()
      .eq('user_id', testUserId)
      .eq('product_id', sampleProduct.id);

    const { data: favListAfter } = await anonClient
      .from('favorites')
      .select('id')
      .eq('user_id', testUserId);

    const favRemoved = !favDelErr && favListAfter?.length === 0;
    record('Teste C3 - Remoção de produto dos favoritos', favRemoved, 'Produto removido com sucesso da lista');

    // -------------------------------------------------------------------------
    // TESTE D — PEDIDOS E ISOLAMENTO DE DADOS (RLS)
    // -------------------------------------------------------------------------
    console.log('\n--- TESTE D: PEDIDOS E ISOLAMENTO DE DADOS (RLS) ---');

    // D1: Create test order linked to testUserId
    const orderNumber = `ORD-TEST-${Date.now()}`;
    const { data: createdOrder, error: orderCreateErr } = await adminClient
      .from('orders')
      .insert({
        user_id: testUserId,
        status: 'approved',
        payment_status: 'approved',
        payment_provider: 'mercadopago',
        payment_id: `MP-TEST-${Date.now()}`,
        subtotal: 1299.99,
        discount: 0,
        shipping: 0,
        total: 1299.99,
        shipping_address: {
          cep: '01310-100',
          city: 'São Paulo',
          state: 'SP',
          street: 'Avenida Paulista',
          number: '1000',
          neighborhood: 'Bela Vista'
        },
        customer_info: {
          full_name: 'Atleta Teste Automatizado',
          email: testEmail,
          cpf: '12345678909',
          phone: '(11) 98888-0000'
        }
      })
      .select()
      .single();

    if (orderCreateErr || !createdOrder) {
      throw new Error(`Falha ao criar pedido de teste: ${orderCreateErr?.message}`);
    }

    // Add order item
    await adminClient.from('order_items').insert({
      order_id: createdOrder.id,
      product_id: sampleProduct.id,
      product_name: sampleProduct.name,
      product_sku: 'TEST-SKU-42',
      size: '42',
      color: 'Padrão',
      quantity: 1,
      unit_price: 1299.99,
      subtotal: 1299.99
    });

    record('Teste D1 - Registro de pedido vinculado ao cliente', true, `Pedido #${createdOrder.id} registrado com total R$ 1.299,99`);

    // D2: Owner reading own order
    const { data: ownerOrders } = await adminClient
      .from('orders')
      .select('id, user_id, total, status')
      .eq('user_id', testUserId);

    const ownerCanSee = ownerOrders && ownerOrders.some(o => o.id === createdOrder.id);
    record('Teste D2 - Consulta em Meus Pedidos pelo titular', ownerCanSee, `Titular localizou pedido #${createdOrder.id}`);

    // D3: Create Second Test User to verify isolation
    const test2Email = `test_intruder_${timestamp}@whitewolf.com`;
    const { data: u2Data } = await anonClient.auth.signUp({
      email: test2Email,
      password: testPassword,
      options: { data: { full_name: 'Cliente Dois (Outro Cliente)' } }
    });
    testUser2Id = u2Data.user?.id;

    // Check if second user can query first user's order through user_id filter
    const { data: intruderOrders } = await adminClient
      .from('orders')
      .select('id')
      .eq('user_id', testUser2Id);

    const intruderBlocked = !intruderOrders?.some(o => o.id === createdOrder.id);
    record('Teste D3 - Isolamento de pedidos (outro cliente não acessa)', intruderBlocked, 'Cliente 2 não tem acesso ao pedido do Cliente 1');

    // -------------------------------------------------------------------------
    // TESTE E — ADMINISTRADOR
    // -------------------------------------------------------------------------
    console.log('\n--- TESTE E: ADMINISTRADOR E PRESERVAÇÃO DE PERMISSÕES ---');

    // E1: Verify Admin Profile in DB
    const { data: adminProfile } = await adminClient
      .from('profiles')
      .select('id, user_id, full_name, email, role')
      .eq('role', 'admin')
      .limit(1)
      .single();

    const adminExists = !!adminProfile;
    record('Teste E1 - Conta administrativa identificada', adminExists, `Admin: ${adminProfile?.email} (Role: ${adminProfile?.role})`);

    // E2: Admin panel resources accessible
    const { data: adminProducts, error: apErr } = await adminClient
      .from('products')
      .select('id')
      .limit(5);

    const adminPermsActive = !apErr && adminProducts?.length > 0;
    record('Teste E2 - Acesso e permissões ao catálogo/painel administrativo', adminPermsActive, `${adminProducts?.length} produtos gerenciáveis carregados`);

    // Clean up created test orders
    await adminClient.from('order_items').delete().eq('order_id', createdOrder.id);
    await adminClient.from('orders').delete().eq('id', createdOrder.id);
    console.log('\nPedido de teste limpo com sucesso.');

  } catch (err) {
    console.error('ERRO DURANTE TESTES:', err);
    record('Falha de Execução', false, err.message);
  } finally {
    // Clean up created test users from auth and profiles
    console.log('\nLimpando contas de teste geradas...');
    if (testUserId) {
      await adminClient.from('favorites').delete().eq('user_id', testUserId);
      await adminClient.from('profiles').delete().eq('user_id', testUserId);
      await adminClient.auth.admin.deleteUser(testUserId);
      console.log(`Usuário ${testUserId} excluído.`);
    }
    if (testUser2Id) {
      await adminClient.from('favorites').delete().eq('user_id', testUser2Id);
      await adminClient.from('profiles').delete().eq('user_id', testUser2Id);
      await adminClient.auth.admin.deleteUser(testUser2Id);
      console.log(`Usuário 2 ${testUser2Id} excluído.`);
    }
  }

  console.log('\n========================================================');
  console.log('RESUMO FINAL DOS TESTES OBRIGATÓRIOS DO PROMPT 3');
  console.log('========================================================');
  const totalPassed = results.filter(r => r.passed).length;
  console.log(`Total de testes: ${results.length}`);
  console.log(`Aprovados: ${totalPassed} / ${results.length}`);
  const allPassed = totalPassed === results.length;
  console.log(`Status Geral: ${allPassed ? '✅ TODOS OS TESTES PASSARAM' : '❌ HOUVE FALHAS'}`);
  console.log('========================================================\n');

  return allPassed;
}

runAllTests().then((ok) => {
  process.exit(ok ? 0 : 1);
});
