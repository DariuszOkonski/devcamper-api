const express = require('express');
const { getCourses, getCourse, addCourse } = require('../controllers/courses');

const router = express.Router({ mergeParams: true });

// it get request from two endpoints:
// /api/v1/courses
// /api/v1/bootcamps/:bootampId/courses
router.route('/').get(getCourses).post(addCourse);
router.route('/:id').get(getCourse);

module.exports = router;
