'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkRoomAvailablity = undefined;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bookRoom = require('../models/book-room');

var _bookRoom2 = _interopRequireDefault(_bookRoom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * middleware function to check room availablity on every provided slots
 */
var checkRoomAvailablity = exports.checkRoomAvailablity = function checkRoomAvailablity(req, res, next) {

  /* while update there is an possblity slots are not present */
  if (req.body.location && Array.isArray(req.body.slots)) {
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
    var meetingId = res.req.headers.referer.indexOf('edit/') !== -1 ? res.req.headers.referer.split('edit/')[1] : undefined;
    _bookRoom2.default.find({
      '_id': { $ne: meetingId },
      'location': req.body.location
      // 'slots.fromTime': {
      //   '$gte': slots[0].fromTime /* search boundary - start time */
      // },
      // 'slots.toTime': {
      //   '$lte': slots[slots.length - 1].toTime /* search boundary - end time */
      // }
    }).populate('bookBy').then(function (bookedRooms) {
      console.log(bookedRooms);
      if (Array.isArray(bookedRooms)) {

        /* array to collect all booked slots */
        var alreadyBookedSlotsWithDate = [];

        /* loop through all slots which falls in boudary */
        bookedRooms.forEach(function (bookedRoom) {

          /* loop through all slots which need to be booked */
          var alreadyBookedSlots = _lodash2.default.filter(slots, function (slotToBeBooked) {

            /* loop through slots of already booked room */
            return _lodash2.default.find(bookedRoom.slots, function (bookedSlot) {
              var availablity = void 0;

              if (bookedSlot.toDate <= slotToBeBooked.fromDate && slotToBeBooked.toDate >= bookedSlot.fromDate) {
                /* check slot availablity */
                availablity = bookedSlot.toTime <= slotToBeBooked.fromTime && slotToBeBooked.toTime >= bookedSlot.fromTime;
              }

              if (availablity) {
                alreadyBookedSlotsWithDate.push({
                  'bookedDate': (0, _moment2.default)(bookedSlot.fromDate).format('YYYY/MM/DD'),
                  'bookedSlots': bookedSlot,
                  'bookedBy': bookedRoom.bookBy
                });
              }

              return availablity;
            });
          });
        });

        /* slots are not available */
        if (alreadyBookedSlotsWithDate.length) {
          return res.status(400).json({
            'alreadyBookedSlots': alreadyBookedSlotsWithDate
          });
        }
      }

      /* all clear - we can book this slots */
      req.body.slots = slots;
      next();
    }).catch(function (err) {
      res.status(400).send('Error while registering the slots');
    });
  } else if (req.body.location) {
    res.status(400).send('Please provide slots details');
  } else if (req.body.slots) {
    res.status(400).send('Please provide location details');
  } else {
    next();
  }
};