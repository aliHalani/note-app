var express = require("express");
//var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var cors = require('cors');
var bodyParser = require('body-parser');


var app = express();
//app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

app.use(cors());
app.use(bodyParser.json());

// Connect to the database before starting the application server.
mongodb.MongoClient.connect("mongodb://localhost/testdata", function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

app.get("/notes", function(req, res) {
  db.collection("notes").find({}).toArray(function(err, docs) {
    if (err) {
      controllernsole.log("ERROR retrieving notes");
    } else {
      console.log("collection sent successfully")
      res.send(docs);
    }
    });
});

app.delete("/notes/:id", function(req, res) {
  db.collection("notes", function(err, collection) {
      collection.deleteOne({_id: new mongodb.ObjectId(req.params.id)}, function(err, result) {
        if (err) {
          console.log("ERROR deleting document");
        } else {
          console.log("document deleted successfully");
          res.send(result);
        }
      });
  });
});

app.put("/notes/:id", function(req, res) {
  delete req.body._id;
  console.log(req.body);
  db.collection("notes").replaceOne({_id: new mongodb.ObjectId(req.params.id)}, req.body, function(err, result) {
    if (err) {
      console.log("ERROR updating document");
      console.log(err);
    } else {
      console.log("document updated successfully");
      res.send(result);
    }
  });
});