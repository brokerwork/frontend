var express = require('express');
var moment = require('moment');
var path = require('path');
var fs = require('fs');
var app = express();

app.use('/v*', (req, res) => {
  var fs = require('fs')
  var path = require('path')
  var file = `${__dirname}/json${req.baseUrl}.json`;
  var data = fs.readFileSync(file, 'utf8');
  console.log('Reading json from: ' + file);  
  console.log('For api: ' + req.baseUrl);
  console.log(`=============${moment().format('YYYY-MM-DD HH:mm:ss')}====================`);
  res.send(JSON.parse(data));
});

app.listen(3002);
