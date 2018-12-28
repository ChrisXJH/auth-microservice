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

app.use('/user', user);
app.use('/session', session);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
