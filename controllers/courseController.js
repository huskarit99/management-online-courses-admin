const Course = require('../models/course');
const User = require('../models/user');

exports.list_courses = (req, res, next) => {
    if (req.session.userSession) {
        const page = Number(req.query.page) || Number(1);
        Course.find()
            .lean()
            .exec(async (err, listCourses) => {
                if (err) {
                    next(err);
                }
                var listCoursesInOnePage = [],
                    page_number = [];
                for (let i = 0; i < listCourses.length; i++) {
                    if (Math.floor(i / 8) == page - 1) {
                        const data = listCourses[i];
                        data['page'] = i + 1;
                        await User.findOne({ _id: data.ownerId }, (err, user) => {
                            if (err) return next(err);
                            data['nameOwner'] = user['name'];
                        });
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
    } else {
        res.redirect('/login');
    }

}

exports.lock_course = (req, res, next) => {
    const id = req.query.id;
    Course.findOne({ _id: id }, async (err, course) => {
        if (err) return next(err);
        course.status = 0;
        await course.save((err, result) => { });
        res.redirect('/list-courses');
    });
}

exports.unlock_course = (req, res, next) => {
    const id = req.query.id;
    Course.findOne({ _id: id }, async (err, course) => {
        if (err) return next(err);
        course.status = 1;
        await course.save((err, result) => { });
        res.redirect('/list-courses');
    });
}