const category = require('../models/category');
const Category = require('../models/category');

exports.list_root_categories = (req, res, next) => {
    let page = Number(req.query.page) || Number(1);

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
                page_number: page_number,
                listCategoriesInOnePage: listCategoriesInOnePage
            });
        });
}

exports.list_categories = (req, res, next) => {
    res.render('categories/list-categories');
}

exports.add_category = (req, res, next) => {
    res.render('categories/add-category');
}

exports.edit_category = (req, res, next) => {
    res.render('categories/edit-category');
}

