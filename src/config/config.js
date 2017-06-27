import applicationConfig from './config.json';

/* get environment specific config - default: development */
const config = applicationConfig[process.env.NODE_ENV || 'development'];

export default config;