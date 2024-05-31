from datetime import datetime, timezone
from math import floor


def get_timestamp():
    return datetime.now(timezone.utc).timestamp()


def get_seconds():
    return floor(get_timestamp())
