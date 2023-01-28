# InstaDAM - API

The backend API for the [InstaDAM project](https://github.com/Pierrad/InstaDAM_API). <br />
This API was created based on [this boilerplate](https://github.com/hagopj13/node-express-boilerplate).

## Features

- [X] Register
- [X] Login
- [X] Upload and retrieve photo with geolocation
- [X] Retrieve a list of photos around a location
- [X] Retrieve a list of photos from a user
- [X] Create a fake list of photos around a location for testing

## Requirements

- [Node.js](https://nodejs.org/en/) >= 14.16.0
- [MongoDB](https://www.mongodb.com/) >= 4.4.0
- Docker (optional)

## Installation

- Clone the repository
- Copy the ```.env.example``` file to ```.env``` and fill the variables
- ```yarn install```
- ```yarn start```


## Notes

- An example usage to load in Insomnia is available in the ```src/resources/insonmia``` folder.