const { port, dbUrl } = require('./configs');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect(
  dbUrl,
  { useNewUrlParser: true }
);

const app = express();

const { user, session } = require('./apis');

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/user', user);
app.use('/session', session);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
