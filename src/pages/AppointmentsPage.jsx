import React, { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import { FiCalendar } from "react-icons/fi";

// mock de dados
const clients = [
    "SolarTech Inovações Ltda.",
    "Energia Viva Residencial",
    "Fazenda Sustentável Agro",
];

const teams = ["Equipe Alpha", "Equipe Beta", "Equipe Gama"];

const nextAppointmentsMock = [
    {
        id: 1,
        type: "Visita",
        time: "10:00",
        team: "Equipe Alpha",
        status: "Confirmado",
    },
    {
        id: 2,
        type: "Instalação",
        time: "14:30",
        team: "Equipe Beta",
        status: "Pendente",
    },
    {
        id: 3,
        type: "Manutenção",
        time: "09:00",
        team: "Equipe Alpha",
        status: "Realizado",
    },
    {
        id: 4,
        type: "Visita",
        time: "11:00",
        team: "Equipe Beta",
        status: "Pendente",
    },
    {
        id: 5,
        type: "Instalação",
        time: "16:00",
        team: "Equipe Gama",
        status: "Cancelado",
    },
];

// dias com visitas / dia atual só pra destacar no calendário
const scheduledDays = [10, 13, 15, 22];
const todayDay = 13; // só pra ficar igual ao protótipo

export default function AppointmentsPage() {
    const [selectedClient, setSelectedClient] = useState("");
    const [selectedTeam, setSelectedTeam] = useState("");
    const [visitDate, setVisitDate] = useState("");
    const [visitTime, setVisitTime] = useState("");
    const [status, setStatus] = useState("Pendente");
    const [notes, setNotes] = useState("");

    // calendário fixo em Maio/2025
    const year = 2025;
    const monthIndex = 4; // 0 = janeiro, 4 = maio

    const calendarDays = useMemo(() => {
        const firstDay = new Date(year, monthIndex, 1);
        const lastDay = new Date(year, monthIndex + 1, 0);
        const daysInMonth = lastDay.getDate();

        const offset = firstDay.getDay(); // 0 = domingo
        const cells = [];

        // espaços em branco antes do dia 1
        for (let i = 0; i < offset; i++) {
            cells.push(null);
        }
        // dias do mês
        for (let d = 1; d <= daysInMonth; d++) {
            cells.push(d);
        }
        return cells;
    }, [monthIndex, year]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // aqui depois você integra com API
        console.log({
            selectedClient,
            selectedTeam,
            visitDate,
            visitTime,
            status,
            notes,
        });
        // por enquanto só limpa
        handleClear();
    };

    const handleClear = () => {
        setSelectedClient("");
        setSelectedTeam("");
        setVisitDate("");
        setVisitTime("");
        setStatus("Pendente");
        setNotes("");
    };

    return (
        <div className="shell">
            <Sidebar />

            <main className="main">
                <Topbar />

                <div className="page-content">
                    <h1 className="page-title">Agendamento de Visita Técnica</h1>

                    <div className="schedule-grid">
                        {/* Card 1 – Novo Agendamento */}
                        <section className="card schedule-form-card">
                            <h2 className="section-title">Novo Agendamento</h2>

                            <form onSubmit={handleSubmit} className="schedule-form">
                                <div className="form-field">
                                    <label>Cliente</label>
                                    <select
                                        value={selectedClient}
                                        onChange={(e) => setSelectedClient(e.target.value)}
                                    >
                                        <option value="">Selecione um cliente</option>
                                        {clients.map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-field">
                                    <label>Equipe Técnica</label>
                                    <select
                                        value={selectedTeam}
                                        onChange={(e) => setSelectedTeam(e.target.value)}
                                    >
                                        <option value="">Selecione uma equipe</option>
                                        {teams.map((t) => (
                                            <option key={t} value={t}>
                                                {t}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="schedule-row">
                                    <div className="form-field">
                                        <label>Data da Visita</label>
                                        <input
                                            type="date"
                                            value={visitDate}
                                            onChange={(e) => setVisitDate(e.target.value)}
                                        />
                                    </div>

                                    <div className="form-field">
                                        <label>Hora da Visita</label>
                                        <input
                                            type="time"
                                            value={visitTime}
                                            onChange={(e) => setVisitTime(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="form-field">
                                    <label>Status do Agendamento</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <option value="Pendente">Pendente</option>
                                        <option value="Confirmado">Confirmado</option>
                                        <option value="Realizado">Realizado</option>
                                        <option value="Cancelado">Cancelado</option>
                                    </select>
                                </div>

                                <div className="form-field">
                                    <label>Observações</label>
                                    <textarea
                                        rows={4}
                                        placeholder="Adicione quaisquer observações importantes sobre a visita..."
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    />
                                </div>

                                <div className="schedule-buttons">
                                    <button type="submit" className="primary-btn">
                                        Agendar Visita
                                    </button>
                                    <button
                                        type="button"
                                        className="secondary-btn"
                                        onClick={handleClear}
                                    >
                                        Limpar
                                    </button>
                                </div>
                            </form>
                        </section>

                        {/* Card 2 – Calendário */}
                        <section className="card schedule-calendar-card">
                            <h2 className="section-title">Calendário de Disponibilidade</h2>

                            <div className="calendar-header">
                                <button className="calendar-nav">&lt; Anterior</button>
                                <div className="calendar-month">Maio {year}</div>
                                <button className="calendar-nav">Próximo &gt;</button>
                            </div>

                            <div className="calendar-grid">
                                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
                                    <div key={d} className="calendar-day-name">
                                        {d}
                                    </div>
                                ))}

                                {calendarDays.map((day, idx) =>
                                    day === null ? (
                                        <div key={`empty-${idx}`} />
                                    ) : (
                                        <div
                                            key={day}
                                            className={[
                                                "calendar-day",
                                                day === todayDay ? "calendar-day-today" : "",
                                                scheduledDays.includes(day)
                                                    ? "calendar-day-scheduled"
                                                    : "",
                                            ]
                                                .filter(Boolean)
                                                .join(" ")}
                                        >
                                            {day}
                                        </div>
                                    )
                                )}
                            </div>

                            <div className="calendar-legend">
                                <div className="legend-item">
                                    <span className="legend-dot legend-dot-scheduled" />
                                    <span>Agendado</span>
                                </div>
                                <div className="legend-item">
                                    <span className="legend-dot legend-dot-today" />
                                    <span>Hoje</span>
                                </div>
                            </div>
                        </section>

                        {/* Card 3 – Próximos Agendamentos */}
                        <section className="card schedule-next-card">
                            <h2 className="section-title">Próximos Agendamentos</h2>

                            <ul className="next-appointments-list">
                                {nextAppointmentsMock.map((item) => (
                                    <li key={item.id} className="next-appointment-item">
                                        <div className="next-appointment-info">
                      <span className="next-appointment-type">
                        {item.type}
                      </span>
                                            <span className="next-appointment-sub">
                        {item.time} - {item.team}
                      </span>
                                        </div>
                                        <span
                                            className={`badge badge-status-${item.status.toLowerCase()}`}
                                        >
                      {item.status}
                    </span>
                                    </li>
                                ))}
                            </ul>

                            <button className="next-appointments-footer">
                                <FiCalendar className="next-appointments-icon" />
                                <span>Ver todos os agendamentos</span>
                            </button>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
