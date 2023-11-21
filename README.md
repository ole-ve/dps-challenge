# Password Validator @DPS

This is my solution to the technical challenge as part of my application for the Digital Product School (Batch #21).
For that, I have implemented a simple React (Typescript) application and dockerized it.

## Run the application

### Prerequisites
- Installation of node and npm **OR**
- Installation of Docker

### Startup
There are three different options on how to run the application:
1. Start from the IDE using the predefined run configuration `Start App`.
2. Execute the following command in the terminal:
```shell
npm run start
```
3. Build and run as a docker container:
```shell
docker build -t <image-name> .

docker run -p 3000:3000 <image-name>
```

## For Lazy Fellows
If you don't want to run the application locally, I got you covered.
The application is hosted as a Docker container on GCP under the following URL:
https://dps-challenge-3zs523db7q-ey.a.run.app

**Note**: Startup of the container might take around 10 seconds due to cold start.
