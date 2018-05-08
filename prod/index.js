'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _config = require('./config/config');

var _config2 = _interopRequireDefault(_config);

var _routes = require('./routes/');

var _routes2 = _interopRequireDefault(_routes);

var _db = require('./config/db');

var _db2 = _interopRequireDefault(_db);

var _cors3 = require('./config/cors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
// import redisClient from './config/redis';

var port = process.env.PORT || _config2.default.PORT;

/* check for CORS */
app.use((0, _cors2.default)(_cors3.corsOptions));

/* middleware will attempt to compress response bodies */
app.use((0, _compression2.default)());

/* secure your express apps by setting various HTTP headers */
app.use((0, _helmet2.default)());

/* log incomming request details */
app.use((0, _morgan2.default)(':method :url :date :remote-addr :status :response-time'));

/* parse application/x-www-form-urlencoded */
app.use(_bodyParser2.default.urlencoded({ 'extended': false }));

/* parse application/json */
app.use(_bodyParser2.default.json());

/* all application routes */
app.use(_routes2.default);

app.listen(port, function () {
  console.log('App listen on ' + port + JSON.stringify(_config2.default));
});