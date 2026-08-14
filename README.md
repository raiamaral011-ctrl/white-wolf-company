# WHITE WOLF COMPANY - Plataforma E-Commerce Esportiva Premium

**WHITE WOLF COMPANY** é uma plataforma completa e moderna de e-commerce voltada para tênis, roupas e acessórios esportivos das marcas **Adidas, Nike, ASICS, Puma e New Balance**.

Desenvolvida com foco em alta performance, segurança, conversão de vendas, responsividade e SEO, totalmente preparada para deploy na **Vercel**.

---

## 🛠️ Tech Stack & Arquitetura

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Lucide Icons, Context API
- **Backend**: Next.js Server Components, Server Actions, Route Handlers
- **Banco de Dados**: Supabase PostgreSQL + Row Level Security (RLS)
- **Autenticação**: Supabase Auth (`@supabase/ssr`)
- **Mídia & Imagens**: Vercel Blob (`@vercel/blob`)
- **Pagamentos**: Mercado Pago (PIX + Cartão de Crédito via SDK Server-Side + Webhooks)
- **Hospedagem**: Vercel

---

## 📁 Estrutura do Projeto

```
sportlab/
├── app/                        # Next.js App Router (Rotas e Páginas)
│   ├── (auth)/                 # Login, Cadastro, Recuperação de Senha
│   ├── tenis/                  # Catálogo de Tênis (Masculino, Feminino, Infantil)
│   ├── roupas/                 # Catálogo de Roupas (Camisetas, Shorts, Calças, Jaquetas)
│   ├── acessorios/             # Mochilas, Bonés, Meias
│   ├── ofertas/                # Produtos em promoção
│   ├── marcas/ & marca/[slug]/ # Páginas oficiais das marcas Adidas, Nike, ASICS, Puma, New Balance
│   ├── produto/[slug]/         # Página detalhada do produto (Galeria, Tamanhos, Frete)
│   ├── busca/                  # Busca por nome, marca, SKU e autocomplete
│   ├── favoritos/              # Lista de desejos persistente
│   ├── carrinho/ & checkout/   # Carrinho e Checkout em 5 etapas com PIX & Mercado Pago
│   ├── minha-conta/            # Painel do cliente e histórico de pedidos
│   ├── admin/                  # Dashboard administrativo e CRUD completo
│   └── api/                    # Route Handlers (Checkout, Webhook Mercado Pago)
├── components/                 # Componentes React Reutilizáveis (Header, Cards, Filtros, Footer)
├── context/                    # CartContext e FavoritesContext com suporte visitante/logado
├── lib/                        # Clientes Supabase, Mercado Pago, Vercel Blob e Schemas Zod
├── supabase/                   # Migrations SQL e Seed Script (50+ produtos)
└── types/                      # Interfaces TypeScript do sistema
```

---

## 🔑 Variáveis de Ambiente (`.env`)

Crie um arquivo `.env.local` na raiz do projeto com as seguintes chaves:

```env
# SUPABASE
NEXT_PUBLIC_SUPABASE_URL=https://sua-instancia.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=seu-anon-key
SUPABASE_SERVICE_ROLE_KEY=seu-service-role-key-privado

# VERCEL BLOB
BLOB_READ_WRITE_TOKEN=seu-token-vercel-blob

# MERCADO PAGO
MERCADOPAGO_ACCESS_TOKEN=TEST-seu-access-token-sandbox
MERCADOPAGO_PUBLIC_KEY=TEST-sua-public-key-sandbox
MERCADOPAGO_WEBHOOK_SECRET=seu-secret-webhook

# APP URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📦 Como Executar Localmente

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Iniciar em modo de desenvolvimento**:
   ```bash
   npm run dev
   ```
   Acesse [http://localhost:3000](http://localhost:3000).

3. **Validar compilação de produção**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🗄️ Configuração do Banco de Dados (Supabase)

1. Acesse seu painel no [Supabase](https://supabase.com/).
2. Vá em **SQL Editor** e execute o arquivo de migração:
   - `supabase/migrations/001_initial_schema.sql` (Cria as 13 tabelas)
   - `supabase/migrations/002_rls_policies.sql` (Ativa RLS e insere políticas de segurança)
3. Para popular a loja com 50+ produtos das marcas (Adidas, Nike, ASICS, Puma, New Balance), execute:
   - `supabase/seed/seed.sql`

---

## 💳 Configuração do Mercado Pago & Webhooks

1. Obtenha as credenciais em [Mercado Pago Developers](https://www.mercadopago.com.br/developers).
2. Para testar pagamentos via PIX e Cartão em ambiente local ou staging, utilize o **Sandbox**.
3. A rota de webhook oficial configurada é:
   - `POST /api/webhooks/mercadopago`
4. Configure a URL do webhook no painel do Mercado Pago apontando para `https://seu-dominio.vercel.app/api/webhooks/mercadopago`.

---

## 🚀 Deploy na Vercel

1. Suba o repositório para o GitHub.
2. Conecte o repositório no dashboard da Vercel.
3. Adicione as Variáveis de Ambiente no painel da Vercel.
4. Conecte a integração do **Vercel Blob** em *Storage > Create Blob*.
5. Clique em **Deploy**.
