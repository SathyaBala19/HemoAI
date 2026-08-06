# model.py
#
# This is the actual "ML" part. For each blood group, it:
#   1. Pulls every donation from donation-service's database
#   2. Counts how many donations happened per week
#   3. Fits a simple linear regression (week number -> donation count)
#   4. Uses that line to predict next week's count
#
# This is a REAL trained model (scikit-learn LinearRegression), not
# hardcoded numbers - but with only a small amount of donation history
# (which is all a fresh install has), predictions will be rough. They
# get more meaningful as more real donations get logged over time.
import datetime
from collections import defaultdict

import numpy as np
import pymysql
from sklearn.linear_model import LinearRegression

import config

BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]


def _get_connection():
    return pymysql.connect(
        host=config.DB_HOST,
        port=config.DB_PORT,
        user=config.DB_USER,
        password=config.DB_PASSWORD,
        database=config.DB_NAME,
        cursorclass=pymysql.cursors.DictCursor,
    )


def _fetch_donations():
    """Reads every donation's blood group + date. Read-only - this
    service never writes to donation-service's database."""
    connection = _get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT BLOOD_GROUP, DONATION_DATE FROM DONATIONS")
            return cursor.fetchall()
    finally:
        connection.close()


def _week_number(donation_date):
    """Turns a date into a single increasing integer (year*52 + ISO
    week), so we can treat "week" as a simple x-axis for the regression."""
    iso_year, iso_week, _ = donation_date.isocalendar()
    return iso_year * 52 + iso_week


def predict_next_week():
    """Returns {blood_group: {predictedUnits, weeksOfData, method}}."""
    rows = _fetch_donations()

    # weekly_counts[blood_group][week_number] = how many donations that week
    weekly_counts = defaultdict(lambda: defaultdict(int))
    for row in rows:
        group = row["BLOOD_GROUP"]
        week = _week_number(row["DONATION_DATE"])
        weekly_counts[group][week] += 1

    current_week = _week_number(datetime.date.today())
    predictions = {}

    for group in BLOOD_GROUPS:
        weeks_data = weekly_counts.get(group, {})
        weeks_of_data = len(weeks_data)

        if weeks_of_data == 0:
            # No history at all yet for this group - nothing to learn from.
            predictions[group] = {"predictedUnits": 0, "weeksOfData": 0, "method": "no_data"}
        elif weeks_of_data == 1:
            # Only one data point - a regression line needs at least two,
            # so just carry that single week's count forward as the guess.
            only_count = next(iter(weeks_data.values()))
            predictions[group] = {"predictedUnits": only_count, "weeksOfData": 1, "method": "single_week_carry_forward"}
        else:
            # Real linear regression: X = week numbers, y = donation counts.
            X = np.array(list(weeks_data.keys())).reshape(-1, 1)
            y = np.array(list(weeks_data.values()))
            model = LinearRegression()
            model.fit(X, y)
            predicted = model.predict([[current_week + 1]])[0]
            # A regression line can dip below zero - donations can't, so clamp it.
            predicted = max(0, round(predicted))
            predictions[group] = {"predictedUnits": int(predicted), "weeksOfData": weeks_of_data, "method": "linear_regression"}

    return predictions
