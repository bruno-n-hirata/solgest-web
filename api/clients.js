import { sql } from '../lib/db.js';

function getJsonBody(req) {
    return new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });
        req.on('end', () => {
            try {
                resolve(data ? JSON.parse(data) : {});
            } catch (err) {
                reject(err);
            }
        });
        req.on('error', reject);
    });
}

export default async function handler(req, res) {
    const { method } = req;

    try {
        if (method === 'GET') {
            const result = await sql`
                SELECT *
                FROM cliente
                ORDER BY nome
            `;
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result));
            return;
        }

        if (method === 'POST') {
            const body = await getJsonBody(req);
            const { nome, cpf_cnpj, email, telefone, logradouro, numero, complemento, bairro, cidade, uf, cep, consumo_medio } = body;

            if (!nome || !email) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Nome e email são obrigatórios' }));
                return;
            }

            const result = await sql`
                INSERT INTO cliente (nome, cpf_cnpj, email, telefone, logradouro, numero, complemento, bairro, cidade, uf, cep, consumo_medio)
                VALUES (${nome}, ${cpf_cnpj}, ${email}, ${telefone}, ${logradouro}, ${numero}, ${complemento}, ${bairro}, ${cidade}, ${uf}, ${cep}, ${consumo_medio})
                RETURNING cliente_id
            `;

            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result[0]));
            return;
        }

        if (method === 'PUT') {
            const body = await getJsonBody(req);
            const { cliente_id, nome, cpf_cnpj, email, telefone, logradouro, numero, complemento, bairro, cidade, uf, cep, consumo_medio } = body;

            if (!cliente_id) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Id é obrigatório para atualizar' }));
                return;
            }

            const result = await sql`
                UPDATE cliente
                SET
                    nome = COALESCE(${nome}, nome),
                    cpf_cnpj = COALESCE(${cpf_cnpj}, cpf_cnpj),
                    email = COALESCE(${email}, email),
                    telefone = COALESCE(${telefone}, telefone),
                    logradouro = COALESCE(${logradouro}, logradouro),
                    numero = COALESCE(${numero}, numero),
                    complemento = COALESCE(${complemento}, complemento),
                    bairro = COALESCE(${bairro}, bairro),
                    cidade = COALESCE(${cidade}, cidade),
                    uf = COALESCE(${uf}, uf),
                    cep = COALESCE(${cep}, cep),
                    consumo_medio = COALESCE(${consumo_medio}, consumo_medio)
                WHERE cliente_id = ${cliente_id}
                RETURNING cliente_id
            `;

            if (result.length === 0) {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: 'Cliente não encontrado' }));
                return;
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result[0]));
            return;
        }

        res.statusCode = 405;
        res.setHeader('Allow', 'GET,POST,PUT');
        res.end(`Método ${method} não permitido`);
    } catch (err) {
        console.error('Erro na /api/clients:', err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Erro interno no servidor' }));
    }
};
