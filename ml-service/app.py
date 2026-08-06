# app.py
#
# Starting point of ml-service. Run it with:
#   pip install -r requirements.txt
#   python app.py
#
# Needs donation-service's MySQL database reachable (same DB the Java
# donation-service uses - see config.py for connection settings) and the
# same JWT_SECRET as the other services.
from flask import Flask, jsonify
from flask_cors import CORS

import config
from auth import require_staff_role
from model import predict_next_week

app = Flask(__name__)

# Same idea as the CORS beans in the Java services' SecurityConfig -
# lets the Vite dev server (localhost:5173) call this API from the browser.
CORS(app, origins=["http://localhost:5173"])


@app.route("/api/forecast", methods=["GET"])
@require_staff_role
def forecast():
    """Returns next week's predicted donation count per blood group,
    from a real scikit-learn model trained on donation-service's data."""
    try:
        predictions = predict_next_week()
        return jsonify({"predictions": predictions})
    except Exception as exc:  # noqa: BLE001 - want a clean 503, not a stack trace
        return jsonify({"error": f"Could not compute forecast: {exc}"}), 503


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=config.PORT)
