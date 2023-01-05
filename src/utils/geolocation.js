const getRandomLocation = (km) => {
  const currentLocation = {
    latitude: 43.6165793,
    longitude: 7.0721425,
  };

  // Generate a random angle between 0 and 2 * PI
  const angle = Math.random() * 2 * Math.PI;

  // Calculate the distance from the center of the circle to the random point
  const distance = km * Math.sqrt(Math.random());

  // Calculate the random point's latitude and longitude
  const latitude = currentLocation.latitude + (distance / 111.12) * Math.cos(angle);
  const longitude = currentLocation.longitude + (distance / (111.12 * Math.cos(currentLocation.latitude))) * Math.sin(angle);

  return [longitude, latitude];
};

module.exports = {
  getRandomLocation,
};
