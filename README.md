# MemeSharer
The social network for sharing memes. Built on the MERN (mongo, express, react, node) stack with utilzation of bootstrap. I chose to make this open source so that anyone can use parts of this code to make their own social media platform.


In order to setup the app for the first time...

App configuration:

1) Install Nodejs (10.17.0) on local machine
2) Install and set up a mongo database database for the app. The directions to do this are in docs/mongoSetup.txt
3) Create an environment variable file similar to "env" in the root directory of the app. Then use the command "source env" before starting up the app to refresh the enviornment variables.

How to run the app:

Backend:
1) In a terminal shell, source the enviornment variables
2) "cd /app/services/"
3) "npm run prodCompile"
     compiles the node packages necessary in each microservice
4) "npm i"
     compiles the node packages necessary in the services root directory
3) "npm run services"
     runs all microservice concurrently

Frontend:
1) In a terminal shell, source the enviornment variables
2) "cd /app/client/"
3) "npm i"
     compiles the node packages necessary in the client root directory
3) "npm start"
    runs the client frontend in development mode



Microservices:
1) Gateway: Entry point for all APIs
2) User: Handles all information on the application user
3) Posts: Handles all information on the application posts, likes, comments, etc.
