var express = require('express');
var app = express();

exports.app = app;

//Settings
app.set('views', './templates');
app.set('view engine', 'jade');


//Urls
app.use(express.static( __dirname , '/static'));


//Views
require('./Login/views.js');
require('./Plugins/views.js');
require('./Devices/views.js');
require('./Users/views.js');
require('./Middlewares/views.js');
app.listen(3000);