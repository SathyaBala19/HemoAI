# auth.py
#
# Same JWT-verification job as JwtAuthFilter in the Java services, just
# written in Python: read the "Authorization: Bearer <token>" header,
# verify it was signed with the shared secret, and pull the role claim
# out of it. This service never issues tokens, only auth-service does.
from functools import wraps

import jwt
from flask import request, jsonify, g

import config


def _extract_token():
    header = request.headers.get("Authorization", "")
    if not header.startswith("Bearer "):
        return None
    return header[len("Bearer "):]


def require_staff_role(view_func):
    """Decorator: rejects the request unless it has a valid JWT for one
    of the staff roles (HOSPITAL_ADMIN, BLOOD_BANK_OFFICER, DHO) -
    matches the role check the Java services do in SecurityConfig."""

    @wraps(view_func)
    def wrapped(*args, **kwargs):
        token = _extract_token()
        if not token:
            return jsonify({"error": "Missing or invalid token"}), 401

        try:
            # The Java side (jjwt's Keys.hmacShaKeyFor) picks HS256, HS384,
            # or HS512 automatically based on how long JWT_SECRET is - so
            # instead of hardcoding one, read which one the token claims to
            # use, but only ever accept it if it's one of these three HMAC
            # algorithms. NEVER pass the header's alg straight through
            # unchecked - that's the classic "alg: none" JWT forgery bug.
            claimed_alg = jwt.get_unverified_header(token).get("alg")
            if claimed_alg not in ("HS256", "HS384", "HS512"):
                return jsonify({"error": "Missing or invalid token"}), 401
            payload = jwt.decode(token, config.JWT_SECRET, algorithms=[claimed_alg])
        except jwt.PyJWTError:
            return jsonify({"error": "Missing or invalid token"}), 401

        role = payload.get("role")
        if role not in config.ALLOWED_ROLES:
            return jsonify({"error": "You do not have permission for this action"}), 403

        g.username = payload.get("sub")
        return view_func(*args, **kwargs)

    return wrapped
