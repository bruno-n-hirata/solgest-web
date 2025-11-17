import React, { useState, useEffect } from "react";

const EMPTY_CLIENT = {
    fullName: "",
    document: "",
    phone: "",
    email: "",
    averageConsumption: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    district: "",
    city: "",
    state: "",
};

export default function ClientForm({ mode = "create", initialData, onCancel, onSave }) {
    const [client, setClient] = useState(EMPTY_CLIENT);
    const [addressEnabled, setAddressEnabled] = useState(false);

    useEffect(() => {
        if (initialData) {
            setClient({ ...EMPTY_CLIENT, ...initialData });
        } else {
            setClient(EMPTY_CLIENT);
        }
    }, [initialData]);

    const handleChange = (field) => (event) => {
        setClient((prev) => ({
            ...prev,
            [field]: event.target.value,
        }));
    };

    const handleCepChange = (event) => {
        let value = event.target.value.replace(/\D/g, "");

        if (value.length > 8) {
            value = value.slice(0, 8);
        }

        if (value.length > 5) {
            value = value.replace(/^(\d{5})(\d{0,3})$/, "$1-$2");
        }

        setClient((prev) => ({ ...prev, cep: value }));

        const digitsCount = value.replace(/\D/g, "").length;
        if (digitsCount < 8) {
            setAddressEnabled(false);
        }
    };

    const handleCepBlur = async () => {
        const cepLimpo = client.cep.replace(/\D/g, "");

        if (cepLimpo.length !== 8) {
            clearAddressFields();
            setAddressEnabled(false);
            return;
        }

        try {
            const res = await fetch(`/api/cep?cep=${cepLimpo}`);

            if (!res.ok) {
                clearAddressFields();
                setAddressEnabled(true);
                return;
            }

            const data = await res.json();

            if (data.error) {
                clearAddressFields();
                setAddressEnabled(true);
                return;
            }

            setClient((prev) => ({
                ...prev,
                street: data.logradouro || "",
                district: data.bairro || "",
                city: data.localidade || "",
                state: data.uf || "",
            }));

            setAddressEnabled(false);
        } catch (e) {
            clearAddressFields();
            setAddressEnabled(true);
        }
    };

    const clearAddressFields = () => {
        setClient((prev) => ({
            ...prev,
            street: "",
            number: "",
            complement: "",
            district: "",
            city: "",
            state: "",
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // aqui você depois pode validar e chamar API
        onSave?.(client);
    };

    return (
        <section className="card client-form-card">
            <div className="client-form-header">
                <h2>{mode === "edit" ? "Editar Cliente" : "Cadastrar Cliente"}</h2>
            </div>

            <form onSubmit={handleSubmit} className="client-form">
                <div className="form-grid">
                    <div className="form-field">
                        <label>Nome Completo</label>
                        <input
                            type="text"
                            placeholder="Nome Completo do Cliente"
                            value={client.fullName}
                            onChange={handleChange("fullName")}
                        />
                    </div>

                    <div className="form-field">
                        <label>CPF/CNPJ</label>
                        <input
                            type="text"
                            placeholder="000.000.000-00 ou 00.000.000/0000-00"
                            value={client.document}
                            onChange={handleChange("document")}
                        />
                    </div>

                    <div className="form-field">
                        <label>Telefone</label>
                        <input
                            type="text"
                            placeholder="(00) 00000-0000"
                            value={client.phone}
                            onChange={handleChange("phone")}
                        />
                    </div>

                    <div className="form-field">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="email@example.com"
                            value={client.email}
                            onChange={handleChange("email")}
                        />
                    </div>

                    <div className="form-field">
                        <label>Consumo Médio Mensal (kWh)</label>
                        <input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={client.averageConsumption}
                            onChange={handleChange("averageConsumption")}
                        />
                    </div>
                </div>

                <div className="form-grid">
                    <div className="form-field">
                        <label>CEP</label>
                        <input
                            type="text"
                            placeholder="00000-000"
                            value={client.cep}
                            onChange={handleCepChange}
                            onBlur={handleCepBlur}
                            inputMode="numeric"
                            pattern="\d*"
                            maxLength={9}
                        />
                    </div>

                    <div className="form-field">
                        <label>Rua</label>
                        <input
                            type="text"
                            placeholder="Nome da Rua"
                            value={client.street}
                            onChange={handleChange("street")}
                            disabled={!addressEnabled}
                        />
                    </div>

                    <div className="form-field">
                        <label>Número</label>
                        <input
                            type="text"
                            placeholder="Ex: 123"
                            value={client.number}
                            onChange={handleChange("number")}
                        />
                    </div>

                    <div className="form-field">
                        <label>Complemento (Opcional)</label>
                        <input
                            type="text"
                            placeholder="Ex: Apto 101"
                            value={client.complement}
                            onChange={handleChange("complement")}
                        />
                    </div>

                    <div className="form-field">
                        <label>Bairro</label>
                        <input
                            type="text"
                            placeholder="Nome do Bairro"
                            value={client.district}
                            onChange={handleChange("district")}
                            disabled={!addressEnabled}
                        />
                    </div>

                    <div className="form-field">
                        <label>Cidade</label>
                        <input
                            type="text"
                            placeholder="Nome da Cidade"
                            value={client.city}
                            onChange={handleChange("city")}
                            disabled={!addressEnabled}
                        />
                    </div>

                    <div className="form-field">
                        <label>Estado</label>
                        <select
                            value={client.state}
                            onChange={handleChange("state")}
                            disabled={!addressEnabled}
                        >
                            <option value="">Selecione um Estado</option>
                            <option value="AC">AC</option>
                            <option value="AL">AL</option>
                            <option value="AP">AP</option>
                            <option value="AM">AM</option>
                            <option value="BA">BA</option>
                            <option value="CE">CE</option>
                            <option value="DF">DF</option>
                            <option value="ES">ES</option>
                            <option value="GO">GO</option>
                            <option value="MA">MA</option>
                            <option value="MT">MT</option>
                            <option value="MS">MS</option>
                            <option value="MG">MG</option>
                            <option value="PA">PA</option>
                            <option value="PB">PB</option>
                            <option value="PR">PR</option>
                            <option value="PE">PE</option>
                            <option value="PI">PI</option>
                            <option value="RJ">RJ</option>
                            <option value="RN">RN</option>
                            <option value="RS">RS</option>
                            <option value="RO">RO</option>
                            <option value="RR">RR</option>
                            <option value="SC">SC</option>
                            <option value="SP">SP</option>
                            <option value="SE">SE</option>
                            <option value="TO">TO</option>
                        </select>
                    </div>
                </div>

                <div className="client-form-footer">
                    <button
                        type="button"
                        className="secondary-btn"
                        onClick={onCancel}
                    >
                        Cancelar
                    </button>
                    <button type="submit" className="primary-btn">
                        {mode === "edit" ? "Salvar Alterações" : "Cadastrar Cliente"}
                    </button>
                </div>
            </form>
        </section>
    );
}
