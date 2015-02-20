/**
 * Created by Saurabh on 10/02/2015.
 */
var express = require('express');
var app = require("../app.js").app;

app.get('/plugins', function(req, res) {
  res.render('plugins', {
    title: 'Devices'
  });
});