# mongo.py
#
# Logs every /api/forecast call (who asked, when, what came back) to
# MongoDB. This is append-only, unstructured history - not the kind of
# data that belongs in donation-service's relational MySQL schema - so
# it lives in its own Mongo database instead.
#
# Logging is best-effort: if Mongo is unreachable, forecast() still
# returns a result to the caller, it just doesn't get logged.
import datetime
import logging

from pymongo import MongoClient
from pymongo.errors import PyMongoError

import config

logger = logging.getLogger(__name__)

_client = None


def _get_collection():
    global _client
    if _client is None:
        _client = MongoClient(config.MONGO_URI, serverSelectionTimeoutMS=2000)
    return _client[config.MONGO_DB_NAME]["forecast_logs"]


def log_forecast(username, predictions):
    try:
        _get_collection().insert_one(
            {
                "username": username,
                "predictions": predictions,
                "requestedAt": datetime.datetime.utcnow(),
            }
        )
    except PyMongoError:
        logger.warning("Could not write forecast log to MongoDB", exc_info=True)


def recent_forecasts(limit=20):
    try:
        docs = _get_collection().find().sort("requestedAt", -1).limit(limit)
        return [
            {
                "username": doc.get("username"),
                "predictions": doc.get("predictions"),
                "requestedAt": doc["requestedAt"].isoformat(),
            }
            for doc in docs
        ]
    except PyMongoError:
        logger.warning("Could not read forecast log from MongoDB", exc_info=True)
        return []
