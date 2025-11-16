import React, { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";

const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export default function BudgetsPage() {
    const [client, setClient] = useState("Energia Sustentável Ltda.");
    const [monthlyConsumption, setMonthlyConsumption] = useState(350); // kWh
    const [panelsQty, setPanelsQty] = useState(12);

    // cálculos bem simples só para demo
    const {
        totalCost,
        annualEconomy,
        paybackYears,
        annualGeneration,
        components,
        chartData,
    } = useMemo(() => {
        const panelPowerKw = 0.35; // 350W
        const kwhPerKwYear = 1500; // geração média por kWp/ano
        const panelUnitCost = 1200;
        const inverterCost = 4500;
        const structureCost = 2000;
        const cabosCost = 800;
        const laborCost = 3800;
        const energyTariff = 0.8; // R$/kWh (aprox)

        const totalPanelsCost = panelsQty * panelUnitCost;
        const totalCostCalc =
            totalPanelsCost + inverterCost + structureCost + cabosCost + laborCost;

        const systemPowerKw = panelsQty * panelPowerKw;
        const annualGen = systemPowerKw * kwhPerKwYear; // kWh/ano

        const annualConsumption = monthlyConsumption * 12;
        const economyKwh = Math.min(annualGen, annualConsumption);
        const annualEconomyCalc = economyKwh * energyTariff;

        const payback =
            annualEconomyCalc > 0 ? totalCostCalc / annualEconomyCalc : 0;

        // dados da tabela de componentes
        const comps = [
            {
                name: "Painéis Solares Monocristalinos (350W)",
                qty: panelsQty,
                unit: panelUnitCost,
                total: panelsQty * panelUnitCost,
            },
            {
                name: "Inversor Híbrido (5kW)",
                qty: 1,
                unit: inverterCost,
                total: inverterCost,
            },
            {
                name: "Estrutura de Fixação (Telhado)",
                qty: 1,
                unit: structureCost,
                total: structureCost,
            },
            {
                name: "Cabeamento e Conectores",
                qty: 1,
                unit: cabosCost,
                total: cabosCost,
            },
            {
                name: "Mão de Obra e Instalação",
                qty: 1,
                unit: laborCost,
                total: laborCost,
            },
        ];

        // dados fake do gráfico: custo x economia por mês
        const baseEconomy = annualEconomyCalc / 12;
        const baseCost = totalCostCalc / 12;
        const chart = MONTHS.map((m, idx) => ({
            month: m,
            economy: Math.round(baseEconomy * (1 + idx * 0.02)),
            cost: Math.round(baseCost * 0.4), // custo mensal "equivalente"
        }));

        return {
            totalCost: totalCostCalc,
            annualEconomy: annualEconomyCalc,
            paybackYears: payback,
            annualGeneration: annualGen,
            components: comps,
            chartData: chart,
        };
    }, [monthlyConsumption, panelsQty]);

    const formatCurrency = (value) =>
        value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
            maximumFractionDigits: 2,
        });

    const handleCalculate = (e) => {
        e.preventDefault();
        // os cálculos já reagem ao state, então aqui é só evitar reload
    };

    const handleClear = () => {
        setClient("");
        setMonthlyConsumption(0);
        setPanelsQty(0);
    };

    const handleSave = () => {
        console.log("Orçamento salvo:", {
            client,
            monthlyConsumption,
            panelsQty,
            totalCost,
            annualEconomy,
            paybackYears,
            annualGeneration,
        });
    };

    const handleGeneratePdf = () => {
        console.log("Gerar PDF (aqui seria chamada de serviço / lib)");
    };

    return (
        <div className="shell">
            <Sidebar />

            <main className="main">
                <Topbar />

                <div className="page-content">
                    <h1 className="page-title">Cálculo de Orçamento Solar</h1>

                    {/* TOPO: FORM + CARDS DE RESUMO */}
                    <div className="budget-top-grid">
                        {/* Dados do Orçamento */}
                        <section className="card budget-form-card">
                            <h2 className="section-title">Dados do Orçamento</h2>
                            <p className="section-subtitle">
                                Insira as informações para calcular o orçamento da instalação solar.
                            </p>

                            <form onSubmit={handleCalculate} className="budget-form">
                                <div className="form-field">
                                    <label>Cliente</label>
                                    <input
                                        type="text"
                                        placeholder="Nome do cliente"
                                        value={client}
                                        onChange={(e) => setClient(e.target.value)}
                                    />
                                </div>

                                <div className="budget-row">
                                    <div className="form-field">
                                        <label>Consumo Médio Mensal (kWh)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={monthlyConsumption}
                                            onChange={(e) =>
                                                setMonthlyConsumption(Number(e.target.value) || 0)
                                            }
                                        />
                                    </div>

                                    <div className="form-field">
                                        <label>Quantidade de Painéis Solares</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={panelsQty}
                                            onChange={(e) =>
                                                setPanelsQty(Number(e.target.value) || 0)
                                            }
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="primary-btn budget-calc-btn">
                                    Calcular Orçamento
                                </button>
                            </form>
                        </section>

                        {/* Cards de resumo */}
                        <section className="budget-summary-grid">
                            <div className="card budget-summary-card">
                                <p className="budget-summary-label">Custo Total Estimado</p>
                                <p className="budget-summary-value">
                                    {formatCurrency(totalCost)}
                                </p>
                                <p className="budget-summary-helper">
                                    Inclui equipamentos e instalação.
                                </p>
                            </div>

                            <div className="card budget-summary-card">
                                <p className="budget-summary-label">Economia Anual Projetada</p>
                                <p className="budget-summary-value">
                                    {formatCurrency(annualEconomy)}
                                </p>
                                <p className="budget-summary-helper">
                                    Baseado no consumo médio e geração.
                                </p>
                            </div>

                            <div className="card budget-summary-card">
                                <p className="budget-summary-label">
                                    Tempo de Retorno do Investimento
                                </p>
                                <p className="budget-summary-value">
                                    {annualEconomy > 0
                                        ? `${Math.round(paybackYears)} anos`
                                        : "-"}
                                </p>
                                <p className="budget-summary-helper">
                                    Período para cobrir o investimento inicial.
                                </p>
                            </div>

                            <div className="card budget-summary-card">
                                <p className="budget-summary-label">Geração Anual Estimada</p>
                                <p className="budget-summary-value">
                                    {annualGeneration.toLocaleString("pt-BR", {
                                        maximumFractionDigits: 0,
                                    })}{" "}
                                    kWh
                                </p>
                                <p className="budget-summary-helper">
                                    Produção de energia esperada por ano.
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* GRÁFICO SIMPLES */}
                    <section className="card budget-chart-card">
                        <h2 className="section-title">Previsão de Economia Mensal</h2>
                        <p className="section-subtitle">
                            Comparativo do consumo atual e economia gerada ao longo do ano.
                        </p>

                        <div className="budget-chart">
                            {chartData.map((item) => (
                                <div key={item.month} className="budget-chart-column">
                                    <div className="budget-chart-bars">
                                        <div
                                            className="budget-chart-bar budget-chart-bar-economy"
                                            style={{
                                                height: `${(item.economy / chartData[11].economy) * 100}%`,
                                            }}
                                        />
                                        <div
                                            className="budget-chart-bar budget-chart-bar-cost"
                                            style={{
                                                height: `${(item.cost / chartData[11].economy) * 100}%`,
                                            }}
                                        />
                                    </div>
                                    <span className="budget-chart-month">{item.month}</span>
                                </div>
                            ))}
                        </div>

                        <div className="budget-chart-legend">
                            <div className="legend-item">
                                <span className="legend-dot legend-dot-economy" />
                                <span>Economia</span>
                            </div>
                            <div className="legend-item">
                                <span className="legend-dot legend-dot-cost" />
                                <span>Custo</span>
                            </div>
                        </div>
                    </section>

                    {/* DETALHES DOS COMPONENTES */}
                    <section className="card budget-components-card">
                        <h2 className="section-title">Detalhes dos Componentes</h2>

                        <div className="budget-components-table">
                            <div className="budget-components-header">
                                <span>Componente</span>
                                <span>Qtd.</span>
                                <span>Custo Unitário</span>
                                <span>Custo Total</span>
                            </div>

                            {components.map((c) => (
                                <div key={c.name} className="budget-components-row">
                                    <span>{c.name}</span>
                                    <span>{c.qty}</span>
                                    <span>{formatCurrency(c.unit)}</span>
                                    <span>{formatCurrency(c.total)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="budget-footer-buttons">
                            <button
                                type="button"
                                className="primary-btn"
                                onClick={handleGeneratePdf}
                            >
                                Gerar PDF do Orçamento
                            </button>
                            <button
                                type="button"
                                className="secondary-btn"
                                onClick={handleSave}
                            >
                                Salvar Orçamento
                            </button>
                            <button
                                type="button"
                                className="danger-btn"
                                onClick={handleClear}
                            >
                                Limpar Campos
                            </button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
