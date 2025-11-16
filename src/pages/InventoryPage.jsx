import React, { useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import {
    FiSearch,
    FiEdit2,
    FiTrash2,
} from "react-icons/fi";

const inventoryItems = [
    {
        id: 1,
        name: "Painel Solar 450W",
        type: "Monocristalino",
        quantity: 150,
        minLevel: 20,
        location: "Armazém A",
        status: "Em Estoque",
    },
    {
        id: 2,
        name: "Inversor",
        type: "Híbrido",
        quantity: 30,
        minLevel: 5,
        location: "Armazém B",
        status: "Em Estoque",
    },
    {
        id: 3,
        name: "Estrutura Montagem Telhado",
        type: "Alumínio",
        quantity: 50,
        minLevel: 100,
        location: "Armazém A",
        status: "Baixo Estoque",
    },
    {
        id: 4,
        name: "Cabo Solar 6mm",
        type: "Cobre",
        quantity: 2000,
        minLevel: 500,
        location: "Armazém C",
        status: "Em Estoque",
    },
    {
        id: 5,
        name: "Conector MC4",
        type: "Plástico",
        quantity: 10,
        minLevel: 50,
        location: "Armazém B",
        status: "Baixo Estoque",
    },
];

export default function InventoryPage() {
    const [movementType, setMovementType] = useState("entrada");
    const [formData, setFormData] = useState({
        item: "",
        quantity: 1,
        location: "",
        notes: "",
    });

    const handleChange = (field) => (e) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Movimentação registrada:", {
            movementType,
            ...formData,
        });
        setFormData({
            item: "",
            quantity: 1,
            location: "",
            notes: "",
        });
    };

    const movementLabel =
        movementType === "entrada"
            ? "Entrada"
            : movementType === "saida"
                ? "Saída"
                : "Transferência";

    return (
        <div className="shell">
            <Sidebar />

            <main className="main">
                <Topbar />

                <div className="page-content">
                    <h1 className="page-title">Controle de Estoque</h1>

                    {/* VISÃO GERAL */}
                    <section className="card inventory-overview-card">
                        <div className="inventory-overview-grid">
                            <div className="inventory-overview-item">
                                <p className="inventory-overview-title">Total de Itens</p>
                                <p className="inventory-overview-value">1.250</p>
                                <p className="inventory-overview-sub">
                                    +15% desde o mês passado
                                </p>
                            </div>

                            <div className="inventory-overview-item">
                                <p className="inventory-overview-title">
                                    Itens com Estoque Baixo
                                </p>
                                <p className="inventory-overview-value inventory-overview-danger">
                                    12
                                </p>
                                <p className="inventory-overview-sub">
                                    Requer atenção imediata
                                </p>
                            </div>

                            <div className="inventory-overview-item">
                                <p className="inventory-overview-title">
                                    Movimentações Recentes
                                </p>
                                <p className="inventory-overview-value">58</p>
                                <p className="inventory-overview-sub">
                                    na última semana
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* ITENS EM ESTOQUE */}
                    <section className="card inventory-table-card">
                        <div className="card-header inventory-table-header">
                            <h2>Itens em Estoque</h2>

                            <div className="inventory-table-actions">
                                <div className="search-box inventory-search">
                                    <FiSearch className="search-icon" />
                                    <input
                                        type="text"
                                        placeholder="Buscar itens..."
                                    />
                                </div>

                                <button className="primary-btn">
                                    <span>+</span> Adicionar Item
                                </button>
                            </div>
                        </div>

                        <div className="table-wrapper">
                            <table className="inventory-table">
                                <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Tipo</th>
                                    <th>Quantidade</th>
                                    <th>Nível Mínimo</th>
                                    <th>Localização</th>
                                    <th>Status</th>
                                    <th className="th-actions">Ações</th>
                                </tr>
                                </thead>
                                <tbody>
                                {inventoryItems.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td>{item.type}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.minLevel}</td>
                                        <td>{item.location}</td>
                                        <td>
                        <span
                            className={
                                item.status === "Em Estoque"
                                    ? "badge badge-stock-ok"
                                    : "badge badge-stock-low"
                            }
                        >
                          {item.status}
                        </span>
                                        </td>
                                        <td className="cell-actions">
                                            <button
                                                className="icon-button"
                                                title="Editar item"
                                            >
                                                <FiEdit2 />
                                            </button>
                                            <button
                                                className="icon-button"
                                                title="Remover item"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>

                            <div className="inventory-pagination">
                                <button className="pagination-link">&lt; Anterior</button>
                                <button className="pagination-link pagination-link-active">
                                    1
                                </button>
                                <button className="pagination-link">2</button>
                                <button className="pagination-link">3</button>
                                <button className="pagination-link">Próximo &gt;</button>
                            </div>
                        </div>
                    </section>

                    {/* REGISTRO DE MOVIMENTAÇÕES */}
                    <section className="card inventory-movements-card">
                        <h2 className="section-title">Registro de Movimentações</h2>

                        <div className="movement-tabs">
                            <button
                                type="button"
                                className={
                                    movementType === "entrada"
                                        ? "movement-tab movement-tab-active"
                                        : "movement-tab"
                                }
                                onClick={() => setMovementType("entrada")}
                            >
                                Entrada
                            </button>
                            <button
                                type="button"
                                className={
                                    movementType === "saida"
                                        ? "movement-tab movement-tab-active"
                                        : "movement-tab"
                                }
                                onClick={() => setMovementType("saida")}
                            >
                                Saída
                            </button>
                            <button
                                type="button"
                                className={
                                    movementType === "transferencia"
                                        ? "movement-tab movement-tab-active"
                                        : "movement-tab"
                                }
                                onClick={() => setMovementType("transferencia")}
                            >
                                Transferência
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="movement-form">
                            <div className="movement-row">
                                <div className="form-field">
                                    <label>Item</label>
                                    <input
                                        type="text"
                                        placeholder="Nome do item"
                                        value={formData.item}
                                        onChange={handleChange("item")}
                                    />
                                </div>

                                <div className="form-field">
                                    <label>Quantidade</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.quantity}
                                        onChange={handleChange("quantity")}
                                    />
                                </div>
                            </div>

                            <div className="form-field">
                                <label>Localização</label>
                                <input
                                    type="text"
                                    placeholder="Armazém, Prateleira"
                                    value={formData.location}
                                    onChange={handleChange("location")}
                                />
                            </div>

                            <div className="form-field">
                                <label>Observações</label>
                                <textarea
                                    rows={3}
                                    placeholder="Notas sobre a entrada"
                                    value={formData.notes}
                                    onChange={handleChange("notes")}
                                />
                            </div>

                            <button type="submit" className="primary-btn movement-submit">
                                Registrar {movementLabel}
                            </button>
                        </form>
                    </section>
                </div>
            </main>
        </div>
    );
}
