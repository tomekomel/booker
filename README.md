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
- get single bookings

Here you have a tokens for a standard users:
- user 1: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwicm9sZSI6InVzZXIiLCJpYXQiOjE1MTYyMzkwMjJ9.8aOP6TSAYKGphtUf7LCG0uQcgERrDAjTCbfOJrnV290`
- user 2: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzIiwicm9sZSI6InVzZXIiLCJpYXQiOjE1MTYyMzkwMjJ9.wPz2OwQuB4WTzew7NE1Bdbbk3mCiqI7zvFUfrPyB1I0`

And for the admin user:
- `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTE2MjM5MDIyfQ.5iVcEnlVHQS72AFmMY9cln5A5eQTvPWaNC94Lbx8-8M`

You can change them in the Postman settings in order to test API authorisation.

## Tests

Should be run inside `booker-backend_service` container.

```bash
# unit tests
$ npm run test

```

