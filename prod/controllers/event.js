'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteEvent = exports.updateEvent = exports.setEventPic = exports.addEvent = exports.getAllEvents = undefined;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _cloudinary = require('cloudinary');

var _cloudinary2 = _interopRequireDefault(_cloudinary);

var _event = require('../models/event');

var _event2 = _interopRequireDefault(_event);

var _config = require('../config/config');

var _config2 = _interopRequireDefault(_config);

var _const = require('../config/const');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * function to check whether slots are valid or not
 */
var checkSlots = function checkSlots(req, res) {
  var isInvalidTimeCombination = false;

  var slots = req.body.slots.map(function (slot, index) {

    /* skip if we find any invalid slot */
    if (isInvalidTimeCombination) {
      return slot;
    }

    var fromTime = (0, _moment2.default)(slot.fromTime, 'HH:mm');
    var toTime = (0, _moment2.default)(slot.toTime, 'HH:mm');

    slot.fromDate = (0, _moment2.default)(slot.fromDate).toDate();
    slot.toDate = (0, _moment2.default)(slot.toDate || slot.fromDate).toDate();
    slot.fromTime = (0, _moment2.default)(slot.fromDate).set({ 'hour': fromTime.hours(), 'minute': fromTime.minutes(), 'second': 0, 'millisecond': 0 }).toDate();
    slot.toTime = (0, _moment2.default)(slot.toDate).set({ 'hour': toTime.hours(), 'minute': toTime.minutes(), 'second': 0, 'millisecond': 0 }).toDate();

    /* check slot start time is less/equal to end time */
    if ((0, _moment2.default)(slot.fromTime) >= (0, _moment2.default)(slot.toTime)) {
      isInvalidTimeCombination = index + 1;
    }

    return slot;
  });

  /* skip if we find any invalid slot */
  if (isInvalidTimeCombination) {}
  //return res.status(400).send(`Slot ${isInvalidTimeCombination}, Please provide valid start and end time`);


  /* sort by ASC */
  slots = _lodash2.default.sortBy(slots, function (slot) {
    return slot.fromTime;
  });
  req.body.slots = slots;

  return true;
};

/**
 * controller to get all/specific events
 * GET /event/:search [all/id]
 */
var getAllEvents = exports.getAllEvents = function getAllEvents(req, res) {
  var search = req.params.search === 'all' ? {} : {
    '_id': req.params.search
  };

  _event2.default.find(search).populate('organiser', _const.USER_FIELDS_TO_POPULATE).then(function (event) {
    res.status(200).send(event);
  }).catch(function (err) {
    res.status(400).send('Unable to find the event');
  });
};

/**
 * controller to create new event
 * POST /event/new
 */
var addEvent = exports.addEvent = function addEvent(req, res) {

  if (!req.body.slots) {
    return res.status(400).send('Please provide slots');
  } else {
    checkSlots(req, res);
  }

  var event = new _event2.default({
    'title': req.body.title,
    'organiser': req.user._id,
    'location': req.body.location,
    'slots': req.body.slots,
    'description': req.body.description,
    'invitees': req.body.invitees,
    'notes': req.body.notes
  });

  event.save().then(function (savedEvent) {
    return _event2.default.findById(savedEvent._id).populate('organiser', _const.USER_FIELDS_TO_POPULATE);
  }).then(function (savedEvent) {
    res.status(200).send(savedEvent);
  }).catch(function (err) {
    res.status(400).send(err);
  });
};

/**
 * controller to set event pic
 * once image store successfully then delete previous eventPic
 * POST /event/pic
 */
var setEventPic = exports.setEventPic = function setEventPic(req, res) {
  var oldEventPicPath = req.event.eventPic;

  _cloudinary2.default.v2.uploader.upload(req.file.path, function (error, result) {
    if (error) {
      return res.status(400).send(error);
    }

    _event2.default.findByIdAndUpdate(req.event._id, {
      '$set': {
        'eventPic': result.url
      }
    }, {
      'new': true
    }).then(function (event) {

      /* check for old eventPic */
      if (oldEventPicPath) {
        _fs2.default.unlink(_path2.default.join(__dirname, './../../', oldEventPicPath));
      }

      res.send(event);
    }).catch(function (err) {
      res.status(400).send('Unable to set profile pic, Please try again');
    });
  });
};

/**
 * controller to update event info
 * PUT /event/:id
 */
var updateEvent = exports.updateEvent = function updateEvent(req, res) {

  if (req.body.slots) {
    checkSlots(req, res);
  }

  _event2.default.findByIdAndUpdate(req.params.id, {
    '$set': req.body
  }, {
    'new': true,
    'runValidators': true,
    'context': 'query'
  }).populate('organiser', _const.USER_FIELDS_TO_POPULATE).then(function (updatedEvent) {
    res.status(200).send(updatedEvent);
  }).catch(function (err) {
    res.status(400).send('Please enter a valid details');
  });
};

/**
 * controller to remove event info
 * DELETE /event/:id
 */
var deleteEvent = exports.deleteEvent = function deleteEvent(req, res) {
  _event2.default.findByIdAndRemove(req.params.id).then(function () {
    res.status(200).send();
  }).catch(function (err) {
    res.status(400).send('Error while deleting the event');
  });
};