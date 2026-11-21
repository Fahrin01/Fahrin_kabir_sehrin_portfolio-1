var express = require('express');
var app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(__dirname + '/../public'));

var crud = require('./crud');
app.use(crud);

var port = process.env.PORT || 5000;

app.listen(port, function () {
  console.log('Server is running on port ' + port);
  console.log('Portfolio: http://localhost:' + port + '/portfolio.html');
  console.log('Admin:     http://localhost:' + port + '/login.html');
});
