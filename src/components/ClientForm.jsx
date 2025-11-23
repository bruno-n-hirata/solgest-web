import React, { useState, useEffect } from "react";

const EMPTY_CLIENT = {
    nome: "",
    cpf_cnpj: "",
    telefone: "",
    email: "",
    consumo_medio: "",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: "",
};

export default function ClientForm({ mode = "create", initialData, onCancel, onSave }) {
    const [client, setClient] = useState(EMPTY_CLIENT);
    const [addressEnabled, setAddressEnabled] = useState(false);
    const [errors, setErrors] = useState({});
    const [isCepLoading, setIsCepLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setClient({ ...EMPTY_CLIENT, ...initialData });
        } else {
            setClient(EMPTY_CLIENT);
        }
    }, [initialData]);

    const handleChange = (field) => (event) => {
        const value = event.target.value;

        setClient((prev) => ({
            ...prev,
            [field]: value,
        }));

        setErrors((prev) => {
            if (!prev[field]) return prev;
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    };

    const handleCepChange = (event) => {
        let value = event.target.value.replace(/\D/g, "");

        if (value.length > 8) {
            value = value.slice(0, 8);
        }

        if (value.length > 5) {
            value = value.replace(/^(\d{5})(\d{0,3})$/, "$1-$2");
        }

        clearAddressFields();

        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.logradouro;
            delete newErrors.bairro;
            delete newErrors.cidade;
            delete newErrors.uf;
            delete newErrors.numero;
            delete newErrors.cep;
            return newErrors;
        });

        setClient((prev) => ({ ...prev, cep: value }));

        const digitsCount = value.replace(/\D/g, "").length;
        if (digitsCount < 8) {
            setAddressEnabled(false);
        }
    };

    const handlePhoneChange = (event) => {
        let value = event.target.value.replace(/\D/g, "");

        if (value.length > 11) {
            value = value.slice(0, 11);
        }

        let formatted = value;

        if (value.length > 0 && value.length <= 2) {
            formatted = `(${value}`;
        }

        if (value.length > 2 && value.length <= 6) {
            formatted = `(${value.slice(0, 2)}) ${value.slice(2)}`;
        }

        if (value.length > 6 && value.length <= 10) {
            formatted = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
        }

        if (value.length === 11) {
            formatted = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
        }

        setClient((prev) => ({
            ...prev,
            telefone: formatted,
        }));

        setErrors((prev) => {
            if (!prev.telefone) return prev;
            const newErrors = { ...prev };
            delete newErrors.telefone;
            return newErrors;
        });
    };

    const handleDocumentChange = (event) => {
        let value = event.target.value.replace(/\D/g, "");

        if (value.length > 14) {
            value = value.slice(0, 14);
        }

        let formatted = value;

        if (value.length <= 11) {
            if (value.length > 3 && value.length <= 6) {
                formatted = `${value.slice(0, 3)}.${value.slice(3)}`;
            }
            if (value.length > 6 && value.length <= 9) {
                formatted = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}`;
            }
            if (value.length > 9) {
                formatted = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9)}`;
            }
        } else {
            if (value.length <= 12) {
                formatted =
                    `${value.slice(0, 2)}.` +
                    `${value.slice(2, 5)}.` +
                    `${value.slice(5, 8)}/` +
                    `${value.slice(8)}`;
            } else {
                formatted =
                    `${value.slice(0, 2)}.` +
                    `${value.slice(2, 5)}.` +
                    `${value.slice(5, 8)}/` +
                    `${value.slice(8, 12)}-` +
                    `${value.slice(12)}`;
            }
        }

        setClient((prev) => ({
            ...prev,
            cpf_cnpj: formatted,
        }));

        setErrors((prev) => {
            if (!prev.cpf_cnpj) return prev;
            const newErrors = { ...prev };
            delete newErrors.cpf_cnpj;
            return newErrors;
        });
    };

    const handleConsumoChange = (event) => {
        let value = event.target.value.replace(/\D/g, "");

        setClient((prev) => ({
            ...prev,
            consumo_medio: value,
        }));

        setErrors((prev) => {
            if (!prev.consumo_medio) return prev;
            const newErrors = { ...prev };
            delete newErrors.consumo_medio;
            return newErrors;
        });
    };

    const handleCepBlur = async () => {
        const cepLimpo = client.cep.replace(/\D/g, "");

        if (cepLimpo.length !== 8) {
            clearAddressFields();
            setAddressEnabled(false);
            setIsCepLoading(false);
            return;
        }

        setIsCepLoading(true);

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
                logradouro: data.logradouro || "",
                bairro: data.bairro || "",
                cidade: data.localidade || "",
                uf: data.uf || "",
            }));

            setAddressEnabled(false);
        } catch (e) {
            clearAddressFields();
            setAddressEnabled(true);
        } finally {
            setIsCepLoading(false);
        }
    };

    const clearAddressFields = () => {
        setClient((prev) => ({
            ...prev,
            logradouro: "",
            numero: "",
            complemento: "",
            bairro: "",
            cidade: "",
            uf: "",
        }));
    };

    const validate = () => {
        const newErrors = {};
        const digitsDoc = client.cpf_cnpj.replace(/\D/g, "");
        const digitsPhone = client.telefone.replace(/\D/g, "");
        const digitsCep = client.cep.replace(/\D/g, "");
        const consumo = client.consumo_medio;

        if (!client.nome.trim()) {
            newErrors.nome = "Informe o nome completo.";
        }

        if (!client.cpf_cnpj.trim()) {
            newErrors.cpf_cnpj = "Informe o CPF ou CNPJ.";
        } else if (digitsDoc.length !== 11 && digitsDoc.length !== 14) {
            newErrors.cpf_cnpj = "CPF deve ter 11 dígitos ou CNPJ 14 dígitos.";
        }

        if (!client.telefone.trim()) {
            newErrors.telefone = "Informe o telefone.";
        } else if (digitsPhone.length < 10 || digitsPhone.length > 11) {
            newErrors.telefone = "Telefone deve ter 10 ou 11 dígitos.";
        }

        if (!client.email.trim()) {
            newErrors.email = "Informe o e-mail.";
        } else {
            const emailRegex = /\S+@\S+\.\S+/;
            if (!emailRegex.test(client.email)) {
                newErrors.email = "Informe um e-mail válido.";
            }
        }

        if (consumo === "" || consumo === null) {
            newErrors.consumo_medio = "Informe o consumo médio mensal.";
        } else if (Number(consumo) < 0) {
            newErrors.consumo_medio = "O consumo não pode ser negativo.";
        }

        if (!client.cep.trim()) {
            newErrors.cep = "Informe o CEP.";
        } else if (digitsCep.length !== 8) {
            newErrors.cep = "CEP deve ter 8 dígitos.";
        }

        if (!client.logradouro.trim()) {
            newErrors.logradouro = "Informe a rua.";
        }

        if (!client.numero.trim()) {
            newErrors.numero = "Informe o número.";
        }

        if (!client.bairro.trim()) {
            newErrors.bairro = "Informe o bairro.";
        }

        if (!client.cidade.trim()) {
            newErrors.cidade = "Informe a cidade.";
        }

        if (!client.uf.trim()) {
            newErrors.uf = "Selecione o estado.";
        }

        return newErrors;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        onSave?.(client);
    };

    const getInputClass = (field) =>
        errors[field] ? "input-error" : "";

    return (
        <section className="card client-form-card">
            <div className="client-form-header">
                <h2>{mode === "edit" ? "Editar Cliente" : "Cadastrar Cliente"}</h2>
            </div>

            <form onSubmit={handleSubmit} className="client-form" noValidate>
                <div className="form-grid">
                    <div className="form-field">
                        <label>Nome Completo</label>
                        <input
                            type="text"
                            placeholder="Nome Completo do Cliente"
                            value={client.nome}
                            onChange={handleChange("nome")}
                            className={getInputClass("nome")}
                        />
                        {errors.nome && (
                            <span className="error-text">{errors.nome}</span>
                        )}
                    </div>

                    <div className="form-field">
                        <label>CPF/CNPJ</label>
                        <input
                            type="text"
                            placeholder="000.000.000-00 ou 00.000.000/0000-00"
                            value={client.cpf_cnpj}
                            onChange={handleDocumentChange}
                            inputMode="numeric"
                            maxLength={18}
                            className={getInputClass("cpf_cnpj")}
                        />
                        {errors.cpf_cnpj && (
                            <span className="error-text">{errors.cpf_cnpj}</span>
                        )}
                    </div>

                    <div className="form-field">
                        <label>Telefone</label>
                        <input
                            type="text"
                            placeholder="(00) 00000-0000"
                            value={client.telefone}
                            onChange={handlePhoneChange}
                            inputMode="numeric"
                            maxLength={15}
                            className={getInputClass("telefone")}
                        />
                        {errors.telefone && (
                            <span className="error-text">{errors.telefone}</span>
                        )}
                    </div>

                    <div className="form-field">
                        <label>E-mail</label>
                        <input
                            type="email"
                            placeholder="email@example.com"
                            value={client.email}
                            onChange={handleChange("email")}
                            className={getInputClass("email")}
                        />
                        {errors.email && (
                            <span className="error-text">{errors.email}</span>
                        )}
                    </div>

                    <div className="form-field">
                        <label>Consumo Médio Mensal (kWh)</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="\d*"
                            placeholder="0"
                            value={client.consumo_medio}
                            onChange={handleConsumoChange}
                            className={getInputClass("consumo_medio")}
                        />
                        {errors.consumo_medio && (
                            <span className="error-text">{errors.consumo_medio}</span>
                        )}
                    </div>
                </div>

                <div className="form-grid">
                    <div className="form-field">
                        <label>CEP</label>
                        <div className="input-with-loader">
                            <input
                                type="text"
                                placeholder="00000-000"
                                value={client.cep}
                                onChange={handleCepChange}
                                onBlur={handleCepBlur}
                                inputMode="numeric"
                                pattern="\d*"
                                maxLength={9}
                                className={getInputClass("cep")}
                            />
                            {isCepLoading && (
                                <span
                                    className="input-loader"
                                    aria-label="Buscando CEP..."
                                />
                            )}
                        </div>
                        {errors.cep && (
                            <span className="error-text">{errors.cep}</span>
                        )}
                    </div>

                    <div className="form-field">
                        <label>Rua</label>
                        <input
                            type="text"
                            placeholder="Nome da Rua"
                            value={client.logradouro}
                            onChange={handleChange("logradouro")}
                            disabled={!addressEnabled}
                            className={getInputClass("logradouro")}
                        />
                        {errors.logradouro && (
                            <span className="error-text">{errors.logradouro}</span>
                        )}
                    </div>

                    <div className="form-field">
                        <label>Número</label>
                        <input
                            type="text"
                            placeholder="Ex: 123"
                            value={client.numero}
                            onChange={handleChange("numero")}
                            className={getInputClass("numero")}
                        />
                        {errors.numero && (
                            <span className="error-text">{errors.numero}</span>
                        )}
                    </div>

                    <div className="form-field">
                        <label>Complemento (Opcional)</label>
                        <input
                            type="text"
                            placeholder="Ex: Apto 101"
                            value={client.complemento}
                            onChange={handleChange("complemento")}
                        />
                    </div>

                    <div className="form-field">
                        <label>Bairro</label>
                        <input
                            type="text"
                            placeholder="Nome do Bairro"
                            value={client.bairro}
                            onChange={handleChange("bairro")}
                            disabled={!addressEnabled}
                            className={getInputClass("bairro")}
                        />
                        {errors.bairro && (
                            <span className="error-text">{errors.bairro}</span>
                        )}
                    </div>

                    <div className="form-field">
                        <label>Cidade</label>
                        <input
                            type="text"
                            placeholder="Nome da Cidade"
                            value={client.cidade}
                            onChange={handleChange("cidade")}
                            disabled={!addressEnabled}
                            className={getInputClass("cidade")}
                        />
                        {errors.cidade && (
                            <span className="error-text">{errors.cidade}</span>
                        )}
                    </div>

                    <div className="form-field">
                        <label>Estado</label>
                        <select
                            value={client.uf}
                            onChange={handleChange("uf")}
                            disabled={!addressEnabled}
                            className={getInputClass("uf")}
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
                        {errors.uf && (
                            <span className="error-text">{errors.uf}</span>
                        )}
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
