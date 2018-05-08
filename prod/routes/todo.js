'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _todo = require('../controllers/todo');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var todoRoutes = _express2.default.Router();

todoRoutes.post('/create', _todo.createTodo);

exports.default = todoRoutes;