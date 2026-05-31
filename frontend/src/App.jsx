import { useState } from "react";
import "./App.css";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip
} from "recharts";

import {
  FaBolt,
  FaLeaf,
  FaMoneyBillWave,
  FaRobot,
  FaExclamationTriangle
} from "react-icons/fa";

function App() {
  const [formData, setFormData] = useState({
    voltage: 234,
    intensity: 18,
    reactive: 0.4,
    sub1: 2,
    sub2: 3,
    sub3: 15,
    budget: 2000,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const predictEnergy = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      alert("Backend is not running");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const forecastData = [
  { month: "Jun", usage: result?.monthly_units * 0.85 || 0 },
  { month: "Jul", usage: result?.monthly_units * 0.95 || 0 },
  { month: "Aug", usage: result?.monthly_units || 0 },
  { month: "Sep", usage: result?.monthly_units * 1.05 || 0 },
  { month: "Oct", usage: result?.monthly_units * 1.1 || 0 }
];

const pieData =
  result?.breakdown
    ? Object.entries(result.breakdown).map(
        ([name, value]) => ({
          name,
          value
        })
      )
    : [];

const COLORS = [
  "#38bdf8",
  "#22c55e",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444"
];

  return (
    <div className="container">

      <div className="hero">
        <h1>⚡ Voltara AI Energy Intelligence</h1>
        <p>
          Smart Electricity Forecasting • Carbon Tracking • Sustainability Analysis
        </p>
      </div>

      <div className="input-card">
        <h2>🏠 Home Energy Information</h2>

        <div className="form-grid">

          <div className="input-group">
            <label>⚡ Home Voltage (Volts)</label>
            <input
              type="number"
              name="voltage"
              value={formData.voltage}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>🔌 Current Electricity Usage (Amps)</label>
            <input
              type="number"
              name="intensity"
              value={formData.intensity}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>📈 Power Load Factor</label>
            <input
              type="number"
              step="0.01"
              name="reactive"
              value={formData.reactive}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>🍳 Kitchen Appliance Usage</label>
            <input
              type="number"
              name="sub1"
              value={formData.sub1}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>🧺 Laundry Appliance Usage</label>
            <input
              type="number"
              name="sub2"
              value={formData.sub2}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>❄️ Air Conditioner Usage</label>
            <input
              type="number"
              name="sub3"
              value={formData.sub3}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>💰 Monthly Electricity Budget (₹)</label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
            />
          </div>

        </div>

        <button
          className="predict-btn"
          onClick={predictEnergy}
        >
          🚀 Generate Smart Energy Report
        </button>
      </div>

      {loading && (
        <div className="loading">
          Analyzing Energy Data...
        </div>
      )}

      {result && (
        <>
          <div className="ai-summary">

  <div className="summary-header">
    <FaRobot />
    <h2>Voltara AI Executive Summary</h2>
  </div>

  <p>
    Your household is operating at
    <strong> {result.score}/100 </strong>
    sustainability efficiency.

    Major energy consumer is
    <strong>
      {" "}
      {Object.keys(result.breakdown)[0]}
    </strong>.

    Estimated monthly bill is
    <strong> ₹{result.estimated_bill}</strong>
    with a carbon impact of
    <strong> {result.carbon} kg CO₂</strong>.
  </p>

</div> <br></br><br></br>
          <div className="dashboard">

  <div className="metric-card">
    <FaBolt className="metric-icon" />
    <h3>Monthly Units</h3>
    <div className="metric-value">
      {result.monthly_units}
    </div>
  </div>

  <div className="metric-card">
    <FaMoneyBillWave className="metric-icon" />
    <h3>Estimated Bill</h3>
    <div className="metric-value">
      ₹{result.estimated_bill}
    </div>
  </div>

  <div className="metric-card">
    <FaLeaf className="metric-icon" />
    <h3>Carbon Impact</h3>
    <div className="metric-value">
      {result.carbon}
    </div>
  </div>

  <div className="metric-card">
    <h3>Sustainability Score</h3>
    <div className="metric-value">
      {result.score}/100
    </div>
  </div>

</div>
          <div className="section">

  <h2>📈 Energy Forecast</h2>

  <ResponsiveContainer
    width="100%"
    height={300}
  >
    <AreaChart data={forecastData}>
      <XAxis dataKey="month" />
      <Tooltip />
      <Area
        type="monotone"
        dataKey="usage"
        stroke="#38bdf8"
        fill="#38bdf8"
      />
    </AreaChart>
  </ResponsiveContainer>

</div>

          <div className="section">
            <h2>
  <FaExclamationTriangle />
  Energy Intelligence Center
</h2>

            {result.alerts?.map((alert, index) => (
              <div key={index} className="alert">
                {alert}
              </div>
            ))}
          </div>

          <div className="section">
            <h2>💡 AI Recommendations</h2>

            {result.recommendations?.map((item, index) => (
              <div key={index} className="recommendation">
                {item}
              </div>
            ))}
          </div>
          <div className="section savings-card">

  <h2>💰 Savings Potential</h2>

  <div className="savings-number">
    ₹{Math.round(result.estimated_bill * 0.15)}
  </div>

  <p>
    Potential monthly savings
    through AI recommendations
  </p>

</div>
          <div className="section">

  <h2>🌍 Carbon Impact Tracker</h2>

  <div className="carbon-bar">

    <div
      className="carbon-fill"
      style={{
        width: `${Math.min(
          result.carbon,
          100
        )}%`
      }}
    />

  </div>

  <p>
    Current Carbon Output:
    {result.carbon} kg CO₂
  </p>

</div>

          <div className="analytics-layout">

  <div className="donut-wrapper">

    <ResponsiveContainer width={350} height={350}>
      <PieChart>

        <Pie
          data={pieData}
          dataKey="value"
          innerRadius={90}
          outerRadius={130}
          paddingAngle={5}
        >
          {pieData.map((entry, index) => (
            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>

        <Tooltip />

      </PieChart>
    </ResponsiveContainer>

    <div className="donut-center">
      <h2>45%</h2>
      <span>AC Usage</span>
    </div>

  </div>

  <div className="analytics-info">

    {pieData.map((item,index)=>(
      <div
        key={index}
        className="analytics-item"
      >
        <div
          className="color-dot"
          style={{
            background:
            COLORS[index]
          }}
        />

        <span>{item.name}</span>

        <strong>
          {item.value}%
        </strong>

      </div>
    ))}

  </div>

</div>
        </>
      )}

    </div>
  );
}

export default App;