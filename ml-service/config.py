# config.py
#
# Every setting here can be overridden with an environment variable,
# same pattern as the Java services' application.properties - the
# values below are just local-dev defaults.
import os

# donation-service's own MySQL database - ml-service reads donation
# history straight from it (read-only queries only, never writes).
DB_HOST = os.environ.get("DB_HOST", "localhost")
DB_PORT = int(os.environ.get("DB_PORT", "3306"))
DB_USER = os.environ.get("DB_USERNAME", "root")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "omen")
DB_NAME = os.environ.get("DB_NAME", "donation_service_db")

# Must be exactly the same secret auth-service signs JWTs with (see
# app.jwt.secret in the Java services' application.properties) - that's
# what lets this service verify a token it never issued.
JWT_SECRET = os.environ.get("JWT_SECRET", "ChangeThisToARandom256BitSecretKeySharedByBothServices")

PORT = int(os.environ.get("PORT", "8086"))

# MongoDB - stores a log of each forecast call (who asked, when, what came
# back). Separate from donation-service's MySQL data: this is unstructured,
# append-only history, not core relational data, so it doesn't belong there.
MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB_NAME = os.environ.get("MONGO_DB_NAME", "ml_service_db")

# Only these roles can call the forecast endpoint - matches the role
# checks in the Java services (donors don't need a supply forecast).
ALLOWED_ROLES = {"HOSPITAL_ADMIN", "BLOOD_BANK_OFFICER", "DHO"}
