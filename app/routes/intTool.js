const express = require('express')
const router = express.Router()

const rootdir= '//jpweb001/wwwroot/';

router.use(express.static(rootdir + '/IntTool/public'));

const {
    homePage,
    productPage,
    categoryPage,
    monoPage,
    hemPage
} = require(rootdir + '/IntTool/public/js/main');

//const {
//    getProductInfo
//} = require('../intdb');

// main
router.route('/home').get(homePage);
router.route('/prod').get(productPage);
router.route('/cgy').get(categoryPage);
router.route('/mono').get(monoPage);
router.route('/hem').get(hemPage);

// intdb
//router.route('/prod').post(getProductInfo);


module.exports = router;