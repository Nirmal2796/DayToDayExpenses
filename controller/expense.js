// const Expense = require('../models/expense');

const sequelize = require('../util/database');

const UserServices=require('../services/userServices');

exports.getExpenses = async (req, res) => {
    try {

        const expenses = await UserServices.getExpenses(req);
        res.status(200).json(expenses);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({success:false});
    }
}

exports.addExpense = async (req, res) => {

        const t= await sequelize.transaction();

    try {

        const amount = req.body.amount;
        const category = req.body.category;
        const description = req.body.description;

        const totalExpenses =  req.user.totalExpenses + Number(amount);
        
        // console.log(totalExpenses);

        const expense = await req.user.createExpense({
            amount: amount,
            category: category,
            description: description,
            date: new Date()
        },{transaction:t});

        await req.user.update({totalExpenses:totalExpenses},{transaction:t});

        await t.commit();

        res.status(201).json({ newExpense: expense });
    }
    catch (err) {
        await t.rollback();
        console.log(err);
        res.status(500).json({success:false});
    }

}

exports.deleteExpense = async (req, res) => {

    const t= await sequelize.transaction();

    try {

        const id = req.params.id;

        const expense = await req.user.getExpenses({ where: { id } },{transaction:t})

        const totalExpenses =  req.user.totalExpenses - Number(expense[0].amount);
        await req.user.update({totalExpenses:totalExpenses},{transaction:t});
        // console.log(expense);
        expense[0].destroy();

        await t.commit();

        res.status(200).json(expense);
    }
    catch (err) {
        await t.rollback();
        console.log(err);
        res.status(500).json({success:false});
    }
}

