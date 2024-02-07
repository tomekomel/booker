## Booker API description

Booker API is created with NestJS framework and PostgreSQL database.

## Installation

```bash
$ docker-compose up
```

## How to use Booker API

API is exposed by default on this url: http://localhost:8080/bookings

You can also import `Booker.postman_collection.json` into the Postman application. It has five defined requests:
- create new booking
- edit existing booking
- delete booking
- get all bookings
- get single booking

## Tests

Should be run inside `booker-backend_service` container.

```bash
# unit tests
$ npm run test

```

