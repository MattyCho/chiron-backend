'use strict';

const getKey = require('../lib/getKey.js');
const jwt = require('jsonwebtoken');
const User = require('../schemas/userSchema.js');
const axios = require('axios');
const userSchema = require('../schemas/userSchema.js');

const Account = {}

Account.profile = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, getKey, {}, function (err, user) {
    if (err) {
      res.send('invalid token - you cannot access this route');
    } else {
      res.json({ 'token': token })
    }
  })
  console.log('profile page');
}

Account.listOfExercises = async (req, res) => {
  await axios.get('https://wger.de/api/v2/exerciseinfo/?limit=25')
    .then(result => {
      // console.log(result.data.results)
      let exerciseData = result.data.results.map(value => {
        let equipment = value.equipment.map(item => item.name)
        let exercise =
        {
          'name': value.name,
          'description': value.description,
          'category': value.category.name,
          'equipment': equipment
        }
        return exercise
      })
      // console.log(exerciseData)
      res.send(exerciseData)
    })
}

Account.favoriteExercises = async (req, res) => {
  let email = req.query.email;
  console.log(req.query)
  await User.findOne({email: email})
    .then(user => {
      console.log("line 47", email)
      res.send(user.exercises)})
     
    }

Account.saveExercise = async (req, res) => {
  console.log(req.body)
  const { email, username, name, description, category, equipment } = req.body;
  const newExercise = { name, description, category, equipment };
  await User.findOne({ "email": email }, (err, user) => {
    if (user) {
      console.log(user)
      user.exercises.push(newExercise);
      user.save()
        .then(user => { res.send(user.exercises) })
    } else {
      let newUser = new User({ email, username, 'exercises': [newExercise] })
      newUser.save()
        .then(user => { res.send(user.exercises) })
    }
  })
}

Account.deleteExercise = async (req, res) => {
  let id = req.body.id;
  let email = req.body.email;
  console.log(email, id)
  await User.findOne({ 'email': email})
  .then(user => {
      console.log("This Line 76", user)
      let filteredExercises = user.exercises.filter((value) => value.id !== id)
      user.exercises = filteredExercises;
      user.save();
      res.send(user.exercises)
    })
}

module.exports = Account;