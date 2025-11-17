export default async function handler(req, res) {
    const { cep } = req.query;

    const cepLimpo = String(cep || "").replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
        return res.status(400).json({ error: "CEP inválido" });
    }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);

        if (!response.ok) {
            return res.status(502).json({ error: "Erro ao consultar serviço externo" });
        }

        const data = await response.json();

        if (data.erro) {
            return res.status(404).json({ error: "CEP não encontrado" });
        }

        return res.status(200).json(data);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Erro interno ao buscar CEP" });
    }
}
