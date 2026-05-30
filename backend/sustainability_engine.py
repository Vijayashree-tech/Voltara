def calculate_sustainability_score(
    monthly_units,
    estimated_bill,
    carbon_emission
):

    score = 100

    if monthly_units > 200:
        score -= 15

    if monthly_units > 400:
        score -= 20

    if estimated_bill > 3000:
        score -= 20

    if carbon_emission > 250:
        score -= 15

    score = max(score, 0)

    return score