'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const Account = require('./modules/UserRoutes.js');
const { default: axios } = require('axios');
// const jwt = require('jsonwebtoken'); will need to import in factory file


app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

const mongooseOptions = { useNewUrlParser: true, useUnifiedTopology: true }
mongoose.connect(process.env.MONGODB_URI, mongooseOptions)

app.get('/profile', Account.profile);
app.get('/exercise', Account.listOfExercises);
app.get('/favExercise', Account.favoriteExercises);
app.post('/exercise', Account.saveExercise);
app.delete('/exercise', Account.deleteExercise);


app.use('*', (req, res) => {
  res.status(404).send('No such route exists');
});

app.listen(PORT, () => console.log(`Looking good on port ${PORT}`));
