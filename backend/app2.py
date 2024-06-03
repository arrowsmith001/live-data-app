import json
import sys
import time
import uuid
from utils import get_seconds
import websocket
import threading
from math import floor
from datetime import UTC, datetime, timezone
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import asc, text, Table
from flask_sock import Sock
from flask.cli import FlaskGroup
from flask_cors import CORS, cross_origin

# time.sleep(5)

# TODO: Refactor functions outside of app.py
# TODO: Clean subscriber model

port = 5000


db = SQLAlchemy()


def log(msg):
    print(msg)
    return


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


app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = (
    # "postgresql://postgres:password@db:5432/robotdatadb"
    "postgresql://postgres:password@localhost/robotdatadb"
)
app.config["CORS_HEADERS"] = "Access-Control-Allow-Origin"
cors = CORS(app)

# Database setup
with app.app_context():
    db.init_app(app)
    Event.__table__.drop(db.engine)
    db.session.commit()
    db.create_all()  # This creates on the table schema
    db.session.commit()


sock = Sock(app)
cli = FlaskGroup(app)


# List to store websocket threads
websocket_threads = []


seconds = get_seconds()


def format_event(event: Event):
    return {
        "id": event.id,
        "data": event.data,
        "server_timestamp": event.server_timestamp,
        "origin": event.origin,
    }


ws_servers = {}

connected_clients = {}
ws_client_prefs = {}


@app.route("/")
def test():
    global ws_servers, connected_clients, ws_client_prefs
    debugInfo = {"clients": clients}
    return json.dumps(debugInfo)


clients = {}


# Handle an incoming client connection, and continuously send data that the client is subscribed to
@sock.route("/ws/connect")
def connect_to_client(ws_client):
    global clients

    log("Incoming Connection: " + str(ws_client.environ))

    client_id = ws_client.environ.get("REMOTE_ADDR")

    if client_id not in clients:
        clients[client_id] = []
    clients[client_id].append("default")

    # while True:
    #     if ws_client_id not in ws_client_prefs.keys():
    #         time.sleep(0.1)
    #         continue

    #     log("CONSIDERING DATA: " + str(len(ws_client_prefs[ws_client_id]["events"])))

    #     try:
    #         while len(ws_client_prefs[ws_client_id]["events"]) > 0:
    #             # ws_client.send(json.dumps(str(time.time()) + " 1 1"))
    #             event = ws_client_prefs[ws_client_id]["events"].pop(0)
    #             log("Sending data to client: " + str(event))
    #             log(str(ws_client))
    #             ws_client.send(json.dumps(event))
    #             log("ok")
    #     except ConnectionAbortedError:
    #         log("Connection closed")
    #         break
    #     time.sleep(0.1)

    # thread = threading.Thread(
    #     target=send_data_to_client, args=(ws_client_id, ws_client)
    # )
    # thread.start()

    return ""


# Connect to a server emitting data
@app.route("/add_connection", methods=["POST"])
@cross_origin()
def add_connection():
    global ws_servers, connected_clients

    client_ip = request.remote_addr

    data = request.get_json()
    ip_address = data.get("ip")
    port = data.get("port")
    endpoint = data.get("endpoint")
    name = data.get("name")
    isPrivate = data.get("isPrivate")

    if not ip_address:
        return "IP address is required", 400

    if endpoint:
        ws_url = f"ws://{ip_address}:{port}/{endpoint}"
    else:
        ws_url = f"ws://{ip_address}:{port}"

    # Forbid connecting to the same server twice
    if ws_url in ws_servers.keys():
        return "Already connected to this server", 400

    ws_server = websocket.WebSocket()
    ws_servers[ws_url] = {
        "ws": ws_server,
        "clientIp": client_ip,
        "isPrivate": isPrivate,
        "name": name,
        "last_received": None,
    }

    connection_changed_event(ws_url, "pending")

    # connected_clients[ws_server] = thread

    try:
        connect_to_server(ws_server, ws_url)
        connection_changed_event(ws_url, "connected")
    except Exception as e:
        log("Error connecting to server: " + str(e))
        connection_changed_event(ws_url, "disconnected")

    return ""


def connection_changed_event(ws_url, status):
    global ws_servers
    ws_servers[ws_url]["status"] = status
    publish_to_all({"status": status, "ws_url": ws_url}, "connection")


def url_to_wsconfig(ws_url):
    if ws_url.startswith("ws://"):
        ws_url = ws_url.replace("ws://", "")
    ip = ws_url.split(":")[0]
    port = ws_url.split(":")[1].split("/")[0]
    # join the rest for endpoint
    endpoint = "/".join(ws_url.split(":")[1].split("/")[1:])
    if endpoint == "/":
        endpoint = ""
    return ip, port, endpoint


def wsconfig_to_url(ip_address, port, endpoint):
    return f"ws://{ip_address}:{port}/{endpoint}"


# Connect to a server emitting data
@app.route("/get_connections", methods=["GET"])
@cross_origin()
def get_connections():
    global ws_servers
    out = []
    for ws_url in ws_servers.keys():
        ip, port, endpoint = url_to_wsconfig(ws_url)
        out.append(
            {
                "name": ws_servers[ws_url]["name"],
                "isPrivate": ws_servers[ws_url]["isPrivate"],
                "ip": ip,
                "port": port,
                "endpoint": endpoint,
                "status": ws_servers[ws_url]["status"],
                "last_received": ws_servers[ws_url]["last_received"],
            }
        )
    # copy a dump of ws_Servers minus ws objects
    return json.dumps(out)


def connect_to_server(ws_server, ws_url):
    ws_server.connect(ws_url)
    thread = threading.Thread(target=read_data, args=(ws_server, ws_url))
    thread.start()


def params_to_url(ip, port, endpoint):
    if endpoint == "":
        return f"ws://{ip}:{port}"
    return f"ws://{ip}:{port}/{endpoint}"


# Read data continuously from a server, and if a client is subscribed to the source of the data, add it to the client's data list
def read_data(ws_server, ws_url):
    try:
        with app.app_context():
            global seconds, ws_servers, ws_client_prefs
            # log("Connected to " + str(ws_server))
            while ws_url in ws_servers.keys():
                try:
                    data = ws_server.recv()
                    time.sleep(0.01)
                except ConnectionAbortedError as e:
                    log("ConnectionAbortedError: " + str(e))
                    connection_changed_event(ws_url, "disconnected")
                    return

                server_timestamp = get_timestamp()
                ws_servers[ws_url]["last_received"] = server_timestamp

                event = push_event(data, server_timestamp, ws_url)
                log("DATA_server_timestamp: " + str(server_timestamp))

                # if a client has been registered as interested in the source of this data...
                publish_to_subscribers(ws_url, event, "data")

    except Exception as e:
        log("Connection closed with controlled exception: " + str(e))
        connection_changed_event(ws_url, "disconnected")


def publish_to_subscribers(ws_url, event, event_type):
    global ws_client_prefs
    for client_id in ws_client_prefs.keys():
        try:
            params = ws_client_prefs[client_id]["params"]
            url = params_to_url(params["ip"], params["port"], params["endpoint"])

            if url == ws_url:
                ws_client_prefs[client_id]["events"].append({event_type: event})
        except:
            pass


def publish_to_all(event, event_type):
    global ws_client_prefs
    for client_id in ws_client_prefs.keys():
        try:
            ws_client_prefs[client_id]["events"].append({event_type: event})
        except:
            pass


# Disconnect from a data server
@app.route("/disconnect")
@cross_origin()
def disconnect_from_server():
    global ws_servers, connected_clients
    data = request.get_json()
    ip_address = data.get("ip")
    port = data.get("port")
    endpoint = data.get("endpoint")

    if not ip_address:
        return "IP address is required", 400

    if endpoint:
        ws_url = f"ws://{ip_address}:{port}/{endpoint}"
    else:
        ws_url = f"ws://{ip_address}"

    if ws_url in ws_servers.keys():
        ws = ws_servers[ws_url]["ws"]
        ws.close()
        connected_clients[ws].join()  # Wait for the thread to finish
        connection_changed_event(ws_url, "disconnected")
        # del connected_clients[ws]
        log("Disconnected from " + ws_url)
        return ""
    else:
        return "Server not found", 404

    return ""


expiry_seconds = 10


# Allow a client to update their subscription preferences
@app.route("/subscribe", methods=["POST"])
@cross_origin()
def client_subscribe():
    global ws_client_prefs
    # while True:
    #     ws.send(json.dumps(read_latest_event()))
    #     time.sleep(0.1)

    # get address and port from request
    ip_address = request.remote_addr
    # port = request.environ.get("REMOTE_PORT")
    id = ip_address

    log("Client updating: " + id + " with data: " + str(ws_client_prefs))

    data = request.get_json()
    params = data

    for id in ws_client_prefs.keys():
        log(id)

    # if client unreocgnized, abort
    if id not in ws_client_prefs.keys():
        ws_client_prefs[id] = {"params": {}, "events": []}
        # return "Client " + id + " not recognized", 400

    # update parameters for the client
    ws_client_prefs[id]["params"] = params

    log("After update: " + str(ws_client_prefs))

    return "OK"


@app.route("/event", methods=["POST"])
def create_event():
    server_timestamp = get_timestamp()
    data = request.get_json().get("data")
    origin = request.remote_addr
    return push_event(data, server_timestamp, origin)


latest_event = None
latest_origin = None


def push_event(data, server_timestamp, origin):
    event = Event(data, server_timestamp, origin)
    # db.session.add(event)
    # db.session.commit()
    return format_event(event)


@app.route("/events", methods=["GET"])
def read_events():
    events = Event.query.order_by(asc(Event.server_timestamp)).all()
    return json.dumps([format_event(event) for event in events])


def read_latest_event():
    return json.dumps([format_event(latest_event)])


@app.route("/events/<int:id>", methods=["GET"])
def read_event(id):
    event = Event.query.get(id)
    return format_event(event)


@app.route("/events/<int:id>", methods=["DELETE"])
def delete_event(id):
    event = Event.query.get(id)
    db.session.delete(event)
    db.session.commit()
    return format_event(event)


@app.route("/events/by_age/<int:age>", methods=["DELETE"])
def delete_events_by_age(age):
    try:
        log("Deleting events older than " + str(age) + " seconds")
        cutoff_time = get_timestamp() - age
        events = Event.query.filter(Event.server_timestamp < cutoff_time).all()
        if len(events) == 0:
            log("Deleted 0 events")
            return json.dumps([])
        # for event in events:
        # db.session.delete(event)
        # db.session.commit()
        # log("Deleted " + str(len(events)) + " events")
        return json.dumps([format_event(event) for event in events])
    except Exception as e:
        log("Error deleting events: " + str(e))
        return json.dumps([])


def purge_db():
    global seconds
    while True:
        time.sleep(1)
        if get_seconds() > seconds:
            seconds = get_seconds()
            delete_events_by_age(expiry_seconds)


if __name__ == "__main__":

    websocket.enableTrace(True)
    threading.Thread(target=purge_db).start()
    app.run(host="0.0.0.0", port=port, debug=True)
