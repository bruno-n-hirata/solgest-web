import React, { useState } from "react";
import SolgestLogo from "../assets/logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage({ onLogin }) {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        if (username === "senac" && password === "senac") {
            setError("");
            onLogin();
        } else {
            setError("Usuário ou senha inválidos.");
        }
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
        if (error) setError("");
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (error) setError("");
    };

    return (
        <div className="app">
            <div className="login-card">
                {/* Logo */}
                <div className="login-logo">
                    <img
                        src={SolgestLogo}
                        alt="SolGest Logo"
                        className="solgest-logo-img"
                    />
                </div>

                <h1 className="login-title">Bem-vindo ao</h1>
                <h2 className="login-subtitle">SolGest</h2>

                <form className="login-form" onSubmit={handleSubmit}>
                    {error && (
                        <p className="login-error-text">{error}</p>
                    )}

                    <div className="form-group">
                        <label htmlFor="username">Usuário</label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Digite seu nome de usuário"
                            value={username}
                            onChange={handleUsernameChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Senha</label>
                        <div className="password-wrapper">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Digite sua senha"
                                value={password}
                                onChange={handlePasswordChange}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <FaEye className="eye-icon" />
                                ) : (
                                    <FaEyeSlash className="eye-icon" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="forgot-wrapper">
                        <button type="button" className="forgot-link">
                            Esqueceu sua senha?
                        </button>
                    </div>

                    <button className="login-button" type="submit">
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
}
