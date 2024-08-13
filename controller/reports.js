
const sequelize = require('../util/database');
const { Op } = require("sequelize");


const UserServices=require('../services/userServices');



exports.getReport = async (req, res) => {
    try {
        const date = req.params.date;

        const expenses = await UserServices.getExpenses(req,{ where: { date: date } });

        res.status(200).json(expenses);

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

        // console.log(year);

        const expenses = await UserServices.getExpenses(req,{
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
        res.status(500).json({success:false});
    }
}

exports.getYearReport = async (req, res) => {
    try {

        const year = req.params.year;

        // console.log(year);

        const expenses = await UserServices.getExpenses(req,{
            where:
                sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), year),

        })
        res.status(200).json(expenses);

    }
    catch (err) {
        console.log(err);
        res.status(500).json({success:false});
    }
}




