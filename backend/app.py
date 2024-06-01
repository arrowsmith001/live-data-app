import json
import time
from flask_socketio import SocketIO
from model import ConnectionData
from utils import get_seconds, log
import websocket
import threading
from math import floor
from datetime import UTC, datetime, timezone
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import asc, text, Table
from flask.cli import FlaskGroup
from flask_cors import CORS, cross_origin


port = 5000


db = SQLAlchemy()

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = (
    # "postgresql://postgres:password@db:5432/robotdatadb"
    "postgresql://postgres:password@localhost/robotdatadb"
)
app.config["CORS_HEADERS"] = "Access-Control-Allow-Origin"

cors = CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")


class Event(db.Model):
    __tablename__ = "event"

    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.String(120), nullable=False)
    server_timestamp = db.Column(db.Float, nullable=False)
    origin = db.Column(db.String(120), nullable=False)

    def __repr__(self):
        return f"Event {self.id} {self.data} {self.server_timestamp} {self.origin}"

    def __init__(self, data, server_timestamp, origin):
        self.data = data
        self.server_timestamp = server_timestamp
        self.origin = origin


# Database setup
with app.app_context():
    db.init_app(app)
    Event.__table__.drop(db.engine)
    db.session.commit()
    db.create_all()
    db.session.commit()


@app.route("/")
def test():
    global clients
    debugInfo = {"clients": clients, "connections": connections}
    return json.dumps(debugInfo)


clients = {}
connections = {}


@socketio.on("connect")
def handle_connect():
    print("Client connected: ", request.sid)
    if request.sid not in clients:
        clients[request.sid] = []
    clients[request.sid].append("default")


@socketio.on("disconnect")
def handle_disconnect():
    print("Client disconnected: ", request.sid)
    if request.sid in clients:
        del clients[request.sid]


@socketio.on("subscribe")
def handle_subscribe(data):
    event_name = data
    if request.sid not in clients:
        clients[request.sid] = []
    clients[request.sid].append(event_name)
    log(request.sid + " subscribed to " + event_name)


@socketio.on("unsubscribe")
def handle_unsubscribe(data):
    event_name = data
    if request.sid in clients:
        clients[request.sid].remove(event_name)
    log(request.sid + " unsubscribed from " + event_name)


@socketio.on("add_connection")
def add_connection(data):

    cd = ConnectionData(data)

    if not cd.ip:
        return "IP address is required", 400

    url = cd.url

    if url in connections:
        return "Connection already exists", 400

    connections[url] = cd
    socketio.emit("connections_changed", getConnectionsJson())

    try:
        ws_server = websocket.WebSocket()
        ws_server.connect(url)
        thread = threading.Thread(target=read_data, args=(ws_server, url))
        thread.start()
    except Exception as e:
        log("Exception: " + str(e))
        return


def getConnectionsJson():
    return json.dumps({"connections": [cd.__dict__() for cd in connections.values()]})


@app.route("/connections", methods=["GET"])
def get_connections():
    return getConnectionsJson()


@socketio.on("delete_connection")
def delete_connection(url):
    if url in connections:
        del connections[url]
    socketio.emit("connections_changed", getConnectionsJson())


def read_data(ws_server, ws_url):
    try:
        with app.app_context():
            while True:
                try:
                    data = ws_server.recv()
                    publish_event(ws_url, data)
                    time.sleep(0.01)
                except ConnectionAbortedError as e:
                    log("ConnectionAbortedError: " + str(e))
                    return

    except Exception as e:
        log("Connection closed with controlled exception: " + str(e))


def publish_event(event_name, data):
    for client, events in clients.items():
        if event_name in events:
            socketio.emit(event_name, data)


if __name__ == "__main__":
    websocket.enableTrace(True)
    socketio.run(host="0.0.0.0", port=port, debug=True)
