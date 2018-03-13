# Redux Server

This is a tiny REST service managing counters. The counters
are kept in memory, so they are reset every time you restart
the service.

Each counter has
- a unique index (a number greater or equal 0) and
- a value.

You can either get or set a counter. But in any distributed
environment, the latter would be bad practice. Use this only
for setting values for presentation purposes. Usually, you
would use the increment and decrement operations instead.

You can either get or set a counter. Of course, you shouldn't
set any counter in a distributed environment. Instead, you
should get it and then use the increment or decrement operations
on it. For presentations, it is a reasonable choice to set
some counters before showing anything to your audience.

The client side to this service resides in
[https://github.com/MichaelKaaden/redux-client-ng5](https://github.com/MichaelKaaden/redux-client-ng5).

## Compiling the service

This server is written in TypeScript. You need to compile
the code to JavaScript for Node.js to be able to be run it.

To compile the app initially, use `yarn run gulp`.
To automatically compile the sources on each 
change, use `yarn run watch`.

Looking inside the gulpfile.js you'll find some other
tasks that might help you in developing the application,
for example `watch:test`.

## Running the service

To run the app in dev mode, use `yarn run dev`. Else,
you may find `yarn run start` useful.

## API Documentation

This seed uses Swagger-UI for documentation purposes.
Run `yarn run swagger` to create it every time you change
the API. The latest version is commited to this repo.

## History

I wrote this as the server
side for a client application utilizing the Redux architecture pattern.

The project was initialized using the express generator. That's the
reason it still uses the `bin/www` file for startup. I had
no reason to rewrite this file, because I don't plan to 
change anything in here. Every other JavaScript file that
contained application code has been replaced by its
TypeScript counterpart, though.
