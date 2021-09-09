# Educational platform

Runner up of the ASTU LXXI International student conference

## Stack
React, Reactstrap, React-Chartjs-2, Axios, Beautiful-React-Hooks - Frontend libraries

Golang, Express - Backend

PostgreSQL - Database mgmt

Heroku - Hosting

## Actions

Github Actions are set up to build the latest commit to the [front](https://github.com/iamquoz/eduplatform/tree/front) branch and to push that build to [prod](https://github.com/iamquoz/eduplatform/tree/prod)

## Structure

Branch name | Description
------------|-------------
prod | Currently deployed on Heroku build
front | React frontend
back | Golang backend
express | Express rewrite of backend

## Run locally
Clone the repository and start a server in the /build directory

## See it run

[Heroku app](https://astumatstat.herokuapp.com/) or under Enviroments

## Authors: 
[@iamquoz](https://github.com/iamquoz) - Frontend

[@neputevshina](https://github.com/neputevshina) - Backend

[@ofu-hub](https://github.com/ofu-hub) - Backend

[@Dima-Neor](https://github.com/Dima-Neor) - Artwork

[@seljmov](https://github.com/seljmov) - Coordination


## Endpoints and routers

student: allows students and the teacher to access the routes

teacher: routes are only allowed for the teacher

app: endpoints without authorization