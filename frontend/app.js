/* ==========================================================================
   Voltara Dashboard Controller & Analytics Logic
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // --- DOM Elements ---
    const elements = {
        // Range Sliders
        voltage: document.getElementById("input-voltage"),
        intensity: document.getElementById("input-intensity"),
        reactive: document.getElementById("input-reactive"),
        sub1: document.getElementById("input-sub1"),
        sub2: document.getElementById("input-sub2"),
        sub3: document.getElementById("input-sub3"),
        budget: document.getElementById("input-budget"),

        // Slider Values
        valVoltage: document.getElementById("val-voltage"),
        valIntensity: document.getElementById("val-intensity"),
        valReactive: document.getElementById("val-reactive"),
        valSub1: document.getElementById("val-sub1"),
        valSub2: document.getElementById("val-sub2"),
        valSub3: document.getElementById("val-sub3"),
        valBudget: document.getElementById("val-budget"),

        // KPI Display
        predictedPower: document.getElementById("kpi-predicted-power"),
        monthlyUnits: document.getElementById("kpi-monthly-units"),
        estimatedBill: document.getElementById("kpi-estimated-bill"),
        billBreakdown: document.getElementById("kpi-bill-breakdown"),
        billBreakdownText: document.getElementById("bill-breakdown-text"),
        carbon: document.getElementById("kpi-carbon"),
        carbonStatus: document.getElementById("kpi-carbon-status"),
        sustainabilityScore: document.getElementById("kpi-sustainability-score"),
        sustainabilityGrade: document.getElementById("kpi-sustainability-grade"),
        sustainabilityStatus: document.getElementById("kpi-sustainability-status"),
        scoreRing: document.getElementById("score-ring-svg"),

        // Progress Bars
        powerProgress: document.getElementById("power-progress"),
        billProgress: document.getElementById("bill-progress"),
        carbonProgress: document.getElementById("carbon-progress"),

        // Content Containers
        alertsContainer: document.getElementById("alerts-container"),
        alertsBadge: document.getElementById("alerts-badge"),
        recommendationsContainer: document.getElementById("recommendations-container"),

        // Controls
        presetBtns: document.querySelectorAll(".preset-btn"),
        themeToggle: document.getElementById("theme-toggle-btn")
    };

    // --- State variables ---
    let activePreset = "normal";
    let applianceChart = null;
    let usageChart = null;

    // Standard baseline average (historic usage profile in kWh per day)
    const baseWeeklyUsage = [12, 14, 13, 15, 14, 18, 19]; // Avg 14.28 kWh/day

    // Scenarios data matching the preset configurations
    const presets = {
        normal: {
            voltage: 234,
            intensity: 18.4,
            reactive: 0.42,
            sub3: 17.0,
            sub2: 1.0,
            sub1: 0.0,
            budget: 2000
        },
        eco: {
            voltage: 228,
            intensity: 7.5,
            reactive: 0.12,
            sub3: 5.0,
            sub2: 0.5,
            sub1: 0.0,
            budget: 1500
        },
        heavy: {
            voltage: 242,
            intensity: 32.5,
            reactive: 1.85,
            sub3: 35.0,
            sub2: 12.0,
            sub1: 8.5,
            budget: 4500
        },
        vacation: {
            voltage: 230,
            intensity: 1.2,
            reactive: 0.05,
            sub3: 0.0,
            sub2: 0.0,
            sub1: 0.0,
            budget: 1000
        }
    };

    // --- Chart initialization ---
    function initCharts() {
        // 1. Appliance Breakdown Chart (Doughnut)
        const applianceCtx = document.getElementById("applianceBreakdownChart").getContext("2d");
        applianceChart = new Chart(applianceCtx, {
            type: "doughnut",
            data: {
                labels: ["AC / Climate", "Fridge", "Fan", "Lighting", "Others"],
                datasets: [{
                    data: [45, 20, 10, 10, 15],
                    backgroundColor: [
                        "#00f2fe", // Neon Cyan
                        "#8b5cf6", // Purple
                        "#10b981", // Green
                        "#fbbf24", // Gold
                        "#64748b"  // Slate Gray
                    ],
                    borderWidth: 2,
                    borderColor: "#0f172a",
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "right",
                        labels: {
                            color: getComputedStyle(document.body).getPropertyValue("--text-secondary").trim() || "#94a3b8",
                            font: {
                                family: "Inter",
                                size: 11
                            },
                            boxWidth: 12,
                            padding: 10
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return ` ${context.label}: ${context.raw}%`;
                            }
                        }
                    }
                },
                cutout: "70%"
            }
        });

        // 2. Weekly Load Anomaly Chart (Line)
        const usageCtx = document.getElementById("usageSpikesChart").getContext("2d");
        usageChart = new Chart(usageCtx, {
            type: "line",
            data: {
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                datasets: [
                    {
                        label: "Historic Baseline",
                        data: baseWeeklyUsage,
                        borderColor: "rgba(100, 116, 139, 0.4)",
                        backgroundColor: "transparent",
                        borderWidth: 2,
                        borderDash: [5, 5],
                        pointRadius: 0,
                        tension: 0.4
                    },
                    {
                        label: "Simulated Current",
                        data: [...baseWeeklyUsage],
                        borderColor: "#00f2fe",
                        backgroundColor: "rgba(0, 242, 254, 0.05)",
                        fill: true,
                        borderWidth: 3,
                        pointBackgroundColor: "#00f2fe",
                        pointBorderColor: "#fff",
                        pointHoverRadius: 7,
                        pointRadius: 3,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "top",
                        labels: {
                            color: getComputedStyle(document.body).getPropertyValue("--text-secondary").trim() || "#94a3b8",
                            font: {
                                family: "Inter",
                                size: 10
                            },
                            boxWidth: 10
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: "#64748b", font: { size: 10 } }
                    },
                    y: {
                        grid: { color: "rgba(255,255,255,0.03)" },
                        ticks: { color: "#64748b", font: { size: 10 } },
                        title: {
                            display: true,
                            text: "Consumption (kWh)",
                            color: "#64748b",
                            font: { size: 9 }
                        }
                    }
                }
            }
        });
    }

    // --- Core Mathematical Engines ---

    // 1. Apparent & Active Power Simulation
    // Active Power (P) in kW = V * I * PF / 1000
    // Real RF models predict power based on loads. We approximate with high physical fidelity.
    function calculateActivePower(v, i, q) {
        if (i === 0) return 0;
        const s = (v * i) / 1000; // Apparent power in kVA
        
        // Ensure Q (Reactive) does not mathematically exceed Apparent power
        const adjustedQ = Math.min(q, s * 0.95); 
        
        // Active power P = sqrt(S^2 - Q^2)
        let p = Math.sqrt(Math.max(s * s - adjustedQ * adjustedQ, 0));
        
        // Bound checks (0 to 10kW)
        return Math.min(Math.max(p, 0), 10);
    }

    // 2. Tariff Engine (Tiered calculation mirroring tariff_engine.py)
    function calculateEstimatedBill(units) {
        if (units <= 100) {
            return 0;
        } else if (units <= 200) {
            return (units - 100) * 2.5;
        } else if (units <= 400) {
            return (100 * 2.5) + ((units - 200) * 4.5);
        } else {
            return (100 * 2.5) + (200 * 4.5) + ((units - 400) * 6.0);
        }
    }

    // Dynamic description of Tariff Breakdown
    function getBillBreakdownHTML(units) {
        let html = `<strong>Tiered Tariff Breakdown:</strong><br>`;
        if (units <= 100) {
            html += `<span class="text-green">0 - 100 units: Free (₹0)</span>`;
        } else if (units <= 200) {
            html += `0 - 100 units: Free<br>`;
            html += `<span class="text-cyan">101 - 200 units: ${Math.round(units - 100)} × ₹2.5</span>`;
        } else if (units <= 400) {
            html += `0 - 100 units: Free<br>`;
            html += `101 - 200 units: 100 × ₹2.5 (₹250)<br>`;
            html += `<span class="text-cyan">201 - 400 units: ${Math.round(units - 200)} × ₹4.5</span>`;
        } else {
            html += `0 - 100 units: Free<br>`;
            html += `101 - 200 units: 100 × ₹2.5 (₹250)<br>`;
            html += `201 - 300 units: 200 × ₹4.5 (₹900)<br>`;
            html += `<span class="text-orange">> 400 units: ${Math.round(units - 400)} × ₹6.0</span>`;
        }
        return html;
    }

    // 3. Carbon Engine (carbon_engine.py)
    function calculateCarbon(units) {
        return Math.round(units * 0.82 * 100) / 100;
    }

    // 4. Sustainability Score Engine (sustainability_engine.py)
    function calculateSustainabilityScore(units, bill, carbon) {
        let score = 100;
        if (units > 200) score -= 15;
        if (units > 400) score -= 20;
        if (bill > 3000) score -= 20;
        if (carbon > 250) score -= 15;
        return Math.max(score, 0);
    }

    // --- Dashboard update orchestration ---
    function updateDashboard() {
        // Read Inputs
        const v = parseFloat(elements.voltage.value);
        const i = parseFloat(elements.intensity.value);
        const q = parseFloat(elements.reactive.value);
        const sub1Val = parseFloat(elements.sub1.value);
        const sub2Val = parseFloat(elements.sub2.value);
        const sub3Val = parseFloat(elements.sub3.value);
        const userBudget = parseFloat(elements.budget.value);

        // Update Slider Text Labels
        elements.valVoltage.textContent = `${v} V`;
        elements.valIntensity.textContent = `${i} A`;
        elements.valReactive.textContent = `${q.toFixed(2)} kVAR`;
        elements.valSub1.textContent = `${sub1Val.toFixed(1)} kWh`;
        elements.valSub2.textContent = `${sub2Val.toFixed(1)} kWh`;
        elements.valSub3.textContent = `${sub3Val.toFixed(1)} kWh`;
        elements.valBudget.textContent = `₹${userBudget.toLocaleString("en-IN")}`;

        // Compute Core Forecasting Metrics
        const predictedPower = calculateActivePower(v, i, q);
        const dailyUnits = predictedPower * 24; // Power in kW * 24 hrs
        
        // In the ML engine, monthly units are predicted_power * 30.
        // We will match the backend formula exactly!
        const monthlyUnits = predictedPower * 30;
        const estimatedBill = calculateEstimatedBill(monthlyUnits);
        const carbon = calculateCarbon(monthlyUnits);
        const sustainabilityScore = calculateSustainabilityScore(monthlyUnits, estimatedBill, carbon);

        // --- Render Core Metric Cards ---
        elements.predictedPower.textContent = `${predictedPower.toFixed(2)} kW`;
        elements.monthlyUnits.textContent = `${monthlyUnits.toFixed(2)} units / mo`;
        elements.estimatedBill.textContent = `₹${estimatedBill.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        elements.billBreakdownText.innerHTML = getBillBreakdownHTML(monthlyUnits);
        elements.carbon.textContent = `${carbon.toFixed(2)} kg`;

        // Carbon footnote status text
        if (carbon < 100) {
            elements.carbonStatus.textContent = "Eco-optimal carbon load";
            elements.carbonStatus.className = "kpi-subtext text-lightgreen";
        } else if (carbon <= 250) {
            elements.carbonStatus.textContent = "Moderate carbon footprint";
            elements.carbonStatus.className = "kpi-subtext";
        } else {
            elements.carbonStatus.textContent = "High carbon emission footprint";
            elements.carbonStatus.className = "kpi-subtext text-orange";
        }

        // Render KPI progress indicators
        elements.powerProgress.style.width = `${Math.min((predictedPower / 8) * 100, 100)}%`;
        elements.billProgress.style.width = `${Math.min((estimatedBill / userBudget) * 100, 100)}%`;
        elements.carbonProgress.style.width = `${Math.min((carbon / 500) * 100, 100)}%`;

        // Update animated SVG score ring & grade text
        elements.sustainabilityScore.textContent = sustainabilityScore;
        
        // Ring Dashoffset calculation (Circumference = 2 * PI * R ≈ 157 for R=25)
        const offset = 157 - (sustainabilityScore / 100) * 157;
        elements.scoreRing.style.strokeDashoffset = offset;

        // Change rating theme colors according to sustainability values
        let scoreColor = "var(--color-violet)";
        let grade = "EXCELLENT";
        let status = "Eco-optimal configuration";

        if (sustainabilityScore >= 85) {
            scoreColor = "var(--color-green)";
            grade = "EXCELLENT";
            status = "Highly efficient energy profile";
        } else if (sustainabilityScore >= 50) {
            scoreColor = "var(--color-orange)";
            grade = "AVERAGE";
            status = "Moderate conservation scope";
        } else {
            scoreColor = "var(--color-red)";
            grade = "INEFFICIENT";
            status = "Immediate energy audits needed";
        }

        elements.scoreRing.style.stroke = scoreColor;
        elements.sustainabilityGrade.style.color = scoreColor;
        elements.sustainabilityGrade.textContent = grade;
        elements.sustainabilityStatus.textContent = status;

        // --- Run Smart Alerts Engine (smart_alert_engine.py) ---
        const alerts = [];
        const currentWeeklyUsage = dailyUnits * 7;
        const baselineWeeklyTotal = baseWeeklyUsage.reduce((a, b) => a + b, 0);

        // Budget exceeded
        if (estimatedBill > userBudget) {
            alerts.push({
                type: "warning",
                title: "Budget Cap Exceeded",
                desc: `Predicted bill ₹${estimatedBill.toFixed(0)} exceeds monthly budget cap of ₹${userBudget}.`,
                icon: "fa-solid fa-wallet"
            });
        }

        // Spike Detection: 30% weekly increase
        if (currentWeeklyUsage > baselineWeeklyTotal * 1.3) {
            alerts.push({
                type: "warning",
                title: "Abnormal Weekly Usage",
                desc: `Weekly load spike detected (${currentWeeklyUsage.toFixed(1)} kWh vs baseline ${baselineWeeklyTotal} kWh).`,
                icon: "fa-solid fa-arrow-trend-up"
            });
        }

        // Appliance Surge check: sum of submeter loads increases standard average
        const totalSubmeterLoad = sub1Val + sub2Val + sub3Val;
        if (totalSubmeterLoad > 25) {
            alerts.push({
                type: "warning",
                title: "Appliance Usage Surge",
                desc: `High combined appliance loads detected (${totalSubmeterLoad.toFixed(1)} kWh continuous).`,
                icon: "fa-solid fa-plug-circle-bolt"
            });
        }

        // Critical extreme usage
        if (estimatedBill > 5000) {
            alerts.push({
                type: "critical",
                title: "Critical Grid Load Warning",
                desc: "High power load threatens local circuit breakers. Reduce cooling profiles.",
                icon: "fa-solid fa-radiation"
            });
        }

        // Normal state
        if (alerts.length === 0) {
            alerts.push({
                type: "normal",
                title: "Usage Patterns Normal",
                desc: "Real-time energy consumption matches standard benchmark baselines.",
                icon: "fa-solid fa-circle-check"
            });
        }

        // Render Alerts inside Container
        elements.alertsContainer.innerHTML = "";
        alerts.forEach(alert => {
            const alertEl = document.createElement("div");
            alertEl.className = `alert-item ${alert.type}`;
            alertEl.innerHTML = `
                <div class="alert-icon"><i class="${alert.icon}"></i></div>
                <div class="alert-content">
                    <h4 class="alert-title">${alert.title}</h4>
                    <p class="alert-desc">${alert.desc}</p>
                </div>
            `;
            elements.alertsContainer.appendChild(alertEl);
        });

        // Set navbar alert badge counter (excluding normal status)
        const activeAlertCount = alerts.filter(a => a.type !== "normal").length;
        elements.alertsBadge.textContent = activeAlertCount;
        elements.alertsBadge.style.display = activeAlertCount > 0 ? "inline-block" : "none";

        // --- Run AI Recommendations Engine (recommendation_engine.py) ---
        const recommendations = [];

        if (monthlyUnits > 200) {
            recommendations.push("Reduce high-power appliance usage during peak energy cost hours.");
        }
        if (estimatedBill > 3000) {
            recommendations.push("Estimated bill is elevated. Lower air conditioning runtime by 1-2 hours daily.");
        }
        if (carbon > 150) {
            recommendations.push("Carbon footprint is above average. Upgrade heavy appliance hardware to energy-efficient models.");
        }
        
        // Custom dynamic slider recommendations
        if (sub3Val > 25) {
            recommendations.push("AC / Heating loads are extremely high. Leverage climate scheduling and smart thermostats.");
        }
        if (sub2Val > 8) {
            recommendations.push("Laundry usage is high. Wash fully loaded laundry cycles on economic eco-wash patterns.");
        }

        if (recommendations.length === 0) {
            recommendations.push("Great job! Your current household energy usage is eco-optimized and cost-efficient.");
        }

        // Render Recommendations inside Container
        elements.recommendationsContainer.innerHTML = "";
        recommendations.forEach(rec => {
            const recEl = document.createElement("div");
            recEl.className = "rec-item";
            recEl.innerHTML = `
                <div class="rec-icon"><i class="fa-solid fa-lightbulb"></i></div>
                <div class="rec-text">${rec}</div>
            `;
            elements.recommendationsContainer.appendChild(recEl);
        });

        // --- Synchronize Chart.js Render Datasets ---

        // 1. Dynamic Anomaly Tracker Updates
        if (usageChart) {
            // Scale simulated line points according to predicted power ratio
            const ratio = predictedPower > 0 ? (predictedPower / 3.0) : 0.05;
            const updatedWeek = baseWeeklyUsage.map(val => Math.round(val * ratio * 10) / 10);
            
            usageChart.data.datasets[1].data = updatedWeek;
            
            // Adjust borders dynamically if spike warning triggers
            const hasSpike = currentWeeklyUsage > baselineWeeklyTotal * 1.3;
            usageChart.data.datasets[1].borderColor = hasSpike ? "var(--color-orange)" : "var(--color-cyan)";
            usageChart.data.datasets[1].pointBackgroundColor = hasSpike ? "var(--color-orange)" : "var(--color-cyan)";
            usageChart.data.datasets[1].backgroundColor = hasSpike ? "rgba(245, 158, 11, 0.04)" : "rgba(0, 242, 254, 0.04)";
            
            usageChart.update("none"); // No jarring re-draw animations on drag
        }

        // 2. Dynamic Appliance Breakdown updates based on sub-sliders
        if (applianceChart) {
            const baseBreakdown = { ac: 45, fridge: 20, fan: 10, lighting: 10, others: 15 };
            
            // Compute real-time weight shifts based on sliders
            const totalSub = sub1Val + sub2Val + sub3Val;
            if (totalSub > 0) {
                // Blend original profiles with user interactive sliders
                const acWeight = (sub3Val / totalSub) * 60 + 20;
                const fridgeWeight = 15;
                const laundryWeight = (sub2Val / totalSub) * 15;
                const kitchenWeight = (sub1Val / totalSub) * 15;
                const rest = 100 - (acWeight + fridgeWeight + laundryWeight + kitchenWeight);

                applianceChart.data.datasets[0].data = [
                    Math.max(acWeight, 10).toFixed(0),
                    Math.max(fridgeWeight, 5).toFixed(0),
                    Math.max(laundryWeight, 5).toFixed(0),
                    Math.max(kitchenWeight, 5).toFixed(0),
                    Math.max(rest, 5).toFixed(0)
                ];
                applianceChart.data.labels = ["AC / Heating", "Fridge", "Laundry (Sub 2)", "Kitchen (Sub 1)", "Others"];
            } else {
                applianceChart.data.datasets[0].data = [45, 20, 10, 10, 15];
                applianceChart.data.labels = ["AC / Climate", "Fridge", "Fan", "Lighting", "Others"];
            }
            applianceChart.update("none");
        }
    }

    // --- Scenario presets loader ---
    function loadPreset(presetName) {
        const preset = presets[presetName];
        if (!preset) return;

        activePreset = presetName;

        // Apply to range inputs
        elements.voltage.value = preset.voltage;
        elements.intensity.value = preset.intensity;
        elements.reactive.value = preset.reactive;
        elements.sub1.value = preset.sub1;
        elements.sub2.value = preset.sub2;
        elements.sub3.value = preset.sub3;
        elements.budget.value = preset.budget;

        // Visual highlights update
        elements.presetBtns.forEach(btn => {
            if (btn.getAttribute("data-preset") === presetName) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });

        // Trigger updates
        updateDashboard();
    }

    // --- Set up Interactive UI Event Handlers ---

    // Sliders drag input listeners
    const allSliders = [
        elements.voltage, elements.intensity, elements.reactive,
        elements.sub1, elements.sub2, elements.sub3, elements.budget
    ];
    
    allSliders.forEach(slider => {
        slider.addEventListener("input", () => {
            // Remove active preset highlight once a user manually changes metrics
            elements.presetBtns.forEach(btn => btn.classList.remove("active"));
            updateDashboard();
        });
    });

    // Preset button clicks
    elements.presetBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const presetName = btn.getAttribute("data-preset");
            loadPreset(presetName);
        });
    });

    // Theme toggling actions
    elements.themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("light-theme");
        
        const isLight = document.body.classList.contains("light-theme");
        elements.themeToggle.innerHTML = isLight ? '<i class="fa-solid fa-sun text-orange"></i>' : '<i class="fa-solid fa-moon"></i>';
        
        // Refresh chart text styling colors
        const textColor = isLight ? "#475569" : "#94a3b8";
        
        if (applianceChart) {
            applianceChart.options.plugins.legend.labels.color = textColor;
            applianceChart.update();
        }
        if (usageChart) {
            usageChart.options.plugins.legend.labels.color = textColor;
            usageChart.options.scales.x.ticks.color = isLight ? "#64748b" : "#64748b";
            usageChart.options.scales.y.ticks.color = isLight ? "#64748b" : "#64748b";
            usageChart.update();
        }
    });

    // Navigation smooth jumps simulation
    document.getElementById("nav-simulator-link").addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelector(".control-panel").scrollIntoView({ behavior: "smooth" });
    });
    
    document.getElementById("nav-alerts-link").addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("alert-panel-section").scrollIntoView({ behavior: "smooth" });
    });
    
    document.getElementById("nav-recommendations-link").addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelector(".recommendations-card").scrollIntoView({ behavior: "smooth" });
    });

    // --- Init Startup Orchestration ---
    initCharts();
    loadPreset("normal");
});
