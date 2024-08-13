const express =require('express');

const cors=require('cors');

require('dotenv').config(); 

const app=express();

const bodyParser=require('body-parser');


const sequelize=require('./util/database');

const User=require('./models/user');
const Expense=require('./models/expense');
const Order=require('./models/order');
const ForgotPasswordRequests=require('./models/forgotPasswordRequests');

const userRouter=require('./routes/user');
const expenseRouter=require('./routes/expense');
const purchaseRouter=require('./routes/purchase');
const premiumRouter=require('./routes/premium');
const passwordRouter=require('./routes/password');


app.use(cors());

app.use(bodyParser.json({extended:false}));


app.use(userRouter);
app.use(expenseRouter);
app.use(purchaseRouter);
app.use(premiumRouter);
app.use(passwordRouter);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);


User.hasMany(ForgotPasswordRequests);
ForgotPasswordRequests.belongsTo(User);

sequelize
.sync()
// .sync({force:true})
.then(result=>{
    app.listen(3000);
})
.catch(err=>console.log(err));

