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

const deleteImage = catchAsync(async (req, res) => {
  await imageService.deleteImageById(req.params.imageId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getImagesByGeolocation = catchAsync(async (req, res) => {
  const images = await imageService.getImagesByGeolocation(req.body);
  const totalPage = await imageService.getTotalPagesByGeolocation(req.body);
  const imagesWithImageData = [];
  for (let i = 0; i < images.length; i += 1) {
    const image = images[i];
    const bitmap = fs.readFileSync(image.path);
    const base64 = Buffer.from(bitmap).toString('base64');
    const user = await userService.getUserById(image.userId);
    imagesWithImageData.push({
      id: image._id,
      name: image.name,
      description: image.description,
      geolocation: image.geolocation,
      image: base64,
      user: {
        name: user.name,
      },
    });
  }
  res.send({
    images: imagesWithImageData,
    totalPage,
  });
});

const getImagesByUserId = catchAsync(async (req, res) => {
  const images = await imageService.getImagesByUserId(req.params.userId);
  const imagesWithImageData = [];
  for (let i = 0; i < images.length; i += 1) {
    const image = images[i];
    const bitmap = fs.readFileSync(image.path);
    const base64 = Buffer.from(bitmap).toString('base64');
    imagesWithImageData.push({
      id: image._id,
      name: image.name,
      description: image.description,
      geolocation: image.geolocation,
      image: base64,
    });
  }
  res.send(imagesWithImageData);
});

module.exports = {
  uploadImage,
  getImage,
  deleteImage,
  getImagesByGeolocation,
  getImagesByUserId,
};
