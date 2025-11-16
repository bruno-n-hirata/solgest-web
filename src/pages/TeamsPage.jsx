import React, { useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import SolgestLogo from "../assets/logo.png";
import {
    FiMapPin,
    FiCalendar,
    FiFileText,
    FiUsers,
    FiBox,
    FiUsers as FiUsersGroup,
    FiUserCheck,
    FiUser,
    FiSearch,
    FiEye,
    FiEdit2,
    FiPower,
} from "react-icons/fi";

export default function TeamsPage() {
    const teams = [
        {
            id: 1,
            name: "Equipe Solar Alfa",
            focusArea: "Instalações Novas",
            members: "2 técnicos",
            status: "Ativa",
        },
        {
            id: 2,
            name: "Equipe Manutenção Beta",
            focusArea: "Manutenção e Reparo",
            members: "2 técnicos",
            status: "Ativa",
        },
        {
            id: 3,
            name: "Equipe Emergência Gama",
            focusArea: "Atendimentos Urgentes",
            members: "1 técnico",
            status: "Ativa",
        },
        {
            id: 4,
            name: "Equipe de Testes Delta",
            focusArea: "Pesquisa e Desenvolvimento",
            members: "0 técnicos",
            status: "Inativa",
        },
    ];

    const technicians = [
        {
            id: 1,
            name: "João Silva",
            role: "Eletricista Chefe",
            specialty: "Instalação, Manutenção Preventiva",
            status: "Em Serviço",
        },
        {
            id: 2,
            name: "Maria Oliveira",
            role: "Ajudante de Instalação",
            specialty: "Estruturas, Limpeza",
            status: "Disponível",
        },
        {
            id: 3,
            name: "Carlos Pereira",
            role: "Técnico de Manutenção",
            specialty: "Diagnóstico, Reparo",
            status: "Disponível",
        },
        {
            id: 4,
            name: "Ana Souza",
            role: "Especialista em Suporte",
            specialty: "Configuração de Inversores",
            status: "Em Serviço",
        },
        {
            id: 5,
            name: "Pedro Costa",
            role: "Eletricista Pleno",
            specialty: "Instalação",
            status: "Disponível",
        },
    ];

    return (
        <div className="shell">
            <Sidebar />

            {/* Main */}
            <main className="main">
                <Topbar />

                <div className="page-content">
                    <h1 className="page-title">Gerenciamento de Equipes Técnicas</h1>

                    {/* Visão Geral */}
                    <section className="card teams-overview-card">
                        <h2 className="section-title">Visão Geral</h2>

                        <div className="overview-grid">
                            <div className="overview-item">
                                <div className="overview-icon-wrapper">
                                    <FiUsersGroup className="overview-icon" />
                                </div>
                                <p className="overview-label">Total de Equipes</p>
                                <p className="overview-value">4</p>
                            </div>

                            <div className="overview-item">
                                <div className="overview-icon-wrapper">
                                    <FiUserCheck className="overview-icon" />
                                </div>
                                <p className="overview-label">Equipes Ativas</p>
                                <p className="overview-value">3</p>
                            </div>

                            <div className="overview-item">
                                <div className="overview-icon-wrapper">
                                    <FiUser className="overview-icon" />
                                </div>
                                <p className="overview-label">Total de Técnicos</p>
                                <p className="overview-value">5</p>
                            </div>

                            <div className="overview-item">
                                <div className="overview-icon-wrapper">
                                    <FiUser className="overview-icon" />
                                </div>
                                <p className="overview-label">Técnicos Disponíveis</p>
                                <p className="overview-value">3</p>
                            </div>
                        </div>
                    </section>

                    {/* Lista de Equipes */}
                    <section className="card teams-list-card">
                        <div className="card-header">
                            <h2>Lista de Equipes</h2>
                            <button className="primary-btn">
                                <span>+</span> Criar Nova Equipe
                            </button>
                        </div>

                        <div className="filters-row">
                            <div className="search-box">
                                <FiSearch className="search-icon" />
                                <input type="text" placeholder="Buscar equipes..." />
                            </div>
                        </div>

                        <div className="table-wrapper">
                            <table className="teams-table">
                                <thead>
                                <tr>
                                    <th>Nome da Equipe</th>
                                    <th>Área de Foco</th>
                                    <th>Membros</th>
                                    <th>Status</th>
                                    <th className="th-actions">Ações</th>
                                </tr>
                                </thead>
                                <tbody>
                                {teams.map((team) => (
                                    <tr key={team.id}>
                                        <td>{team.name}</td>
                                        <td>{team.focusArea}</td>
                                        <td>{team.members}</td>
                                        <td>
                        <span
                            className={
                                team.status === "Ativa"
                                    ? "badge badge-active-team"
                                    : "badge badge-inactive-team"
                            }
                        >
                          {team.status}
                        </span>
                                        </td>
                                        <td className="cell-actions">
                                            <button className="icon-button" title="Ver equipe">
                                                <FiEye />
                                            </button>
                                            <button className="icon-button" title="Editar equipe">
                                                <FiEdit2 />
                                            </button>
                                            <button className="icon-button" title="Ativar/Desativar">
                                                <FiPower />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Lista de Técnicos */}
                    <section className="card teams-technicians-card">
                        <div className="card-header">
                            <h2>Lista de Técnicos</h2>
                            <button className="primary-btn">
                                <span>+</span> Adicionar Técnico
                            </button>
                        </div>

                        <div className="technicians-card">
                            <div className="technicians-header">
                                <h3>Técnicos</h3>
                                <p>Lista completa de todos os técnicos cadastrados.</p>
                            </div>

                            <div className="technicians-grid">
                                {technicians.map((tech) => (
                                    <div key={tech.id} className="technician-card">
                                        <div className="technician-avatar">
                                            {tech.name.split(" ")[0][0]}
                                        </div>
                                        <div className="technician-info">
                                            <h4 className="technician-name">{tech.name}</h4>
                                            <p className="technician-role">{tech.role}</p>
                                            <p className="technician-specialty">
                                                {tech.specialty}
                                            </p>
                                        </div>
                                        <div className="technician-footer">
                      <span
                          className={
                              tech.status === "Disponível"
                                  ? "badge badge-available"
                                  : "badge badge-service"
                          }
                      >
                        {tech.status}
                      </span>
                                            <button className="link-button technician-edit-button">
                                                <FiEdit2 className="action-icon" /> Editar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
