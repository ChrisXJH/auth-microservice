# Authentication Microservice

## Install (dev)

```
npm install
```

## Start (dev)

```
npm start
```

## Build containers

```
docker-compose build
```

## Start containers

Before starting the service, we need to start mongodb:

```
sudo docker run -d -p 27017:27017 --name mongo -h mongo mongo
```

Start the service:

```
sudo docker run -d -p 8080:3000 --link mongo authmicroservice_app
```
