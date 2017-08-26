Project structure:

server.js: Node.js program that acts as the backend, and creates a RESTful API using Express for interaction with Angular.js.

app.js: Stores angular app and controller.

index.html: Static Angular.js webpage.



In order to run the app on your local machine in its current state, you must first have a local MongoDB database running with a collection named notes.

You must replace "testdata" in line 18 of server.js with the name of your database.