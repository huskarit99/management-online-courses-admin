const Course = require('../models/course');

exports.list_courses = (req, res, next) => {
    // var page = Number(req.query.page) || Number(1);

    Course.find()
        .lean()
        .exec((err, listCourses) => {
            if (err) {
                next(err);
            }
            res.render('courses/list-courses', {
                listCourses: listCourses
            });
        });
}