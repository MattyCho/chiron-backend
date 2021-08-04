'use strict';

const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  name: {type:String},
  description: {type:String},
  category: {type:String},
  equipment: {type:Array}
})

const userSchema = new mongoose.Schema({
  name: {type:String},
  email: {type:String},
  exercises: [exerciseSchema]
})

module.exports = mongoose.model('users', userSchema);