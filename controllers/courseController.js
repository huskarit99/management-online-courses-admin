const Course = require('../models/course');

exports.list_courses = (req, res, next) => {
    var page = Number(req.query.page) || Number(1);

    Course.find()
        .lean()
        .exec((err, listCourses) => {
            if (err) {
                next(err);
            }

            var listCoursesInOnePage = [], page_number = [];
            for (let i = 0; i < listCourses.length; i++) {
                if (Math.floor(i / 8) == page - 1) {
                    const data = listCourses[i];
                    data['page'] = i + 1;
                    listCoursesInOnePage.push(data);
                }
                if (i / 8 == Math.floor(i / 8)) {
                    page_number.push((i / 8) + 1);
                }
            }
            res.render('courses/list-courses', {
                currentPage: page,
                page_number: page_number,
                listCoursesInOnePage: listCoursesInOnePage
            });
        });
}