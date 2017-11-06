import Work from '../models/work';

import { USER_FIELDS_TO_POPULATE } from '../config/const';

/**
 * controller to get all/specific work
 * GET /work/:projectType/:search
 * projectType: FI/RFP
 * search all/id
 */
export const getWork = (req, res) => {
  const search = {
    'projectType': req.params.projectType
  };

  if(req.params.search && req.params.search !== 'all') {
    search._id = req.params.search;
  }

  Work.find(search)
    .populate('contactPerson', USER_FIELDS_TO_POPULATE)
    .populate('members.member', USER_FIELDS_TO_POPULATE)
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
    'name': req.body.name,
    'description': req.body.description,
    'technology': req.body.technology,
    'projectType': req.body.projectType,
    'estimation': req.body.estimation,
    'contactPerson': req.body.contactPerson,
    'members': req.body.members,
    'vacancy': req.body.vacancy
  });

  work.save()
    .then(savedWork => {
      return Work.findById(savedWork._id).populate('contactPerson', USER_FIELDS_TO_POPULATE).populate('members.member', USER_FIELDS_TO_POPULATE);
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
    .populate('contactPerson', USER_FIELDS_TO_POPULATE)
    .populate('members.member', USER_FIELDS_TO_POPULATE)
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
