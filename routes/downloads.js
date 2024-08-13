const express=require('express');

const router=express.Router();

const userAuthentication=require('../middleware/userAuthentication');
const downloadsController=require('../controller/downloads');


router.get('/download-report/:date',userAuthentication.authentication,downloadsController.downloadReport);

router.get('/download-monthReport/',userAuthentication.authentication,downloadsController.downloadMonthlyReport);

router.get('/download-yearReport/:year',userAuthentication.authentication,downloadsController.downloadYearlyReport);

router.get('/showDownloads',userAuthentication.authentication,downloadsController.showDownloads);

module.exports=router;