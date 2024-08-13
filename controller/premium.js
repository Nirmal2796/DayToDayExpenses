const User = require('../models/user');
const sequelize = require('../util/database');
const { Op } = require("sequelize");

const S3Services=require('../services/S3Services');
const UserServices=require('../services/userServices');


exports.getLeaderBoard = async (req, res) => {

    try {

        const leaderBoard = await User.findAll({
            attributes: ['id', 'name', 'totalExpenses'],
            order: [['totalExpenses', 'DESC']],
            limit: 10
        });

        res.status(200).json(leaderBoard);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({success:false});
    }

}


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




exports.downloadReport = async (req, res) => {
    try {
        const date = req.params.date;

        const expenses = await UserServices.getExpenses(req,{ where: { date: date } });

        const stringifiedExpenses = JSON.stringify(expenses);

        const fileName = `${req.user.id}/${new Date()}.txt`;

        const fileURL = await S3Services.uploadToS3(stringifiedExpenses, fileName);

        res.status(200).json({ fileURL: fileURL, success: true });

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ fileURL: '', success: false });
    }
}

exports.downloadMonthlyReport = async (req, res) => {
    try {
        const month = req.query.month;
        const year = req.query.year;

       
        const expenses = await UserServices.getExpenses(req,{
            where: {
                [Op.and]: [
                    sequelize.where(sequelize.fn('MONTH', sequelize.col('date')), month),
                    sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), year),
                ]
            }
        })

        const stringifiedExpenses = JSON.stringify(expenses);

        const fileName = `${req.user.id}/${new Date()}.txt`;

        const fileURL = await uploadToS3(stringifiedExpenses, fileName);

        res.status(200).json({ fileURL: fileURL, success: true });

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ fileURL: '', success: false });
    }
}

exports.downloadYearlyReport = async (req, res) => {
    try {
        const year = req.params.year;

        const expenses = await UserServices.getExpenses(req,{
            where:
                sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), year),

        })

        const stringifiedExpenses = JSON.stringify(expenses);

        const fileName = `${req.user.id}/${new Date()}.txt`;

        const fileURL = await uploadToS3(stringifiedExpenses, fileName);

        res.status(200).json({ fileURL: fileURL, success: true });

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ fileURL: '', success: false });
    }
}