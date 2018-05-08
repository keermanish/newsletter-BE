'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _todo = require('../models/todo');

var _todo2 = _interopRequireDefault(_todo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mongoose = require('mongoose');

var todoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'This is required']
  }
});

exports.default = mongoose.model('Todo', todoSchema);