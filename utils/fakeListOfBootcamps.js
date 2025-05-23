const { faker } = require('@faker-js/faker');

exports.fakeListOfBootcamps = (number = 1) => {
  return Array.from({ length: number }, (_, i) => i + 1).map((item) => {
    const street = faker.location.street();
    const city = faker.location.city();
    const state = faker.location.countryCode();
    const zipcode = faker.location.zipCode('#####-####');
    const country = faker.location.countryCode();

    const location = {
      type: 'Point',
      coordinates: [
        (Math.random() * 100).toFixed(6),
        (Math.random() * 100).toFixed(6),
      ],
      formattedAddress: `${street}, ${city}, ${state} ${zipcode}, ${country}`,
      street,
      city,
      state,
      zipcode,
      country,
    };

    return location;
  });
};

exports.fakeLongLattPositions = () => (Math.random() * 100).toFixed(6);

// module.exports = { fakeListOfBootcamps, fakeListOfBootcamps };
