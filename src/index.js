import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';

import config from './config/config';
import routes from './routes/';
import dbConnection from './config/db';
import { corsOptions } from './config/cors';

const app = express();
const port = process.env.PORT || config.PORT;

/* check for CORS */
app.use(cors(corsOptions));

/* middleware will attempt to compress response bodies */
app.use(compression());

/* secure your express apps by setting various HTTP headers */
app.use(helmet());

/* log incomming request details */
app.use(morgan(':method :url :date :remote-addr :status :response-time'));

/* parse application/x-www-form-urlencoded */
app.use(bodyParser.urlencoded({ 'extended': false }));

/* parse application/json */
app.use(bodyParser.json());

/* all application routes */
app.use(routes);

app.listen(port, () => {
  console.log(`App listen on ${port}`);
});
