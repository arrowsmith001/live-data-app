import json
import sys
import time
import websocket
import threading
from math import floor
from datetime import UTC, datetime, timezone
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import (
    asc,
    text,
)
from flask_sock import Sock
from flask.cli import FlaskGroup

time.sleep(5)

port = 5000
# query = text(
#     "INSERT INTO public.event (data, received_at, received_from) VALUES ('12,223,22254', 1.01, '192.0.0.0');"
# )
# conn.execute(query)
# conn.commit()


app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = (
    "postgresql://postgres:password@localhost/robotdatadb"
)
db = SQLAlchemy(app)
sock = Sock(app)
cli = FlaskGroup(app)

# List to store websocket threads
websocket_threads = []


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


ws_clients = {}
websocket_servers = {}


connected_clients = {}


@app.route("/")
def test():
    return "Hello, World!"


@app.route("/connect")
def connect_to_server():
    global websocket_servers, connected_clients
    data = request.get_json()
    ip_address = data.get("ip")
    port = data.get("port")
    endpoint = data.get("endpoint")

    if not ip_address:
        return "IP address is required", 400

    if endpoint:
        ws_url = f"ws://{ip_address}:{port}/{endpoint}"
    else:
        ws_url = f"ws://{ip_address}:{port}"

    # Forbid connecting to the same server twice
    if ws_url in websocket_servers.values():
        return "Already connected to this server", 400

    ws_server = websocket.WebSocket()
    ws_server.connect(ws_url)

    websocket_servers[ws_server] = ws_url
    connected_clients[ws_server] = thread

    thread = threading.Thread(target=read_data, args=(ws_server,))
    thread.start()

    return ""


@app.route("/disconnect")
def disconnect_from_server():
    global websocket_servers, connected_clients
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

    if ws_url in websocket_servers.values():
        for ws in websocket_servers:
            if websocket_servers[ws] == ws_url:
                ws.close()
                connected_clients[ws].join()  # Wait for the thread to finish
                del websocket_servers[ws]
                del connected_clients[ws]
                print("Disconnected from " + ws_url)
                return ""
    else:
        return "Server not found", 404

    return ""


expiry_seconds = 10


def read_data(ws_server):
    try:
        with app.app_context():
            global seconds
            ws_url = websocket_servers[ws_server]
            print("Connected to " + str(ws_server))
            while ws_server:
                try:
                    data = ws_server.recv()
                except ConnectionAbortedError:
                    print("Connection closed")
                    break
                received_at = get_timestamp()
                event = push_event(data, received_at, ws_url)
                print("read_data: " + str(event) + " received from " + ws_url)

                # if a client has been registered as interested in the source of this data...
                for ws_client in ws_clients:
                    if ws_clients[ws_client].get("ip") == ws_url:
                        ws_client.send(json.dumps(event))

    except Exception as e:
        print("Connection closed with controlled exception: " + str(e))
        del websocket_servers[ws_server]


def send_data(ws_client):
    with app.app_context():
        while True:
            ws_client.ping()
            time.sleep(1)


@sock.route("/ws/connect")
def connect_to_client(ws_client):
    global ws_clients
    # while True:
    #     ws.send(json.dumps(read_latest_event()))
    #     time.sleep(0.1)

    if ws_client in ws_clients:
        return "Client already connected", 400

    ws_clients[ws_client] = ws_client

    # Get the parameters from the client
    ip = request.args.get("ip")
    port = request.args.get("port")
    endpoint = request.args.get("endpoint")

    parameters = {"ip": ip, "port": port, "endpoint": endpoint}
    print("Client connected: " + str(parameters))

    # Store the parameters for the client
    ws_clients[ws_client] = parameters

    ws_client.send(json.dumps("HELLO FROM SERVER"))

    # thread = threading.Thread(target=send_data, args=(ws_client,))
    # thread.start()
    while True:
        ws_client.send(time.time())
        time.sleep(5)
    return ""


@sock.route("/ws/update")
def update_from_client(ws_client):
    global ws_clients
    # while True:
    #     ws.send(json.dumps(read_latest_event()))
    #     time.sleep(0.1)

    # if client unreocgnized, abort
    if ws_client not in ws_clients:
        return "Client not recognized", 400

    # Get the parameters from the client
    parameters = request.get("ip")

    # Store the parameters for the client
    ws_clients[ws_client] = parameters

    return ""


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
        print("Deleting events older than " + str(age) + " seconds")
        cutoff_time = get_timestamp() - age
        events = Event.query.filter(Event.received_at < cutoff_time).all()
        if len(events) == 0:
            print("Deleted 0 events")
            return json.dumps([])
        # for event in events:
        # db.session.delete(event)
        # db.session.commit()
        # print("Deleted " + str(len(events)) + " events")
        return json.dumps([format_event(event) for event in events])
    except Exception as e:
        print("Error deleting events: " + str(e))
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
