from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

from tariff_engine import calculate_bill
from carbon_engine import calculate_carbon
from sustainability_engine import calculate_sustainability_score
from smart_alert_engine import analyze_usage
from recommendation_engine import generate_recommendations
from appliance_breakdown import appliance_breakdown

app = Flask(__name__)
CORS(app)

# Load trained model
model = joblib.load("electricity_bill_model.pkl")


@app.route("/")
def home():
    return jsonify({
        "project": "Voltara Smart Energy Management",
        "status": "Backend Running",
        "message": "Use POST /predict for predictions"
    })


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        test_data = pd.DataFrame([{
            "Global_reactive_power": float(data["reactive"]),
            "Voltage": float(data["voltage"]),
            "Global_intensity": float(data["intensity"]),
            "Sub_metering_1": float(data["sub1"]),
            "Sub_metering_2": float(data["sub2"]),
            "Sub_metering_3": float(data["sub3"])
        }])

        # ML Prediction
        prediction = model.predict(test_data)
        predicted_power = float(prediction[0])

        # Monthly Units
        monthly_units = predicted_power * 30

        # Bill
        estimated_bill = calculate_bill(monthly_units)

        # Carbon
        carbon_emission = calculate_carbon(monthly_units)

        # Sustainability Score
        sustainability_score = calculate_sustainability_score(
            monthly_units,
            estimated_bill,
            carbon_emission
        )

        # Smart Alerts
        alerts = analyze_usage(
            predicted_bill=estimated_bill,
            user_budget=float(data["budget"]),
            current_week_usage=55,
            average_usage=35,
            appliance_usage_change=30
        )

        # Recommendations
        recommendations = generate_recommendations(
            monthly_units,
            estimated_bill,
            carbon_emission
        )

        # Appliance Breakdown
        breakdown = appliance_breakdown()

        return jsonify({
            "predicted_power": round(predicted_power, 2),
            "monthly_units": round(monthly_units, 2),
            "estimated_bill": round(estimated_bill, 2),
            "carbon": round(carbon_emission, 2),
            "score": sustainability_score,
            "alerts": alerts,
            "recommendations": recommendations,
            "breakdown": breakdown
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)