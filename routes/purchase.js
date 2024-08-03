const express=require('express');

const router=express.Router();

const userAuthentication=require('../middleware/userAuthentication');
const purchaseController=require('../controller/purchase');

router.get('/buypremium',userAuthentication.authentication,purchaseController.purchasePremium);

router.post('/updateTransactions',userAuthentication.authentication,purchaseController.updateTransaction);



module.exports=router;

