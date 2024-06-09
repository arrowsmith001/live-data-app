import json
import logging
import time
from flask_socketio import SocketIO
from flask import Flask, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy


port = 5000

db = SQLAlchemy()
socketio = SocketIO()

def create_app(debug=False):

    app = Flask(__name__)
    app.debug = debug
    app.logger.setLevel(logging.INFO)
    app.config["SQLALCHEMY_DATABASE_URI"] = (
        # "postgresql://postgres:password@db:5432/robotdatadb"
        "postgresql://postgres:password@localhost/robotdatadb"
    )
    app.config["CORS_HEADERS"] = "Access-Control-Allow-Origin"

    with app.app_context():
        db.init_app(app)
        db.drop_all()
        db.session.commit()
        db.create_all()
        db.session.commit()

    cors = CORS(app)

    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    socketio.init_app(app, cors_allowed_origins="*")

    return app