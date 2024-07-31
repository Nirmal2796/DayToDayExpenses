const Expense=require('../models/expense');
const { Op } = require("sequelize");
const sequelize = require('../util/database');

exports.getExpenses=async(req,res)=>{
    try{
        const expenses=await Expense.findAll();
        res.status(200).json(expenses);
    }
    catch(err){
        console.log(err);
    }
}

exports.addExpense=async (req,res)=>{
    try{
        const amount=req.body.amount;
        const category=req.body.category;
        const description=req.body.description;

        const expense=await Expense.create({
            amount:amount,
            category:category,
            description:description,
            date:new Date()
        });

        res.status(201).json({newExpense:expense});
    }
    catch(err){
        console.log(err);
    }

}

exports.deleteExpense=async(req,res)=>{
    try{

        const id= req.params.id;
    
        await Expense.findByPk(id).then(data=>{
            data.destroy();
            res.status(200).json(data);
        })
    }
    catch(err){
        console.log(err);
    }
}

exports.getReport=async(req,res)=>{
    try{
        const date=req.params.date;

        const expenses=await Expense.findAll({where:{date:date}});
        res.status(200).json(expenses);

    }
    catch(err){
        console.log(err);
    }
}

exports.getMonthReport=async(req,res)=>{
    try{
        const month=req.query.month;
        const year=req.query.year;

        // console.log(year);

        const expenses=await Expense.findAll({
            where: {
                [Op.and]: [
                    sequelize.where(sequelize.fn('MONTH', sequelize.col('date')), month),
                    sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), year),
                ]
            }})
        res.status(200).json(expenses);

    }
    catch(err){
        console.log(err);
    }
}

exports.getYearReport=async(req,res)=>{
    try{
        
        const year=req.params.year;

        // console.log(year);

        const expenses=await Expense.findAll({
            where: 
                    sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), year),
                
            })
        res.status(200).json(expenses);

    }
    catch(err){
        console.log(err);
    }
}
