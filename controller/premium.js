const User=require('../models/user');
const Expense=require('../models/expense');
const sequelize = require('../util/database');
const { Op } = require("sequelize");

exports.getLeaderBoard=async (req,res)=>{

    const leaderBoard= await User.findAll({
        attributes:['id','name','totalExpenses'],
        order:[['totalExpenses','DESC']],
        limit:10
    });


    res.status(200).json(leaderBoard);

}


exports.getReport = async (req, res) => {
    try {
        const date = req.params.date;

        const expenses = await req.user.getExpenses({ where: { date: date } });

        res.status(200).json(expenses);

    }
    catch (err) {
        console.log(err);
    }
}

exports.getMonthReport = async (req, res) => {
    try {
        const month = req.query.month;
        const year = req.query.year;

        // console.log(year);

        const expenses = await req.user.getExpenses({
            where: {
                [Op.and]: [
                    sequelize.where(sequelize.fn('MONTH', sequelize.col('date')), month),
                    sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), year),
                ]
            }
        })
        res.status(200).json(expenses);

    }
    catch (err) {
        console.log(err);
    }
}

exports.getYearReport = async (req, res) => {
    try {

        const year = req.params.year;

        // console.log(year);

        const expenses = await req.user.getExpenses({
            where:
                sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), year),

        })
        res.status(200).json(expenses);

    }
    catch (err) {
        console.log(err);
    }
}


exports.downloadReport=async(req,res)=>{
    try{

    }
    catch (err) {
        console.log(err);
    }
}