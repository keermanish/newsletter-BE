import mongoose from 'mongoose';

import config from './config'

/* Use native promises */
mongoose.Promise = global.Promise;

const dbConnection = mongoose.connect(config.DB_URL);

/* When successfully connected */
mongoose.connection.on('connected', () => {
  console.log(`Mongoose default connection open to ${config.DB_URL}`);
});

/* If the connection throws an error */
mongoose.connection.on('error', err => {
  console.error(`Mongoose default connection error ${err}`);
});

/* When the connection is disconnected */
mongoose.connection.on('disconnected', () => {
  console.error('Mongoose default connection disconnected');
});

/* If the Node process ends, close the Mongoose connection */
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.error('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

export default dbConnection;
