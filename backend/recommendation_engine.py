def generate_recommendations(
    monthly_units,
    estimated_bill,
    carbon_emission
):

    suggestions = []

    if monthly_units > 200:
        suggestions.append(
            "Reduce high-power appliance usage during peak hours."
        )

    if estimated_bill > 3000:
        suggestions.append(
            "Your predicted bill is high. Consider reducing AC usage by 1–2 hours daily."
        )

    if carbon_emission > 150:
        suggestions.append(
            "Your carbon footprint is above average. Consider energy-efficient appliances."
        )

    if not suggestions:
        suggestions.append(
            "Great job! Your energy usage appears efficient."
        )

    return suggestions