'use strict'
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/../../public/client`));

const port = process.env.PORT || 8080;
app.listen(port);
