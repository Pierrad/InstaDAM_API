/* eslint-disable security/detect-non-literal-fs-filename */
/* eslint-disable no-await-in-loop */
const httpStatus = require('http-status');
const fs = require('fs');
const catchAsync = require('../utils/catchAsync');
const { imageService, userService } = require('../services');

const uploadImage = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.user._id);
  const image = await imageService.uploadImage(req, user);
  res.status(httpStatus.CREATED).send(image);
});

const getImage = catchAsync(async (req, res) => {
  const image = await imageService.getImageById(req.params.imageId);
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const imageData = fs.readFileSync(image.path);
  res.send({
    name: image.name,
    description: image.description,
    geolocation: image.geolocation,
    image: imageData,
    userId: image.userId,
  });
});

const getImagesByGeolocation = catchAsync(async (req, res) => {
  const images = await imageService.getImagesByGeolocation(req.body);
  const imagesWithImageData = [];
  for (let i = 0; i < images.length; i += 1) {
    const image = images[i];
    const imageData = fs.readFileSync(image.path);
    const user = await userService.getUserById(image.userId);
    imagesWithImageData.push({
      name: image.name,
      description: image.description,
      geolocation: image.geolocation,
      image: imageData,
      user: {
        name: user.name,
      },
    });
  }
  res.send(imagesWithImageData);
});

const getImagesByUserId = catchAsync(async (req, res) => {
  const images = await imageService.getImagesByUserId(req.params.userId);
  const imagesWithImageData = [];
  for (let i = 0; i < images.length; i += 1) {
    const image = images[i];
    const imageData = fs.readFileSync(image.path);
    imagesWithImageData.push({
      name: image.name,
      description: image.description,
      geolocation: image.geolocation,
      image: imageData,
    });
  }
  res.send(imagesWithImageData);
});

module.exports = {
  uploadImage,
  getImage,
  getImagesByGeolocation,
  getImagesByUserId,
};
