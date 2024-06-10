import json
from .. import socketio
from . import main
from .model import Schema
from .utils import log
from .. import db
from flask import current_app as app, request


@main.route("/schemas/add", methods=["POST"])
def add_schema():

    data = request.get_json()

    log("Adding schema: " + str(data))

    ds = Schema(data)

    db.session.add(ds)
    db.session.commit()

    socketio.emit("schemas_changed", getSchemasJson())

    return ds.get_dict(), 200


@main.route("/schemas/<int:id>", methods=["GET"])
def get_schema(id):
    return json.dumps(
        db.session.query(Schema).filter(Schema.id == id).first().get_dict()
    )


@main.route("/schemas/delete/<int:id>", methods=["DELETE"])
def delete_schema(id):
    db.session.query(Schema).filter(Schema.id == id).delete()
    db.session.commit()
    socketio.emit("schemas_changed", getSchemasJson())


@main.route("/schemas", methods=["GET"])
def get_schemas():
    return getSchemasJson()


def getSchemasJson():
    return json.dumps([s.get_dict() for s in db.session.query(Schema).all()])