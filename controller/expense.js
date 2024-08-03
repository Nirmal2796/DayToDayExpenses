// const Expense = require('../models/expense');

const sequelize = require('../util/database');

exports.getExpenses = async (req, res) => {
    try {

        const expenses = await req.user.getExpenses();
        res.status(200).json(expenses);
    }
    catch (err) {
        console.log(err);
    }
}

exports.addExpense = async (req, res) => {
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
        });

        await req.user.update({totalExpenses:totalExpenses});

        res.status(201).json({ newExpense: expense });
    }
    catch (err) {
        console.log(err);
    }

}

exports.deleteExpense = async (req, res) => {
    try {

        const id = req.params.id;

        const expense = await req.user.getExpenses({ where: { id } })
        // console.log(expense);
        expense[0].destroy();

        res.status(200).json(expense);
    }
    catch (err) {
        console.log(err);
    }
}

