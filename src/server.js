const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 4000;
const mongoose = require('mongoose');
const path = require('path');

let Model = require('./model/MongooseDBSchema');

app.use(cors());
app.use(bodyParser.json());

const fullStackAppRouter = express.Router();
app.use('/fullStackApp', fullStackAppRouter);

// settings for connecting to the client
app.use(express.static(path.join(__dirname, '../../frontend/build')));
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
});

var url = "mongodb://localhost:27017/local";
//var url = "mongodb+srv://mongodbuser:mongodbuser@fullstackprojectcluster-hghwx.mongodb.net/Users?retryWrites=true&w=majority";

mongoose.connect(url, {useNewUrlParser: true});
mongoose.connect(url, {useUnifiedTopology: true});
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

fullStackAppRouter.route('/').get(function(req, res) {
    Model.MongooseDBSchema.find(function(err, fullStackDB) {
      if (err) {
        console.log(err);
      } else {
        res.json(fullStackDB);
      }
    });
});

fullStackAppRouter.route('/:id').get(function(req, res) {
  let id = req.params.id;
  Model.MongooseDBSchema.findById(id, function(err, fullStackDB) {
    res.json(fullStackDB);
  });
});


fullStackAppRouter.route('/add').post(function(req, res) {

  let fullStackDB = new Model.MongooseDBSchema(req.body);

  fullStackDB.save()
    .then(fullStackDB => {
      res.status(200).json('Record was added successfully');
    })
    .catch(err => {
      res.status(400).send('Adding new record failed');
    });
});

fullStackAppRouter.route('/update/:id').post(function(req, res) {
  Model.MongooseDBSchema.findById(req.params.id, function(err, fullStackDB) {
    if (!fullStackDB) {
      res.status(404).send('Requested data not found');
    } else {
      fullStackDB.a_firstName = req.body.a_firstName;
      fullStackDB.a_middleName = req.body.a_middleName;
      fullStackDB.a_lastName = req.body.a_lastName;

      fullStackDB.save()
        .then(fullStackDB => {
          res.json('Record was updated successfully');
        })
        .catch(err => {
          res.status(400).send('Record update failed');
        });
    }
  })
});

fullStackAppRouter.route('/delete/:id').post(function(req, res) {
  Model.MongooseDBSchema.findById(req.params.id, function(err, fullStackDB) {
    if (!fullStackDB) {
      res.status(404).send('Requested data not found');
    } else {
      fullStackDB.remove()
        .then(fullStackDB => {
          res.json('Record was deleted successfully');
        })
        .catch(err => {
          res.status(400).send('Record deletion failed');
        });
    }
  })
});


app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});
