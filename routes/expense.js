const express=require('express');

const router=express.Router();

const expenseController=require('../controller/expense');

router.get('/get-expenses',expenseController.getExpenses);

router.post('/add-expense',expenseController.addExpense);

router.delete('/delete-expense/:id',expenseController.deleteExpense);

router.get('/get-report/:date',expenseController.getReport);

router.get('/get-monthReport/',expenseController.getMonthReport);

router.get('/get-yearReport/:year',expenseController.getYearReport);

module.exports=router;