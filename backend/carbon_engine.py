def calculate_carbon(monthly_units):

    # Approximate CO₂ emission factor
    carbon_emission = monthly_units * 0.82

    return round(carbon_emission, 2)