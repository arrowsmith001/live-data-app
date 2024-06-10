import json
import threading
import time
from flask_socketio import SocketIO
import websocket
from .utils import log
from .model import Connection
from flask import Blueprint, request
from .. import socketio, db
from . import main


def read_data(ws_server, id):
    event_name = "connection-" + str(id)
    try:
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


@main.route("/connections/connect/<int:id>", methods=["GET"])
def connect(id):
    conn = db.session.query(Connection).filter(Connection.id == id).first()
    url = conn.url

    print('Connecting to: ', url)

    try:
        ws_server = websocket.WebSocket()
        ws_server.connect("ws://" + url)
        thread = threading.Thread(target=read_data, args=(ws_server, id))
        thread.start()
    except Exception as e:
        log("Exception: " + str(e))

    return "Connected", 200


@main.route("/connections", methods=["GET"])
def get_connections():
    return getConnectionsJson()


@main.route("/connections/add", methods=["POST"])
def add_connection():

    data = request.get_json()

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

    socketio.emit("connections_changed", getConnectionsJson())

    connect(cd.id)
    
    return cd.get_dict(), 200
    
    
@main.route("/connections/delete/<int:id>", methods=["DELETE"])
def delete_connection(id):
    db.session.query(Connection).filter(Connection.id == id).delete()
    db.session.commit()
    socketio.emit("connections_changed", getConnectionsJson())
    return "Deleted", 200

def getConnectionsJson():
    return json.dumps([c.get_dict() for c in db.session.query(Connection).all()])
