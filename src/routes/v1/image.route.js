const express = require('express');
const auth = require('../../middlewares/auth');
const { imageController } = require('../../controllers');
const upload = require('../../utils/storage');
const { imageValidation } = require('../../validations');
const validate = require('../../middlewares/validate');

const router = express.Router();

router.route('/').post(auth('uploadImage'), upload.single('image'), imageController.uploadImage);
router.route('/:imageId').get(auth('getImage'), imageController.getImage);
router
  .route('/geolocation')
  .post(auth('getImage'), validate(imageValidation.getImagesByGeolocation), imageController.getImagesByGeolocation);
router.route('/user/:userId').get(auth('getImage'), imageController.getImagesByUserId);

module.exports = router;
