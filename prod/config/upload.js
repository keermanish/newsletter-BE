'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.eventPicUpload = exports.avatarUpload = undefined;

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* path to upload dir */
var UPLOAD_PATH = _path2.default.join(__dirname, './../../uploads');

/* funtion to check supported image extensions */
var fileFilter = function fileFilter(req, file, cb) {
  /* accept image only */
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Only image files are allowed'), false);
  }
  cb(null, true);
};

/* storge for avatar */
var avatarStorage = _multer2.default.diskStorage({
  'destination': UPLOAD_PATH + '/avatar/',
  'filename': function filename(req, file, cb) {
    var uploadedFileName = file.originalname.split('.');
    var fileName = uploadedFileName[0];
    var ext = uploadedFileName[1];

    cb(null, fileName + '-' + Date.now() + '-' + req.user._id + '-avatar.' + ext);
  }
});

/* required config for avatar upload */
var avatarUpload = exports.avatarUpload = (0, _multer2.default)({
  'storage': avatarStorage,
  'limits': {
    'fileSize': 3000000 /* in bytes 1000000b = 1mb*/
  },
  'onFileSizeLimit': function onFileSizeLimit(file) {
    /* delete the partially written file */
    _fs2.default.unlink(_path2.default.join(__dirname, './../../' + file.path));
  },
  fileFilter: fileFilter
}).single('avatar');

/* storge for avatar */
var eventPicStorage = _multer2.default.diskStorage({
  'destination': UPLOAD_PATH + '/eventPic/',
  'filename': function filename(req, file, cb) {
    var uploadedFileName = file.originalname.split('.');
    var fileName = uploadedFileName[0];
    var ext = uploadedFileName[1];

    cb(null, fileName + '-' + Date.now() + '-' + req.user._id + '-eventPic.' + ext);
  }
});

/* required config for eventPic upload */
var eventPicUpload = exports.eventPicUpload = (0, _multer2.default)({
  'storage': eventPicStorage,
  'limits': {
    'fileSize': 3000000 /* in bytes 1000000b = 1mb*/
  },
  'onFileSizeLimit': function onFileSizeLimit(file) {
    /* delete the partially written file */
    _fs2.default.unlink(_path2.default.join(__dirname, './../../' + file.path));
  },
  fileFilter: fileFilter
}).single('eventPic');