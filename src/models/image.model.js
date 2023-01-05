const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const imageSchema = mongoose.Schema(
  {
    name: String,
    description: String,
    path: String,
    geolocation: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
imageSchema.plugin(toJSON);

// create a 2dsphere index on the geolocation field
imageSchema.index({ geolocation: '2dsphere' });

/**
 * @typedef Image
 */
const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
