const Joi = require('joi');

const getImagesByGeolocation = {
  body: Joi.object().keys({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
  }),
};

module.exports = {
  getImagesByGeolocation,
};
