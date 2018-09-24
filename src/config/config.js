import cloudinary from 'cloudinary';
import applicationPrivateConfig from './config.json';

const applicationPublicConfig = {
  'development': {
    "API_URL": "http://localhost:3000"
  },
  "stage": {
    "API_URL": "http://FIXME:3000" // Please change me later
  },
  'production': {
    "API_URL": "https://newsletter-be.herokuapp.com"
  }
};

cloudinary.config({
  cloud_name: 'makeer02',
  api_key: '158494249426276',
  api_secret: 'c1LuEO4jt6FZzaiOc2_92S829hc'
});

/**
 * common configuration
 * same across all environment
 */
const commonConfigAcrossAllEnv = {
  'OTP_EXPIRY_TIME': 2, /* in hours */

  'REDIS_KEY': 'newsletter:' /* unique seperator to distinguish redis key */
};

/**
 * get environment specific config - default: development
 * this is private configuration - not tracked in git
 */
const runtimePrivateConfig = applicationPrivateConfig[process.env.NODE_ENV || 'development'];

/**
 * get environment specific config - default: development
 * this is public configuration available in git
 */
const runtimePublicConfig = applicationPublicConfig[process.env.NODE_ENV || 'development'];

/* combine both */
const config = Object.assign({}, runtimePrivateConfig, runtimePublicConfig, commonConfigAcrossAllEnv);

export default config;
