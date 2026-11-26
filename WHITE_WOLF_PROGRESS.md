# WHITE WOLF COMPANY — REGISTRO DE PROGRESSO (PROMPTS 1, 2, 3, 4 & 5)
> **Arquivo Oficial de Acompanhamento e Continuidade de Tarefas**
> Atualizado em: 26/11/2026
> Status: PROMPTS 1, 2, 3, 4 E 5 EXECUTADOS COM SUCESSO

---

## 1. Pontos de Restauração & Estado do Git
- **Pontos de Restauração Salvos:**
  - `backup-before-prompt-1` (Tag e branch `backup/pre-prompt-1`)
  - `backup-before-prompt-2` (Tag e branch `backup/pre-prompt-2`)
  - `backup-before-prompt-3` (Tag e branch `backup/pre-prompt-3`)
  - `backup-before-prompt-4` (Tag e branch `backup/pre-prompt-4`)
  - `backup-before-prompt-5` (Tag e branch `backup/pre-prompt-5`)
- **Ambientes Conectados e Operacionais:**
  - GitHub: `raiamaral011-ctrl/white-wolf-company` (Branch `main`)
  - Supabase: `white-wolf-company` (`tdwqrqcyhrprzijguulo`) - `ACTIVE_HEALTHY`
  - Vercel: `https://white-wolf-company-758y.vercel.app`

---

## 2. Detalhamento da Execução do Prompt 4

### 2.1 Remoção da Seleção de Numeração ao Passar o Mouse nos Cards (Item 12)
- **Componente:** `components/product/ProductCard.tsx`
- **Modificações:**
  - Remoção completa do painel flutuante que aparecia em hover com o texto `"NUMERAÇÃO MASCULINA:"`, botões de tamanho e botão `"ADICIONAR AO CARRINHO"`.
  - A imagem dos tênis agora permanece limpa e desobstruída.
  - O carrossel de fotos individuais (setas laterais circulares e indicadores de pontos) continua funcionando perfeitamente.
  - O botão de favoritos (coração) continua ativo e persistindo no banco de dados.
  - O card redireciona de forma limpa para a página de detalhes do tênis (`/produto/[slug]`).

### 2.2 Padronização da Numeração de Todos os Tênis (37 a 45) (Item 13)
- **Banco de Dados (Supabase):**
  - Script executado em todos os produtos existentes no banco: todas as variantes faltantes no intervalo 37..45 foram cadastradas com estoque real `0` (sem criar estoque fictício).
  - Todos os 58 produtos cadastrados possuem variantes completas e ordenadas de 37 a 45.
- **Página de Detalhes do Produto (`app/produto/[slug]/page.tsx`):**
  - Sequência estrita e crescente de 37 a 45 (`STANDARD_SHOE_SIZES = ['37', '38', '39', '40', '41', '42', '43', '44', '45']`).
  - Tamanhos sem estoque aparecem com indicador tachado (*line-through*), desabilitados para seleção e compra.
  - Apenas tamanhos com estoque positivo (`stock > 0`) podem ser adicionados ao carrinho.
  - O tamanho padrão selecionado é automaticamente o primeiro número com estoque disponível.
- **Painel Administrativo (`app/admin/produtos/novo/page.tsx` e `app/admin/produtos/[id]/page.tsx`):**
  - Grade automática de 37 a 45 pronta para o administrador.
  - Cada numeração possui chave de disponibilidade (*toggle* Ativo/Inativo) e campo de quantidade em estoque.
  - Botões de conveniência *"Ativar Todos"* e *"Desativar Todos"*.
  - Ao salvar ou editar o produto, a disponibilidade e os estoques de cada tamanho são persistidos de forma segura no Supabase.
- **Carrinho e Checkout:**
  - Carrinho atualizado exibindo Imagem, Nome do tênis, Marca, Tamanho escolhido, Quantidade, Preço Unitário, Subtotal e Valor Total.
  - Checkout valida produto, tamanho, estoque e recalcula todos os preços no servidor a partir do banco.

### 2.3 Integração Oficial Mercado Pago (Checkout Pro & Webhook)
- **Biblioteca Centralizada:** `lib/mercadopago/client.ts`
  - Utilização do SDK oficial `mercadopago` (versão 2.3.0).
  - Suporte flexível às variáveis de ambiente oficiais (`MERCADO_PAGO_ACCESS_TOKEN` ou `MERCADOPAGO_ACCESS_TOKEN`).
  - Geração de preferências de pagamento via Checkout Pro (`createMercadoPagoPreference`) no servidor:
    - Identificação de cada item com nome, tamanho, preço unitário do banco e quantidade.
    - Metadados do comprador (Nome, CPF, E-mail, Telefone com DDD e Endereço).
    - `external_reference` vinculado ao identificador do pedido (`orderId`).
    - Configuração de `back_urls` para retorno e `notification_url` para o webhook.
  - Consulta ao estado real da transação (`getMercadoPagoPaymentDetails`).
  - Validação de assinatura criptográfica HMAC SHA-256 (`verifyMercadoPagoSignature`) usando o cabeçalho `x-signature` (`ts` e `v1`) e `crypto.timingSafeEqual`.
- **Rota de Checkout (`app/api/checkout/route.ts`):**
  - Validação de estoque e preços reais no banco de dados.
  - Criação do pedido com status `pending` associado ao cliente logado.
  - Criação da preferência no Mercado Pago e retorno da URL de checkout (`checkoutUrl`).
- **Página de Retorno e Feedback (`app/checkout/feedback/page.tsx`):**
  - Consulta o estado real do pedido no servidor via `/api/checkout/status`.
  - Tratamento visual coerente para os 3 estados oficiais:
    - **Aprovado:** Confirmação de compra, resumo dos itens e link para Meus Pedidos.
    - **Pendente:** Aviso de análise da transação pelo Mercado Pago e botão para recarregar status.
    - **Recusado:** Informação de não aprovação com opção de tentar novamente no checkout.
- **Webhook de Confirmação (`app/api/webhooks/mercadopago/route.ts`):**
  - Validação de autenticidade da notificação.
  - Consulta da transação diretamente na API do Mercado Pago.
  - Idempotência: impede reprocessamento ou desconto duplo de estoque para notificações repetidas.
  - Baixa de estoque segura nos tamanhos comprados somente na primeira transição para `approved`.
  - Atualização dos registros nas tabelas `orders` e `payments`.
- **Painel Administrativo de Pedidos (`app/admin/pedidos/page.tsx`):**
  - Coluna dedicada com o identificador de transação / preferência do Mercado Pago (`payment_id`).
  - Visualização de valores, datas, cliente, e-mail e status do pagamento.

---

## 3. Relatório da Bateria de Testes (Prompt 4)

| ID | Cenário de Teste | Resultado | Detalhes |
|---|---|---|---|
| **T01** | Remoção de numeração e quick-add no hover do card | ✅ APROVADO | Card limpo confirmado: sem overlay de numeração, carrossel e favoritos 100% preservados. |
| **T02** | Padronização de numeração 37 a 45 no Supabase | ✅ APROVADO | Todos os 58 produtos possuem variantes completas de 37 a 45. |
| **T03** | Grade fixa 37 a 45 e bloqueio sem estoque na página de detalhes | ✅ APROVADO | Grade 37..45 em ordem crescente; tamanhos esgotados desabilitados para compra. |
| **T04** | Formulários Administrativos (Novo e Edição) com grade 37-45 | ✅ APROVADO | Grade automática com ativação/desativação e edição de estoque por tamanho. |
| **T05** | Detalhamento do Carrinho de Compras | ✅ APROVADO | Imagem, nome, marca, tamanho, quantidade, preço unitário e subtotal exibidos. |
| **T06** | Validação de Assinatura HMAC-SHA256 do Webhook | ✅ APROVADO | Algoritmo oficial `x-signature` com `crypto.timingSafeEqual` validado. |
| **T07** | Validação no Servidor da Rota de Checkout | ✅ APROVADO | Preços e estoque consultados no servidor; proteção contra manipulação client-side. |
| **T08** | Idempotência e Baixa Segura de Estoque no Webhook | ✅ APROVADO | Idempotência validada contra notificações repetidas; baixa atômica de estoque. |
| **T09** | Página de Retorno / Feedback inteligente | ✅ APROVADO | Consulta status real via `/api/checkout/status`; cobre Aprovado, Pendente e Recusado. |
| **T10** | Painel Administrativo de Pedidos | ✅ APROVADO | Exibe pedidos, clientes, valores, status e IDs da transação Mercado Pago. |

**Resultado:** 10 de 10 testes aprovados (100% de conformidade).

---

## 4. Detalhamento da Execução do Prompt 5 (Ajustes no Menu & Numeração 37 a 45)

### 4.1 Remoção da Opção "Corrida de Rua" do Menu "TODOS OS TÊNIS"
- **Componente:** `components/header/Header.tsx`
- **Modificações:**
  - Removido exclusivamente o item e link `Corrida de Rua` (`href="/produtos?sport=corrida"`).
  - Espaçamentos e layout perfeitamente preservados sem lacunas visuais.
  - Opções restantes no menu drop-down mantidas ativas:
    1. 👟 Ver Todos os Calçados (`/produtos`)
    2. Treino & Academia (`/produtos?sport=academia`)
    3. Casual & Lifestyle (`/produtos?sport=lifestyle`)
    4. 🏃 Tênis de Maratona (`/maratona`)
    5. 🔥 Ofertas & Descontos (`/ofertas`)
  - Identidade visual, carrosséis, pesquisa e categorias mantidos 100% íntegros.

### 4.2 Padronização e Exibição do Tamanho 37
- **Filtros do Catálogo (`components/product/ProductFilters.tsx`):**
  - Atualizado array `MALE_SIZES` para iniciar em `37`: `['37', '38', '39', '40', '41', '42', '43', '44', '45']`.
  - Permite aos clientes filtrar calçados pelo tamanho 37 diretamente na listagem da loja.
- **Tabela de Guia de Medidas (`app/produto/[slug]/page.tsx`):**
  - Adicionado tamanho 37 (24.5 cm) e tamanho 45 (30.5 cm) na tabela do modal Guia de Tamanhos.
- **Formulários Administrativos de Produtos (`app/admin/produtos/novo/page.tsx` e `[id]/page.tsx`):**
  - Grade automática iniciando em 37 até 45 para novos produtos e produtos existentes.
  - Controle de disponibilidade e estoque em unidades reais salvo no Supabase.
- **Fluxo Completo de Compra (Carrinho -> Checkout -> Pedido):**
  - Seleção do tamanho 37 no detalhe do produto.
  - Preservação do tamanho 37 no carrinho de compras.
  - Checkout validando produto, tamanho e estoque real no servidor.
  - Criação do pedido com tamanho 37 e integração Mercado Pago Checkout Pro.

---

## 5. Relatório da Bateria de Testes Obrigatórios (Prompt 5)

| ID | Cenário de Teste | Resultado | Detalhes |
|---|---|---|---|
| **T01** | Abrir o menu Todos os Tênis | ✅ APROVADO | Menu e estrutura dropdown confirmados no Header. |
| **T02** | Confirmar que Corrida de Rua não aparece | ✅ APROVADO | Opção removida sem deixar lacunas no layout. |
| **T03** | Confirmar que as demais opções continuam funcionando | ✅ APROVADO | 5 opções ativas (Ver Todos, Treino, Casual, Maratona, Ofertas). |
| **T04** | Abrir diferentes produtos | ✅ APROVADO | Carregamento validado no Supabase para múltiplos calçados. |
| **T05** | Confirmar que a numeração começa em 37 | ✅ APROVADO | Todas as grades de tamanho iniciam em 37. |
| **T06** | Confirmar que a sequência termina em 45 | ✅ APROVADO | Sequência 37-38-39-40-41-42-43-44-45 confirmada. |
| **T07** | Testar a seleção do tamanho 37 | ✅ APROVADO | Seleção visual e lógica de primeiro disponível funcionando. |
| **T08** | Testar um produto sem estoque no tamanho 37 | ✅ APROVADO | Botão desabilitado (`disabled`) e indisponível para compra. |
| **T09** | Cadastrar novo produto com tamanho 37 | ✅ APROVADO | Grade padrão com tamanho 37 inicializada automaticamente. |
| **T10** | Editar produto existente e testar numeração | ✅ APROVADO | Mapeamento completo 37 a 45 na edição administrativa. |
| **T11** | Adicionar tênis tamanho 37 ao carrinho | ✅ APROVADO | Variante com tamanho 37 preservada no carrinho. |
| **T12** | Confirmar que o checkout mantém numeração | ✅ APROVADO | Checkout e pedido persistem tamanho 37 no banco. |

**Resultado:** 12 de 12 testes aprovados (100% de conformidade).

---

## 6. Arquivos Modificados e Criados (Prompt 5)

### Arquivos Modificados:
- `components/header/Header.tsx` (Remoção da opção Corrida de Rua do dropdown Todos os Tênis)
- `components/product/ProductFilters.tsx` (Adição do tamanho 37 no filtro de calçados masculinos)
- `app/produto/[slug]/page.tsx` (Adição do tamanho 37 e 45 na tabela do guia de medidas)
- `WHITE_WOLF_PROGRESS.md` (Atualização com execução e relatório do Prompt 5)

### Arquivos Criados:
- `scripts/check_sizes.js` (Verificação de variantes no banco de dados)
- `scripts/test_prompt5.js` (Bateria dos 12 testes automatizados do Prompt 5)
- `scripts/test_prompt5_results.json` (Resultado dos testes em JSON)

---

## 7. Como Ativar Pagamentos Reais em Produção

### Arquivos Modificados:
- `components/product/ProductCard.tsx` (Remoção do hover de numeração rápida)
- `app/produto/[slug]/page.tsx` (Grade padrão 37..45 e validação de estoque)
- `app/carrinho/page.tsx` (Exibição explícita de preço unitário e subtotal)
- `app/checkout/page.tsx` (Fluxo de Checkout Pro Mercado Pago)
- `app/admin/produtos/novo/page.tsx` (Grade 37-45 com chaves de ativação)
- `app/admin/produtos/[id]/page.tsx` (Edição com grade 37-45 e chaves de ativação)
- `app/admin/pedidos/page.tsx` (Exibição de transações e metadados MP)
- `app/api/checkout/route.ts` (Geração de preferência Checkout Pro no servidor)
- `app/api/webhooks/mercadopago/route.ts` (Webhook com assinatura e idempotência)
- `lib/mercadopago/client.ts` (SDK oficial, preferência, consulta e HMAC)
- `.env.example` (Documentação das variáveis Mercado Pago)

### Arquivos Criados:
- `app/checkout/feedback/page.tsx` (Página de retorno com consulta em tempo real)
- `app/api/checkout/status/route.ts` (Endpoint seguro para consulta de status do pedido)
- `scripts/standardize_database_sizes.js` (Script de migração dos tamanhos 37..45 no Supabase)
- `scripts/test_prompt4.js` (Bateria automatizada de testes do Prompt 4)

---

## 5. Como Ativar Pagamentos Reais em Produção

Para ativar os pagamentos reais na Vercel e no ambiente local:

### 1. Obter as Credenciais no Painel do Mercado Pago:
1. Acesse o painel de desenvolvedores: [Mercado Pago Developers](https://www.mercadopago.com.br/developers/panel/app).
2. Selecione sua aplicação da **White Wolf Company**.
3. No menu lateral, acesse **Credenciais de Produção**.
4. Copie o **Access Token** (`APP_USR-...`) e a **Public Key**.
5. No menu **Webhooks / Notificações**, copie a **Chave secreta** (*Webhook Secret*).

### 2. Configurar as Variáveis de Ambiente na Vercel:
Acesse as configurações do projeto na Vercel (*Project Settings -> Environment Variables*) e adicione:
- `MERCADO_PAGO_ACCESS_TOKEN`: Seu Access Token de Produção (`APP_USR-...`).
- `MERCADO_PAGO_PUBLIC_KEY`: Sua Public Key (`APP_USR-...`).
- `MERCADO_PAGO_WEBHOOK_SECRET`: A chave secreta de assinatura do webhook.
- `NEXT_PUBLIC_APP_URL`: `https://white-wolf-company.vercel.app` (ou domínio de produção).

### 3. Configurar a URL de Webhook no Mercado Pago:
1. No painel do Mercado Pago, vá em **Webhooks / Notificações**.
2. Configure a URL de produção:
   `https://white-wolf-company.vercel.app/api/webhooks/mercadopago`
3. Selecione o evento: **Pagamentos (payments)**.
4. Salve a configuração.

---

## 6. Instruções para Continuidade ("RETOMAR AO PROMPT")
Ao enviar **RETOMAR AO PROMPT**:
1. Leia este arquivo `WHITE_WOLF_PROGRESS.md`.
2. Verifique o estado do Git e as variáveis de ambiente ativas.
3. Prossiga a partir da última tarefa pendente ou instruções adicionais fornecidas.
