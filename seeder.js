const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

//load env vars
dotenv.config({ path: './config/config.env' });

// load models
const Bootcamp = require('./models/Bootcamp');

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(console.log('MongoDB connected for seeder...'))
  .catch((e) => console.log('MONGO CONNECTION ERROR'));

// read json files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);
// const courses = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
// );
// const reviews = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8')
// );
// const users = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
// );

//import into db
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);

    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (error) {
    console.log(error.message);
  }
};

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();

    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (error) {
    console.log(error.message);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
