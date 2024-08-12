const AWS = require('aws-sdk');

require('dotenv').config();

const User = require('../models/user');
const Expense = require('../models/expense');
const sequelize = require('../util/database');
const { Op } = require("sequelize");

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

        const expenses = await req.user.getExpenses({ where: { date: date } });

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
        res.status(500).json({success:false});
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
        res.status(500).json({success:false});
    }
}





function uploadToS3(expenses, fileName) {

    const BUCKET_NAME = 'daytodayexpenses';
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
        // Bucket:BUCKET_NAME
    })

    var params = {
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: expenses,
        ACL: 'public-read'
    }

    return new Promise((resolve, reject) => {

        s3bucket.upload(params, (err, s3res) => {
            if (err) {
                console.log('err');
                reject(err);
            }
            else {
                console.log('SUCCESS', s3res);
                resolve(s3res.Location);
            }
        })
    })
}


exports.downloadReport = async (req, res) => {
    try {
        const date = req.params.date;

        const expenses = await req.user.getExpenses({ where: { date: date } });

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

exports.downloadMonthlyReport = async (req, res) => {
    try {
        const month = req.query.month;
        const year = req.query.year;

       
        const expenses = await req.user.getExpenses({
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

        const expenses = await req.user.getExpenses({
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