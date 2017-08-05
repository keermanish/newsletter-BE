/**
 * all validation functions goes here
 */

 import moment from 'moment';

/**
 * function to check whether provided value is empty or not
 * @param  {any}  value [value to be checked]
 * @return {Boolean}
 */
export const isEmpty = value => {
  return !value || typeof value === String && !value.trim();
};

/**
 * function to check provided value is number or not
 * @param {*} value 
 */
export const isValidNumber = value => {
  const reg = /^\d+$/g;
  return reg.test(value);
};

/**
 * function to validate user name
 * @param {String} value [user name]
 * @returns {Boolean}
 */
export const isValidName = value => {
  if(isEmpty(value)) {
    return false;
  }

  const reg = /^[a-zA-Z'.\s]+$/g;
  return reg.test(value);
};

/**
 * function to validate alphanumeric
 * @param {String} value
 * @returns {Boolean}
 */
export const isValidAlphanumeric = value => {
  if(isEmpty(value)) {
    return false;
  }

  const reg = /^[a-zA-Z0-9'.\s]+$/g;
  return reg.test(value);
};

/**
 * function to validate phone number
 * @link https://stackoverflow.com/a/16702965
 */
export const isValidPhoneNumber = value => {
  if(isEmpty(value)) {
    return false;
  }

  const reg = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/g;
  return reg.test(value);
};

/**
 * function to validate email
 * @link https://stackoverflow.com/a/46181
 */
export const isValidEmail = value => {
  if(isEmpty(value)) {
    return false;
  }

  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return reg.test(value);
};

/**
 * function to validate date
 * @param {Date/String}
 */
export const isValidDate = value => {
  if(isEmpty(value)) {
    return false;
  }

  return moment(value).isValid();
};

/**
 * function to validate time
 * @param {Date/String} - HH:mm
 */
export const isValidTime = value => {
  if(isEmpty(value)) {
    return false;
  }

  return moment(value, 'HH:MM').isValid();
};
