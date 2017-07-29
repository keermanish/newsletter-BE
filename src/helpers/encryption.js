import bcrypt from 'bcrypt';

/**
 * function to encrypt the provided value
 * @param {string} input
 * @returns {promise}
 */
export const hashData = (input) => {
  return new Promise((resolve, reject) => {
    if(!input) {
      return resolve(input);
    }

    /* https://www.npmjs.com/package/bcrypt#a-note-on-rounds */
    bcrypt.genSalt(12, (saltError, salt) => {
      if(saltError) {
        return reject(saltError);
      }

      bcrypt.hash(input, salt, (hashError, hashedInput) => {
        if(hashError) {
          return reject(hashError);
        }

        return resolve(hashedInput);
      });
    });
  });
};

/**
 * function to compare hashed and readable data
 * @param {string} dataToBeCompare
 * @param {string} hashedData
 * @returns {promise}
 */
export const compareDate = (dataToBeCompare, hashedData) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(dataToBeCompare, hashedData, (err, isMatched) => {
      if(isMatched) {
        return resolve(true);
      }

      reject(false);
    });
  });
};
