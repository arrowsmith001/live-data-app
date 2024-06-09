import json
import threading
import time
from flask_socketio import SocketIO
import websocket
from .utils import log
from .model import Connection
from flask import Blueprint
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


@main.route("/connections", methods=["GET"])
def get_connections():
    return getConnectionsJson()


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
    
    
@socketio.on("delete_connection")
def delete_connection(id):
    db.session.query(Connection).filter(Connection.id == id).delete()
    db.session.commit()
    socketio.emit("connections_changed", getConnectionsJson())

def getConnectionsJson():
    return json.dumps([c.get_dict() for c in db.session.query(Connection).all()])
