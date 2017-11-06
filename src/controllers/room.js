import Room from '../models/room';

/**
 * controller to get all/specific stored room info
 * GET /room/:search [all/id]
 */
export const getRoom = (req, res) => {
  const search = req.params.search === 'all' ? {} : {
    '_id': req.params.search
  };

  Room.find(search)
    .then(roomList => {
      res.status(200).send(roomList);
    })
    .catch(err => {
      res.status(400).send('Error while fetching room list');
    });
};

/**
 * controller to store new room
 * POST /room/new
 */
export const addNewRoom = (req, res) => {
  const room = new Room({
    'name': req.body.name,
    'location': req.body.location,
    'capacity': req.body.capacity
  });

  room.save()
    .then(addedRoom => {
      res.status(200).send(addedRoom);
    })
    .catch(err => {
      res.status(400).send(err);
    });
};

/**
 * controller to update room info
 * PUT /room/:id
 */
export const updateRoom = (req, res) => {
  Room.findByIdAndUpdate(req.params.id, {
    '$set': req.body
  }, {
    'new': true,
    'runValidators': true,
    'context': 'query'
  })
    .then(updatedRoom => {
      res.status(200).send(updatedRoom);
    })
    .catch(err => {
      res.status(400).send('Error while updating room information');
    });
};


/**
 * controller to remove room info
 * DELETE /room/:id
 */
export const deleteRoom = (req, res) => {
  Room.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(200).send();
    })
    .catch(err => {
      res.status(400).send('Error while deleting room information');
    });
};
