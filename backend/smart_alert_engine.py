def analyze_usage(
    predicted_bill,
    user_budget,
    current_week_usage,
    average_usage,
    appliance_usage_change
):

    alerts = []

    # =========================
    # BUDGET ALERT
    # =========================

    if predicted_bill > user_budget:
        alerts.append(
            "⚠ Budget Alert: Predicted bill exceeds your budget."
        )

    # =========================
    # ANOMALY DETECTION
    # =========================

    if current_week_usage > average_usage * 1.3:
        alerts.append(
            "⚠ Abnormal Usage Detected: Weekly usage spike identified."
        )

    # =========================
    # APPLIANCE SURGE DETECTION
    # =========================

    if appliance_usage_change > 25:
        alerts.append(
            "⚠ Appliance Usage Increased Significantly."
        )

    # =========================
    # HIGH ENERGY WARNING
    # =========================

    if predicted_bill > 5000:
        alerts.append(
            "🚨 Critical Warning: Extremely high electricity usage."
        )

    # =========================
    # NORMAL STATUS
    # =========================

    if len(alerts) == 0:
        alerts.append(
            "✅ Usage pattern looks normal."
        )

    return alerts