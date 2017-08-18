import applicationPrivateConfig from './config.json';

const applicationPublicConfig = {
  'development': {
    "API_URL": "http://localhost:3000"
  },
  "stage": {
    "API_URL": "http://10.12.168.10:3000" // Please change me later
  },
  'production': {
    "API_URL": "http://production:3000" // Please change me later
  }
};

/**
 * common configuration
 * same across all environment
 */
const commonConfigAcrossAllEnv = {
  'OTP_EXPIRY_TIME': 2 /* in hours */
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
