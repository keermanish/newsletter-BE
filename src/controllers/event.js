import moment from 'moment';
import _ from 'lodash';

import Event from '../models/event';

import { USER_FIELDS_TO_POPULATE } from '../config/const';

/**
 * function to check whether slots are valid or not
 */
const checkSlots = (req, res) => {
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
  req.body.slots = slots;

  return true;
};

/**
 * controller to get all/specific events
 * GET /event/:search [all/id]
 */
export const getAllEvents = (req, res) => {
  const search = req.params.search === 'all' ? {} : {
    '_id': req.params.search
  };

  Event.find(search)
    .populate('organiser', USER_FIELDS_TO_POPULATE)
    .then(event => {
      res.status(200).send(event);
    })
    .catch(err => {
      res.status(400).send('Unable to find the event');
    });
};

/**
 * controller to create new event
 * POST /event/new
 */
export const addEvent = (req, res) => {

  if(!req.body.slots) {
    return res.status(400).send('Please provide slots');
  } else {
    checkSlots(req, res);
  }

  const event = new Event({
    'title': req.body.title,
    'organiser': req.user._id,
    'location': req.body.location,
    'slots': req.body.slots,
    'description': req.body.description
  });

  event.save()
    .then(savedEvent => {
      return Event.findById(savedEvent._id).populate('organiser', USER_FIELDS_TO_POPULATE);
    })
    .then(savedEvent => {
      res.status(200).send(savedEvent);
    })
    .catch(err => {
      res.status(400).send(err);
    });
};

/**
 * controller to update event info
 * PUT /event/:id
 */
export const updateEvent = (req, res) => {

  if(req.body.slots) {
    checkSlots(req, res);
  }

  Event.findByIdAndUpdate(req.params.id, {
    '$set': req.body
  }, {
    'new': true,
    'runValidators': true,
    'context': 'query'
  })
    .populate('organiser', USER_FIELDS_TO_POPULATE)
    .then(updatedEvent => {
      res.status(200).send(updatedEvent);
    })
    .catch(err => {
      res.status(400).send('Please enter a valid details');
    });
};

/**
 * controller to remove event info
 * DELETE /event/:id
 */
export const deleteEvent = (req, res) => {
  Event.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(200).send();
    })
    .catch(err => {
      res.status(400).send('Error while deleting the event');
    });
};
