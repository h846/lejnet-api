const express = require('express')
const {INTTOOLS_PATH} = require('../public/paths');

const router = express.Router()

//const rootdir= 'C:/Projects';

router.use(express.static(INTTOOLS_PATH + '/public'));
const hem_controller = require(INTTOOLS_PATH + '/controllers/hemController');

const {
    homePage,
    productPage,
    categoryPage,
    monoPage
//    hemPage
} = require(INTTOOLS_PATH + '/public/js/main');

//const {
//    getProductInfo
//} = require('../intdb');

// main
router.get('/home',(req,res)=>{
    res.redirect('../inttool');
});

//router.route('/').get(productPage);
router.route('/').get(homePage);
//router.route('/home').get = (req,res)=>{
//    res.render('home',{title:'Internet Tools'});
//};

router.route('/prod').get(productPage);
router.route('/cgy').get(categoryPage);
router.route('/mono').get(monoPage);
//router.route('/hem').get(hemPage);

// GET request for list of hem types
router.get('/hemtypes', hem_controller.hemTypes);
// GET request for list of hem groups
router.get('/hemgroups', hem_controller.hemGroups);

// intdb
//router.route('/prod').post(getProductInfo);


module.exports = router;