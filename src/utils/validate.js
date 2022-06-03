import Joi from 'joi';

/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
function pick(object, keys) {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      // eslint-disable-next-line no-param-reassign
      obj[key] = object[key];
    }
    return obj;
  }, {});
}

export {
  pick
};

export default (schema) => (values) => {
  const object = pick(values, Object.keys(schema));
  // console.log(object)
  const {
    value,
    error
  } = Joi.compile(schema).prefs({
    errors: {
      label: 'key',
    }
  }).validate(object);
  if (error) {
    console.log({
      error
    })
    const errorMessage = error.details.map(detail => detail.message).join('');
    throw new Error(errorMessage)
  }
  return value
}
