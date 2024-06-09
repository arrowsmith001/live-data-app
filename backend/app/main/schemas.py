import json
from .. import socketio
from . import main
from .model import Schema
from .utils import log
from .. import db
from flask import current_app as app


@socketio.on("add_schema")
def add_schema(data):

    log("Adding schema: " + str(data))

    ds = Schema(data)

    db.session.add(ds)
    db.session.commit()

    socketio.emit("schemas_changed", getSchemasJson())


@main.route("/schemas/<int:id>", methods=["GET"])
def get_schema(id):
    return json.dumps(
        db.session.query(Schema).filter(Schema.id == id).first().get_dict()
    )


@socketio.on("delete_schema")
def delete_schema(id):
    db.session.query(Schema).filter(Schema.id == id).delete()
    db.session.commit()
    socketio.emit("schemas_changed", getSchemasJson())


@main.route("/schemas", methods=["GET"])
def get_schemas():
    return getSchemasJson()


def getSchemasJson():
    return json.dumps([s.get_dict() for s in db.session.query(Schema).all()])