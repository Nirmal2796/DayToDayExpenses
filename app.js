const express =require('express');

const cors=require('cors');

const app=express();

const bodyParser=require('body-parser');


const sequelize=require('./util/database');

const User=require('./models/user');
const Expense=require('./models/expense');

const expenseRouter=require('./routes/expense');
const userRouter=require('./routes/user');


app.use(cors());

app.use(bodyParser.json({extended:false}));

app.use(expenseRouter);
app.use(userRouter);

User.hasMany(Expense);
Expense.belongsTo(User);



sequelize
.sync()
// .sync({force:true})
.then(result=>{
    app.listen(3000);
})
.catch(err=>console.log(err));

