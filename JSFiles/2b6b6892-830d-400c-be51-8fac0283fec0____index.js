"use strict";

// == Imports ===============================================================

var express = require('express');
var merge = require('merge');

var fs = require('fs');
var path = require('path');

var logger = require('morgan');

// var models = require('../models');
var config = require('../lib/config');

// == Module Variables =======================================================

var app = express();

// == Support Functions ======================================================

function loadExtension(name) {
  require('./' + name)(app);
}

function extensionExists(name) {
  try {
    var stat = fs.statSync('./' + name + '.js');

    return true;
  } catch (e) {
    return false;
  }
}

// == App Configuration ======================================================

loadExtension('body_parser');
loadExtension('cookies');
// loadExtension('session'); // Requires Redis

app.use(logger('dev'));

// REFACTOR: Shunt into environments/ stub

var envExtension = 'environment/' + app.get('env');

if (extensionExists(envExtension)) {
  loadExtension(envExtension);
}

loadExtension('routes');

merge(app.locals, require('./helpers'));

loadExtension('errors');

// == Exports ===============================================================

module.exports = app;
