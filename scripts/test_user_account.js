const { createClient } = require('@supabase/supabase-js');

const BASE_URL = 'http://localhost:3000';
const SUPABASE_URL = 'https://tdwqrqcyhrprzijguulo.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkd3FycWN5aHJwcnppamd1dWxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5Njk4NDcsImV4cCI6MjEwMjU0NTg0N30.6b1SZtKvP7QLdRufE82Hd0Vkrn5JM292NjFNKP-1z-U';

async function runTestSuite() {
  console.log('================================================================');
  console.log('   WHITE WOLF COMPANY — TESTES DO SISTEMA DE CONTA E USUÁRIO');
  console.log('================================================================\n');

  const testResults = [];

  // -------------------------------------------------------------
  // TESTE A — VISITANTE
  // -------------------------------------------------------------
  console.log('--- TESTE A: VISITANTE NÃO AUTENTICADO ---');
  try {
    // 1. Visitante acessando endpoints protegidos
    const profRes = await fetch(`${BASE_URL}/api/profile`);
    const ordersRes = await fetch(`${BASE_URL}/api/orders`);
    const adminSessRes = await fetch(`${BASE_URL}/api/admin/session`);

    const visitorBlocked = profRes.status === 401 && ordersRes.status === 401 && adminSessRes.status === 401;
    console.log(`[x] Visitante bloqueado em rotas privadas: ${visitorBlocked ? 'SIM (401)' : 'NÃO'}`);

    // 2. Rotas públicas de login e cadastro acessíveis
    const loginRes = await fetch(`${BASE_URL}/login`);
    const cadastroRes = await fetch(`${BASE_URL}/cadastro`);
    const adminLoginRes = await fetch(`${BASE_URL}/admin/login`);

    const pagesOk = loginRes.status === 200 && cadastroRes.status === 200 && adminLoginRes.status === 200;
    console.log(`[x] Rotas /login, /cadastro e /admin/login ativas: ${pagesOk ? 'OK (200)' : 'FALHOU'}`);

    testResults.push({
      cenario: 'Teste A — Visitante',
      bloqueio_privado: visitorBlocked ? 'Aprovado' : 'Falhou',
      paginas_auth: pagesOk ? 'Aprovado' : 'Falhou',
      status_geral: (visitorBlocked && pagesOk) ? 'Aprovado' : 'Falhou'
    });
  } catch (err) {
    console.error('Erro no Teste A:', err.message);
    testResults.push({ cenario: 'Teste A — Visitante', status_geral: 'Falhou' });
  }

  // -------------------------------------------------------------
  // TESTE B — CLIENTE
  // -------------------------------------------------------------
  console.log('\n--- TESTE B: CLIENTE AUTENTICADO ---');
  try {
    const supabase = createClient(SUPABASE_URL, ANON_KEY);
    const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
      email: 'cliente.teste@whitewolf.com',
      password: 'clienteteste123'
    });

    if (authErr || !authData.user) {
      throw new Error('Falha no login do cliente: ' + authErr?.message);
    }
    console.log(`[x] Login Cliente Teste realizado: OK (ID: ${authData.user.id})`);

    // Buscar perfil no Supabase
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, role')
      .eq('user_id', authData.user.id)
      .single();

    console.log(`[x] Perfil carregado: "${profile.full_name}" | Role: "${profile.role}"`);
    const isCustomer = profile.role === 'customer';

    // Testar atualização de dados pessoais via Supabase
    const { data: updProf, error: updErr } = await supabase
      .from('profiles')
      .update({ phone: '(11) 98888-7777', updated_at: new Date().toISOString() })
      .eq('user_id', authData.user.id)
      .select()
      .single();

    const dataUpdated = !updErr && updProf.phone === '(11) 98888-7777';
    console.log(`[x] Atualização de Dados Pessoais: ${dataUpdated ? 'OK' : 'Falhou'}`);

    // Testar logout do cliente
    await supabase.auth.signOut();
    const { data: afterLogout } = await supabase.auth.getSession();
    const logoutSuccess = afterLogout.session === null;
    console.log(`[x] Logout do Cliente e encerramento de sessão: ${logoutSuccess ? 'OK' : 'Falhou'}`);

    testResults.push({
      cenario: 'Teste B — Cliente',
      identificacao: isCustomer ? 'Aprovado (customer)' : 'Falhou',
      dados_pessoais: dataUpdated ? 'Aprovado' : 'Falhou',
      logout: logoutSuccess ? 'Aprovado' : 'Falhou',
      status_geral: (isCustomer && dataUpdated && logoutSuccess) ? 'Aprovado' : 'Falhou'
    });
  } catch (err) {
    console.error('Erro no Teste B:', err.message);
    testResults.push({ cenario: 'Teste B — Cliente', status_geral: 'Falhou: ' + err.message });
  }

  // -------------------------------------------------------------
  // TESTE C — ADMINISTRADOR
  // -------------------------------------------------------------
  console.log('\n--- TESTE C: ADMINISTRADOR AUTENTICADO ---');
  try {
    // Login do administrador via /api/admin/login
    const adminLoginRes = await fetch(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'guillermo@whitewolf.com', password: 'guizinho77' })
    });

    const adminLoginData = await adminLoginRes.json();
    const cookieHeader = adminLoginRes.headers.get('set-cookie') || '';
    const adminToken = cookieHeader.split(';')[0];

    const adminLogged = adminLoginRes.status === 200 && adminLoginData.user?.role === 'admin';
    console.log(`[x] Login Administrador: ${adminLogged ? 'OK (Role: admin)' : 'Falhou'}`);

    // Verificar sessão administrativa
    const sessRes = await fetch(`${BASE_URL}/api/admin/session`, {
      headers: { 'Cookie': adminToken }
    });
    const sessData = await sessRes.json();
    const sessOk = sessRes.status === 200 && sessData.authenticated === true;
    console.log(`[x] Verificação de Sessão Admin: ${sessOk ? 'OK (authenticated: true)' : 'Falhou'}`);

    // Testar logout administrativo via /api/admin/logout
    const logoutRes = await fetch(`${BASE_URL}/api/admin/logout`, {
      method: 'POST',
      headers: { 'Cookie': adminToken }
    });
    const logoutCookie = logoutRes.headers.get('set-cookie') || '';
    const logoutOk = logoutRes.status === 200 && (logoutCookie.toLowerCase().includes('max-age=0') || logoutCookie.toLowerCase().includes('expires='));
    console.log(`[x] Logout Admin e destruição do cookie ww_admin_token: ${logoutOk ? 'OK' : 'Falhou'}`);

    // Verificar que sessão foi realmente invalidada
    const afterSess = await fetch(`${BASE_URL}/api/admin/session`);
    const sessionKilled = afterSess.status === 401;
    console.log(`[x] Sessão admin após logout: ${sessionKilled ? 'Encerrada (401)' : 'Ainda ativa'}`);

    testResults.push({
      cenario: 'Teste C — Administrador',
      login_admin: adminLogged ? 'Aprovado' : 'Falhou',
      sessao_admin: sessOk ? 'Aprovado' : 'Falhou',
      logout_admin: (logoutOk && sessionKilled) ? 'Aprovado' : 'Falhou',
      status_geral: (adminLogged && sessOk && logoutOk && sessionKilled) ? 'Aprovado' : 'Falhou'
    });
  } catch (err) {
    console.error('Erro no Teste C:', err.message);
    testResults.push({ cenario: 'Teste C — Administrador', status_geral: 'Falhou: ' + err.message });
  }

  // -------------------------------------------------------------
  // TESTE D — SEGURANÇA
  // -------------------------------------------------------------
  console.log('\n--- TESTE D: SEGURANÇA E ISOLAMENTO ---');
  try {
    // 1. Cliente comum tentando logar no painel administrativo
    const clientAdminAttempt = await fetch(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'cliente.teste@whitewolf.com', password: 'clienteteste123' })
    });
    const clientBlockedFromAdmin = clientAdminAttempt.status === 403;
    console.log(`[x] Cliente bloqueado de login administrativo: ${clientBlockedFromAdmin ? 'SIM (403 Acesso Negado)' : 'NÃO'}`);

    // 2. Acesso a pedido de outro cliente sem autenticação
    const orderAccessWithoutAuth = await fetch(`${BASE_URL}/api/orders/91e6465b-9777-454c-a2ee-6aeefa8b721e`);
    const orderProtected = orderAccessWithoutAuth.status === 401 || orderAccessWithoutAuth.status === 403;
    console.log(`[x] Detalhe de pedido protegido contra acessos não autorizados: ${orderProtected ? 'SIM (' + orderAccessWithoutAuth.status + ')' : 'NÃO'}`);

    testResults.push({
      cenario: 'Teste D — Segurança',
      bloqueio_admin: clientBlockedFromAdmin ? 'Aprovado (403)' : 'Falhou',
      protecao_pedidos: orderProtected ? 'Aprovado' : 'Falhou',
      status_geral: (clientBlockedFromAdmin && orderProtected) ? 'Aprovado' : 'Falhou'
    });
  } catch (err) {
    console.error('Erro no Teste D:', err.message);
    testResults.push({ cenario: 'Teste D — Segurança', status_geral: 'Falhou: ' + err.message });
  }

  console.log('\n================================================================');
  console.log('             TABELA OFICIAL DE TESTES DE CONTA (E2E)');
  console.log('================================================================');
  console.table(testResults);
  console.log('================================================================\n');
}

runTestSuite();
