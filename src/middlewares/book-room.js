import moment from 'moment';
import _ from 'lodash';

import BookRoom from '../models/book-room';

/**
 * middleware function to check room availablity on every provided slots
 */
export const checkRoomAvailablity = (req, res, next) => {

  /* while update there is an possblity slots are not present */
  if(req.body.location && Array.isArray(req.body.slots)) {
    let isInvalidTimeCombination = false;

    let slots = req.body.slots.map((slot, index) => {

      /* skip if we find any invalid slot */
      if(isInvalidTimeCombination) {
        return slot;
      }

      const fromTime = moment(slot.fromTime, 'HH:mm');
      const toTime = moment(slot.toTime, 'HH:mm');

      slot.fromDate = moment(slot.fromDate).toDate();
      slot.toDate = moment(slot.toDate || slot.fromDate).toDate();
      slot.fromTime = moment(slot.fromDate)
                      .set({'hour': fromTime.hours(), 'minute': fromTime.minutes(), 'second': 0, 'millisecond': 0})
                      .toDate();
      slot.toTime = moment(slot.toDate)
                    .set({'hour': toTime.hours(), 'minute': toTime.minutes(), 'second': 0, 'millisecond': 0})
                    .toDate();

      /* check slot start time is less/equal to end time */
      if(moment(slot.fromTime) >= moment(slot.toTime)) {
        isInvalidTimeCombination = index + 1;
      }

      return slot;
    });

    /* skip if we find any invalid slot */
    if(isInvalidTimeCombination) {
      //return res.status(400).send(`Slot ${isInvalidTimeCombination}, Please provide valid start and end time`);
    }

    /* sort by ASC */
    slots = _.sortBy(slots, (slot) => slot.fromTime);
    let meetingId = ((res.req.headers.referer).indexOf('edit/') !== -1) ? (res.req.headers.referer).split('edit/')[1] : undefined;
    BookRoom.find({
      '_id': { $ne: meetingId },
      'location': req.body.location,
      // 'slots.fromTime': {
      //   '$gte': slots[0].fromTime /* search boundary - start time */
      // },
      // 'slots.toTime': {
      //   '$lte': slots[slots.length - 1].toTime /* search boundary - end time */
      // }
    })
    .populate('bookBy')
      .then(bookedRooms => {console.log(bookedRooms);
        if(Array.isArray(bookedRooms)) {

          /* array to collect all booked slots */
          let alreadyBookedSlotsWithDate = [];

          /* loop through all slots which falls in boudary */
          bookedRooms.forEach(bookedRoom => {

            /* loop through all slots which need to be booked */
            const alreadyBookedSlots = _.filter(slots, slotToBeBooked => {

              /* loop through slots of already booked room */
              return _.find(bookedRoom.slots, bookedSlot => {
                let availablity;

                if(bookedSlot.toDate <= slotToBeBooked.fromDate && slotToBeBooked.toDate >= bookedSlot.fromDate) {
                  /* check slot availablity */
                  availablity = (bookedSlot.toTime <= slotToBeBooked.fromTime && slotToBeBooked.toTime >= bookedSlot.fromTime);
                }

                if(availablity) {
                  alreadyBookedSlotsWithDate.push({
                    'bookedDate': moment(bookedSlot.fromDate).format('YYYY/MM/DD'),
                    'bookedSlots': bookedSlot,
                    'bookedBy': bookedRoom.bookBy
                  });
                }

                return availablity;
              });
            });
          });

          /* slots are not available */
          if(alreadyBookedSlotsWithDate.length) {
            return res.status(400).json({
              'alreadyBookedSlots': alreadyBookedSlotsWithDate
            });
          }
        }

        /* all clear - we can book this slots */
        req.body.slots = slots;
        next();
      })
      .catch(err => {
        res.status(400).send('Error while registering the slots');
      });
  } else if(req.body.location) {
    res.status(400).send('Please provide slots details');
  } else if(req.body.slots) {
    res.status(400).send('Please provide location details');
  }else {
    next();
  }
};
