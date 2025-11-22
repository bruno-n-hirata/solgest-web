SELECT p.projeto_id, p.titulo, p.status, c.nome AS cliente
FROM projeto p
JOIN cliente c ON c.cliente_id = p.cliente_id
ORDER BY p.titulo;

SELECT p.titulo AS projeto, pr.nome AS produto, pp.quantidade, pr.unidade
FROM projeto p
JOIN produto_projeto pp ON pp.projeto_id = p.projeto_id
JOIN produto pr ON pr.produto_id = pp.produto_id
ORDER BY p.titulo, pr.nome;

SELECT vt.visita_tecnica_id,
       vt.status,
       vt.data_agendada,
       p.titulo AS projeto,
       e.nome AS equipe,
       t.nome AS tecnico,
       et.funcao
FROM visita_tecnica vt
JOIN projeto p ON p.projeto_id = vt.projeto_id
JOIN equipe e ON e.equipe_id = vt.equipe_id
LEFT JOIN equipe_tecnico et ON et.equipe_id = e.equipe_id
LEFT JOIN tecnico t ON t.tecnico_id = et.tecnico_id
ORDER BY vt.data_agendada;

SELECT vt.*
FROM visita_tecnica vt
LEFT JOIN projeto p ON p.projeto_id = vt.projeto_id
WHERE p.projeto_id IS NULL;

SELECT e.nome AS equipe, COUNT(*) AS qt_visitas_futuras
FROM visita_tecnica vt
JOIN equipe e ON e.equipe_id = vt.equipe_id
WHERE vt.data_agendada::date >= CURRENT_DATE
GROUP BY e.nome
ORDER BY e.nome;

SELECT p.projeto_id,
       p.titulo,
       p.valor_estimado,
       SUM(pp.quantidade * pr.preco) AS valor_itens
FROM projeto p
JOIN produto_projeto pp ON pp.projeto_id = p.projeto_id
JOIN produto pr ON pr.produto_id = pp.produto_id
GROUP BY p.projeto_id, p.titulo, p.valor_estimado
ORDER BY p.titulo;

SELECT status, COUNT(*) AS quantidade
FROM projeto
GROUP BY status
ORDER BY status;
