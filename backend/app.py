import json
import sys
import time
import uuid
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

port = 5000


db = SQLAlchemy()


def log(msg):
    print(msg)
    return


class Event(db.Model):
    __tablename__ = "event"

    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.String(120), nullable=False)
    received_at = db.Column(db.Float, nullable=False)
    received_from = db.Column(db.String(120), nullable=False)

    def __repr__(self):
        return f"Event {self.id} {self.data} {self.received_at} {self.received_from}"

    def __init__(self, data, received_at, received_from):
        self.data = data
        self.received_at = received_at
        self.received_from = received_from


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


def get_timestamp():
    return datetime.now(timezone.utc).timestamp()


def get_seconds():
    return floor(get_timestamp())


seconds = get_seconds()


def format_event(event: Event):
    return {
        "id": event.id,
        "data": event.data,
        "received_at": event.received_at,
        "received_from": event.received_from,
    }


ws_servers = {}

connected_clients = {}
ws_client_prefs = {}


@app.route("/")
def test():
    return "Hello, World!"


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
    }

    # connected_clients[ws_server] = thread

    connect_to_server(ws_server, ws_url)

    return ""


def url_to_wsconfig(ws_url):
    if ws_url.startswith("ws://"):
        ws_url = ws_url.replace("ws://", "")
    ip = ws_url.split(":")[1].replace("//", "")
    port = ws_url.split(":")[2].split("/")[0]
    # join the rest for endpoint
    endpoint = "/".join(ws_url.split(":")[2].split("/")[1:])
    return ip, port, endpoint


def wsconfig_to_url(ip_address, port, endpoint):
    return f"ws://{ip_address}:{port}/{endpoint}"


# Connect to a server emitting data
@app.route("/get_connections", methods=["GET"])
@cross_origin()
def get_connections():
    global ws_servers
    # copy a dump of ws_Servers minus ws objects
    return json.dumps(
        [
            {
                "url": ws_url,
                "name": ws_servers[ws_url]["name"],
                "isPrivate": ws_servers[ws_url]["isPrivate"],
            }
            for ws_url in ws_servers.keys()
        ]
    )


def connect_to_server(ws_server, ws_url):
    ws_server.connect(ws_url)
    thread = threading.Thread(target=read_data, args=(ws_server, ws_url))
    thread.start()


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
                except ConnectionAbortedError:
                    time.sleep(0.01)
                    continue
                received_at = get_timestamp()
                event = push_event(data, received_at, ws_url)
                log("DATA_RECEIVED_AT: " + str(received_at))

                # if a client has been registered as interested in the source of this data...
                for id in ws_client_prefs.keys():
                    try:
                        url = (
                            "ws://"
                            + ws_client_prefs[id]["params"]["ip"]
                            + ":"
                            + str(ws_client_prefs[id]["params"]["port"])
                            + "/"
                        ) + ws_client_prefs[id]["params"]["endpoint"]

                        if url == ws_url:
                            log("DATA_APPENDED: " + str(event["data"]))
                            ws_client_prefs[id]["data"].append(event["data"])
                    except:
                        pass

    except Exception as e:
        log("Connection closed with controlled exception: " + str(e))
        del ws_servers[ws_url]


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
        del ws_servers[ws]
        del connected_clients[ws]
        log("Disconnected from " + ws_url)
        return ""
    else:
        return "Server not found", 404

    return ""


expiry_seconds = 10


# Handle an incoming client connection, and continuously send data that the client is subscribed to
@sock.route("/ws/connect")
def connect_to_client(ws_client):
    global ws_client_prefs

    client_addr = ws_client.environ.get("REMOTE_ADDR")
    # client_port = ws_client.environ.get("REMOTE_PORT")
    ws_client_id = client_addr  # + ":" + str(client_port)

    if ws_client_id in ws_client_prefs.keys():
        return "Client already connected", 400

    # generate a GUID

    log("Client connected: " + ws_client_id)

    # TODO: Debug this

    # # Store the parameters for the client
    # log("1: " + str(ws_clients))
    # ws_clients[ws_client_id] = {"params": {}, "data": []}
    # log("2: " + str(ws_clients))

    # while True:
    #     ws_client.send(json.dumps("0 1 1"))
    #     time.sleep(0.1)

    while True:

        if ws_client_id not in ws_client_prefs.keys():
            time.sleep(0.1)
            continue

        log("CONSIDERING DATA: " + str(ws_client_prefs[ws_client_id]["data"]))

        try:
            while len(ws_client_prefs[ws_client_id]["data"]) > 0:
                # ws_client.send(json.dumps(str(time.time()) + " 1 1"))
                data = ws_client_prefs[ws_client_id]["data"].pop(0)
                log("Sending data to client: " + str(data))
                log(str(ws_client))
                ws_client.send(data)
                log("ok")
        except ConnectionAbortedError:
            log("Connection closed")
            break
        time.sleep(0.1)
    # thread = threading.Thread(
    #     target=send_data_to_client, args=(ws_client_id, ws_client)
    # )
    # thread.start()

    return ""


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
        ws_client_prefs[id] = {"params": {}, "data": []}
        # return "Client " + id + " not recognized", 400

    # update parameters for the client
    ws_client_prefs[id]["params"] = params

    log("After update: " + str(ws_client_prefs))

    return "OK"


@app.route("/event", methods=["POST"])
def create_event():
    received_at = get_timestamp()
    data = request.get_json().get("data")
    received_from = request.remote_addr
    return push_event(data, received_at, received_from)


latest_event = None
latest_received_from = None


def push_event(data, received_at, received_from):
    event = Event(data, received_at, received_from)
    # db.session.add(event)
    # db.session.commit()
    return format_event(event)


@app.route("/events", methods=["GET"])
def read_events():
    events = Event.query.order_by(asc(Event.received_at)).all()
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
        events = Event.query.filter(Event.received_at < cutoff_time).all()
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
