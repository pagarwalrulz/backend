const mongoose = require('mongoose');

// Mongoose Model is an interface to the database for querying the records
// creating a model
const MongooseDBSchema = mongoose.model('UserDetails', {
    a_firstName: String,
    a_middleName: String,
    a_lastName: String
});
// making it visible to node
exports.MongooseDBSchema = MongooseDBSchema;
