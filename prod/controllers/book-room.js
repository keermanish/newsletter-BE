'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteSchedule = exports.updateSchedule = exports.addSchedule = exports.getAllBookedRoomSchedule = undefined;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _bookRoom = require('../models/book-room');

var _bookRoom2 = _interopRequireDefault(_bookRoom);

var _const = require('../config/const');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * controller to get all/specific schedules
 * GET /book-room/:search [all/id]
 */
var getAllBookedRoomSchedule = exports.getAllBookedRoomSchedule = function getAllBookedRoomSchedule(req, res) {
  var search = req.params.search === 'all' ? {} : {
    '_id': req.params.search
  };

  _bookRoom2.default.find(search).populate('bookBy', _const.USER_FIELDS_TO_POPULATE).populate('location').then(function (bookedRooms) {
    res.status(200).send(bookedRooms);
  }).catch(function (err) {
    res.status(400).send('Unable to find booked rooms');
  });
};

/**
 * controller to create new schedule
 * POST /book-room/new
 */
var addSchedule = exports.addSchedule = function addSchedule(req, res) {

  if (!req.body.slots) {
    return res.status(400).send('Please provide slots');
  }

  var roomToBeBooked = new _bookRoom2.default({
    'title': req.body.title,
    'bookBy': req.user._id,
    'location': req.body.location,
    'slots': req.body.slots,
    'description': req.body.description
  });

  roomToBeBooked.save().then(function (bookedRoom) {
    return _bookRoom2.default.findById(bookedRoom._id).populate('bookBy', _const.USER_FIELDS_TO_POPULATE).populate('location');
  }).then(function (bookedRooms) {
    res.status(200).send(bookedRooms);
  }).catch(function (err) {
    res.status(400).send(err);
  });
};

/**
 * controller to update schedule info
 * PUT /book-room/:id
 */
var updateSchedule = exports.updateSchedule = function updateSchedule(req, res) {
  _bookRoom2.default.findByIdAndUpdate(req.params.id, {
    '$set': req.body
  }, {
    'new': true,
    'runValidators': true,
    'context': 'query'
  }).populate('bookBy', _const.USER_FIELDS_TO_POPULATE).populate('location').then(function (updatedSchedule) {
    res.status(200).send(updatedSchedule);
  }).catch(function (err) {
    res.status(400).send('Please enter a valid details');
  });
};

/**
 * controller to remove schedule info
 * DELETE /book-room/:id
 */
var deleteSchedule = exports.deleteSchedule = function deleteSchedule(req, res) {
  _bookRoom2.default.findByIdAndRemove(req.params.id).then(function () {
    res.status(200).send();
  }).catch(function (err) {
    res.status(400).send('Error while deleting the schedule');
  });
};