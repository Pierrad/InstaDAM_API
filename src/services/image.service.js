const httpStatus = require('http-status');
const fs = require('fs');
const Image = require('../models/image.model');
const ApiError = require('../utils/ApiError');

const PAGE_SIZE = 10; // number of items per page
const MAX_DISTANCE = 100000; // 100km

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

const deleteImageById = async (imageId) => {
  const image = await getImageById(imageId);
  const { path } = image;
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  fs.unlinkSync(path);
  await image.remove();
};

const getImagesByGeolocation = async ({ longitude, latitude, page }) => {
  const skip = (page - 1) * PAGE_SIZE;

  const images = await Image.find({
    geolocation: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        $maxDistance: MAX_DISTANCE, // 100km
      },
    },
  })
    .skip(skip)
    .limit(PAGE_SIZE);

  return images;
};

const getTotalPagesByGeolocation = async ({ longitude, latitude }) => {
  const images = await Image.find({
    geolocation: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        $maxDistance: MAX_DISTANCE, // 100km
      },
    },
  });

  const totalImages = images.length;

  const totalPage = Math.ceil(totalImages / PAGE_SIZE);

  return totalPage;
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
  deleteImageById,
  getImagesByGeolocation,
  getImagesByUserId,
  getTotalPagesByGeolocation,
};
