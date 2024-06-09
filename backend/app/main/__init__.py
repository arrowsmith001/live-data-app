from flask import Blueprint

main = Blueprint('main', __name__)

from . import connections, schemas, dashboards, model, routes, utils