const express=require('express');

const router=express.Router();

const userAuthentication=require('../middleware/userAuthentication');
const premiumController=require('../controller/premium');

router.get('/get-report/:date',userAuthentication.authentication,premiumController.getReport);

router.get('/get-monthReport/',userAuthentication.authentication,premiumController.getMonthReport);

router.get('/get-yearReport/:year',userAuthentication.authentication,premiumController.getYearReport);

router.get('/showleaderboard',userAuthentication.authentication,premiumController.getLeaderBoard);

router.get('/download-report/:date',userAuthentication.authentication,premiumController.downloadReport);

router.get('/download-monthReport/',userAuthentication.authentication,premiumController.downloadMonthlyReport);

router.get('/download-yearReport/:year',userAuthentication.authentication,premiumController.downloadYearlyReport);


module.exports=router;