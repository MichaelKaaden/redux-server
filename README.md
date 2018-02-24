# Redux Server

This is a tiny REST service managing counters.

Each counter has
- a unique index (a number greater or equal 0)
- a value

You can view and try out the API using the Swagger UI
included in this project.

## Project Initialization

It was initialized using the express generator. That's the
reason it still uses the `bin/www` file for startup. I had
no reason to rewrite this file, because I don't plan to 
change anything in here. Every other JavaScript file that
contained application code has been replaced by its
TypeScript variant, though.

## Compiling the app

The app is written in TypeScript. You need to compile
the code to JavaScript for it to be able to be run
in Node.js.

To compile the app initially, use `npm run gulp`.
To automatically compile the sources on each 
change, use `npm run watch`.

Looking inside the gulpfile.js you'll find some other
tasks that might help you in developing the application,
for example `watch:test`.

## Running the app

To run the app in dev mode, use `npm run dev`. Else,
you may find `npm run start` useful.

## API Documentation

This seed uses Swagger-UI for documentation purposes.
Run `npm run swagger` to create it every time you change
the API. The latest version is commited to this repo.
