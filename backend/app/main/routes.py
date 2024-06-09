
import json
from flask import request

from .utils import get_seconds
from .connections import getConnectionsJson
from .. import socketio
from . import main

clients = {}

@main.route("/")
def test():
    global clients
    debugInfo = {"clients": clients, "connections": getConnectionsJson()}
    return json.dumps(debugInfo)


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
