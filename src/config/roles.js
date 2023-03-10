const allRoles = {
  user: ['uploadImage', 'getImage', 'getUsers', 'manageUsers', 'generate', 'deleteImage'],
  admin: [],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
