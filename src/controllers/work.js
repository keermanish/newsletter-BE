import Work from '../models/work';

import { USER_FIELDS_TO_POPULATE } from '../config/const';

/**
 * controller to get all/specific work
 * GET /work/:typeOfWork/:search
 * typeOfWork: FI/RFP
 * search all/id
 */
export const getWork = (req, res) => {
  const search = {
    'typeOfWork': req.params.typeOfWork
  };

  if(req.params.search && req.params.search !== 'all') {
    search._id = req.params.search;
  }

  Work.find(search)
    .populate('spoc', USER_FIELDS_TO_POPULATE)
    .populate('participants.participant', USER_FIELDS_TO_POPULATE)
    .then(works => {
      res.status(200).send(works);
    })
    .catch(err => {
      res.status(400).send('Unable to find booked rooms');
    });
};

/**
 * controller to create new work
 * POST /work/new
 */
export const addWork = (req, res) => {
  const work = new Work({
    'title': req.body.title,
    'description': req.body.description,
    'technology': req.body.technology,
    'typeOfWork': req.body.typeOfWork,
    'estimation': req.body.estimation,
    'spoc': req.body.spoc,
    'participants': req.body.participants,
    'vacancy': req.body.vacancy
  });

  work.save()
    .then(savedWork => {
      return Work.findById(savedWork._id).populate('spoc', USER_FIELDS_TO_POPULATE).populate('participants.participant', USER_FIELDS_TO_POPULATE);
    })
    .then(savedWork => {
      res.status(200).send(savedWork);
    })
    .catch(err => {
      res.status(403).send(err);
    });
};

/**
 * controller to update existing work
 * PUT /work/:id
 */
export const updateWork = (req, res) => {
  Work.findByIdAndUpdate(req.params.id, {
    '$set': req.body
  }, {
    'new': true,
    'runValidators': true,
    'context': 'query'
  })
    .populate('spoc', USER_FIELDS_TO_POPULATE)
    .populate('participants.participant', USER_FIELDS_TO_POPULATE)
    .then(updatedWork => {
      res.status(200).send(updatedWork);
    })
    .catch(err => {
      res.status(403).send(err);
    });
};

/**
 * controller to delete existing work
 * DELETE /work/:id
 */
export const removeWork = (req, res) => {
  Work.findByIdAndRemove(req.params.id)
  .then(() => {
    res.status(200).send();
  })
  .catch(err => {
    res.status(400).send('Error while deleting the schedule');
  });
};
