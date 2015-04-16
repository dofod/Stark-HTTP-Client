/**
 * Created by Saurabh on 04/04/2015.
 */
var express = require('express');
var app = require("../app.js").app;

app.get('/middlewares', function(req, res) {
  res.render('middlewares', {
    title: 'Middlewares'
  });
});