const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const Downloads=sequelize.define('download',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    date:{
        type:Sequelize.DATEONLY,
        allowNull:false
    },
    fileURL:{
        type:Sequelize.STRING,
        allowNull:false
    }
});


module.exports=Downloads;