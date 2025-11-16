import { useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import ClientForm from "../components/ClientForm.jsx";
import SolgestLogo from "../assets/logo.png";
import {
    FiMapPin,
    FiCalendar,
    FiFileText,
    FiUsers,
    FiBox,
    FiEdit2,
    FiDollarSign,
    FiSearch,
    FiChevronDown,
} from "react-icons/fi";

const clientsMock = [
    {
        id: 1,
        name: "SolarTech Inovações Ltda.",
        phone: "(11) 98765-4321",
        email: "contato@solartech.com.br",
        consumption: 550,
        status: "Ativo",
    },
    {
        id: 2,
        name: "Energia Viva Residencial",
        phone: "(21) 91234-5678",
        email: "maria.silva@energiaviva.com.br",
        consumption: 320,
        status: "Ativo",
    },
    {
        id: 3,
        name: "Fazenda Sustentável Agro",
        phone: "(31) 93456-7890",
        email: "joao.fazenda@agro.com.br",
        consumption: 1200,
        status: "Inativo",
    },
];

export default function ClientsPage() {
    const [clients, setClients] = useState(clientsMock);
    const [showForm, setShowForm] = useState(false);
    const [formMode, setFormMode] = useState("create"); // 'create' | 'edit'
    const [editingClient, setEditingClient] = useState(null);

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

    const handleSaveClient = (data) => {
        if (formMode === "create") {
            const newClient = {
                id: clients.length + 1,
                name: data.fullName,
                phone: data.phone,
                email: data.email,
                consumption: Number(data.averageConsumption || 0),
                status: "Ativo",
                // você pode guardar também o restante dos campos se quiser
            };
            setClients((prev) => [...prev, newClient]);
        } else if (formMode === "edit" && editingClient) {
            setClients((prev) =>
                prev.map((c) =>
                    c.id === editingClient.id
                        ? {
                            ...c,
                            name: data.fullName,
                            phone: data.phone,
                            email: data.email,
                            consumption: Number(data.averageConsumption || 0),
                        }
                        : c
                )
            );
        }
        setShowForm(false);
    };

    return (
        <div className="shell">
            <Sidebar />

            {/* Conteúdo principal */}
            <main className="main">
                <Topbar />

                {/* área de conteúdo da página */}
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
                            initialData={
                                editingClient
                                    ? {
                                        fullName: editingClient.name,
                                        phone: editingClient.phone,
                                        email: editingClient.email,
                                        averageConsumption: editingClient.consumption,
                                    }
                                    : null
                            }
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

                                <button className="filter-select">
                                    <span>Todos</span>
                                    <FiChevronDown />
                                </button>
                            </div>

                            <div className="table-wrapper">
                                <table className="clients-table">
                                    <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Telefone</th>
                                        <th>Email</th>
                                        <th>Consumo Médio (kWh)</th>
                                        <th>Status</th>
                                        <th className="th-actions">Ações</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {clients.map((client) => (
                                        <tr key={client.id}>
                                            <td className="cell-name">{client.name}</td>
                                            <td>{client.phone}</td>
                                            <td>{client.email}</td>
                                            <td>{client.consumption}</td>
                                            <td>
                              <span
                                  className={
                                      client.status === "Ativo"
                                          ? "badge badge-active"
                                          : "badge badge-inactive"
                                  }
                              >
                                {client.status}
                              </span>
                                            </td>
                                            <td className="cell-actions">
                                                <button
                                                    className="link-button"
                                                    onClick={() => handleEditClient(client)}
                                                >
                                                    <FiEdit2 className="action-icon" /> Editar
                                                </button>
                                                <button className="link-button">
                                                    <FiCalendar className="action-icon" /> Agendar Visita
                                                </button>
                                                <button className="link-button">
                                                    <FiDollarSign className="action-icon" /> Calcular
                                                    Orçamento
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>

                                <div className="table-footer">
                                    Mostrando 1 a 5 de 5 clientes
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
}
