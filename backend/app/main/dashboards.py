import json
from .utils import log
from . import main
from .. import db
from .model import Dashboard


def getDashboardsJson():
    return json.dumps([d.get_dict() for sd in db.session.query(Dashboard).all()])


@main.route("/dashboards", methods=["GET"])
def get_dashboards():
    return getDashboardsJson()