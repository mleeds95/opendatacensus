'use strict';

var _ = require('underscore');
var loaders = require('../loaders');
var models = require('../models');


var _promisedLoad = function(res, options) {

  return loaders.loadTranslatedData(options)
    .then(function() { res.send({status: 'ok', message: 'ok'}); })
    .catch(function(E) { res.send({status: 'error', message: E}); });

};


var dashboard = function (req, res) {

  res.render('dashboard.html');

};


var loadRegistry = function (req, res) {

  return loaders.loadRegistry(req.params.domain).spread(function(error, data) {
    if (error)
      res.send({'status': 'error', message: error});
    else
      res.send({'status': 'ok', message: 'ok'});
  });

};


var loadConfig = function (req, res) {

  return loaders.loadConfig(req.params.domain)
    .then(function() { res.send({'status': 'ok', message: 'ok'}); })
    .catch(function(E) { res.send({'status': 'error', message: E}); });

};

var loadPlaces = function (req, res) {

  return _promisedLoad(res, {
    Model: models.Place,
    setting: 'places',
    site: req.params.domain
  });

};

var loadDatasets = function (req, res) {

  return _promisedLoad(res, {
    mapper: function(D) {return _.extend(D, {name: D.title});},
    Model: models.Dataset,
    setting: 'datasets',
    site: req.params.domain
  });

};

var loadQuestions = function (req, res) {

  return _promisedLoad(res, {
    mapper: function(D) { return _.extend(D, {dependants: D.dependants.split(','), score: D.score || 0}); },
    Model: models.Question,
    setting: 'questions',
    site: req.params.domain
  });

};


module.exports = {
  dashboard: dashboard,
  loadRegistry: loadRegistry,
  loadConfig: loadConfig,
  loadPlaces: loadPlaces,
  loadDatasets: loadDatasets,
  loadQuestions: loadQuestions
};
