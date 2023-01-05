const { faker } = require('@faker-js/faker');
const httpStatus = require('http-status');
const { User, Token, Image } = require('../models');
const ApiError = require('../utils/ApiError');
const { getRandomLocation } = require('../utils/geolocation');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Get user by token
 * @param {string} token
 * @returns {Promise<User>}
 */
const getUserByToken = async (token) => {
  const tokenObject = await Token.findOne({ token });
  if (!tokenObject) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Token not found');
  }
  const user = await getUserById(tokenObject.user);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return user;
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

const generateUsersWithImages = async () => {
  const fakeUsers = [...Array(100)].map(() => ({
    name: faker.name.fullName(),
    email: faker.internet.email(),
    password: 'Azerty12',
  }));

  const users = await User.insertMany(fakeUsers);

  const storageImage = 'storage/fake/image';
  const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  await Promise.all(
    users.map(async (user) => {
      const fakeImages = [...Array(10)].map(() => ({
        name: faker.lorem.words(),
        description: faker.lorem.sentence(),
        path: `${storageImage}${random(1, 10)}.jpg`,
        geolocation: {
          type: 'Point',
          coordinates: getRandomLocation(100), // 100km
        },
        userId: user._id,
      }));
      await Image.insertMany(fakeImages);
    })
  );
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  getUserByToken,
  updateUserById,
  deleteUserById,
  generateUsersWithImages,
};
