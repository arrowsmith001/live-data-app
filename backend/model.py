class ConnectionInfo:
    def __init__(self, data):
        self.ip = data["ip"]
        self.port = data["port"]
        self.endpoint = data["endpoint"]
        self.name = data["name"]

    @property
    def url(self):
        if self.endpoint:
            return f"{self.ip}:{self.port}/{self.endpoint}"
        else:
            return f"{self.ip}:{self.port}"

    def __dict__(self):
        return {
            "ip": self.ip,
            "port": self.port,
            "endpoint": self.endpoint,
            "name": self.name,
        }


class DataSchema:
    def __init__(self, data):
        self.count = data["count"]
        self.labels = data["labels"]
        self.types = data["types"]
        self.format = data["format"]
        self.delimeter = data["delimeter"]

    def __dict__(self):
        return {
            "count": self.count,
            "labels": self.labels,
            "types": self.types,
            "format": self.format,
            "delimeter": self.delimeter,
        }


class Dashboard:
    def __init__(self, data):
        self.views = data["views"]


class DataView:
    def __init__(self, data):
        self.name = data["name"]
        self.type = data["type"]
        self.schema = data["schema"]
        self.args = data["args"]
