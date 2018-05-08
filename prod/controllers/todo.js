'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.name = exports.createTodo = undefined;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _todo = require('../models/todo');

var _todo2 = _interopRequireDefault(_todo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* controller to creat todo */
var createTodo = exports.createTodo = function createTodo(req, res) {
  var todo = new _todo2.default({
    'name': req.body.name
  });

  todo.save().then(function (todo) {
    res.status(200).send(todo);
  }).catch(function (err) {
    res.send(err);
  });
};

var name = exports.name = 'manish';