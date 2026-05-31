import { useState } from "react";
import "./App.css";

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
          <div className="dashboard">

            <div className="metric-card">
              <h3>⚡ Daily Consumption</h3>
              <div className="metric-value">
                {result.predicted_power}
              </div>
              <p>kWh</p>
            </div>

            <div className="metric-card">
              <h3>📅 Monthly Units</h3>
              <div className="metric-value">
                {result.monthly_units}
              </div>
              <p>Units</p>
            </div>

            <div className="metric-card">
              <h3>💰 Estimated Bill</h3>
              <div className="metric-value">
                ₹{result.estimated_bill}
              </div>
            </div>

            <div className="metric-card">
              <h3>🌍 Carbon Footprint</h3>
              <div className="metric-value">
                {result.carbon}
              </div>
              <p>kg CO₂</p>
            </div>

            <div className="metric-card">
              <h3>🏆 Sustainability</h3>
              <div className="metric-value">
                {result.score}/100
              </div>
            </div>

          </div>

          <div className="section">
            <h2>🚨 Smart Alerts</h2>

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

          <div className="section">
            <h2>🔋 Appliance Breakdown</h2>

            <div className="breakdown-grid">

              {Object.entries(result.breakdown).map(
                ([name, value]) => (
                  <div
                    className="breakdown-card"
                    key={name}
                  >
                    <h4>{name}</h4>
                    <p>{value}%</p>
                  </div>
                )
              )}

            </div>
          </div>
        </>
      )}

    </div>
  );
}

export default App;