import json
import logging
import time
from flask_socketio import SocketIO, join_room, leave_room
from model import ConnectionInfo, DataSchema
from utils import get_seconds, log
import websocket
import threading
from math import floor
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import asc, text, Table
from flask.cli import FlaskGroup
from flask_cors import CORS, cross_origin
from sqlalchemy.dialects.postgresql import ARRAY


port = 5000


db = SQLAlchemy()

app = Flask(__name__)
app.logger.setLevel(logging.INFO)
app.config["SQLALCHEMY_DATABASE_URI"] = (
    # "postgresql://postgres:password@db:5432/robotdatadb"
    "postgresql://postgres:password@localhost/robotdatadb"
)
app.config["CORS_HEADERS"] = "Access-Control-Allow-Origin"

cors = CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")


# class Event(db.Model):
#     __tablename__ = "event"

#     id = db.Column(db.Integer, primary_key=True)
#     data = db.Column(db.String(120), nullable=False)
#     server_timestamp = db.Column(db.Float, nullable=False)
#     origin = db.Column(db.String(120), nullable=False)

#     def __repr__(self):
#         return f"Event {self.id} {self.data} {self.server_timestamp} {self.origin}"

#     def __init__(self, data, server_timestamp, origin):
#         self.data = data
#         self.server_timestamp = server_timestamp
#         self.origin = origin


class Connection(db.Model):
    __tablename__ = "connection"

    id = db.Column(db.Integer, primary_key=True)

    url = db.Column(db.String(255), nullable=False)
    ip = db.Column(db.String(120), nullable=False)
    port = db.Column(db.Integer, nullable=False)
    endpoint = db.Column(db.String(120), nullable=True)
    name = db.Column(db.String(120), nullable=False)

    def __repr__(self):
        return f"Connection {self.name} {self.url}"

    def __init__(self, data):
        self.ip = data["ip"]
        self.port = data["port"]
        self.endpoint = data["endpoint"]
        self.name = data["name"]
        self.url = self.ip + ":" + str(self.port)
        if self.endpoint:
            self.url += "/" + self.endpoint

    def get_dict(self):
        return {
            "id": self.id,
            "ip": self.ip,
            "port": self.port,
            "endpoint": self.endpoint,
            "name": self.name,
            "url": self.url,
        }


class Schema(db.Model):
    __tablename__ = "schema"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(120), nullable=False)
    count = db.Column(db.Integer, nullable=False)
    labels = db.Column(ARRAY(db.String), nullable=False)
    types = db.Column(ARRAY(db.String), nullable=False)
    format = db.Column(db.String(32), nullable=False)
    delimiter = db.Column(db.String(8), nullable=True)

    def __repr__(self):
        return f"Schema {self.name} {self.labels} {self.types}"

    def __init__(self, data):
        self.count = data["count"]
        self.name = data["name"]
        self.labels = data["labels"]
        self.types = data["types"]
        self.format = data["format"]
        if "delimiter" in data:
            self.delimiter = data["delimiter"]

    def get_dict(self):
        return {
            "id": self.id,
            "count": self.count,
            "name": self.name,
            "labels": self.labels,
            "types": self.types,
            "format": self.format,
            "delimiter": self.delimiter,
        }


# Database setup
with app.app_context():
    db.init_app(app)
    db.drop_all()
    db.session.commit()
    db.create_all()
    db.session.commit()


@app.route("/")
def test():
    global clients
    debugInfo = {"clients": clients, "connections": getConnectionsJson()}
    return json.dumps(debugInfo)


clients = {}  # sid -> {connected: timestamp}


@socketio.on("connect")
def handle_connect():
    print("Client connected: ", request.sid)
    if request.sid not in clients:
        clients[request.sid] = {}
    clients[request.sid].update({"connected": get_seconds()})


@socketio.on("disconnect")
def handle_disconnect():
    print("Client disconnected: ", request.sid)
    if request.sid in clients:
        del clients[request.sid]


@socketio.on("subscribe")
def handle_subscribe(event_name):
    join_room(event_name)
    log(request.sid + " subscribed to " + event_name)


@socketio.on("unsubscribe")
def handle_unsubscribe(event_name):
    leave_room(event_name)
    log(request.sid + " unsubscribed from " + event_name)


@socketio.on("add_connection")
def add_connection(data):

    log("Adding connection: " + str(data))

    cd = Connection(data)

    if not cd.ip:
        return "IP address is required", 400

    if not cd.port:
        return "Port is required", 400

    url = cd.url

    if db.session.query(Connection).filter(Connection.url == url).count() > 0:
        return "Connection already exists", 400

    db.session.add(cd)
    db.session.commit()

    id = db.session.query(Connection).filter(Connection.url == url).first().id

    socketio.emit("connections_changed", getConnectionsJson())

    try:
        ws_server = websocket.WebSocket()
        ws_server.connect("ws://" + url)
        thread = threading.Thread(target=read_data, args=(ws_server, id))
        thread.start()
    except Exception as e:
        log("Exception: " + str(e))
        return


@socketio.on("add_schema")
def add_schema(data):

    log("Adding schema: " + str(data))

    ds = Schema(data)

    db.session.add(ds)
    db.session.commit()

    socketio.emit("schemas_changed", getSchemasJson())


def read_data(ws_server, id):
    event_name = "connection-" + str(id)
    try:
        with app.app_context():
            while True:
                try:
                    data = ws_server.recv()
                    socketio.emit(event_name, data)
                    print("Emitted: ", data, " to ", event_name)
                    time.sleep(0.01)
                except ConnectionAbortedError as e:
                    log("ConnectionAbortedError: " + str(e))
                    return

    except Exception as e:
        log("Connection closed with controlled exception: " + str(e))


@socketio.on("delete_connection")
def delete_connection(id):
    db.session.query(Connection).filter(Connection.id == id).delete()
    db.session.commit()
    socketio.emit("connections_changed", getConnectionsJson())


@socketio.on("delete_schema")
def delete_schema(id):
    db.session.query(Schema).filter(Schema.id == id).delete()
    db.session.commit()
    socketio.emit("schemas_changed", getSchemasJson())


@app.route("/schemas/<int:id>", methods=["GET"])
def get_schema(id):
    return json.dumps(
        db.session.query(Schema).filter(Schema.id == id).first().get_dict()
    )


@app.route("/connections", methods=["GET"])
def get_connections():
    return getConnectionsJson()


@app.route("/schemas", methods=["GET"])
def get_schemas():
    return getSchemasJson()


def getConnectionsJson():
    return json.dumps([c.get_dict() for c in db.session.query(Connection).all()])


def getSchemasJson():
    return json.dumps([s.get_dict() for s in db.session.query(Schema).all()])


if __name__ == "__main__":
    websocket.enableTrace(True)
    socketio.run(host="0.0.0.0", port=port, debug=True)
