import moment from 'moment';

import BookRoom from '../models/book-room';

/**
 * controller to get all/specific schedules
 * GET /book-room/:search [all/id]
 */
export const getAllBookedRoomSchedule = (req, res) => {
  const search = req.params.search === 'all' ? {} : {
    '_id': req.params.search
  };

  BookRoom.find(search)
    .populate('bookBy')
    .populate('location')
    .then(bookedRooms => {
      res.status(200).send(bookedRooms);
    })
    .catch(err => {
      res.status(400).send('Unable to find booked rooms');
    });
};

/**
 * controller to create new schedule
 * POST /book-room/new
 */
export const addSchedule = (req, res) => {

  if(!req.body.slots) {
    return res.status(400).send('Please provide slots');
  }

  const roomToBeBooked = new BookRoom({
    'title': req.body.title,
    'bookBy': req.user._id,
    'location': req.body.location,
    'slots': req.body.slots,
    'description': req.body.description
  });

  roomToBeBooked.save()
    .then(bookedRoom => {
      return BookRoom.findById(bookedRoom._id).populate('bookBy').populate('location');
    })
    .then(bookedRooms => {
      res.status(200).send(bookedRooms);
    })
    .catch(err => {
      res.status(400).send(err);
    });
};

/**
 * controller to update schedule info
 * PUT /book-room/:id
 */
export const updateSchedule = (req, res) => {
  BookRoom.findByIdAndUpdate(req.params.id, {
    '$set': req.body
  }, {
    'new': true,
    'runValidators': true,
    'context': 'query'
  })
    .populate('bookBy')
    .populate('location')
    .then(updatedSchedule => {
      res.status(200).send(updatedSchedule);
    })
    .catch(err => {
      res.status(400).send('Please enter a valid details');
    });
};

/**
 * controller to remove schedule info
 * DELETE /book-room/:id
 */
export const deleteSchedule = (req, res) => {
  BookRoom.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(200).send();
    })
    .catch(err => {
      res.status(400).send('Error while deleting the schedule');
    });
};
