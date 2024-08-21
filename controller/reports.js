const Expense = require('../models/expense');

const sequelize = require('../util/database');
const { Op } = require("sequelize");


const UserServices=require('../services/userServices');



exports.getReport = async (req, res) => {
    try {
        const date = req.params.date;

        const page=Number(req.query.page) || 1;
        const expenses_per_page=Number(req.query.limit) ;

        const totalExpenses=await Expense.count({where:{
            [Op.and]:[
                sequelize.where(sequelize.col('userId'),req.user.id),
                sequelize.where(sequelize.col('date'),date)]}});

        const expenses = await UserServices.getExpenses(req,
            { where: { date: date }, 
            offset:(page-1) * expenses_per_page,
            limit:expenses_per_page });

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

exports.getMonthReport = async (req, res) => {
    try {
        const month = req.query.month;
        const year = req.query.year;

        const page=Number(req.query.page) || 1;
        const expenses_per_page=Number(req.query.limit) ;

       


        const totalExpenses=await Expense.count({where:{
            [Op.and]:[
                sequelize.where(sequelize.col('userId'),req.user.id),
                sequelize.where(sequelize.fn('MONTH', sequelize.col('date')), month),
                sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), year)]},

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


        // console.log(year);

        const expenses = await UserServices.getExpenses(req,{
            where: {
                [Op.and]: [
                    sequelize.where(sequelize.fn('MONTH', sequelize.col('date')), month),
                    sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), year),
                ]
            },
            offset:(page-1) * expenses_per_page,
            limit:expenses_per_page
        })
        
        res.status(200).json({expenses,pageData});

    }
    catch (err) {
        console.log(err);
        res.status(500).json({success:false});
    }
}

exports.getYearReport = async (req, res) => {
    try {

        const year = req.params.year;

        const page=Number(req.query.page) || 1;
        const expenses_per_page=Number(req.query.limit) ;

        const totalExpenses=await Expense.count({where:{
            [Op.and]:[
                sequelize.where(sequelize.col('userId'),req.user.id),
                sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), year)]}});

        // console.log(year);

        const expenses = await UserServices.getExpenses(req,{
            where:
                sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), year),
                offset:(page-1) * expenses_per_page,
                limit:expenses_per_page 

        })

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




