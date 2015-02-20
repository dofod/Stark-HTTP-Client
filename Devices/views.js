/**
 * Created by Saurabh on 11/02/2015.
 */
var express = require('express');
var app = require("../app.js").app;

app.get('/devices/', function(req, res) {
  res.render('devices',{
            title: 'Devices'
          }
  );
});
