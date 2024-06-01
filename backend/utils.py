from datetime import datetime, timezone
from math import floor


def log(msg):
    print(msg)
    return


def get_timestamp():
    return datetime.now(timezone.utc).timestamp()


def get_seconds():
    return floor(get_timestamp())
