INSERT INTO cliente (nome, cpf_cnpj, email, telefone, logradouro, numero, bairro, cidade, uf, cep)
VALUES
 ('Ana Souza',  '123.456.789-00', 'ana@exemplo.com', '(44) 90000-0001', 'Rua A', '100', 'Centro', 'Maringá', 'PR', '87000-000'),
 ('Bruno Lima', '45.123.456/0001-55', 'bruno@exemplo.com', '(44) 90000-0002', 'Av. B', '200', 'Zona 1', 'Maringá', 'PR', '87010-000');

INSERT INTO equipe (nome, ativo) VALUES
 ('Equipe Alfa', TRUE),
 ('Equipe Beta', TRUE);

INSERT INTO tecnico (nome, cpf, email, telefone, ativo) VALUES
 ('Carla Mendes',  '111.222.333-44', 'carla@empresa.com', '(44) 90000-1001', TRUE),
 ('Diego Rocha',   '222.333.444-55', 'diego@empresa.com', '(44) 90000-1002', TRUE),
 ('Eduarda Pires', '333.444.555-66', 'eduarda@empresa.com', '(44) 90000-1003', TRUE);

INSERT INTO equipe_tecnico (equipe_id, tecnico_id, funcao)
SELECT e.equipe_id, t.tecnico_id, 'Eletricista'
FROM equipe e, tecnico t
WHERE e.nome = 'Equipe Alfa' AND t.nome = 'Carla Mendes';

INSERT INTO equipe_tecnico (equipe_id, tecnico_id, funcao)
SELECT e.equipe_id, t.tecnico_id, 'Instalador'
FROM equipe e, tecnico t
WHERE e.nome = 'Equipe Alfa' AND t.nome = 'Diego Rocha';

INSERT INTO equipe_tecnico (equipe_id, tecnico_id, funcao)
SELECT e.equipe_id, t.tecnico_id, 'Líder de Campo'
FROM equipe e, tecnico t
WHERE e.nome = 'Equipe Beta' AND t.nome = 'Eduarda Pires';

INSERT INTO produto (nome, tipo, preco, unidade) VALUES
 ('Painel 550W',      'painel',   950.00,  'pc'),
 ('Inversor 5kW',     'inversor', 3200.00, 'pc'),
 ('Estrutura Telhado','estrutura',450.00,  'pc'),
 ('Cabo 6mm',         'cabo',     12.50,   'm');

INSERT INTO projeto (titulo, descricao, status, valor_estimado, data_solicitacao, data_aprovacao, consumo_medio, cliente_id)
SELECT 'Residencial Ana - 5kWp', 'Projeto residencial 5kWp', 'aprovado', 15000.00, CURRENT_DATE - 7, CURRENT_DATE - 5, 420.0, c.cliente_id
FROM cliente c WHERE c.nome = 'Ana Souza';

INSERT INTO projeto (titulo, descricao, status, valor_estimado, data_solicitacao, data_aprovacao, consumo_medio, cliente_id)
SELECT 'Residencial Bruno - 8kWp', 'Projeto residencial 8kWp', 'pendente', NULL, CURRENT_DATE - 2, NULL, 680.0, c.cliente_id
FROM cliente c WHERE c.nome = 'Bruno Lima';

INSERT INTO produto_projeto (projeto_id, produto_id, quantidade, observacao)
SELECT p.projeto_id, pr.produto_id, 10, '10 painéis 550W'
FROM projeto p, produto pr
WHERE p.titulo = 'Residencial Ana - 5kWp' AND pr.nome = 'Painel 550W';

INSERT INTO visita_tecnica (data_agendada, status, observacao, projeto_id, equipe_id)
SELECT CURRENT_DATE + TIME '09:00', 'agendada', 'Primeira visita', p.projeto_id, e.equipe_id
FROM projeto p, equipe e
WHERE p.titulo = 'Residencial Ana - 5kWp' AND e.nome = 'Equipe Alfa';
