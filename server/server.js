var express = require("express");
//var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var cors = require('cors');
var bodyParser = require('body-parser');

var jwt = require("jsonwebtoken");
var crypto = require("crypto");


var app = express();
//app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

app.use(cors());
app.use(bodyParser.json());
app.set("secretKey", "testsecretkey");
app.use(express.static(__dirname));

// Connect to the database before starting the application server.
mongodb.MongoClient.connect("mongodb://db/testdata", function (err, database) {
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

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/html/index.html');
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

app.post("/notes", function(req, res) {
  db.collection("notes").insertOne({title: "", content: ""}, function(err, result) {
    if (err) {
      console.log("ERROR adding document");
    } else {
      console.log("document added successfully");
      console.log(result.ops[0]._id);
      res.send(result.ops[0]._id);
    }
  });
});


app.post("/register", function(req, res) {
  var username = req.body.username;
  var passwd = req.body.passwd;
  if (username && passwd) {
    var salt = crypto.randomBytes(16).toString("hex");
    var hash = crypto.pbkdf2Sync(passwd, salt, 2048, 32, "sha512").toString("hex");
    db.collection("users").insertOne({username: username, passwd: [salt, hash].join("$")}, function(err, result) {
      if (err) {
        console.log("A user with that name already exists");
      } else {
        console.log("User added successfully");
      }
    });
  }
  res.send();
});

app.post("/login", function(req, res) {
  console.log("starting login");
  var username = req.body.username;
  var passwd = req.body.passwd;
  if (username && passwd) {
    db.collection("users").find({username: username}).toArray(function(err, result) {
      console.log(result);
      if (result.length) {
        var hash = result[0].passwd.split("$")[1];
        var salt = result[0].passwd.split("$")[0];
        var comphash = crypto.pbkdf2Sync(passwd, salt, 2048, 32, "sha512").toString("hex");
        if (comphash == hash) {
            console.log("Auth successful for " + username);
            //const token  = jwt.sign({id: result[0]._id, }, app.get("secretKey"), {expiresIn: '1h'});
            //res.json({status:"success", message"User found", data:{token:token}});
        } else {
            console.log("Wrong password for " +  username);
            res.send();
        }
      } else {
          console.log("No user exists");
          res.sendStatus(401);
      }
    });
  }
});

/*
curl -H "Content-Type: application/json" -X POST http://localhost:8080/login -d "{\"username\":\"test\", \"passwd\":\"test\"}"
*/
