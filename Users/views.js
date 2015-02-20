/**
 * Created by Saurabh on 10/02/2015.
 */
var express = require('express');
var app = require("../app.js").app;

app.get('/users', function(req, res) {
  res.render('users', {
    title: 'Users'
  });
});/**
 * Created by Saurabh on 14/02/2015.
 */
