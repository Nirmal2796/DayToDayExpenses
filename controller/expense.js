const Expense = require('../models/expense');

const sequelize = require('../util/database');

const UserServices=require('../services/userServices');

exports.getExpenses = async (req, res) => {
    try {
        const page=Number(req.query.page) || 1;
        const expenses_per_page=Number(req.query.limit) ;

        const totalExpenses=await Expense.count({where:{userId:req.user.id}});

        const expenses = await UserServices.getExpenses(req,{
            offset:(page-1) * expenses_per_page,
            limit:expenses_per_page
        });

        

        const pageData={
            currentPage:page,
            hasNextPage: expenses_per_page* page < totalExpenses,
            nextPage:page+1,
            hasPreviousPage:page>1,
            previousPage:page-1,
            total:totalExpenses,
            lastPage:Math.ceil(totalExpenses/expenses_per_page)
        }


        res.status(200).json({expenses,pageData});
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

