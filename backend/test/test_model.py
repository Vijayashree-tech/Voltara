import joblib
import pandas as pd

# =========================
# LOAD TRAINED MODEL
# =========================

model = joblib.load("../electricity_bill_model.pkl")

print("Model loaded successfully!")

# =========================
# TEST INPUT DATA
# =========================

# Format:
# [
#   Global_reactive_power,
#   Voltage,
#   Global_intensity,
#   Sub_metering_1,
#   Sub_metering_2,
#   Sub_metering_3
# ]

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
# BILL ESTIMATION
# =========================

# Example:
# ₹8 per unit

estimated_bill = predicted_power * 8 * 30

# =========================
# OUTPUT
# =========================

print("\n===== PREDICTION RESULT =====")
print(f"Predicted Power Consumption: {predicted_power:.2f} kW")
print(f"Estimated Monthly Bill: ₹{estimated_bill:.2f}")

# =========================
# OVERUSE ALERT
# =========================

if estimated_bill > 3000:
    print("⚠ ALERT: High Electricity Usage Detected!")
else:
    print("✅ Usage is under control.")