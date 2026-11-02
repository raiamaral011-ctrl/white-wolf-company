# CHECKPOINT DE ESTADO — WHITE WOLF COMPANY
> **Documento de Continuidade e Memória de Projeto**
> Este arquivo foi gerado para permitir que qualquer instância do agente de IA (ou desenvolvedor) retome o trabalho exatamente de onde parou, com pleno conhecimento da arquitetura, credenciais, histórico de alterações, estado do banco de dados e testes.

---

## 1. Identificação Geral do Projeto

- **Nome:** WHITE WOLF COMPANY
- **Segmento:** E-Commerce Esportivo de Elite (especializado exclusivamente em tênis de performance, corrida de rua, maratona e treino)
- **Data da última atualização:** 02/11/2026
- **Status do Build:** Compilação com sucesso (Next.js 14 — 45 rotas estáticas e dinâmicas)
- **Status da Loja:** 100% funcional para navegação, criação de conta, catálogo, carrinho, checkout demonstrativo e gestão administrativa.

---

## 2. Stack Tecnológica & Arquitetura

| Camada | Tecnologia / Ferramenta |
|---|---|
| **Framework Web** | Next.js 14+ (App Router), React 18, TypeScript |
| **Estilização** | Tailwind CSS, Lucide React Icons |
| **Gerenciamento de Estado** | React Context API (`CartContext`, `FavoritesContext`) |
| **Banco de Dados** | Supabase PostgreSQL + Row Level Security (RLS) |
| **Autenticação** | Supabase Auth (`@supabase/ssr` e `@supabase/supabase-js`) |
| **Storage de Mídia** | Supabase Storage (`product-media` e `home-banners`) |
| **Gateway de Pagamento** | Mercado Pago SDK Server-Side + Modo Demonstrativo acadêmico |
| **Hospedagem & CI/CD** | Vercel (deploy contínuo automático a cada push na branch `main`) |
| **Controle de Versão** | Git & GitHub |

---

## 3. Ambientes & Repositórios

### 3.1 GitHub
- **Repositório Oficial:** `https://github.com/raiamaral011-ctrl/white-wolf-company`
- **Usuário Proprietário:** `raiamaral011-ctrl`
- **Branch Principal:** `main`
- **Remote Git Configurado:**
  `origin https://<GITHUB_PAT>@github.com/raiamaral011-ctrl/white-wolf-company.git`

### 3.2 Vercel (Produção)
- **URL Ativa em Produção:** `https://white-wolf-company-758y.vercel.app`
- **Status HTTP:** 200 OK
- **Deploy:** Vinculado automaticamente ao GitHub. Qualquer `git push origin main` dispara a compilação e publicação automática na Vercel.

### 3.3 Supabase (Backend & Banco de Dados)
- **Nome do Projeto:** `white-wolf-company`
- **Project Ref / ID:** `tdwqrqcyhrprzijguulo`
- **Região:** `sa-east-1` (São Paulo, Brasil)
- **Status:** `ACTIVE_HEALTHY`
- **Endpoint da API:** `https://tdwqrqcyhrprzijguulo.supabase.co`
- **Buckets de Storage:**
  - `product-media` (Público — fotos e vídeos dos calçados nos formatos AVIF, WebP, JPG, PNG)
  - `home-banners` (Público — banners da página inicial)
- **Variáveis de Ambiente (`.env.local`):**
  - `NEXT_PUBLIC_SUPABASE_URL=https://tdwqrqcyhrprzijguulo.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkd3FycWN5aHJwcnppamd1dWxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5Njk4NDcsImV4cCI6MjEwMjU0NTg0N30.6b1SZtKvP7QLdRufE82Hd0Vkrn5JM292NjFNKP-1z-U`
  - `SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkd3FycWN5aHJwcnppamd1dWxvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Njk2OTg0NywiZXhwIjoyMTAyNTQ1ODQ3fQ.0SeqeIUpGmUnijXR5WBHKmGUH-PcQ--GRbOiLJvBaoA`
  - `NEXT_PUBLIC_APP_URL=https://white-wolf-company-758y.vercel.app`

---

## 4. Estrutura do Banco de Dados (Supabase)

1. **`brands`**: Marcas esportivas cadastradas (`id`, `name`, `slug`, `description`).
   - Adidas (`b1000000-0000-0000-0000-000000000001`)
   - Nike (`b1000000-0000-0000-0000-000000000002`)
   - ASICS (`b1000000-0000-0000-0000-000000000003`)
   - Puma (`b1000000-0000-0000-0000-000000000004`)
   - New Balance (`b1000000-0000-0000-0000-000000000005`)
2. **`categories`**: Modalidades de calçados (`id`, `name`, `slug`, `description`).
   - Tênis (`c1000000-0000-0000-0000-000000000001`)
   - Maratona (`c4000000-0000-0000-0000-000000000004`)
   - Ofertas (`c5000000-0000-0000-0000-000000000005`)
   - Futebol (`c6000000-0000-0000-0000-000000000006`)
3. **`products`**: Calçados cadastrados (`id` UUID, `name`, `slug`, `sku`, `price`, `compare_at_price`, `gender`, `sport`, `featured`, `is_new`, `is_sale`, `is_maratona`, `rating`, `review_count`, `brand_id`, `category_id`).
4. **`product_images`**: Imagens e mídias vinculadas (`id`, `product_id`, `url`, `alt`, `sort_order`).
5. **`product_variants`**: Tamanhos e estoque real (`id`, `product_id`, `sku`, `size`, `color`, `color_name`, `stock`).
6. **`orders`**: Pedidos registrados (`id` UUID, `user_id`, `status`, `payment_status`, `payment_provider`, `payment_id`, `subtotal`, `discount`, `shipping`, `total`, `shipping_address`, `customer_info`).
7. **`order_items`**: Itens comprados nos pedidos (`id`, `order_id`, `product_id`, `variant_id`, `product_name`, `product_sku`, `size`, `color`, `quantity`, `unit_price`, `subtotal`).
8. **`payments`**: Registros de transações e QR Codes (`id`, `order_id`, `provider`, `amount`, `payment_method`, `status`, `qr_code`).
9. **`profiles`**: Perfis de usuário com papel de acesso (`id`, `user_id`, `full_name`, `email`, `role` = 'customer' | 'admin').

---

## 5. Funcionalidades e Correções Implementadas

### A. Loja Exclusiva de Tênis
- Remoção completa de vestuário, camisetas, calças, shorts, jaquetas e acessórios da interface pública.
- Redirecionamento automático das rotas legadas (`/roupas`, `/acessorios`) para `/produtos`.
- Menus e navegação 100% voltados para tênis: Masculino, Feminino, Infantil e Maratona.

### B. Correção Universal de Imagens e AVIF
- `next.config.js` reconfigurado com `remotePatterns: [{ protocol: 'https', hostname: '**' }, { protocol: 'http', hostname: '**' }]`.
- Suporte nativo a imagens do Supabase Storage, Akamai, CDNs da Nike, Adidas, Puma, New Balance e Unsplash.
- `ProductCard.tsx`, `CartDrawer.tsx` e galeria de detalhes ajustados com tratamento `unoptimized` para AVIF e data URLs, além de filtragem para não tentar exibir arquivos de vídeo como imagem.

### C. Supabase Auth & Área do Cliente
- `UserMenu.tsx`: Dropdown responsivo para mobile e desktop com identificação do usuário logado, distinção de role (Cliente vs Admin) e logout real via Supabase.
- `/login` e `/cadastro`: Formulários com validação, mensagens de erro claras e persistência de sessão.
- `/minha-conta`: Painel dinâmico conectado diretamente ao usuário logado, exibindo pedidos reais consultados do Supabase e links para Dados Pessoais.

### D. Sincronização Admin → Loja Pública
- `app/api/admin/products/route.ts` e `app/api/admin/products/[id]/route.ts`: Adição de `revalidatePath` em operações de `POST`, `PUT` e `DELETE`.
- Novos produtos e alterações de preço/estoque refletem instantaneamente no catálogo público.

### E. Carrinho & Checkout Demonstrativo
- Carrinho com validação estrita de estoque por tamanho e cálculo automático de frete grátis (> R$299) e desconto PIX (5%).
- Checkout em 5 etapas salvando pedidos na tabela `orders`, itens em `order_items` e executando baixa real de estoque em `product_variants`.

---

## 6. Resultados dos Testes Ponta a Ponta por Marca (E2E)

Script automatizado de validação direta no Supabase: `test_brands_purchase.js`

| Marca | Tênis Testado | Filtro | Imagem | Carrinho | Checkout Demonstrativo | Pedido no Banco | Baixa de Estoque Real |
|---|---|---|---|---|---|---|---|
| **Nike** | Air Max 90 Preto | ✅ Aprovado | ✅ Aprovado | ✅ Aprovado (Tam 37) | ✅ Aprovado (PIX) | ✅ Gravado | ✅ 10 → 9 un. |
| **Adidas** | TÊNIS CAMPUS 00s | ✅ Aprovado | ✅ Aprovado | ✅ Aprovado (Tam 37) | ✅ Aprovado (PIX) | ✅ Gravado | ✅ 9 → 8 un. |
| **ASICS** | Superblast 3 | ✅ Aprovado | ✅ Aprovado | ✅ Aprovado (Tam 37) | ✅ Aprovado (PIX) | ✅ Gravado | ✅ 9 → 8 un. |
| **Puma** | tenis puma 180 | ✅ Aprovado | ✅ Aprovado | ✅ Aprovado (Tam 39) | ✅ Aprovado (PIX) | ✅ Gravado | ✅ 9 → 8 un. |
| **New Balance** | Tênis New Balance 9060 | ✅ Aprovado | ✅ Aprovado | ✅ Aprovado (Tam 37) | ✅ Aprovado (PIX) | ✅ Gravado | ✅ 10 → 9 un. |

---

## 7. Instruções para Retomada por Agente de IA

Se você é uma nova sessão ou instância de IA recebendo este arquivo:

1. **Localização do projeto:** `C:\Users\granb\.gemini\antigravity\scratch\white-wolf-company`
2. **Runtime:** Node.js portátil v20 configurado em `C:\Users\granb\.gemini\antigravity\scratch\nodejs`.
   - Adicione ao PATH antes de comandos: `$env:PATH = "C:\Users\granb\.gemini\antigravity\scratch\nodejs;C:\Program Files\Microsoft Visual Studio\2022\Community\Common7\IDE\CommonExtensions\Microsoft\TeamFoundation\Team Explorer\Git\cmd;$env:PATH"`
3. **Credenciais:** O repositório já está clonado e configurado com remote origin autenticado. O arquivo `.env.local` contém as credenciais completas e válidas do Supabase.
4. **Execução de Testes:** Execute `node test_brands_purchase.js` para revalidar imediatamente todas as 5 marcas e compras no banco de dados.
5. **Compilação:** Execute `npm run build` para garantir que o projeto compila sem erros de tipagem.
6. **Publicação:** Qualquer commit com `git push origin main` publicará automaticamente no Vercel.
7. **Regra de Continuidade:** Ao término de cada turno de alterações, atualize este arquivo `WHITE_WOLF_CHECKPOINT.md` e faça commit/push no repositório.
