# 🩸 HemoAI

**A blood bank management platform that closes the gap between donors, hospitals, and the blood banks in between — with a forecasting model that tells you what's running low *before* it does.**

HemoAI is a full-stack, microservices-based system: a React frontend, five Spring Boot services, and a Python ML service, all containerized and ready to run with a single command.

## Why HemoAI

Blood shortages aren't usually a supply problem — they're a *visibility* problem. Banks don't know demand is coming until it's already a crisis, donors don't know where they're needed, and hospitals are stuck calling around. HemoAI puts all three in one system:

- **Blood banks** get live inventory tracking and a forecast of next week's donations, per blood group
- **Hospitals & DHOs** get a real-time view of stock across the banks they oversee, not just one location
- **Donors** get a map of nearby banks, their own donation history, and a certificate for every donation

## Features

- 🔐 **Role-based accounts** — donors, blood bank officers, hospital admins, and district health officers (DHOs), with new blood bank/hospital registrations held in a pending-approval queue before going live
- 🩹 **Inventory tracking** per blood group per bank, with low-stock alerts
- 🗺️ **Donor map** (Leaflet) showing nearby blood banks and donors
- 📄 **Donation history** per donor, with downloadable PDF donation certificates (jsPDF + html2canvas)
- 📈 **Demand forecasting** — a `LinearRegression` model trained per blood group on real donation history, predicting next week's donations
- 💬 **AI chatbot** for natural-language inventory queries, backed by a locally-run Ollama model (keeps donor data self-hosted, nothing sent to a third-party API)
- 👥 **Staff management & reporting** for blood banks, plus a district-wide oversight view for DHOs

## Architecture

```
frontend (React)
    │
    ├── auth-service        :8081   accounts, login, role approval
    ├── employee-service    :8082   blood bank staff
    ├── inventory-service   :8083   stock per blood group per bank
    ├── donation-service    :8084   donation records, certificates
    ├── chatbot-service     :8085   NL queries → grounded in live inventory
    │                                 └── Ollama (local LLM)
    └── ml-service          :8086   demand forecasting (Flask + scikit-learn)

MySQL   — one database per Java microservice
MongoDB — forecast-call logging (ml-service, best-effort)
```

The Java services share a MySQL instance (one schema each) and authenticate with a shared JWT secret. `ml-service` trains a `LinearRegression` model per blood group on `donation-service`'s real donation history to predict next week's donation counts. `chatbot-service` calls `inventory-service` at answer time so it can ground replies in actual stock levels instead of guessing. The Chatbot screen needs Ollama running with a model pulled; every other screen works without it.

| Service | Tech | Port |
|---|---|---|
| `frontend` | React 18 + Vite, Leaflet, jsPDF/html2canvas, react-router | 5173 |
| `backend/auth-service` | Spring Boot | 8081 |
| `backend/employee-service` | Spring Boot | 8082 |
| `backend/inventory-service` | Spring Boot | 8083 |
| `backend/donation-service` | Spring Boot | 8084 |
| `backend/chatbot-service` | Spring Boot (calls Ollama) | 8085 |
| `ml-service` | Flask + scikit-learn | 8086 |

## Quick start

### Docker (recommended)

```bash
docker compose up --build
```

This builds and starts every service — MySQL and MongoDB included. Set the required secrets first (see [Configuration](#configuration)), then open **http://localhost:5173**.

### Windows, without Docker

```bash
start.bat
```

Launches all eight processes (five Spring Boot services, Ollama, ml-service, frontend) in their own windows, using a local MySQL and MongoDB. See the comments at the top of [start.bat](start.bat) for what needs to already be installed and running.

### Running a single service

```bash
# each Spring Boot service, from backend/<service-name>
mvn spring-boot:run

# frontend
cd frontend && npm install && npm run dev      # http://localhost:5173

# ml-service
cd ml-service && pip install -r requirements.txt && python app.py   # http://localhost:8086
```

## Configuration

Every service reads its secrets from environment variables — nothing sensitive is hardcoded. Create a `.env` file in the project root (used by `compose.yaml`) or export these before running services individually:

| Variable | Used by | Purpose |
|---|---|---|
| `DB_PASSWORD` | all Java services, `ml-service` | MySQL password |
| `JWT_SECRET` | all Java services, `ml-service` | Shared secret for signing/verifying login tokens |
| `MYSQL_ROOT_PASSWORD` | `mysql` container | Root password for the MySQL container |

## Requirements

- JDK 21
- Node.js + npm
- Python 3.10+
- MySQL (override connection details with `DB_HOST` / `DB_USERNAME` / `DB_PASSWORD`)
- MongoDB (defaults to `mongodb://localhost:27017`)
- Ollama (only needed for the Chatbot screen)

...or just Docker, if you'd rather not install any of the above.

## Developing in Eclipse

See [ECLIPSE_SETUP.md](ECLIPSE_SETUP.md) for importing the five Maven services, the frontend, and ml-service as separate Eclipse projects.

## Docs

Requirements and design documentation live in [docs/](docs/), including a [demo video script](docs/video_script.md) for recording a walkthrough of the platform.
