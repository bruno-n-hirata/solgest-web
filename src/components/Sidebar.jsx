import { NavLink } from "react-router-dom";
import {
    FiMapPin,
    FiCalendar,
    FiFileText,
    FiUsers,
    FiBox,
} from "react-icons/fi";
import SolgestLogo from "../assets/logo.png";

const navItems = [
    { to: "/clientes", icon: FiMapPin, label: "Clientes" },
    { to: "/agendamentos", icon: FiCalendar, label: "Agendamentos" }, // futuro
    { to: "/orcamentos", icon: FiFileText, label: "Orçamentos" },     // futuro
    { to: "/equipes", icon: FiUsers, label: "Equipes" },
    { to: "/estoque", icon: FiBox, label: "Estoque" },                // futuro
];

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <img src={SolgestLogo} alt="SolGest" />
            </div>

            <nav className="sidebar-nav">
                {navItems.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            isActive ? "nav-item nav-item-active" : "nav-item"
                        }
                    >
                        <Icon className="nav-icon" />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
