# HemoAI

A blood bank management platform: a React frontend backed by five Spring Boot
microservices (auth, employee, inventory, donation, chatbot) plus a Python
ML service that forecasts donation demand.

## Quick start (Windows)

```bash
start.bat
```

This builds and launches every service and opens the app in your browser.

## Architecture

| Service | Tech | Port |
|---|---|---|
| `frontend` | React 18 + Vite, Leaflet (donor map), jsPDF/html2canvas, react-router | 5173 |
| `backend/auth-service` | Spring Boot | 8081 |
| `backend/employee-service` | Spring Boot | 8082 |
| `backend/inventory-service` | Spring Boot | 8083 |
| `backend/donation-service` | Spring Boot | 8084 |
| `backend/chatbot-service` | Spring Boot (uses Ollama) | 8085 |
| `ml-service` | Flask + scikit-learn | 8086 |

The Java services share a MySQL database. `ml-service` trains a
`LinearRegression` model per blood group on `donation-service`'s real
donation history to predict next week's donation counts, and logs each
forecast call to MongoDB (best-effort). The Chatbot screen needs Ollama
running locally with a model pulled; every other screen works without it.

## Requirements

- JDK 21
- Node.js + npm
- Python 3.10+
- MySQL (`root` / `omen` by default, override with `DB_USERNAME` / `DB_PASSWORD`)
- MongoDB (defaults to `mongodb://localhost:27017`)
- Ollama (only needed for the Chatbot screen)

## Running services individually

```bash
# each Spring Boot service, from backend/<service-name>
mvn spring-boot:run

# frontend
cd frontend
npm install
npm run dev      # http://localhost:5173

# ml-service
cd ml-service
pip install -r requirements.txt
python app.py     # http://localhost:8086
```

## Developing in Eclipse

See [ECLIPSE_SETUP.md](ECLIPSE_SETUP.md) for importing the five Maven
services, the frontend, and ml-service as separate Eclipse projects.
