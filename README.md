# Programming Concepts Exam

The libraries need to be installed in order to test the answers for exercise 1 and 3.
From the root folder, execute:
```
$ npm install
```

# Exercise 1

You can find the code in the `exercise-1-multiply` folder.

To run the tests, from the root folder run:
```
$ npm run test:multiply
```

# Exercise 2

You can find the query and its result in the `exercise-2-sql-query` folder.

# Exercise 3

For this exercise, the code is located in `exercise-3-rest-api`.

## API description

The API documentation is available here: https://documenter.getpostman.com/view/3136678/SVzz2K4d

To import a Postman collection documenting the API and allowing for quick tests, press this button:

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/3e559c55836383eeca90)

## Connection to the database
The server uses the database connection string specified in the `.env` file.
You can modify it to connect to your own database.

If you have docker installed, you can also simply call:
```
$ docker-compose up -d
```
to pull a Postgres image and automatically create two databases (dev/test) with the right name and credentials.
Then shut it down with:
```
$ docker-compose down
```

## Start the development server
To start the development server, run:
```
$ npm run start
```
To execute the tests, run:
```
$ npm run test:api
```

## Build and serve
To build the application and serve it, run:
```
$ npm run build
$ npm run serve
```

The API will be available on port 3000 (specified in `.env`) with an `/api` prefix.
