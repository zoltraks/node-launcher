# TASK LAUNCHER

## Description

This is a service written in JavaScript to manage configurable tasks over HTTP.

Provides operations to run a configurable task on HTTP request.

Stores execution history and provides a console stream of running tasks.

Secured using JWT.

## Author

Filip Golewski

## Prerequisites

Node.js

## Usage

Clone repository and open command line inside repository directory.

Install required dependencies.

```
npm install
```

Create ``server.env`` (runtime configuration), ``client.json`` (client authentication) and ``task.json`` (task repository) files.

You may start with example files.

```
cp server.example.env server.env
cp client.example.json client.json
cp task.example.env task.json
```

To run server run ``npm start``. 

```
npm start
```

If everything is fine, you should see list of available routes and console command prompt.

```
$ npm start

> responder@1.0.0 start
> node server.js


GET /swagger.json
GET /api/setup/task/:task
GET /api/task/task/:task/start
GET /

Launcher is listening on port: 20002 at http://localhost:20002/ ❤️
```

To perform unit tests use ``npm test``.

```
npm test
```

## Docker

Build docker image using ``Dockerfile``.

```
docker build -t launcher .
```

```
docker run -d -p 20002:20002 --name launcher launcher
```

```
docker ps
```

```
docker logs -f launcher
```

```
docker stop launcher
```

```
docker ps -a --size
```

To show container log file.

```
CID=$(docker ps --no-trunc -qaf "name=^launcher") && sudo ls /var/lib/docker/containers/$CID/$CID-json.log
```

To clear container log file.

```
CID=$(docker ps --no-trunc -qaf "name=^launcher") && sudo truncate -s 0 /var/lib/docker/containers/$CID/$CID-json.log
```

```
docker start launcher
```

To remove docker image from machine registry.

```
docker rm launcher
```

```
docker rmi launcher
```

## Configuration

## Check

Change http://localhost:20002 to match correct URL for your case.

```
curl -X POST http://localhost:20002/api/auth/login -H "Accept: application/json" -H "Content-Type: application/json" -d '{"client_id":"admin","client_secret":"admin"}'
```

```json
{"token":"eyJhbGci...7Cpr6rh8"}
```

Save token to environment variable for future requests.

```
JWT=eyJhbGci...7Cpr6rh8
```

Get list of tasks.

```
curl -X GET http://localhost:20002/api/setup/task -H "Accept: application/json" -H "Authorization: Bearer $JWT"
```

```json
{"list":[{"name":"default"}],"time":"2024-01-18 12:10:34.288423"}
```

```
curl -X GET http://localhost:20002/api/task/start/default -H "Accept: application/json" -H "Authorization: Bearer $JWT"
```

```json
{"job":"a39429d3-f654-40f3-821b-0a20497674cc","time":"2024-01-18 12:23:06.036700"}
```

```
curl -X GET http://localhost:20002/api/task/info/default -H "Accept: application/json" -H "Authorization: Bearer $JWT"
```

```json
{"name":"default","jobs":[{"guid":"a39429d3-f654-40f3-821b-0a20497674cc","created":"2024-01-18 12:23:06.017766","running":false,"stopped":"2024-01-18 12:23:06.049835","buffer":{"stdout":1}}]}
```

```
JOB=a39429d3-f654-40f3-821b-0a20497674cc
```

```
curl -X GET http://localhost:20002/api/job/stdout/$JOB -H "Accept: application/json" -H "Authorization: Bearer $JWT"
```

```json
{"stdout":[{"time":"2024-01-18 12:23:06.056432","text":"EXIT\r\n"}]}
```

```
curl -X GET http://localhost:20002/api/job/info/$JOB -H "Accept: application/json" -H "Authorization: Bearer $JWT"
```

```json
{"created":"2024-01-18 12:23:06.017766","task":"default","running":false,"stopped":"2024-01-18 12:23:06.049835","buffer":{"stdout":1}}
```
