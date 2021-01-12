const Category = require('../models/category');
var rootId = "";
var childId = "";

exports.list_root_categories = (req, res, next) => {
    const page = Number(req.query.page) || Number(1);

    Category.find()
        .lean()
        .exec((err, listRootCategories) => {
            if (err) {
                next(err);
            }
            var listCategoriesInOnePage = [], page_number = [];
            for (let i = 0; i < listRootCategories.length; i++) {
                if (Math.floor(i / 4) == page - 1) {
                    const data = listRootCategories[i];
                    data['page'] = i + 1;
                    if (data.categories) {
                        for (let j = 0; j < data.categories.length; j++) {
                            var tmp = data.categories[j];
                            tmp['page'] = j + 1;
                            data.categories[j] = tmp;
                        }
                    }
                    listCategoriesInOnePage.push(data);
                }
                if (i / 4 == Math.floor(i / 4)) {
                    page_number.push((i / 4) + 1);
                }
            }
            res.render('categories/list-root-categories', {
                currentPage: page,
                page_number: page_number,
                listCategoriesInOnePage: listCategoriesInOnePage
            });
        });
}

exports.edit_category = (req, res, next) => {
    rootId = "";
    childId = "";
    rootId = req.query.rootid;
    if (req.query.childid) {
        childId = req.query.childid;
        Category.findById(rootId)
            .lean()
            .exec((err, rootCategory) => {
                if (err) {
                    next(err);
                }
                for (let i = 0; i < rootCategory.categories.length; i++) {
                    if (rootCategory.categories[i]._id == childId) {
                        childCategory = rootCategory.categories[i];
                    }
                }
                res.render('categories/edit-category', {
                    name: childCategory.name
                });
            });
    } else {
        Category.findById(rootId)
            .lean()
            .exec((err, rootCategory) => {
                if (err) {
                    next(err);
                }
                res.render('categories/edit-category', {
                    name: rootCategory.name
                });
            });
    }
}

async function doesChildCategoryBelongToAnyCourse(categoryChildName) {
    const Course = require('../models/course');
    var check = false;
    await Course.find({ categoryChildName: categoryChildName }, (er, course) => {
        if (err) next(err);
        check = true;
    });
    return check;
}

exports.delete_category = (req, res, next) => {
    rootId = "";
    childId = "";
    rootId = req.query.rootid;
    if (req.query.childid) {
        childId = req.query.childid;
    }
    var check = false;
    Category.findById(rootId)
        .lean()
        .exec(async (err, rootCategory) => {
            if (err) {
                next(err);
            }
            if (childId === "") {
                for (let i = 0; i < rootCategory.categories.length; i++) {
                    if (await (doesChildCategoryBelongToAnyCourse(rootCategory.categories[i].categoryChildName)) === false) {
                        check = true;
                    }
                }
                if (check === false) {
                    rootCategory.status = 0;
                } else {

                }
            } else {
                let i;
                for (i = 0; i < rootCategory.categories.length; i++) {
                    if (rootCategory.categories[i]._id === childId) {
                        check = await (doesChildCategoryBelongToAnyCourse(rootCategory.categories[i].categoryChildName));
                        break;
                    }
                }
                if (check === true) {
                    rootCategory.categories[i].status = 0;
                } else {

                }
            }
            await rootCategory.save((err, result) => { });
            res.render('categories/list_root_categories', {
                name: childCategory.name
            });
        });
}

exports.post_category = (req, res, next) => {
    const newName = req.body.name;
    Category.findOne({ _id: rootId }, (err, rootCategory) => {
        if (err) {
            next(err);
        }
        if (childId) {
            for (let i = 0; i < rootCategory.categories.length; i++) {
                if (rootCategory.categories[i]._id == childId) {
                    const tmp = rootCategory.categories[i];
                    tmp.name = newName;
                    rootCategory.categories[i] = tmp;
                }
            }
        } else {
            rootCategory.name = newName;
        }
        rootCategory.save((err, result) => { });
        res.redirect('/list-root-categories');
    });
}


exports.add_category = (req, res, next) => {
    res.render('categories/add-category');
}