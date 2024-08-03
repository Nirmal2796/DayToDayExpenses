const express =require('express');

const cors=require('cors');

const app=express();

const bodyParser=require('body-parser');


const sequelize=require('./util/database');

const User=require('./models/user');
const Expense=require('./models/expense');
const Order=require('./models/order');

const userRouter=require('./routes/user');
const expenseRouter=require('./routes/expense');
const purchaseRouter=require('./routes/purchase');
const premiumRouter=require('./routes/premium');


app.use(cors());

app.use(bodyParser.json({extended:false}));

app.use(userRouter);
app.use(expenseRouter);
app.use(purchaseRouter);
app.use(premiumRouter);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);


sequelize
.sync()
// .sync({force:true})
.then(result=>{
    app.listen(3000);
})
.catch(err=>console.log(err));

