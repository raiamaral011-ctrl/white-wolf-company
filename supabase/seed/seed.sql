-- Seed File for WHITE WOLF COMPANY E-Commerce (50+ Products)

-- CLEAR EXISTING DATA
TRUNCATE TABLE order_items, orders, payments, cart_items, carts, favorites, product_variants, product_images, products, categories, brands CASCADE;

-- BRANDS
INSERT INTO brands (id, name, slug, description) VALUES
('b1000000-0000-0000-0000-000000000001', 'Adidas', 'adidas', 'Marca global de sportswear com foco em inovação, tecnologia de amortecimento Boost e estilo street-performance.'),
('b1000000-0000-0000-0000-000000000002', 'Nike', 'nike', 'Pioneira no esporte mundial, famosa pela tecnologia Air Max, materiais Dri-FIT e alta performance esportiva.'),
('b1000000-0000-0000-0000-000000000003', 'ASICS', 'asics', 'Especialista japonesa em estabilidade, ergonomia e amortecimento em GEL para corrida e treinos intensos.'),
('b1000000-0000-0000-0000-000000000004', 'Puma', 'puma', 'Fusão perfeita de cultura urbana, velocidade e design arrojado para treinos, futebol e lifestyle esportivo.'),
('b1000000-0000-0000-0000-000000000005', 'New Balance', 'new-balance', 'Excelência em conforto, suporte plantar e estética retrô-futurista premiada para corrida e dia a dia.');

-- CATEGORIES
INSERT INTO categories (id, name, slug, description) VALUES
('c1000000-0000-0000-0000-000000000001', 'Tênis', 'tenis', 'Calçados esportivos de alta tecnologia para corrida, treino, basquete e casual.'),
('c1000000-0000-0000-0000-000000000002', 'Camisetas', 'camisetas', 'Vestuário leve, respirável com tecnologia de secagem rápida para performance maxima.'),
('c1000000-0000-0000-0000-000000000003', 'Shorts', 'shorts', 'Shorts esportivos projetados para liberdade total de movimento e ventilação.'),
('c1000000-0000-0000-0000-000000000004', 'Calças', 'calcas', 'Calças jogger, leggings e agasalhos para treino e recuperação com máximo conforto.'),
('c1000000-0000-0000-0000-000000000005', 'Jaquetas', 'jaquetas', 'Corta-ventos, jaquetas impermeáveis e moletons técnicos com proteção térmica.'),
('c1000000-0000-0000-0000-000000000006', 'Acessórios', 'acessorios', 'Mochilas, bonés, meias técnicas, garrafas e luvas de treino.');

-- PRODUCTS (50 items)
-- Brand IDs: Adidas (b...01), Nike (b...02), ASICS (b...03), Puma (b...04), New Balance (b...05)
-- Category IDs: Tênis (c...01), Camisetas (c...02), Shorts (c...03), Calças (c...04), Jaquetas (c...05), Acessórios (c...06)

INSERT INTO products (id, brand_id, category_id, name, slug, description, sku, price, compare_at_price, gender, sport, featured, is_new, is_sale, rating, review_count) VALUES
-- ADIDAS (10 items)
('a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Tênis Ultraboost Light Tech', 'tenis-ultraboost-light-tech', 'O Ultraboost Light é nosso tênis mais leve de todos os tempos, fabricado com o revolucionário material Light BOOST para um retorno de energia supremo.', 'ADI-UB-01', 1199.90, 1399.90, 'masculino', 'corrida', true, true, true, 4.90, 128),
('a1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Tênis Adizero Boston 12 Pro', 'tenis-adizero-boston-12-pro', 'Construído para corridas de média e longa distância com hastes de carbono ENERGYRODS 2.0 que reduzem a perda de energia.', 'ADI-AZ-02', 1299.90, NULL, 'unisex', 'corrida', true, true, false, 4.85, 94),
('a1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Tênis NMD_R1 V3 Primeknit', 'tenis-nmd-r1-v3-primeknit', 'Ícone urbano reinventado com amortecimento BOOST envolto em TPU estruturado.', 'ADI-NMD-03', 899.90, 999.90, 'feminino', 'lifestyle', false, false, true, 4.75, 82),
('a1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002', 'Camiseta Own The Run Tech', 'camiseta-own-the-run-tech', 'Camiseta de corrida leve em tecido AEROREADY com elementos refletivos 360 graus.', 'ADI-TS-04', 199.90, NULL, 'masculino', 'corrida', false, true, false, 4.60, 45),
('a1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000003', 'Shorts Pro Running 2 em 1', 'shorts-pro-running-2-em-1', 'Shorts duplo com bermuda interna de compressão e bolso oculto para smartphone.', 'ADI-SH-05', 249.90, 299.90, 'masculino', 'corrida', false, false, true, 4.70, 61),
('a1000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000004', 'Calça Tiro 23 League Track', 'calca-tiro-23-league-track', 'Calça clássica de treino com zíperes nos tornozelos e modelagem ajustada.', 'ADI-PT-06', 349.90, NULL, 'masculino', 'futebol', false, false, false, 4.80, 110),
('a1000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000005', 'Jaqueta Corta-Vento Marathon Jacket', 'jaqueta-corta-vento-marathon', 'Jaqueta ultra leve com repelência à água e capuz ajustável contra o vento.', 'ADI-JK-07', 499.90, 599.90, 'feminino', 'corrida', true, false, true, 4.88, 77),
('a1000000-0000-0000-0000-000000000008', 'b1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000006', 'Mochila Training Pro 30L', 'mochila-training-pro-30l', 'Mochila esportiva reforçada com compartimento para notebook e base à prova de água.', 'ADI-BP-08', 329.90, NULL, 'unisex', 'academia', false, true, false, 4.65, 39),
('a1000000-0000-0000-0000-000000000009', 'b1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Tênis Forum Low Retro Urban', 'tenis-forum-low-retro-urban', 'Estilo basquete clássico dos anos 80 feito em couro premium e tira removível de tornozelo.', 'ADI-FR-09', 699.90, NULL, 'unisex', 'lifestyle', true, false, false, 4.92, 210),
('a1000000-0000-0000-0000-000000000010', 'b1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000006', 'Boné Sport Performance Tech', 'bone-sport-performance-tech', 'Boné aba curva com faixa antitranspiração interna e ajuste de fivela rápida.', 'ADI-CP-10', 129.90, 149.90, 'unisex', 'general', false, false, true, 4.50, 50),

-- NIKE (10 items)
('a1000000-0000-0000-0000-000000000011', 'b1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'Tênis Air Zoom Alphafly NEXT% 3', 'tenis-air-zoom-alphafly-next3', 'O tênis de maratona mais rápido da Nike com duas cápsulas Air Zoom e placa de fibra de carbono Flyplate.', 'NIK-AF-11', 1999.90, 2199.90, 'masculino', 'corrida', true, true, true, 4.95, 340),
('a1000000-0000-0000-0000-000000000012', 'b1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'Tênis Pegasus 40 React', 'tenis-pegasus-40-react', 'O cavalinho de batalha para seus treinos diários. Duas unidades Zoom Air garantem impulso elástico.', 'NIK-PG-12', 799.90, 899.90, 'feminino', 'corrida', true, false, true, 4.86, 450),
('a1000000-0000-0000-0000-000000000013', 'b1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'Tênis Metcon 9 Cross-Training', 'tenis-metcon-9-cross-training', 'Padrão ouro em levantamento de peso e treinos funcionais com placa Hyperlift ampliada.', 'NIK-MT-13', 999.90, NULL, 'masculino', 'academia', true, true, false, 4.91, 185),
('a1000000-0000-0000-0000-000000000014', 'b1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002', 'Camiseta Dri-FIT Legend Pro', 'camiseta-dri-fit-legend-pro', 'Tecnologia antissuor Dri-FIT que mantém o corpo seco durante os treinos mais intensos.', 'NIK-DF-14', 179.90, NULL, 'masculino', 'academia', false, false, false, 4.70, 95),
('a1000000-0000-0000-0000-000000000015', 'b1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000003', 'Shorts Stride 5" Brief-Lined', 'shorts-stride-5-brief-lined', 'Sensação de leveza desenvolvida para movimentação irrestrita com forro macio.', 'NIK-SH-15', 279.90, 329.90, 'masculino', 'corrida', false, true, true, 4.80, 72),
('a1000000-0000-0000-0000-000000000016', 'b1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000004', 'Calça Tech Fleece Jogger', 'calca-tech-fleece-jogger', 'Fleece premium leve com retenção térmica natural e design afunilado moderno.', 'NIK-TF-16', 649.90, NULL, 'unisex', 'lifestyle', true, false, false, 4.94, 310),
('a1000000-0000-0000-0000-000000000017', 'b1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000005', 'Jaqueta Windrunner Therma-FIT', 'jaqueta-windrunner-therma-fit', 'O icônico design chevron de 1978 combinado com isolamento térmico avançado.', 'NIK-WR-17', 749.90, 849.90, 'masculino', 'lifestyle', false, false, true, 4.89, 88),
('a1000000-0000-0000-0000-000000000018', 'b1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'Tênis Giannis Immortality 3', 'tenis-giannis-immortality-3', 'Desenhado para o jogo intenso e ágil no basquete com tração multidirecional.', 'NIK-GI-18', 599.90, 699.90, 'infantil', 'basquete', false, true, true, 4.75, 42),
('a1000000-0000-0000-0000-000000000019', 'b1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000006', 'Meia Nike Everyday Cushion (3 Pares)', 'meia-nike-everyday-cushion-3p', 'Amortecimento sob o calcanhar e ponta do pé com faixa no arco que envolve o pé.', 'NIK-SO-19', 89.90, NULL, 'unisex', 'general', false, false, false, 4.82, 190),
('a1000000-0000-0000-0000-000000000020', 'b1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'Tênis Air Force 1 07 Essential', 'tenis-air-force-1-07-essential', 'Lendária silhueta em couro branco com cápsula de ar embutida no solado.', 'NIK-AF1-20', 799.90, NULL, 'unisex', 'lifestyle', true, false, false, 4.96, 520),

-- ASICS (10 items)
('a1000000-0000-0000-0000-000000000021', 'b1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001', 'Tênis GEL-Nimbus 26 Max', 'tenis-gel-nimbus-26-max', 'A experiência máxima em suavidade com tecnologia PureGEL e espuma FF BLAST PLUS ECO.', 'ASC-NM-21', 1199.90, 1299.90, 'masculino', 'corrida', true, true, true, 4.93, 230),
('a1000000-0000-0000-0000-000000000022', 'b1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001', 'Tênis GEL-Kayano 30 Stability', 'tenis-gel-kayano-30-stability', 'Estabilidade adaptativa 4D GUIDANCE SYSTEM para prevenção de pronação em corridas longas.', 'ASC-KY-22', 1249.90, NULL, 'feminino', 'corrida', true, false, false, 4.91, 160),
('a1000000-0000-0000-0000-000000000023', 'b1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001', 'Tênis Novablast 4 Bounce', 'tenis-novablast-4-bounce', 'Geometria de entressola inspirada em trampolins com retorno de energia excepcional.', 'ASC-NB-23', 999.90, 1099.90, 'unisex', 'corrida', false, true, true, 4.88, 145),
('a1000000-0000-0000-0000-000000000024', 'b1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001', 'Tênis GEL-Pulse 14 All-Road', 'tenis-gel-pulse-14-all-road', 'Amortecimento confiável para iniciantes e intermediários com cabedal em engineered mesh.', 'ASC-PL-24', 499.90, 599.90, 'masculino', 'corrida', false, false, true, 4.70, 98),
('a1000000-0000-0000-0000-000000000025', 'b1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000002', 'Camiseta ASICS Seamless Run', 'camiseta-asics-seamless-run', 'Construção sem costuras laterais para evitar atrito em maratonas e treinos longos.', 'ASC-TS-25', 189.90, NULL, 'feminino', 'corrida', false, true, false, 4.65, 52),
('a1000000-0000-0000-0000-000000000026', 'b1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000003', 'Shorts ASICS Katakana 7"', 'shorts-asics-katakana-7', 'Tecido de secagem rápida com bolso traseiro à prova de suor para chave ou gel de carboidrato.', 'ASC-SH-26', 199.90, 239.90, 'masculino', 'corrida', false, false, true, 4.72, 40),
('a1000000-0000-0000-0000-000000000027', 'b1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000004', 'Legging ASICS Core High-Waist', 'legging-asics-core-high-waist', 'Legging de alta compressão e cós alto que não escorrega durante o agachamento.', 'ASC-LG-27', 299.90, NULL, 'feminino', 'academia', false, false, false, 4.85, 66),
('a1000000-0000-0000-0000-000000000028', 'b1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000005', 'Jaqueta ASICS Accelerate Waterproof', 'jaqueta-asics-accelerate-waterproof', 'Proteção 100% impermeável com costuras seladas para corridas sob chuva forte.', 'ASC-JK-28', 699.90, 799.90, 'unisex', 'corrida', true, false, true, 4.90, 31),
('a1000000-0000-0000-0000-000000000029', 'b1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000006', 'Viseira ASICS Performance Visor', 'viseira-asics-performance-visor', 'Viseira leve com tecido atoalhado interno e secagem hiper rápida.', 'ASC-VS-29', 99.90, NULL, 'unisex', 'corrida', false, false, false, 4.60, 28),
('a1000000-0000-0000-0000-000000000030', 'b1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001', 'Tênis Japan S Heritage', 'tenis-japan-s-heritage', 'Baseado em um modelo de 1981 com estampa de basquete retrô e perfil baixo elegante.', 'ASC-JP-30', 549.90, 629.90, 'unisex', 'lifestyle', false, false, true, 4.78, 115),

-- PUMA (10 items)
('a1000000-0000-0000-0000-000000000031', 'b1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000001', 'Tênis Deviate Nitro Elite 2', 'tenis-deviate-nitro-elite-2', 'Super tênis de competição com espuma com infusão de nitrogênio NITROFOAM Elite.', 'PUM-DN-31', 1499.90, 1699.90, 'masculino', 'corrida', true, true, true, 4.92, 110),
('a1000000-0000-0000-0000-000000000032', 'b1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000001', 'Tênis Suede Classic XXI', 'tenis-suede-classic-xxi', 'O lendário Puma Suede em camurça genuína com a clássica Formstrip lateral em contraste.', 'PUM-SD-32', 449.90, NULL, 'unisex', 'lifestyle', true, false, false, 4.94, 380),
('a1000000-0000-0000-0000-000000000033', 'b1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000001', 'Tênis Fuse 2.0 Training Pro', 'tenis-fuse-2-0-training-pro', 'Solado PUMAGRIP de borracha extrema e forma ampla no antepé para estabilidade total.', 'PUM-FS-33', 699.90, 799.90, 'masculino', 'academia', false, true, true, 4.81, 74),
('a1000000-0000-0000-0000-000000000034', 'b1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002', 'Camiseta Puma Graphic Cat', 'camiseta-puma-graphic-cat', 'Algodão macio BCI com o clássico logo PUMA Cat estampado no peito.', 'PUM-TS-34', 119.90, NULL, 'masculino', 'lifestyle', false, false, false, 4.60, 105),
('a1000000-0000-0000-0000-000000000035', 'b1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000003', 'Shorts Puma Fit Woven 7"', 'shorts-puma-fit-woven-7', 'Com tecnologia dryCELL de controle de umidade e bolso lateral com zíper.', 'PUM-SH-35', 189.90, 219.90, 'masculino', 'academia', false, false, true, 4.68, 48),
('a1000000-0000-0000-0000-000000000036', 'b1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000004', 'Calça Puma T7 Track Pants', 'calca-puma-t7-track-pants', 'Listras T7 de 7cm icônicas nas laterais com bolsos embutidos e caimento clássico.', 'PUM-PT-36', 399.90, NULL, 'unisex', 'lifestyle', false, true, false, 4.83, 92),
('a1000000-0000-0000-0000-000000000037', 'b1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000005', 'Jaqueta Puma Hooded Windbreaker', 'jaqueta-puma-hooded-windbreaker', 'Proteção com tecnologia windCELL projetada para manter o corpo aquecido sem esquentar.', 'PUM-JK-37', 429.90, 499.90, 'feminino', 'lifestyle', false, false, true, 4.75, 53),
('a1000000-0000-0000-0000-000000000038', 'b1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000001', 'Tênis Future Match FG/AG Futebol', 'tenis-future-match-fg-ag-futebol', 'Chuteira com cabedal FUZIONFIT360 que se adapta ao pé para dribles desconcertantes.', 'PUM-FT-38', 599.90, NULL, 'infantil', 'futebol', true, true, false, 4.88, 67),
('a1000000-0000-0000-0000-000000000039', 'b1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000006', 'Mala Puma Gym Duffel Bag 35L', 'mala-puma-gym-duffel-bag-35l', 'Mala esportiva com compartimento exclusivo para tênis e alça tiracolo acolchoada.', 'PUM-BG-39', 259.90, 299.90, 'unisex', 'academia', false, false, true, 4.70, 81),
('a1000000-0000-0000-0000-000000000040', 'b1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000001', 'Tênis RS-X Efekt Reflective', 'tenis-rs-x-efekt-reflective', 'Design futurista volumoso com detalhes refletivos e amortecimento Running System.', 'PUM-RS-40', 799.90, 899.90, 'masculino', 'lifestyle', true, false, true, 4.87, 130),

-- NEW BALANCE (10 items)
('a1000000-0000-0000-0000-000000000041', 'b1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000001', 'Tênis New Balance Fresh Foam X More v4', 'tenis-nb-fresh-foam-x-more-v4', 'A maior quantidade de espuma Fresh Foam X já colocada em um tênis para conforto absoluto.', 'NB-FF-41', 1099.90, 1299.90, 'masculino', 'corrida', true, true, true, 4.95, 175),
('a1000000-0000-0000-0000-000000000042', 'b1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000001', 'Tênis New Balance 550 Vintage White', 'tenis-nb-550-vintage-white', 'Homenagem aos jogadores de basquete dos anos 90 com silhueta limpa e couro resistente.', 'NB-550-42', 899.90, NULL, 'unisex', 'lifestyle', true, true, false, 4.97, 410),
('a1000000-0000-0000-0000-000000000043', 'b1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000001', 'Tênis New Balance 9060 Tech', 'tenis-nb-9060-tech', 'Reinterpretação arrojada dos elementos clássicos da série 99X com estética Y2K.', 'NB-9060-43', 1199.90, 1349.90, 'unisex', 'lifestyle', true, false, true, 4.93, 290),
('a1000000-0000-0000-0000-000000000044', 'b1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000001', 'Tênis FuelCell Rebel v3 Speed', 'tenis-fuelcell-rebel-v3-speed', 'Sensação de propulsão responsiva com entressola FuelCell para treinos de tiro e ritmo.', 'NB-FC-44', 949.90, NULL, 'feminino', 'corrida', false, false, false, 4.84, 88),
('a1000000-0000-0000-0000-000000000045', 'b1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002', 'Camiseta NB Athletics Heavyweight', 'camiseta-nb-athletics-heavyweight', 'Algodão de alta gramatura de 240g com bordado discreto no peito.', 'NB-TS-45', 199.90, NULL, 'masculino', 'lifestyle', false, true, false, 4.70, 44),
('a1000000-0000-0000-0000-000000000046', 'b1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000003', 'Shorts NB Impact Run 5"', 'shorts-nb-impact-run-5', 'Sensação de ventilação suprema com aberturas laterais e suporte interno sem atrito.', 'NB-SH-46', 229.90, 269.90, 'feminino', 'corrida', false, false, true, 4.81, 62),
('a1000000-0000-0000-0000-000000000047', 'b1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000004', 'Calça NB Essentials Stacked Logo', 'calca-nb-essentials-stacked-logo', 'Moletom macio em mistura de algodão com barras caneladas e cordão ajustável.', 'NB-PT-47', 379.90, NULL, 'masculino', 'lifestyle', false, false, false, 4.78, 73),
('a1000000-0000-0000-0000-000000000048', 'b1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000005', 'Jaqueta NB Tenacity Fleece Zip', 'jaqueta-nb-tenacity-fleece-zip', 'Tecido fleece elástico com retenção de calor e bolsos laterais com zíper.', 'NB-JK-48', 499.90, 579.90, 'masculino', 'academia', false, true, true, 4.86, 38),
('a1000000-0000-0000-0000-000000000049', 'b1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000006', 'Garrafa NB Performance Stainless Steel 750ml', 'garrafa-nb-performance-stainless-750ml', 'Isolamento a vácuo de parede dupla que mantém bebidas geladas por até 24 horas.', 'NB-BT-49', 149.90, NULL, 'unisex', 'general', false, false, false, 4.90, 99),
('a1000000-0000-0000-0000-000000000050', 'b1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000001', 'Tênis New Balance 2002R Protection Pack', 'tenis-nb-2002r-protection-pack', 'Camadas desconstruídas de camurça premium com solado N-ergy de alto amortecimento.', 'NB-2002-50', 1299.90, 1499.90, 'unisex', 'lifestyle', true, true, true, 4.98, 310);

-- PRODUCT IMAGES (At least 2-4 images per product)
-- Uses clean high-quality Unsplash sports URLs
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES
-- P1 (Ultraboost Light)
('a1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80', 'Tênis Ultraboost Light Tech Vista Lateral Red/Black', 1),
('a1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80', 'Tênis Ultraboost Light Tech Solado e Detalhes', 2),

-- P2 (Adizero)
('a1000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop&q=80', 'Tênis Adizero Boston 12 Pro Verde Esportivo', 1),
('a1000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80', 'Tênis Adizero Boston Detalhe Traseiro', 2),

-- P11 (Alphafly)
('a1000000-0000-0000-0000-000000000011', 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80', 'Tênis Air Zoom Alphafly NEXT% 3', 1),

-- P12 (Pegasus)
('a1000000-0000-0000-0000-000000000012', 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80', 'Tênis Pegasus 40 React', 1),

-- P21 (Nimbus)
('a1000000-0000-0000-0000-000000000021', 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&auto=format&fit=crop&q=80', 'Tênis GEL-Nimbus 26 Max', 1),

-- P31 (Deviate Nitro)
('a1000000-0000-0000-0000-000000000031', 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&auto=format&fit=crop&q=80', 'Tênis Deviate Nitro Elite 2', 1),

-- P41 (Fresh Foam)
('a1000000-0000-0000-0000-000000000041', 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&auto=format&fit=crop&q=80', 'Tênis New Balance Fresh Foam X', 1),

-- P42 (NB 550)
('a1000000-0000-0000-0000-000000000042', 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&auto=format&fit=crop&q=80', 'Tênis New Balance 550 Vintage White', 1);

-- Default images for any remaining products
INSERT INTO product_images (product_id, url, alt, sort_order)
SELECT id, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80', name, 1
FROM products
WHERE id NOT IN (SELECT DISTINCT product_id FROM product_images);

-- PRODUCT VARIANTS (Sizes, Colors, Stock)
-- Footwear variants (Sizes 38, 39, 40, 41, 42, 43, 44)
INSERT INTO product_variants (product_id, sku, size, color, color_name, stock)
SELECT p.id, p.sku || '-SZ' || sz, sz, '#0f172a', 'Preto/Vermelho', 15
FROM products p
CROSS JOIN (VALUES ('38'), ('39'), ('40'), ('41'), ('42'), ('43'), ('44')) AS sizes(sz)
WHERE p.category_id = 'c1000000-0000-0000-0000-000000000001';

-- Apparel & Accessory variants (Sizes P, M, G, GG)
INSERT INTO product_variants (product_id, sku, size, color, color_name, stock)
SELECT p.id, p.sku || '-SZ' || sz, sz, '#0f172a', 'Preto Grafite', 20
FROM products p
CROSS JOIN (VALUES ('P'), ('M'), ('G'), ('GG')) AS sizes(sz)
WHERE p.category_id != 'c1000000-0000-0000-0000-000000000001';
