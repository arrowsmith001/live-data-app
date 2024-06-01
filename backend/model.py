class ConnectionData:
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
