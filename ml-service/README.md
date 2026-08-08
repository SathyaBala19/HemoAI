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
- a MongoDB instance reachable at `MONGO_URI` (defaults to
  `mongodb://localhost:27017`) - used only to log forecast calls, see below

## MongoDB

Every `/api/forecast` call is logged (best-effort - a Mongo outage doesn't
fail the request) to the `forecast_logs` collection in the `ml_service_db`
database: who asked, when, and what came back. This is the only place in
HemoAI that uses MongoDB - everything else is MySQL. It's a natural fit
here because it's append-only, unstructured history, not core relational
data, and this service is fully isolated from the Java/Tomcat stack (the
Windows loopback issue that hit the Java services doesn't apply to Flask).

## Endpoints

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

`GET /api/forecast/history` - same auth requirement. Returns the most
recent forecast calls logged in MongoDB:

```json
{
  "history": [
    { "username": "alice@hospital.org", "predictions": { "...": "..." }, "requestedAt": "2026-08-07T10:15:00" }
  ]
}
```
