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

statuses = {}

def set_connection_status(id, status):
    global statuses
    if(status == None):
        if(id in statuses.keys()): del statuses[id]
        return
    
    statuses[id] = status
    socketio.emit("connection_status_changed", {"id": id, "data": statuses})


@main.route("/connections/statuses", methods=["GET"])
def get_connection_statuses():
    global statuses
    return json.dumps(statuses)


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
                set_connection_status(id, "disconnected")
                return

    except Exception as e:
        log("Connection closed with controlled exception: " + str(e))
        set_connection_status(id, "disconnected")

ws_servers = {}

@main.route("/connections/connect/<int:id>", methods=["GET"])
def connect(id):
    global ws_servers
    if(id in statuses and statuses[id] == "connected"):
        return 'OK', 200
    
    set_connection_status(id, "pending")
    conn = db.session.query(Connection).filter(Connection.id == id).first()
    url = conn.url

    print('Connecting to: ', url)

    try:
        ws_server = websocket.WebSocket()
        ws_server.connect("ws://" + url)
        set_connection_status(id, "connected")
        thread = threading.Thread(target=read_data, args=(ws_server, id))
        thread.start()
        ws_servers[id] = ws_server
    except Exception as e:
        set_connection_status(id, "disconnected")
        log("Exception: " + str(e))



    return 'OK', 200


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
    set_connection_status(cd.id, "pending")

    connect(cd.id)
    
    return json.dumps(cd.get_dict())
    
    
@main.route("/connections/delete/<int:id>", methods=["DELETE"])
def disconnect_connection(id):
    db.session.query(Connection).filter(Connection.id == id).delete()
    db.session.commit()

    socketio.emit("connections_changed", getConnectionsJson())
    set_connection_status(id, None)

    if(id in ws_servers.keys()): ws_servers[id].close()

    return "Deleted", 200


@main.route("/connections/disconnect/<int:id>", methods=["GET"])
def delete_connection(id):

    if(id in statuses and statuses[id] != "connected"):
        return 'OK', 200

    if(id not in ws_servers.keys()): return 404

    ws_servers[id].close()

    return "Deleted", 200

def getConnectionsJson():
    return json.dumps([c.get_dict() for c in db.session.query(Connection).all()])
