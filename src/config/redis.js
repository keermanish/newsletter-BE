import redis from 'redis';

import config from '../config/config';

/**
 * create redis clint with default configuration
 * prefix: unique seperator to distinguish redis key
 */
const redisClient = redis.createClient({
  'prefix': config.REDIS_KEY
});

redisClient.on('connect', () => {
  console.log('Redis is connected with default config');
});

redisClient.on('error', () => {
  console.log('Error while connecting with Redis');
});

export default redisClient;
