const Sequelize=require('sequelize').Sequelize;

const sequelize=new Sequelize('dtdexpense','root','Nirmal@27',{
    dialect: 'mysql',
    host: 'localhost',
    define: {
        timestamps: false,
      }
});

module.exports=sequelize;