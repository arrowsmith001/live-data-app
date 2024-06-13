import json
import logging
import os
import time
from flask_socketio import SocketIO
from flask import Flask, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

time.sleep(2)

port = 5000

db = SQLAlchemy()
socketio = SocketIO()

def create_app(debug=False):

    app = Flask(__name__)
    app.debug = debug
    app.logger.setLevel(logging.INFO)
    app.config["SQLALCHEMY_DATABASE_URI"] = ( os.getenv("DATABASE_URL"))
    app.config["CORS_HEADERS"] = "Access-Control-Allow-Origin"

    with app.app_context():
        from .main.connections import Connection
        from .main.schemas import Schema
        from .main.dashboards import Dashboard
        db.init_app(app)
        # db.drop_all() # Remove to persist data
        db.session.commit()
        db.create_all()
        db.session.commit()

    cors = CORS(app)

    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    socketio.init_app(app, cors_allowed_origins="*")

    return app