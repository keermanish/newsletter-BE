'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteRoom = exports.updateRoom = exports.addNewRoom = exports.getRoom = undefined;

var _room = require('../models/room');

var _room2 = _interopRequireDefault(_room);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * controller to get all/specific stored room info
 * GET /room/:search [all/id]
 */
var getRoom = exports.getRoom = function getRoom(req, res) {
  var search = req.params.search === 'all' ? {} : {
    '_id': req.params.search
  };

  _room2.default.find(search).then(function (roomList) {
    res.status(200).send(roomList);
  }).catch(function (err) {
    res.status(400).send('Error while fetching room list');
  });
};

/**
 * controller to store new room
 * POST /room/new
 */
var addNewRoom = exports.addNewRoom = function addNewRoom(req, res) {
  var room = new _room2.default({
    'name': req.body.name,
    'location': req.body.location,
    'capacity': req.body.capacity
  });

  room.save().then(function (addedRoom) {
    res.status(200).send(addedRoom);
  }).catch(function (err) {
    res.status(400).send(err);
  });
};

/**
 * controller to update room info
 * PUT /room/:id
 */
var updateRoom = exports.updateRoom = function updateRoom(req, res) {
  _room2.default.findByIdAndUpdate(req.params.id, {
    '$set': req.body
  }, {
    'new': true,
    'runValidators': true,
    'context': 'query'
  }).then(function (updatedRoom) {
    res.status(200).send(updatedRoom);
  }).catch(function (err) {
    res.status(400).send('Error while updating room information');
  });
};

/**
 * controller to remove room info
 * DELETE /room/:id
 */
var deleteRoom = exports.deleteRoom = function deleteRoom(req, res) {
  _room2.default.findByIdAndRemove(req.params.id).then(function () {
    res.status(200).send();
  }).catch(function (err) {
    res.status(400).send('Error while deleting room information');
  });
};