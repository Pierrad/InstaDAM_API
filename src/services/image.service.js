const httpStatus = require('http-status');
const Image = require('../models/image.model');
const ApiError = require('../utils/ApiError');

const uploadImage = async (req, user) => {
  const { body, file } = req;
  const image = await Image.create({
    name: body.name,
    description: body.description,
    path: file.path,
    geolocation: {
      type: 'Point',
      coordinates: [JSON.parse(body.geolocation).longitude, JSON.parse(body.geolocation).latitude],
    },
    userId: user._id,
  });
  return image;
};

const getImageById = async (imageId) => {
  const image = await Image.findById(imageId);
  if (!image) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Image not found');
  }
  return image;
};

const getImagesByGeolocation = async (geolocation) => {
  const images = await Image.find({
    geolocation: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [geolocation.longitude, geolocation.latitude],
        },
        $maxDistance: 10000, // 10km
      },
    },
  });
  return images;
};

const getImagesByUserId = async (userId) => {
  const images = await Image.find({
    userId,
  });
  return images;
};

module.exports = {
  uploadImage,
  getImageById,
  getImagesByGeolocation,
  getImagesByUserId,
};
