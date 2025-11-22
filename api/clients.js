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
            const { name, email } = body;

            if (!name || !email) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'name e email são obrigatórios' }));
                return;
            }

            const result = await sql`
                INSERT INTO cliente (name, email)
                VALUES (${name}, ${email})
                RETURNING id, name, email, created_at
            `;

            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result[0]));
            return;
        }

        if (method === 'PUT') {
            const body = await getJsonBody(req);
            const { id, name, email } = body;

            if (!id) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'id é obrigatório para atualizar' }));
                return;
            }

            const result = await sql`
                UPDATE users
                SET
                    name = COALESCE(${name}, name),
                    email = COALESCE(${email}, email)
                WHERE id = ${id}
                RETURNING id, name, email, created_at
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
