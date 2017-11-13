const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = "mongodb://rattapon:40459@ds259855.mlab.com:59855/user";
var data = [];

MongoClient.connect(MONGO_URL, (err, db) => {
  if (err) {
    return console.log("Connecttion Failed : ", err);
  }

  var express = require('express');
  var app = express();
  var bodyParser = require('body-parser');
  var path = require('path');

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(express.static(path.join(__dirname, 'public')));
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));


  app.get('/', (req, res) => {
    db.collection("users").find({}).sort({
      id: 1
    }).toArray(function (err, result) {
      // console.log(result);
      if (err) {
        return console.log(err);
      }
      data = result;
      res.render('index', {
        title: "Customer List",
        users: result
      }); // render ‘views/index.ejs’
    });
  });

  app.get('/user', (req, res) => {
    db.collection("users").find({}).toArray(function (err, result) {
      if (err) {
        return console.log(err);
      }
      res.json(result);
    });
  });

  app.post('/user', (req, res) => {
    db.collection("users").find({}).sort({
      id: -1
    }).limit(1).toArray(function (err, result) {
      if (err) {
        return console.log(err);
      }
      var uid = result[0]["id"];
      var newUser = {
        id: parseInt(uid) + 1,
        name: req.body.name,
        gender: req.body.gender,
        age: parseInt(req.body.age),
        email: req.body.email
      }
      db.collection("users").insertOne(newUser, function (err, res) {
        if (err) {
          return console.log(err);
        }
        data.push(newUser);
        console.log("User name : " + newUser.name + " inserted");
      });
    });
    res.json({
      success: true,
      message: 'user has been create',
    });
  });

  app.post('/user/add', (req, res) => {
    db.collection("users").find({}).sort({
      id: -1
    }).limit(1).toArray(function (err, result) {
      if (err) {
        return console.log(err);
      }
      var uid = result[0]["id"];
      var newUser = {
        id: parseInt(uid) + 1,
        name: req.body.name,
        gender: req.body.gender,
        age: parseInt(req.body.age),
        email: req.body.email
      }
      db.collection("users").insertOne(newUser, function (err, res) {
        if (err) {
          return console.log(err);
        }
      });
      data.push(newUser);
      console.log("User name : " + newUser.name + " inserted");
      res.redirect('/');
    });
  });

  app.post('/user/delete', (req, res) => {
    var uid = req.body.uid;
    var query = {
      id: parseInt(uid)
    };
    db.collection("users").find(query).toArray(function (err, result) {
      if (err) {
        return console.log(err);
      }
    });
    db.collection("users").deleteOne(query, function (err, res) {
      if (err) {
        return console.log(err);
      }
    });
    var index = data.findIndex(function (item, i) {
      return item.id === parseInt(uid)
    });
    console.log("find delete id:" + uid + " have index:" + index);
    data.splice(index, 1);
    console.log("User id : " + uid + " deleted");
    res.redirect('/');
  });

  app.get('/user/:id', (req, res) => {
    var uid = req.params.id;
    var query = {
      id: parseInt(uid)
    };
    db.collection("users").find(query).toArray(function (err, result) {
      if (err) {
        return console.log(err);
      }
      res.json(result);
    });
  });

  app.put('/user/:id', (req, res) => {
    var uid = req.params.id;
    var query = {
      id: parseInt(uid)
    };
    var newvalues = {
      id: parseInt(uid),
      name: req.body.name,
      gender: req.body.gender,
      age: parseInt(req.body.age),
      email: req.body.email
    }
    db.collection("users").updateOne(query, newvalues, function (err, res) {
      if (err) {
        return console.log(err);
      }
      console.log("User id : " + uid + " updated");
    });
    res.json({
      success: true,
      message: 'user id:' + newvalues.id + ' has been edit',
    });
  });

  app.delete('/user/:id', (req, res) => {
    var uid = req.params.id;
    var query = {
      id: parseInt(uid)
    };
    db.collection("users").deleteOne(query, function (err, res) {
      if (err) {
        return console.log(err);
      }
      console.log("User id : " + uid + " deleted");
    });
    res.json({
      success: true,
      message: 'user id:' + uid + ' has been delete',
    });
  });

  const PORT = process.env.PORT || 8080;
  app.listen(PORT, function () {
    console.log('Server Started on Port 8080…');
  });

});