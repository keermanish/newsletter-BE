'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _work = require('../controllers/work');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var workRoutes = _express2.default.Router();

/**
 * route to get all/specific work
 * GET /work/:projectType/:search
 * projectType: FI/RFP
 * search all/id
 */
workRoutes.get('/:projectType/:search', _work.getWork);

/**
 * route to create new work
 * POST /work/new
 */
workRoutes.post('/new', _work.addWork);

/**
 * route to update existing work
 * PUT /work/new
 */
workRoutes.put('/:id', _work.updateWork);

/**
 * route to delete existing work
 * DELETE /work/new
 */
workRoutes.delete('/:id', _work.removeWork);

exports.default = workRoutes;