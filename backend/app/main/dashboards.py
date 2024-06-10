import json

from flask import request

from .utils import log
from . import main
from .. import db, socketio
from .model import Dashboard


def getDashboardsJson():
    return json.dumps([d.get_dict() for sd in db.session.query(Dashboard).all()])

@main.route("/dashboards/add", methods=["POST"])
def addDashboard():
    data = request.get_json()
    log("Adding dashboard: " + str(data))

    ds = Dashboard(data)

    db.session.add(ds)
    db.session.commit()
    
    socketio.emit("dashboards_changed", getDashboardsJson())

@main.route("/dashboards", methods=["GET"])
def get_dashboards():
    return getDashboardsJson()