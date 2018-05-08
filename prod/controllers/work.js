'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeWork = exports.updateWork = exports.addWork = exports.getWork = undefined;

var _work = require('../models/work');

var _work2 = _interopRequireDefault(_work);

var _const = require('../config/const');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * controller to get all/specific work
 * GET /work/:projectType/:search
 * projectType: FI/RFP
 * search all/id
 */
var getWork = exports.getWork = function getWork(req, res) {
  var search = {};

  if (req.params.search && req.params.search !== 'all') {
    search._id = req.params.search;
  }

  if (req.params.projectType && req.params.projectType !== 'all') {
    search.projectType = req.params.projectType;
  }

  _work2.default.find(search).populate('contactPerson', _const.USER_FIELDS_TO_POPULATE).then(function (works) {
    res.status(200).send(works);
  }).catch(function (err) {
    res.status(400).send('Unable to find booked rooms');
  });
};

/**
 * controller to create new work
 * POST /work/new
 */
var addWork = exports.addWork = function addWork(req, res) {
  var work = new _work2.default({
    'name': req.body.name,
    'description': req.body.description,
    'technologies': req.body.technologies,
    'projectType': req.body.projectType,
    'estimation': req.body.estimation,
    'contactPerson': req.body.contactPerson,
    'members': req.body.members,
    'vacancies': req.body.vacancies
  });

  work.save().then(function (savedWork) {
    return _work2.default.findById(savedWork._id).populate('contactPerson', _const.USER_FIELDS_TO_POPULATE).populate('members.member', _const.USER_FIELDS_TO_POPULATE);
  }).then(function (savedWork) {
    res.status(200).send(savedWork);
  }).catch(function (err) {
    res.status(403).send(err);
  });
};

/**
 * controller to update existing work
 * PUT /work/:id
 */
var updateWork = exports.updateWork = function updateWork(req, res) {
  _work2.default.findByIdAndUpdate(req.params.id, {
    '$set': req.body
  }, {
    'new': true,
    'runValidators': true,
    'context': 'query'
  }).populate('contactPerson', _const.USER_FIELDS_TO_POPULATE).populate('members.member', _const.USER_FIELDS_TO_POPULATE).then(function (updatedWork) {
    res.status(200).send(updatedWork);
  }).catch(function (err) {
    res.status(403).send(err);
  });
};

/**
 * controller to delete existing work
 * DELETE /work/:id
 */
var removeWork = exports.removeWork = function removeWork(req, res) {
  _work2.default.findByIdAndRemove(req.params.id).then(function () {
    res.status(200).send();
  }).catch(function (err) {
    res.status(400).send('Error while deleting the schedule');
  });
};