const express=require('express');

const router=express.Router();

const userAuthentication=require('../middleware/userAuthentication');
const reportsController=require('../controller/reports');

router.get('/get-report/:date',userAuthentication.authentication,reportsController.getReport);

router.get('/get-monthReport/',userAuthentication.authentication,reportsController.getMonthReport);

router.get('/get-yearReport/:year',userAuthentication.authentication,reportsController.getYearReport);


module.exports=router;