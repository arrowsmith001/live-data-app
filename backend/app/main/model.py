import json
from .. import db
from sqlalchemy.dialects.postgresql import ARRAY


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
            "url": self.url
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
    
class Dashboard(db.Model):
    __tablename__ = "dashboard"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(120), nullable=False)
    version = db.Column(db.String(120), nullable=False)
    streams = db.Column(ARRAY(db.String), nullable=False)
    views = db.Column(ARRAY(db.String), nullable=False)

    def __repr__(self):
        return f"Dashboard {self.name} {self.version} {self.dataStreams} {self.views}"
    
    def __init__(self, data):
        self.name = data["name"]
        self.version = data["version"]
        self.dataStreams = data["streams"]
        self.views = data["views"]

    def get_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "version": self.version,
            "streams": [[s[0], s[1]] for s in self.streams.split(",")],
            "views": json.loads(self.views)
        }
