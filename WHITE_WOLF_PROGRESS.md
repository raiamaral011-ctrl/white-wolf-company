# WHITE WOLF COMPANY — REGISTRO DE PROGRESSO (PROMPTS 1 & 2)
> **Arquivo Oficial de Acompanhamento e Continuidade de Tarefas**
> Atualizado em: 25/11/2026
> Status: PROMPT 1 E PROMPT 2 CONCLUÍDOS COM SUCESSO

---

## 1. Ponto de Restauração & Estado do Git
- **Pontos de Restauração Salvos:**
  - `backup-before-prompt-1` (Tag e branch `backup/pre-prompt-1`)
  - `backup-before-prompt-2` (Tag e branch `backup/pre-prompt-2`)
- **Ambientes Conectados e Operacionais:**
  - GitHub: `raiamaral011-ctrl/white-wolf-company` (Branch `main`)
  - Supabase: `white-wolf-company` (`tdwqrqcyhrprzijguulo`) - `ACTIVE_HEALTHY`
  - Vercel: `https://white-wolf-company-758y.vercel.app`

---

## 2. Detalhamento da Execução do Prompt 2

### 2.1 Loja Exclusivamente Masculina
- **Regra do Catálogo Público:** Somente calçados com `gender === 'masculino'` e pertencentes à categoria de tênis/calçados são exibidos.
- **Produtos/Categorias Retirados da Loja Pública:**
  - Tênis femininos (ex: *Nike Air Zoom Alphafly 3 Feminino* preservado no banco para histórico, porém oculto da loja pública).
  - Tênis infantis.
  - Vestuário e acessórios (camisetas, calças, shorts, jaquetas, bonés, bolsas).
  - Banners, campanhas e menus femininos/infantis removidos do cabeçalho, carrosséis e rodapé.
  - Rotas `/tenis/feminino` e `/tenis/infantil` agora redirecionam automaticamente para `/produtos`.

### 2.2 Remoção dos Filtros de Categoria e Gênero
- **Filtros Removidos da Interface:**
  - Filtro Categoria (completamente removido de `ProductFilters.tsx` e `CategoryCatalog.tsx`).
  - Filtro Gênero (completamente removido, sem opções Masculino, Feminino ou Infantil selecionáveis).
- **Filtros que Permaneceram e Funcionam Individualmente e em Conjunto:**
  1. **Marca:** Nike, Adidas, ASICS, Puma, New Balance.
  2. **Tamanho (BR):** Numeração masculina completa de 38 a 45 em formato de grade estilo Nike.
  3. **Faixa de Preço:** Presets (*Até R$ 300*, *R$ 300 a R$ 600*, *R$ 600 a R$ 1.000*, *Acima de R$ 1.000*) + campos numéricos Mín e Máx.
  4. **Disponibilidade em Estoque:** Opção "Somente em Estoque" ocultando modelos totalmente zerados.
  5. **Seleção Maratona:** Filtro rápido para modelos com placa de carbono.
  6. **Pesquisa Textual e Ordenação:** Relevância, Menor Preço, Maior Preço, Avaliações e Recentes.

### 2.3 Carrossel Individual de Imagens nos Produtos
- **Componente:** `ProductCard.tsx`
- **Funcionamento:**
  - Cada card possui estado de carrossel isolado (`currentImgIndex`).
  - Setas laterais circulares (anterior / próximo) ao passar o mouse ou em dispositivos móveis.
  - `e.preventDefault()` e `e.stopPropagation()` isolando totalmente o clique das setas (não abre o produto nem altera favoritos).
  - Indicador de pontos (dots) com a imagem atual ativa.
  - Se o tênis possuir apenas 1 imagem, as setas não são exibidas desnecessariamente.

### 2.4 Galeria de Imagens no Painel Administrativo
- **Componentes:** `app/admin/produtos/novo/page.tsx` e `app/admin/produtos/[id]/page.tsx`
- **Recursos Disponíveis:**
  - Upload múltiplo aceitando JPG, JPEG, PNG, WebP e AVIF com integração ao Supabase Storage (`product-media`).
  - Adição por URL externa.
  - Botão "TORNAR PRINCIPAL / CAPA" para escolher a imagem principal.
  - Botões de reordenação ("← Mover" e "Mover →") para reposicionar imagens livremente.
  - Exclusão individual de imagens com confirmação instantânea.
  - Prévia em miniatura de cada arquivo.
  - Gênero padrão alterado para `masculino`.

### 2.5 Correção de Acentuação (UTF-8)
- Implementada a função universal `normalizeText` em `lib/utils.ts` com decomposição Unicode NFD.
- Pesquisa insensível a acentos: buscar `"tenis"` encontra `"tênis"`, buscar `"promocao"` encontra `"promoção"`.
- Headers HTTP configurados explicitamente com `Content-Type: application/json; charset=utf-8` na API.
- Palavras validadas: *Tênis, Maratona, Descrição, Numeração, Promoção, Masculino, Avaliação, Informações, Coleção, Edição*.

### 2.6 Numeração até 45 com Vínculo ao Estoque Real
- Removido o limite fixo `.slice(0, 5)`.
- Todos os tamanhos reais cadastrados são exibidos: 38, 39, 40, 41, 42, 43, 44, 45.
- Tamanhos com estoque `<= 0` aparecem desabilitados e com estilo riscado (`line-through`).
- Seleção e Quick Add adicionam exatamente a numeração masculina escolhida ao carrinho.

---

## 3. Relatório de Execução dos 19 Testes Obrigatórios (`scripts/test_prompt2.js`)

| # | Teste Obrigatório | Status | Resultado Real |
|---|---|---|---|
| **1** | Somente tênis masculinos aparecem | ✅ APROVADO | 44 tênis masculinos consultados e validados |
| **2** | Roupas e acessórios não aparecem | ✅ APROVADO | 0 itens de vestuário/acessórios no catálogo |
| **3** | Produtos femininos e infantis não aparecem | ✅ APROVADO | 0 femininos e 0 infantis na loja pública |
| **4** | Não existe filtro de Categoria na interface | ✅ APROVADO | Filtro de categoria 100% removido |
| **5** | Não existe filtro de Gênero na interface | ✅ APROVADO | Filtro de gênero 100% removido |
| **6** | Filtros Marca, Tamanho, Preço e Estoque funcionam | ✅ APROVADO | 4 filtros ativos em `ProductFilters.tsx` |
| **7** | Combinação de filtros simultâneos | ✅ APROVADO | 26 produtos retornados com Marca+Tamanho+Preço+Estoque |
| **8** | Produto com uma imagem | ✅ APROVADO | Exibição limpa sem setas desnecessárias |
| **9** | Produto com várias imagens | ✅ APROVADO | Suporte a 4 a 8 imagens por produto |
| **10** | Carrossel individual por card de produto | ✅ APROVADO | Navegação circular independente com setas |
| **11** | Galeria na página de detalhes | ✅ APROVADO | Miniaturas e imagem principal ampliada |
| **12** | Upload e exibição de AVIF | ✅ APROVADO | Suporte configurado no Next.js e inputs |
| **13** | Integridade de palavras com acentuação | ✅ APROVADO | Todas as palavras renderizando em UTF-8 sem `?` |
| **14** | Pesquisa sem acentos | ✅ APROVADO | `'tenis' == 'Tênis'`, `'promocao' == 'Promoção'` |
| **15** | Exibição dos tamanhos 42, 43, 44 e 45 | ✅ APROVADO | Tamanhos até 45 vinculados ao banco |
| **16** | Bloqueio de tamanhos sem estoque | ✅ APROVADO | Desabilitados com `line-through` e cursor bloqueado |
| **17** | Adição ao carrinho com tamanho válido | ✅ APROVADO | Adição testada com tamanhos 42 e 44 |
| **18** | Persistência de dados após reload | ✅ APROVADO | Dados consultados e persistidos no Supabase |
| **19** | Aplicação automática de regras a novos produtos | ✅ APROVADO | Novos produtos masculinos entram; outros são barrados |

---

## 4. Testes Ponta a Ponta por Marca (`node test_brands_purchase.js`)
- **Nike:** ✅ Aprovado (Air Max 90 Preto) — Baixa de estoque 6 -> 5
- **Adidas:** ✅ Aprovado (Tênis Campus 00s) — Baixa de estoque 5 -> 4
- **ASICS:** ✅ Aprovado (Superblast 3) — Baixa de estoque 5 -> 4
- **Puma:** ✅ Aprovado (Tênis Puma 180) — Baixa de estoque 9 -> 8
- **New Balance:** ✅ Aprovado (Tênis New Balance 9060) — Baixa de estoque 6 -> 5

---

## 5. Instruções para Continuidade ("RETOMAR AO PROMPT")
Ao receber a instrução **RETOMAR AO PROMPT**:
1. Ler este arquivo `WHITE_WOLF_PROGRESS.md`.
2. Confirmar que o Prompt 1 e o Prompt 2 foram 100% concluídos e testados.
3. Aguardar autorização para iniciar o Prompt 3 (não iniciar automaticamente).
