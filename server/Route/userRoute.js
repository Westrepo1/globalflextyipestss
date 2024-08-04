const express = require('express');
// const multer = require('multer');
const router = express.Router();

const userController = require('../controllers/userController');


// image upload
// var storage = multer.diskStorage({
//     destination: function(req, res, cb){
//         cb(null, './uploads');
//     },
//     filename: function(req, file,cb){
//         cb(null, file.fieldname+"_"+Date.now()+"_"+file.originalname);
//     }
// })

// var upload = multer({
//     storage: storage,
// }).single("image");



router.get('/dashboard',userController.dashboardPage);

router.get('/navbarPage',userController.navbarPage);

router.get('/verify',userController.verifyPage);
router.post('/verify/:id', userController.verifyPage_post);

router.get('/account',userController.accountPage);
router.get('/editProfile',userController.editProfilePage);
router.get('/transactions/:id',userController.transactionPage);

router.get('/trading-live',userController.livePage);
router.post('/trading-live/:id',userController.livePage_post);
router.get('/tradinghistory/:id', userController.tradingHistory)

router.get('/accountUpgrade',userController.upgradePage);
router.post('/accountUpgrade/:id',userController.upgradePage_post);

router.get('/deposit', userController.depositPage);
router.post('/deposit/:id', userController.depositPage_post);
router.get('/depositHistory/:id',userController.depositHistory);

router.get('/withdrawal',userController.widthdrawPage);
router.post('/widthdraw/:id',userController.widthdrawPage_post);
router.get('/widthdrawHistory/:id',userController.widthdrawHistory);

// router.get('/buyCrypto', userController.buyCrypto)

module.exports = router;

