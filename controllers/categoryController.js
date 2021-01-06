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

exports.edit_category = (req, res, next) => {
    const rootId = req.query.rootid;
    if (req.query.childid) {
        const childId = req.query.childid;
        Category.findById(rootId)
            .lean()
            .exec((err, rootCategory) => {
                if (err) {
                    next(err);
                }
                let childCategory;
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

exports.post_category = (req, res, next) => {

}


exports.add_category = (req, res, next) => {
    res.render('categories/add-category');
}