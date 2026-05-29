import os
import sys
import joblib
import pandas as pd

# =========================
# SET BASE DIRECTORY
# =========================

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

sys.path.append(BASE_DIR)

# =========================
# IMPORT MODULES
# =========================

from tariff_engine import calculate_bill
from smart_alert_engine import analyze_usage

# =========================
# LOAD TRAINED MODEL
# =========================

model_path = os.path.join(
    BASE_DIR,
    "electricity_bill_model.pkl"
)

model = joblib.load(model_path)

print("Model loaded successfully!")

# =========================
# TEST INPUT DATA
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

# =========================
# MONTHLY UNIT ESTIMATION
# =========================

monthly_units = predicted_power * 30

# =========================
# TARIFF CALCULATION
# =========================

estimated_bill = calculate_bill(monthly_units)

# =========================
# USER MONITORING DATA
# =========================

user_budget = 2000

current_week_usage = 55

average_usage = 35

appliance_usage_change = 30

# =========================
# SMART ALERT ANALYSIS
# =========================

alerts = analyze_usage(
    estimated_bill,
    user_budget,
    current_week_usage,
    average_usage,
    appliance_usage_change
)

# =========================
# OUTPUT
# =========================

print("\n===== PREDICTION RESULT =====")

print(
    f"Predicted Daily Consumption: "
    f"{predicted_power:.2f} kWh"
)

print(
    f"Predicted Monthly Units: "
    f"{monthly_units:.2f} units"
)

print(
    f"Estimated Monthly Bill: "
    f"₹{estimated_bill:.2f}"
)

# =========================
# SMART ALERTS
# =========================

print("\n===== SMART ALERTS =====")

for alert in alerts:
    print(alert)