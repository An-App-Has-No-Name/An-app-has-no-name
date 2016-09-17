const express = require('express');
const mongodb = require('./mongo.config');

const app = express();
app.use('/', express.static(`${__dirname}/../..`));

app.listen(process.env.PORT || 9999);

console.log('Server is running on Port 9999');

