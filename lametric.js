const express = require('express');
const portAuthority = require('./portAuthority');
const metro = require('./metro');


let app = express();

app.get('/portauthority/', function (req, res) {
    portAuthority.process(req, res)
});

app.get('/metro/', function (req, res) {
    metro.process(req, res)
});

app.listen(3000);




