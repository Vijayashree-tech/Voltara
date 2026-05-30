import os
import sys
import joblib
import pandas as pd

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

sys.path.append(BASE_DIR)

from tariff_engine import calculate_bill
from smart_alert_engine import analyze_usage
from carbon_engine import calculate_carbon
from sustainability_engine import calculate_sustainability_score
from recommendation_engine import generate_recommendations
from appliance_breakdown import appliance_breakdown

# =========================
# LOAD MODEL
# =========================

model_path = os.path.join(
    BASE_DIR,
    "electricity_bill_model.pkl"
)

model = joblib.load(model_path)

print("Model loaded successfully!")

# =========================
# INPUT DATA
# =========================

test_data = pd.DataFrame([
    {
        "Global_reactive_power": 0.418,
        "Voltage": 234.84,
        "Global_intensity": 18.4,
        "Sub_metering_1": 0.0,
        "Sub_metering_2": 1.0,
        "Sub_metering_3": 17.0
    }
])

# =========================
# PREDICTION
# =========================

prediction = model.predict(test_data)

predicted_power = prediction[0]

monthly_units = predicted_power * 30

# =========================
# BILL
# =========================

estimated_bill = calculate_bill(monthly_units)

# =========================
# CARBON
# =========================

carbon_emission = calculate_carbon(
    monthly_units
)

# =========================
# SUSTAINABILITY SCORE
# =========================

sustainability_score = (
    calculate_sustainability_score(
        monthly_units,
        estimated_bill,
        carbon_emission
    )
)

# =========================
# SMART ALERTS
# =========================

alerts = analyze_usage(
    estimated_bill,
    user_budget=2000,
    current_week_usage=55,
    average_usage=35,
    appliance_usage_change=30
)

# =========================
# AI SUGGESTIONS
# =========================

recommendations = (
    generate_recommendations(
        monthly_units,
        estimated_bill,
        carbon_emission
    )
)

# =========================
# APPLIANCE BREAKDOWN
# =========================

breakdown = appliance_breakdown()

# =========================
# OUTPUT
# =========================

print("\n===== ENERGY REPORT =====")

print(
    f"Predicted Daily Consumption: "
    f"{predicted_power:.2f} kWh"
)

print(
    f"Monthly Units: "
    f"{monthly_units:.2f}"
)

print(
    f"Estimated Bill: "
    f"₹{estimated_bill:.2f}"
)

print(
    f"Carbon Emission: "
    f"{carbon_emission:.2f} kg CO₂"
)

print(
    f"Sustainability Score: "
    f"{sustainability_score}/100"
)

print("\n===== SMART ALERTS =====")

for alert in alerts:
    print(alert)

print("\n===== ENERGY SAVING SUGGESTIONS =====")

for recommendation in recommendations:
    print(f"• {recommendation}")

print("\n===== APPLIANCE BREAKDOWN =====")

for appliance, percentage in breakdown.items():
    print(f"{appliance}: {percentage}%")