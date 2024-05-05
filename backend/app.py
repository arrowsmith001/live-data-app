import json
import time
import websocket
import threading
from math import floor
from datetime import UTC, datetime, timezone
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import asc
from flask_sock import Sock

port = 5000

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = (
    "postgresql://postgres:password@localhost/robotdatadb"
)
db = SQLAlchemy(app)
sock = Sock(app)


class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.String(120), nullable=False)
    received_at = db.Column(db.Float, nullable=False)

    def __repr__(self):
        return f"Event {self.id} {self.data} {self.received_at}"

    def __init__(self, data, received_at):
        self.data = data
        self.received_at = received_at


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
    }


ws_server = None
ws_client = None


@app.route("/connect")
def connect_to_server():
    global ws_server
    ws_server = websocket.WebSocket()
    ws_server.connect("ws://192.168.0.89:8080/ws")
    thread = threading.Thread(target=read_data)
    thread.start()
    return ""


@sock.route("/ws")
def connect_to_client(ws):
    global ws_client
    while True:
        ws.send(json.dumps(read_events()))
        time.sleep(0.25)
    ws_client = ws
    thread = threading.Thread(target=send_data)
    thread.start()
    return ""


@app.route("/event", methods=["POST"])
def create_event():
    received_at = get_timestamp()
    data = request.get_json().get("data")
    return push_event(data, received_at)


def push_event(data, received_at):
    event = Event(data, received_at)
    db.session.add(event)
    db.session.commit()
    return format_event(event)


@app.route("/events", methods=["GET"])
def read_events():
    events = Event.query.order_by(asc(Event.received_at)).all()
    return json.dumps([format_event(event) for event in events])


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
    cutoff_time = get_timestamp() - age
    events = Event.query.filter(Event.received_at < cutoff_time).all()
    if len(events) == 0:
        return json.dumps([])
    for event in events:
        db.session.delete(event)
    db.session.commit()
    return json.dumps([format_event(event) for event in events])


expiry_seconds = 10


def read_data():
    with app.app_context():
        global seconds
        while True:
            data = ws_server.recv()
            received_at = get_timestamp()
            push_event(data, received_at)

            seconds_now = get_seconds()
            if seconds_now > seconds:
                delete_events_by_age(expiry_seconds)
                seconds = seconds_now


def send_data():
    with app.app_context():
        while True:
            ws_client.send(json.dumps(read_events()))
            time.sleep(0.25)


if __name__ == "__main__":
    websocket.enableTrace(True)
    app.run(port=port, debug=True)
