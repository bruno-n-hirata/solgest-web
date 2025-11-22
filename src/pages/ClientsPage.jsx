import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import ClientForm from "../components/ClientForm.jsx";
import {
    FiCalendar,
    FiEdit2,
    FiDollarSign,
    FiSearch,
} from "react-icons/fi";

export default function ClientsPage() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showForm, setShowForm] = useState(false);
    const [formMode, setFormMode] = useState("create");
    const [editingClient, setEditingClient] = useState(null);

    const fetchClients = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch("/api/clients");
            if (!res.ok) {
                throw new Error("Erro ao buscar clientes");
            }

            const data = await res.json();
            setClients(data);
        } catch (err) {
            console.error(err);
            setError("Não foi possível carregar os clientes.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleAddClient = () => {
        setFormMode("create");
        setEditingClient(null);
        setShowForm(true);
    };

    const handleEditClient = (client) => {
        setFormMode("edit");
        setEditingClient(client);
        setShowForm(true);
    };

    const handleCancelForm = () => {
        setShowForm(false);
    };

    const handleSaveClient = async (data) => {
        try {
            let res;

            if (formMode === "create") {
                res = await fetch("/api/clients", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });
            } else {
                res = await fetch("/api/clients", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });
            }

            if (!res.ok) {
                console.error("Erro ao salvar cliente");
                return;
            }

            await fetchClients();

            setShowForm(false);
        } catch (err) {
            console.error("Erro no handleSaveClient:", err);
        }
    };

    return (
        <div className="shell">
            <Sidebar />

            <main className="main">
                <Topbar />

                <div className="page-content">
                    <h1 className="page-title">
                        {showForm
                            ? formMode === "edit"
                                ? "Clientes / Editar"
                                : "Clientes / Novo"
                            : "Clientes"}
                    </h1>

                    {showForm ? (
                        <ClientForm
                            mode={formMode}
                            initialData={editingClient ? editingClient : null }
                            onCancel={handleCancelForm}
                            onSave={handleSaveClient}
                        />
                    ) : (
                        <section className="card clients-card">
                            <div className="card-header">
                                <h2>Lista de Clientes</h2>

                                <button className="primary-btn" onClick={handleAddClient}>
                                    <span>+</span> Adicionar Cliente
                                </button>
                            </div>

                            <div className="filters-row">
                                <div className="search-box">
                                    <FiSearch className="search-icon" />
                                    <input
                                        type="text"
                                        placeholder="Buscar cliente por nome, email ou telefone..."
                                    />
                                </div>
                            </div>

                            <div className="table-wrapper">
                                {loading && <div style={{ padding: 16 }}>Carregando clientes...</div>}
                                {error && !loading && (
                                    <div style={{ padding: 16, color: "#b91c1c" }}>{error}</div>
                                )}

                                {!loading && !error && (
                                    <>
                                        <table className="clients-table">
                                            <thead>
                                            <tr>
                                                <th>Nome</th>
                                                <th>Telefone</th>
                                                <th>Email</th>
                                                <th>Consumo Médio (kWh)</th>
                                                <th className="th-actions">Ações</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {clients.map((client) => (
                                                <tr key={client.cliente_id}>
                                                    <td className="cell-name">{client.nome}</td>
                                                    <td>{client.telefone}</td>
                                                    <td>{client.email}</td>
                                                    <td>{client.consumo_medio}</td>
                                                    <td className="cell-actions">
                                                        <button className="link-button" onClick={() => handleEditClient(client)}>
                                                            <FiEdit2 className="action-icon" /> Editar
                                                        </button>
                                                        <button className="link-button">
                                                            <FiCalendar className="action-icon" /> Agendar Visita
                                                        </button>
                                                        <button className="link-button">
                                                            <FiDollarSign className="action-icon" /> Calcular Orçamento
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>

                                        <div className="table-footer">
                                            {clients.length === 0
                                                ? "Nenhum cliente cadastrado"
                                                : `Mostrando ${clients.length} cliente(s)`}
                                        </div>
                                    </>
                                )}
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
}
