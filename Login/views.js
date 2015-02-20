var express = require('express');
var app = require("../app.js").app;

app.get('/login/', function(req, res) {
  res.render('login', {
    title: 'Welcome'
  });
});