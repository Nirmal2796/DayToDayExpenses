const express=require('express');

const router=express.Router();

const expenseController=require('../controller/expense');
const userAuthentication=require('../middleware/userAuthentication');

router.get('/get-expenses',userAuthentication.authentication,expenseController.getExpenses);

router.post('/add-expense',userAuthentication.authentication,expenseController.addExpense);

router.delete('/delete-expense/:id',userAuthentication.authentication,expenseController.deleteExpense);


module.exports=router;