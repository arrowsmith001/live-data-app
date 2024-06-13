# Live Data App

This app facilitates data visualization for real-time data streamed over WebSocket. 

Given a WebSocket endpoint - or multiple endpoints - this app enables the user to centralize their connections, destructure the incoming data (delimited or JSON formats accepted) into usable data points, and present it visually in real-time.


## Getting started

1. Install Docker on your PC

2. Clone this repo to your PC

3. Open a terminal at the project root

4. Build images for the backend and frontend:
```
$ docker build -t live-data-app-backend -f Dockerfile.backend .
$ docker build -t live-data-app-frontend -f Dockerfile.frontend .
```
Note: This only needs to be done once, or whenever code changes are made.

5. Run  

`$ docker compose up`


## Usage

The standard workflow is to:

- Define your connections, which are your WebSocket endpoints, then...

- Define your schemas, which represent your data's structure and data item types, then...

- Define your dashboards, which represent a set of views which will present incoming data, given a connection, schema and input mapping

Your dashboards will then be available to be viewed on the Home page.


## Debug/development

You can run the app without Docker for developing or debugging individual parts of the app.

For backend:
```
pip install -r -requirements.txt
flask run
```

For frontend:
```
npm install
npm start
```

For the database, you need to setup and run your own PostgreSQL instance. Then set DATABASE_URL in backend/.flaskenv to your endpoint e.g. `postgresql://postgres:password@localhost:5432/livedatadb`.