## Run containers

Start mongodb

```
sudo docker run -d -p 27017:27017 --name mongo -h mongo mongo
```

Start the microservice

```
sudo docker run -d -p 8080:3000 --link mongo authmicroservice_app
```
