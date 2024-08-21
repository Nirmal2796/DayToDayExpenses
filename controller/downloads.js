const sequelize = require('../util/database');
const { Op } = require("sequelize");

const S3Services=require('../services/S3Services');
const UserServices=require('../services/userServices');

const Downloads=require('../models/downloads');


exports.downloadReport = async (req, res) => {
    try {
        const date = req.params.date;

        const expenses = await UserServices.getExpenses(req,{ where: { date: date } });

        const stringifiedExpenses = JSON.stringify(expenses);

        const fileName = `${req.user.id}/${new Date()}.txt`;

        const fileURL = await S3Services.uploadToS3(stringifiedExpenses, fileName);

        console.log(fileURL);
        await req.user.createDownload({
            date: new Date(),
            fileURL:fileURL
        });
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


exports.showDownloads=async (req,res)=>{
    try{

        const page=Number(req.query.page) || 1;
        const downloads_per_page=Number(req.query.limit) ;

        const totalDownloads=await Downloads.count({where:{userId:req.user.id}});

        const downloads=await req.user.getDownloads({
            offset:(page-1) * downloads_per_page,
            limit:downloads_per_page
        });

        const pageData={
            currentPage:page,
            hasNextPage: downloads_per_page* page < totalDownloads,
            nextPage:page+1,
            hasPreviousPage:page>1,
            previousPage:page-1,
            total:totalDownloads,
            lastPage:Math.ceil(totalDownloads/downloads_per_page)
        }


        res.status(200).json({downloads,pageData});

    }
    catch (err) {
        console.log(err);
        res.status(500).json({success: false });
    }
}