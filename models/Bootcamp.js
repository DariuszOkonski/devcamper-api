const mongoose = require('mongoose');
const slugify = require('slugify');
// const geocoder = require('../utils/geocoder');
const { faker } = require('@faker-js/faker');

const BootcampSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name can not be more than 50 characters'],
    },
    slug: String,
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description can not be more than 500 characters'],
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        'Please use a valid URL with HTTP or HTTPS',
      ],
    },
    phone: {
      type: String,
      maxlength: [20, 'Phone number can not be more than 20 characters'],
    },
    email: {
      type: String,
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, 'Please add a valid email'],
    },
    address: {
      type: String,
      required: [true, 'Please add an address'],
    },
    location: {
      // geoJSON point
      type: {
        type: String,
        enum: ['Point'],
        required: false,
      },
      coordinates: {
        type: [Number],
        required: false,
        index: '2dsphere',
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    careers: {
      type: [String],
      required: true,
      enum: [
        'Web Development',
        'Mobile Development',
        'UI/UX',
        'Data Science',
        'Business',
        'Other',
      ],
    },
    averageRating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [10, 'Rating can not be more than 10'],
    },
    averageCost: Number,
    photo: {
      type: String,
      default: 'no-photo.jpg',
    },
    housing: {
      type: Boolean,
      default: false,
    },
    jobAssistance: {
      type: Boolean,
      default: false,
    },
    jobGuarantee: {
      type: Boolean,
      default: false,
    },
    acceptGi: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// create bootcamp slug from the name
BootcampSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });

  next();
});

// TODO: this part wont work because service require real paycard data
BootcampSchema.pre('save', async function (next) {
  // const loc = await geocoder.geocode(this.address);
  // this.location = {
  //   type: 'Point',
  //   coordinates: [loc[0].longitude, loc[0].latitude],
  //   formattedAddress: loc[0].formattedAddress,
  //   street: loc[0].streetName,
  //   city: loc[0].city,
  //   state: loc[0].stateCode,
  //   zipCode: loc[0].zipcode,
  //   country: loc[0].countryCode,
  // };

  const street = faker.location.street();
  const city = faker.location.city();
  const state = faker.location.countryCode();
  const zipcode = faker.location.zipCode('#####-####');
  const country = faker.location.countryCode();

  this.location = {
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

  // do not save address in db
  this.address = undefined;

  next();
});

// cascade delete courses when a bootcamp is deleted
BootcampSchema.pre('remove', async function (next) {
  console.log(`Courses being removed from bootcamp ${this._id}`);

  await this.model('Course').deleteMany({ bootcamp: this._id });
  next();
});

// reverse populate with virtuals
BootcampSchema.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'bootcamp',
  justOne: false,
});

module.exports = mongoose.model('Bootcamp', BootcampSchema);
