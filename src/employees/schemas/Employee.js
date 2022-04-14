const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Employee = new Schema({
    a_ID: Number,
    a_Name: String
});

const SomeModel = mongoose.model('SomeModel', SomeModelSchema );