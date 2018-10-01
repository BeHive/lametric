const express = require('express');
const portAuthority = require('./portAuthority');


let app = express();

app.get('/portauthority/', function (req, res) {
    portAuthority.process(req, res)
});

app.listen(3000);




