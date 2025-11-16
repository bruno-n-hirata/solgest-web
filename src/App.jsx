import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import ClientsPage from "./pages/ClientsPage.jsx";
import AppointmentsPage from "./pages/AppointmentsPage.jsx";
import BudgetsPage from "./pages/BudgetsPage.jsx";
import TeamsPage from "./pages/TeamsPage.jsx";
import InventoryPage from "./pages/InventoryPage.jsx";

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return sessionStorage.getItem("solgest-auth") === "true";
    });

    const handleLogin = () => {
        setIsAuthenticated(true);
        sessionStorage.setItem("solgest-auth", "true");
    };

    return (
        <Routes>
            <Route
                path="/"
                element={
                    isAuthenticated ? (
                        <Navigate to="/clientes" replace />
                    ) : (
                        <LoginPage onLogin={handleLogin} />
                    )
                }
            />

            <Route
                path="/clientes"
                element={
                    isAuthenticated ? (
                        <ClientsPage />
                    ) : (
                        <Navigate to="/" replace />
                    )
                }
            />

            <Route
                path="/agendamentos"
                element={
                    isAuthenticated ? (
                        <AppointmentsPage />
                    ) : (
                        <Navigate to="/" replace />
                    )
                }
            />

            <Route
                path="/orcamentos"
                element={
                    isAuthenticated ? (
                        <BudgetsPage />
                    ) : (
                        <Navigate to="/" replace />
                    )
                }
            />

            <Route
                path="/equipes"
                element={
                    isAuthenticated ? (
                        <TeamsPage />
                    ) : (
                        <Navigate to="/" replace />
                    )
                }
            />

            <Route
                path="/estoque"
                element={
                    isAuthenticated ? (
                        <InventoryPage />
                    ) : (
                        <Navigate to="/" replace />
                    )
                }
            />

            {/* fallback */}
            <Route
                path="*"
                element={
                    <Navigate
                        to={isAuthenticated ? "/clientes" : "/"}
                        replace
                    />
                }
            />
        </Routes>
    );
}

