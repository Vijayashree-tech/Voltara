import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
import joblib

# =========================
# LOAD DATASET
# =========================

df = pd.read_csv(
    "household_power_consumption.txt",
    sep=';',
    low_memory=False
)

print("Dataset loaded!")

# =========================
# CLEAN DATA
# =========================

df.replace('?', pd.NA, inplace=True)

columns = [
    'Global_active_power',
    'Global_reactive_power',
    'Voltage',
    'Global_intensity',
    'Sub_metering_1',
    'Sub_metering_2',
    'Sub_metering_3'
]

for col in columns:
    df[col] = pd.to_numeric(df[col], errors='coerce')

df.dropna(inplace=True)

print("Data cleaned!")

# =========================
# REDUCE DATASET SIZE
# =========================

# Take only 50,000 rows
df = df.sample(50000, random_state=42)

print(f"Reduced dataset size: {len(df)} rows")

# =========================
# FEATURES & TARGET
# =========================

X = df[
    [
        'Global_reactive_power',
        'Voltage',
        'Global_intensity',
        'Sub_metering_1',
        'Sub_metering_2',
        'Sub_metering_3'
    ]
]

y = df['Global_active_power']

# =========================
# TRAIN TEST SPLIT
# =========================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# =========================
# TRAIN MODEL
# =========================

model = RandomForestRegressor(
    n_estimators=20,     # fewer trees
    max_depth=10,        # limit tree depth
    random_state=42,
    n_jobs=-1
)

print("Training model...")

model.fit(X_train, y_train)

print("Model training completed!")

# =========================
# PREDICTIONS
# =========================

y_pred = model.predict(X_test)

# =========================
# EVALUATION
# =========================

mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"Mean Absolute Error: {mae}")
print(f"R2 Score: {r2}")

# =========================
# SAVE MODEL (COMPRESSED)
# =========================

joblib.dump(
    model,
    "electricity_bill_model.pkl",
    compress=3
)

print("Compressed model saved!")