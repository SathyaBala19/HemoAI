# ml-service

The real ML piece of HemoAI - a small Flask API that trains a
scikit-learn `LinearRegression` per blood group on donation-service's
actual donation history, and predicts next week's donation count.

## Why predictions might look flat right now

With a fresh install (little to no donation history yet), most blood
groups will show `"method": "no_data"` and a prediction of 0 - there's
nothing to learn from yet. As real donations get logged through the app
over time, this model actually improves, because it's training on real
rows in the `DONATIONS` table, not a canned formula.

## Running it

```bash
pip install -r requirements.txt
python app.py
```

Runs on port 8086 by default. Needs:
- donation-service's MySQL database reachable (same DB, read-only queries)
- the same `JWT_SECRET` as the Java services (see `config.py`)

## Endpoint

`GET /api/forecast` - requires `Authorization: Bearer <token>` for a
staff role (HOSPITAL_ADMIN, BLOOD_BANK_OFFICER, DHO). Returns:

```json
{
  "predictions": {
    "O+": { "predictedUnits": 12, "weeksOfData": 4, "method": "linear_regression" },
    "O-": { "predictedUnits": 0,  "weeksOfData": 0, "method": "no_data" }
  }
}
```
